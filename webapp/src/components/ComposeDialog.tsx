'use client'

import { useState } from 'react'
import FormattingToolbar from './FormattingToolbar'

interface ComposeDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function ComposeDialog({ isOpen, onClose }: ComposeDialogProps) {
  const [recipients, setRecipients] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [showFormattingToolbar, setShowFormattingToolbar] = useState(false)

  const handleSend = () => {
    // Handle send logic here
    console.log('Sending message:', { recipients, subject, message })
    alert('Message sent successfully!')
    onClose()
    // Reset form
    setRecipients('')
    setSubject('')
    setMessage('')
  }

  const handleDiscard = () => {
    // Reset form and close
    setRecipients('')
    setSubject('')
    setMessage('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-0 right-0 w-[580px] h-[600px] bg-white shadow-xl z-50 border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-800">New Message</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => alert('Minimize dialog')}
            className="text-gray-500 hover:text-gray-700 text-lg leading-none"
            title="Minimize"
          >
            _
          </button>
          <button 
            onClick={() => alert('Maximize dialog')}
            className="text-gray-500 hover:text-gray-700 text-lg leading-none"
            title="Maximize"
          >
            ☐
          </button>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-lg leading-none"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* To Field */}
      <div className="p-2 border-b border-gray-200 flex items-center">
        <span className="text-sm text-gray-600 mr-2">To</span>
        <input
          type="text"
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          placeholder="Enter recipient email"
          className="flex-1 outline-none text-sm text-black placeholder-gray-400"
        />
        <button 
          onClick={() => alert('Cc Bcc functionality')}
          className="text-blue-600 text-xs hover:underline"
        >
          Cc Bcc
        </button>
      </div>

      {/* Subject Field */}
      <div className="p-2 border-b border-gray-200">
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="w-full outline-none text-sm text-black placeholder-gray-400"
        />
      </div>

      {/* Message Body */}
      <div className="flex-1 p-2 overflow-y-auto">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="w-full h-full outline-none resize-none text-sm text-black placeholder-gray-400"
        ></textarea>
      </div>

      {/* Footer Toolbar */}
      <div className="flex justify-between items-center p-2 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSend}
            className="bg-orange-500 text-white text-sm px-4 py-2 rounded-full flex items-center space-x-1 hover:bg-orange-600 transition-colors"
          >
            <span>Send</span>
            <span className="text-xs">▼</span>
          </button>
          <button 
            onClick={() => setShowFormattingToolbar(!showFormattingToolbar)}
            className={`w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full text-lg ${
              showFormattingToolbar ? 'bg-gray-300' : ''
            }`}
            title="Font formatting"
          >
            Aa
          </button>
          <button 
            onClick={() => alert('Attach file')}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full text-lg"
            title="Attach file"
          >
            📎
          </button>
          <button 
            onClick={() => alert('Insert link')}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full text-lg"
            title="Insert link"
          >
            🔗
          </button>
          <button 
            onClick={() => alert('Insert emoji')}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full text-lg"
            title="Insert emoji"
          >
            😀
          </button>
          <button 
            onClick={() => alert('Insert image')}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full text-lg"
            title="Insert image"
          >
            🖼️
          </button>
          <button 
            onClick={() => alert('Security options')}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full text-lg"
            title="Security options"
          >
            🔒
          </button>
          <button 
            onClick={() => alert('Drawing tool')}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full text-lg"
            title="Drawing tool"
          >
            🖊️
          </button>
          <button 
            onClick={() => alert('More options')}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full text-lg"
            title="More options"
          >
            ...
          </button>
        </div>
        <button 
          onClick={handleDiscard} 
          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full text-lg"
          title="Discard message"
        >
          🗑️
        </button>
      </div>

      {/* Formatting Toolbar */}
      <FormattingToolbar 
        isVisible={showFormattingToolbar}
        onClose={() => setShowFormattingToolbar(false)}
      />
    </div>
  )
}