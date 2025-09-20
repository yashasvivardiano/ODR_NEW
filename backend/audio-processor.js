// Real Audio Processing Service with Whisper API

const OpenAI = require('openai');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY // Fallback to Groq if needed
});

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'audio/mp3', 'audio/wav', 'audio/m4a'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only video and audio files are allowed.'));
    }
  }
});

class AudioProcessor {
  constructor() {
    this.processingQueue = new Map();
    this.ensureDirectories();
  }

  ensureDirectories() {
    const dirs = ['uploads', 'temp', 'processed'];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Extract audio from video file using FFmpeg
   */
  async extractAudioFromVideo(videoPath, outputPath) {
    return new Promise((resolve, reject) => {
      console.log(`🎵 Extracting audio from: ${videoPath}`);
      
      ffmpeg(videoPath)
        .output(outputPath)
        .audioCodec('pcm_s16le') // 16-bit PCM for best quality
        .audioChannels(1) // Mono for better speech recognition
        .audioFrequency(16000) // 16kHz sample rate (Whisper optimal)
        .on('start', (commandLine) => {
          console.log('FFmpeg command:', commandLine);
        })
        .on('progress', (progress) => {
          console.log(`Progress: ${Math.round(progress.percent)}%`);
        })
        .on('end', () => {
          console.log('✅ Audio extraction completed');
          resolve(outputPath);
        })
        .on('error', (err) => {
          console.error('❌ FFmpeg error:', err);
          reject(err);
        })
        .run();
    });
  }

  /**
   * Split audio into chunks for processing (Whisper has 25MB limit)
   */
  async splitAudio(audioPath, chunkDurationSeconds = 300) { // 5 minute chunks
    const chunks = [];
    const audioDir = path.dirname(audioPath);
    const baseName = path.basename(audioPath, path.extname(audioPath));
    
    return new Promise((resolve, reject) => {
      // First, get audio duration
      ffmpeg.ffprobe(audioPath, (err, metadata) => {
        if (err) return reject(err);
        
        const duration = metadata.format.duration;
        const numChunks = Math.ceil(duration / chunkDurationSeconds);
        
        console.log(`🔪 Splitting audio into ${numChunks} chunks`);
        
        let completedChunks = 0;
        
        for (let i = 0; i < numChunks; i++) {
          const startTime = i * chunkDurationSeconds;
          const chunkPath = path.join(audioDir, `${baseName}_chunk_${i}.wav`);
          
          ffmpeg(audioPath)
            .seekInput(startTime)
            .duration(chunkDurationSeconds)
            .output(chunkPath)
            .on('end', () => {
              chunks.push({
                path: chunkPath,
                startTime: startTime,
                endTime: Math.min(startTime + chunkDurationSeconds, duration),
                index: i
              });
              
              completedChunks++;
              if (completedChunks === numChunks) {
                // Sort chunks by index
                chunks.sort((a, b) => a.index - b.index);
                resolve(chunks);
              }
            })
            .on('error', reject)
            .run();
        }
      });
    });
  }

  /**
   * Transcribe audio using OpenAI Whisper API
   */
  async transcribeWithWhisper(audioPath, options = {}) {
    try {
      console.log(`🎤 Transcribing audio: ${audioPath}`);
      
      const audioFile = fs.createReadStream(audioPath);
      
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: options.language || 'en',
        response_format: 'verbose_json',
        timestamp_granularities: ['word', 'segment']
      });
      
      console.log('✅ Transcription completed');
      return transcription;
      
    } catch (error) {
      console.error('❌ Whisper API error:', error);
      throw error;
    }
  }

  /**
   * Process speaker diarization (identify different speakers)
   */
  async identifySpeakers(transcription, participants = []) {
    // This is a simplified speaker identification
    // In production, you'd use more sophisticated speaker diarization
    
    const segments = transcription.segments || [];
    const enhancedSegments = [];
    
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      
      // Simple speaker assignment based on timing patterns
      // In real implementation, use voice fingerprinting
      const speakerIndex = Math.floor(i / 3) % participants.length;
      const participant = participants[speakerIndex] || { 
        id: `speaker_${speakerIndex}`, 
        role: 'unknown' 
      };
      
      enhancedSegments.push({
        id: `segment_${i}`,
        startTime: segment.start,
        endTime: segment.end,
        text: segment.text,
        confidence: 0.85, // Whisper doesn't provide word-level confidence in segments
        speakerId: participant.id,
        speakerRole: participant.role,
        words: segment.words || []
      });
    }
    
    return enhancedSegments;
  }

  /**
   * Main processing function: Video/Audio -> Transcript with speakers
   */
  async processAudioFile(filePath, sessionId, participants = [], options = {}) {
    try {
      this.updateProcessingStatus(sessionId, 'processing', 10, 'audio_extraction');
      
      let audioPath = filePath;
      const fileExt = path.extname(filePath).toLowerCase();
      
      // Extract audio if it's a video file
      if (['.mp4', '.avi', '.mov', '.mkv'].includes(fileExt)) {
        const audioOutputPath = path.join('temp', `${sessionId}_audio.wav`);
        audioPath = await this.extractAudioFromVideo(filePath, audioOutputPath);
      }
      
      this.updateProcessingStatus(sessionId, 'processing', 25, 'transcription');
      
      // Check file size and split if necessary
      const stats = fs.statSync(audioPath);
      const fileSizeMB = stats.size / (1024 * 1024);
      
      let transcriptionResults = [];
      
      if (fileSizeMB > 20) { // Split if larger than 20MB
        console.log(`📁 Large file detected (${fileSizeMB.toFixed(1)}MB), splitting...`);
        const chunks = await this.splitAudio(audioPath);
        
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          console.log(`Processing chunk ${i + 1}/${chunks.length}`);
          
          const chunkTranscription = await this.transcribeWithWhisper(chunk.path, options);
          
          // Adjust timestamps to account for chunk offset
          if (chunkTranscription.segments) {
            chunkTranscription.segments.forEach(segment => {
              segment.start += chunk.startTime;
              segment.end += chunk.startTime;
              if (segment.words) {
                segment.words.forEach(word => {
                  word.start += chunk.startTime;
                  word.end += chunk.startTime;
                });
              }
            });
          }
          
          transcriptionResults.push(chunkTranscription);
          
          // Clean up chunk file
          fs.unlinkSync(chunk.path);
        }
      } else {
        // Process as single file
        const transcription = await this.transcribeWithWhisper(audioPath, options);
        transcriptionResults.push(transcription);
      }
      
      this.updateProcessingStatus(sessionId, 'processing', 60, 'speaker_identification');
      
      // Combine all transcription results
      const combinedSegments = [];
      let combinedText = '';
      
      transcriptionResults.forEach(result => {
        if (result.segments) {
          combinedSegments.push(...result.segments);
        }
        combinedText += result.text + ' ';
      });
      
      // Identify speakers
      const enhancedSegments = await this.identifySpeakers(
        { segments: combinedSegments }, 
        participants
      );
      
      this.updateProcessingStatus(sessionId, 'processing', 85, 'transcription');
      
      // Create final transcript object
      const transcript = {
        id: `${sessionId}_transcript`,
        hearingId: sessionId,
        segments: enhancedSegments,
        fullText: combinedText.trim(),
        confidence: 0.85,
        language: options.language || 'en',
        processingTime: Date.now(),
        createdAt: new Date().toISOString(),
        metadata: {
          originalFile: path.basename(filePath),
          audioFile: path.basename(audioPath),
          fileSize: fileSizeMB,
          duration: enhancedSegments.length > 0 ? 
            Math.max(...enhancedSegments.map(s => s.endTime)) : 0,
          chunksProcessed: transcriptionResults.length
        }
      };
      
      // Clean up temporary files
      if (audioPath !== filePath) {
        fs.unlinkSync(audioPath);
      }
      
      this.updateProcessingStatus(sessionId, 'completed', 100, 'transcription');
      
      return transcript;
      
    } catch (error) {
      this.updateProcessingStatus(sessionId, 'failed', 0, 'transcription');
      throw error;
    }
  }

  updateProcessingStatus(sessionId, status, progress, stage) {
    // This would typically update a database or cache
    // For now, just log the progress
    console.log(`[${sessionId}] ${stage}: ${status} (${progress}%)`);
    
    // Update global processing queue
    if (global.processingQueue && global.processingQueue.has(sessionId)) {
      const processingStatus = global.processingQueue.get(sessionId);
      processingStatus.status = status;
      processingStatus.progress = progress;
      
      // Update specific stage
      const stageObj = processingStatus.stages.find(s => s.stage === stage);
      if (stageObj) {
        stageObj.status = status === 'completed' ? 'completed' : 
                         status === 'failed' ? 'failed' : 'in_progress';
        stageObj.progress = progress;
        if (status === 'completed') {
          stageObj.endTime = new Date().toISOString();
        }
      }
    }
  }
}

module.exports = {
  AudioProcessor,
  upload
};
