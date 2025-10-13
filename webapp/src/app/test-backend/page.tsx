'use client'

import { useState } from 'react'

export default function TestBackend() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testBackend = async () => {
    setLoading(true)
    setResult('Testing...')
    
    try {
      // Test health endpoint
      const healthResponse = await fetch('http://localhost:3001/api/health')
      const healthData = await healthResponse.json()
      
      // Test login endpoint
      const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'demo@example.com', password: 'demo123' }),
      })
      const loginData = await loginResponse.json()
      
      setResult(`✅ Backend is working!
      
Health Check: ${JSON.stringify(healthData, null, 2)}

Login Test: ${JSON.stringify(loginData, null, 2)}`)
    } catch (error) {
      setResult(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Backend Connection Test</h1>
      <button 
        onClick={testBackend} 
        disabled={loading}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007AFF', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Backend Connection'}
      </button>
      
      <pre style={{ 
        marginTop: '20px', 
        padding: '10px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '5px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        {result}
      </pre>
    </div>
  )
}
