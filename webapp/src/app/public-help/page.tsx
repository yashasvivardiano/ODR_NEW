'use client'

import { useState } from 'react'
import Link from 'next/link'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

export default function PublicHelpPage() {
  const [activeTab, setActiveTab] = useState('contact')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I get started with the platform?',
      answer: 'To get started, simply click "Register / Login" on our homepage, create an account, and follow the guided setup process. You can then submit disputes or participate in existing cases.',
      category: 'getting-started'
    },
    {
      id: '2',
      question: 'What are the system requirements?',
      answer: 'Our platform works on any modern web browser (Chrome, Firefox, Safari, Edge) on desktop, tablet, or mobile devices. You need a stable internet connection for video hearings.',
      category: 'technical'
    },
    {
      id: '3',
      question: 'How do I contact support?',
      answer: 'You can reach our support team via phone at +1 (555) 123-4567, email at support@odr-platform.com, or use our live chat feature during business hours.',
      category: 'support'
    },
    {
      id: '4',
      question: 'What are your business hours?',
      answer: 'Our support team is available Monday-Friday 9 AM - 6 PM EST, Saturday 10 AM - 4 PM EST. Email support is available 24/7 with responses within 24 hours.',
      category: 'support'
    },
    {
      id: '5',
      question: 'How secure is my information?',
      answer: 'We use enterprise-grade encryption and security measures. All data is encrypted in transit and at rest. We comply with international data protection standards.',
      category: 'security'
    },
    {
      id: '6',
      question: 'Can I schedule a demo?',
      answer: 'Yes! Contact our sales team to schedule a personalized demo of our platform. We can show you how ODR can benefit your organization.',
      category: 'demo'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Topics', count: faqs.length },
    { id: 'getting-started', name: 'Getting Started', count: faqs.filter(f => f.category === 'getting-started').length },
    { id: 'technical', name: 'Technical', count: faqs.filter(f => f.category === 'technical').length },
    { id: 'support', name: 'Support', count: faqs.filter(f => f.category === 'support').length },
    { id: 'security', name: 'Security', count: faqs.filter(f => f.category === 'security').length },
    { id: 'demo', name: 'Demo', count: faqs.filter(f => f.category === 'demo').length }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSubmitTicket = () => {
    alert('Support ticket submission feature coming soon!\n\nThis will allow you to:\n• Submit detailed support requests\n• Attach screenshots and documents\n• Track ticket status\n• Receive email updates')
  }

  const handleLiveChat = () => {
    alert('Live chat feature coming soon!\n\nThis will provide:\n• Real-time chat with support agents\n• File sharing capabilities\n• Chat history\n• Quick response times')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 bg-gray-800 rounded mr-2"></div>
                <span className="text-lg font-semibold text-gray-800">(company name)</span>
              </Link>
            </div>
            <div className="flex items-center space-x-8">
              <nav className="hidden md:flex space-x-8">
                <a href="/#how-it-works" className="text-gray-600 hover:text-gray-900">How it Works</a>
                <Link href="/public-resources" className="text-gray-600 hover:text-gray-900">Resources</Link>
                <Link href="/public-help" className="text-orange-600 font-medium">Contact Us</Link>
              </nav>
              <Link 
                href="/login" 
                className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors font-medium"
              >
                Register / Login
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us & Support</h1>
          <p className="text-gray-600">Get help with using our platform and resolve any issues</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Live Chat</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Get instant help from our support team</p>
            <button 
              onClick={handleLiveChat}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Start Chat
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">🎫</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Submit Ticket</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Create a support ticket for complex issues</p>
            <button 
              onClick={handleSubmitTicket}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Submit Ticket
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-lg">📞</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Contact Us</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Phone and email support</p>
            <div className="text-sm text-gray-600">
              <p>📞 +1 (555) 123-4567</p>
              <p>📧 support@odr-platform.com</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('contact')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'contact'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Contact Information
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'faq'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                FAQ
              </button>
              <button
                onClick={() => setActiveTab('demo')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'demo'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Schedule Demo
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📞</span>
                      <div>
                        <p className="font-medium text-gray-900">Phone Support</p>
                        <p className="text-gray-600">+1 (555) 123-4567</p>
                        <p className="text-sm text-gray-500">Mon-Fri, 9 AM - 6 PM EST</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📧</span>
                      <div>
                        <p className="font-medium text-gray-900">Email Support</p>
                        <p className="text-gray-600">support@odr-platform.com</p>
                        <p className="text-sm text-gray-500">24/7 response within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💬</span>
                      <div>
                        <p className="font-medium text-gray-900">Live Chat</p>
                        <p className="text-gray-600">Available on platform</p>
                        <p className="text-sm text-gray-500">Mon-Fri, 9 AM - 5 PM EST</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM EST</p>
                    <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM EST</p>
                    <p><strong>Sunday:</strong> Closed</p>
                    <p><strong>Holidays:</strong> Limited support available</p>
                  </div>
                </div>
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div>
                {/* Search and Filter */}
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search FAQ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name} ({category.count})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <span className="text-gray-500">
                          {openFAQ === faq.id ? '−' : '+'}
                        </span>
                      </button>
                      {openFAQ === faq.id && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {filteredFAQs.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No FAQs found matching your search criteria.</p>
                  </div>
                )}
              </div>
            )}

            {/* Demo Tab */}
            {activeTab === 'demo' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Schedule a Demo</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  See how our ODR platform can benefit your organization. Our team will show you the key features and answer any questions you may have.
                </p>
                <div className="space-y-4">
                  <button className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium">
                    Schedule Demo
                  </button>
                  <p className="text-sm text-gray-500">
                    Or contact us directly at <strong>sales@odr-platform.com</strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
