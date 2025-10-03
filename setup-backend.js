// ODR AI Backend Setup Script
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up ODR AI Backend...');

try {
  // Create backend directory
  const backendDir = path.join(__dirname, 'backend');
  if (!fs.existsSync(backendDir)) {
    fs.mkdirSync(backendDir);
    console.log('✅ Created backend directory');
  }

  // Copy files to backend directory
  const filesToCopy = [
    { src: 'backend-server.js', dest: 'server.js' },
    { src: 'backend-package.json', dest: 'package.json' },
    { src: 'backend-env.example', dest: '.env.example' }
  ];

  filesToCopy.forEach(({ src, dest }) => {
    const srcPath = path.join(__dirname, src);
    const destPath = path.join(backendDir, dest);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied ${src} to backend/${dest}`);
    }
  });

  // Install dependencies
  console.log('📦 Installing backend dependencies...');
  process.chdir(backendDir);
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\n🎉 Backend setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. cd backend');
  console.log('2. cp .env.example .env');
  console.log('3. Edit .env and add your OPENAI_API_KEY');
  console.log('4. npm start');
  console.log('\n🔗 Test endpoint: http://localhost:3001/health');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
