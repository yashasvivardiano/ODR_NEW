'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '../../components/Navigation'
import ComposeDialog from '../../components/ComposeDialog'

export default function MessagesPage() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('inbox')
  const [searchQuery, setSearchQuery] = useState('')
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      caseNumber: '12345',
      parties: 'John Smith vs. Jane Doe',
      preview: 'Hi, I\'ve reviewed the documents and have a few questions...',
      time: '2 hours ago',
      unread: true,
      avatar: 'JS',
      folder: 'inbox'
    },
    {
      id: 2,
      caseNumber: '67890',
      parties: 'Robert Johnson vs. Alice Brown',
      preview: 'The hearing is scheduled for next Tuesday at 2 PM.',
      time: '1 day ago',
      unread: true,
      avatar: 'RJ',
      folder: 'inbox'
    },
    {
      id: 3,
      caseNumber: '11223',
      parties: 'Michael Davis vs. Sarah Wilson',
      preview: 'Please find the attached settlement agreement.',
      time: '2 days ago',
      unread: false,
      avatar: 'MD',
      folder: 'sent'
    },
    {
      id: 4,
      caseNumber: '33445',
      parties: 'David Lee vs. Emily Clark',
      preview: 'I\'m available for a virtual hearing next week.',
      time: '3 days ago',
      unread: false,
      avatar: 'DL',
      folder: 'drafts'
    },
    {
      id: 5,
      caseNumber: '55667',
      parties: 'Christopher Harris vs. Olivia Green',
      preview: 'The judge has requested additional information.',
      time: '1 week ago',
      unread: false,
      avatar: 'CH',
      folder: 'starred'
    }
  ])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const userData = localStorage.getItem('user')
    
    if (!isLoggedIn || !userData) {
      window.location.href = '/login'
      return
    }
    
    setUser(JSON.parse(userData))
  }, [])


  const getMessageCount = (folder: string) => {
    return messages.filter(msg => msg.folder === folder).length
  }

  const sidebarItems = [
    { id: 'inbox', label: 'Inbox', icon: '📁', count: getMessageCount('inbox') },
    { id: 'sent', label: 'Sent', icon: '✈️', count: getMessageCount('sent') },
    { id: 'drafts', label: 'Drafts', icon: '📄', count: getMessageCount('drafts') },
    { id: 'starred', label: 'Starred', icon: '⭐', count: getMessageCount('starred') },
    { id: 'trash', label: 'Trash', icon: '🗑️', count: getMessageCount('trash') }
  ]

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    console.log(`Switched to ${tabId} tab`)
  }

  const handleCompose = () => {
    setIsComposeOpen(true)
  }

  const handleSettings = () => {
    alert('Settings clicked - This would open message settings')
  }

  const filteredMessages = messages.filter(message => {
    const matchesFolder = message.folder === activeTab
    const matchesSearch = message.parties.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.caseNumber.includes(searchQuery)
    return matchesFolder && (searchQuery === '' || matchesSearch)
  })

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <Navigation currentPage="/messages" unreadCount={0} />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200">
          <div className="p-6">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  suppressHydrationWarning
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count > 0 && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activeTab === item.id
                        ? 'bg-orange-200 text-orange-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <button 
                onClick={handleCompose}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors cursor-pointer"
                suppressHydrationWarning
              >
                Compose
              </button>
            </div>

            <div className="mt-8">
              <button 
                onClick={handleSettings}
                className="flex items-center space-x-3 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                suppressHydrationWarning
              >
                <span className="text-lg">⚙️</span>
                <span className="font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-black mb-4">Messages</h1>
            
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search messages"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-stone-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black placeholder-gray-500"
                suppressHydrationWarning
              />
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📧</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No messages found</h3>
                  <p className="text-gray-500">Try adjusting your search terms</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 bg-white rounded-lg shadow-sm border-l-4 cursor-pointer hover:shadow-md transition-shadow ${
                        message.unread ? 'border-orange-500' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-semibold">
                          {message.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-lg font-semibold text-black truncate">
                              Case {message.caseNumber} - {message.parties}
                            </h3>
                            <span className="text-sm text-gray-500">{message.time}</span>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {message.preview}
                          </p>
                          {message.unread && (
                            <div className="mt-2">
                              <span className="inline-block w-2 h-2 bg-orange-500 rounded-full"></span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Compose Dialog */}
      <ComposeDialog 
        isOpen={isComposeOpen} 
        onClose={() => setIsComposeOpen(false)} 
      />
    </div>
  )
}
