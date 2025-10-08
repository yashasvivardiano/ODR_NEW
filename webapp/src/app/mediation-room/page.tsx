'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

interface Participant {
  id: string
  name: string
  role: string
  avatar: string
  isOnline: boolean
}

interface Document {
  id: string
  name: string
  type: string
  size: string
}

interface ChatMessage {
  id: string
  sender: string
  senderRole: string
  message: string
  timestamp: string
  avatar: string
  isFromMediator: boolean
}

export default function MediationRoomPage() {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(true)

  const participants: Participant[] = [
    {
      id: '1',
      name: 'Dr. Olivia Bennett',
      role: 'Mediator',
      avatar: '👩‍⚖️',
      isOnline: true
    },
    {
      id: '2',
      name: 'Ethan Carter',
      role: 'Party A',
      avatar: '👨‍💼',
      isOnline: true
    },
    {
      id: '3',
      name: 'Chloe Davis',
      role: 'Party B',
      avatar: '👩‍💼',
      isOnline: true
    }
  ]

  const documents: Document[] = [
    {
      id: '1',
      name: 'Contract Agreement',
      type: 'PDF',
      size: '2.4 MB'
    },
    {
      id: '2',
      name: 'Financial Records',
      type: 'PDF',
      size: '1.8 MB'
    },
    {
      id: '3',
      name: 'Correspondence',
      type: 'PDF',
      size: '3.2 MB'
    }
  ]

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'Dr. Olivia Bennett',
      senderRole: 'Mediator',
      message: 'Welcome everyone. Let\'s start by reviewing the agreed-upon agenda for today\'s session.',
      timestamp: '10:30 AM',
      avatar: '👩‍⚖️',
      isFromMediator: true
    },
    {
      id: '2',
      sender: 'Ethan Carter',
      senderRole: 'Party A',
      message: 'Sounds good, Dr. Bennett. We\'re ready to proceed.',
      timestamp: '10:31 AM',
      avatar: '👨‍💼',
      isFromMediator: false
    },
    {
      id: '3',
      sender: 'Dr. Olivia Bennett',
      senderRole: 'Mediator',
      message: 'Great. First, let\'s address the outstanding financial matters. Ethan, could you provide an update on the proposed settlement terms?',
      timestamp: '10:32 AM',
      avatar: '👩‍⚖️',
      isFromMediator: true
    }
  ])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'You',
        senderRole: 'Participant',
        message: chatMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: '👤',
        isFromMediator: false
      }
      setChatMessages([...chatMessages, newMessage])
      setChatMessage('')
    }
  }

  const toggleVideo = () => setIsVideoOn(!isVideoOn)
  const toggleAudio = () => setIsAudioOn(!isAudioOn)
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing)
  const toggleRecording = () => setIsRecording(!isRecording)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="/mediation-room" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mediation Room: Case #12345</h1>
          <p className="text-gray-600">Virtual hearing session in progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-3">
            {/* Video Conference Display */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                {isVideoOn ? (
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gray-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <span className="text-2xl">▶️</span>
                      </div>
                    </div>
                    <p className="text-gray-600">Video Conference Active</p>
                    <p className="text-sm text-gray-500">Dr. Olivia Bennett is speaking</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-4xl">📹</span>
                    </div>
                    <p className="text-gray-600">Video is turned off</p>
                  </div>
                )}
              </div>

              {/* Video Controls */}
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={toggleVideo}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isVideoOn 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                >
                  {isVideoOn ? '📹 Turn Off Video' : '📹 Turn On Video'}
                </button>
                <button
                  onClick={toggleAudio}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isAudioOn 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                >
                  {isAudioOn ? '🎤 Mute' : '🎤 Unmute'}
                </button>
                <button
                  onClick={toggleScreenShare}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isScreenSharing 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                >
                  {isScreenSharing ? '🖥️ Stop Sharing' : '🖥️ Share Screen'}
                </button>
                <button
                  onClick={toggleRecording}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isRecording 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                >
                  {isRecording ? '⏹️ Stop Recording' : '⏺️ Start Recording'}
                </button>
              </div>
            </div>

            {/* Chat Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
                  <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {isChatOpen ? '▼' : '▶️'}
                  </button>
                </div>
              </div>
              
              {isChatOpen && (
                <>
                  <div className="p-6 max-h-64 overflow-y-auto">
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isFromMediator ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`flex max-w-xs lg:max-w-md ${message.isFromMediator ? 'flex-row' : 'flex-row-reverse'}`}>
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                                {message.avatar}
                              </div>
                            </div>
                            <div className={`ml-3 ${message.isFromMediator ? '' : 'mr-3'}`}>
                              <div className={`px-4 py-2 rounded-lg ${
                                message.isFromMediator 
                                  ? 'bg-orange-100 text-gray-900' 
                                  : 'bg-orange-500 text-white'
                              }`}>
                                <p className="text-sm font-medium">{message.sender}</p>
                                <p className="text-sm">{message.message}</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex space-x-4">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder-gray-500"
                      />
                      <button
                        type="submit"
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Participants */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Participants</h3>
              <div className="space-y-4">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                        {participant.avatar}
                      </div>
                      {participant.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{participant.name}</p>
                      <p className="text-sm text-gray-500">{participant.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                    <div className="text-2xl">📄</div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500">{doc.type} • {doc.size}</p>
                    </div>
                    <button className="text-orange-600 hover:text-orange-700">
                      <span className="text-lg">⬇️</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">1h 23m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Active
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recording:</span>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    isRecording 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isRecording ? 'Recording' : 'Not Recording'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
