# Quick Integration Guide - ODR AI System

## 🚀 Wire AI into Your App (3 Steps)

### Step 1: Update App.tsx (Temporary Testing)
```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FilingFormExample from './FilingFormExample';
import HearingAIDashboard from './HearingAIDashboard';

export default function App() {
  const [currentView, setCurrentView] = React.useState('menu');

  if (currentView === 'filing') {
    return <FilingFormExample />;
  }
  
  if (currentView === 'hearing') {
    return <HearingAIDashboard />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ODR AI System</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setCurrentView('filing')}
      >
        <Text style={styles.buttonText}>🤖 AI Filing Assistant</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => setCurrentView('hearing')}
      >
        <Text style={styles.buttonText}>🎥 Court Hearing AI</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
```

### Step 2: Configure Environment
Add to your app's environment:
```typescript
// In your app config or .env
export const AI_CONFIG = {
  baseUrl: 'http://localhost:3001', // Your backend URL
  // For device testing, use your computer's IP:
  // baseUrl: 'http://192.168.1.100:3001',
};
```

### Step 3: Test Both Features

**Filing AI Test:**
1. Open app → "AI Filing Assistant"
2. Fill in dispute description (50+ chars)
3. See AI suggestions appear automatically
4. Click "Apply" to use suggestions

**Hearing AI Test:**
1. Open app → "Court Hearing AI"
2. Click "Process Court Hearing Video"
3. Watch real-time progress (8 stages)
4. See transcript, probability analysis when done

## 🔧 Backend Status
Your backend is running on `http://localhost:3001` with:
- ✅ Groq API key configured
- ✅ Filing assistance endpoint
- ✅ Hearing processing pipeline
- ✅ Real-time status tracking

## 📱 Mobile Testing
For testing on physical device/emulator:
1. Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update baseUrl to: `http://YOUR_IP:3001`
3. Ensure backend allows CORS for your IP

## 🚨 Quick Debug
If something doesn't work:
1. **Backend not responding?** 
   - Check: `curl http://localhost:3001/health`
   - Restart: `cd backend && npm start`

2. **AI suggestions not showing?**
   - Check browser console for errors
   - Verify GROQ_API_KEY in backend/.env

3. **Mobile app crashes?**
   - Check Metro bundler logs
   - Ensure all imports are correct

## 🎯 Next Steps (Production)
- Replace localhost with your deployed backend URL
- Add real video upload capability
- Implement user authentication
- Add case management database
- Deploy to app stores

That's it! Your AI system is ready to demo. 🚀
