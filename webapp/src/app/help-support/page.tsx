'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

export default function HelpSupportPage() {
  const [activeTab, setActiveTab] = useState('faq')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I submit a new dispute?',
      answer: 'To submit a new dispute, go to the Cases section and click "Create Dispute". Fill out the multi-step form with your dispute details, upload supporting documents, and submit. You\'ll receive a case ID for tracking.',
      category: 'disputes'
    },
    {
      id: '2',
      question: 'How do I join a virtual hearing?',
      answer: 'When a hearing is scheduled, you\'ll receive a notification. Click "Join Hearing" from your dashboard or go to the Hearings section. The system will redirect you to the virtual mediation room with video conferencing capabilities.',
      category: 'hearings'
    },
    {
      id: '3',
      question: 'What documents can I upload?',
      answer: 'You can upload PDF, DOC, DOCX, and image files (JPG, PNG). Maximum file size is 10MB per document. Supported documents include contracts, emails, receipts, photos, and legal documents.',
      category: 'documents'
    },
    {
      id: '4',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot your password?" on the login page, enter your email address, and check your inbox for a reset link. The link expires in 24 hours for security.',
      category: 'account'
    },
    {
      id: '5',
      question: 'What are the different user roles?',
      answer: 'The platform supports Judges, Lawyers, Witnesses, and Parties. Each role has specific permissions and access to different features. Judges can manage cases, Lawyers can represent clients, and Parties can submit disputes.',
      category: 'account'
    },
    {
      id: '6',
      question: 'How do I track my case status?',
      answer: 'Log into your dashboard to see all your cases with current status. You can also click "View Details" on any case to see the full timeline, documents, and upcoming deadlines.',
      category: 'disputes'
    },
    {
      id: '7',
      question: 'Can I schedule a hearing?',
      answer: 'Yes, go to the Hearings section and click "Schedule Hearing". You can select available time slots and invite participants. The system will send notifications to all parties.',
      category: 'hearings'
    },
    {
      id: '8',
      question: 'How do I access meeting archives?',
      answer: 'Go to the Documents section and click on the "Meeting Archives" tab. You can search by case ID, participant, or date. Click "View Transcript" to see meeting details.',
      category: 'documents'
    },
    {
      id: '9',
      question: 'What if I have technical issues?',
      answer: 'Contact our technical support team at support@odr-platform.com or use the live chat feature. We also have a comprehensive troubleshooting guide in the Resources section.',
      category: 'technical'
    },
    {
      id: '10',
      question: 'How secure is my data?',
      answer: 'We use enterprise-grade encryption and security measures. All data is encrypted in transit and at rest. We comply with international data protection standards and conduct regular security audits.',
      category: 'security'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Topics', count: faqs.length },
    { id: 'disputes', name: 'Disputes', count: faqs.filter(f => f.category === 'disputes').length },
    { id: 'hearings', name: 'Hearings', count: faqs.filter(f => f.category === 'hearings').length },
    { id: 'documents', name: 'Documents', count: faqs.filter(f => f.category === 'documents').length },
    { id: 'account', name: 'Account', count: faqs.filter(f => f.category === 'account').length },
    { id: 'technical', name: 'Technical', count: faqs.filter(f => f.category === 'technical').length },
    { id: 'security', name: 'Security', count: faqs.filter(f => f.category === 'security').length }
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
      <Navigation currentPage="/help-support" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
          <p className="text-gray-600">Get help with using the ODR platform and resolve any issues</p>
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
                onClick={() => setActiveTab('resources')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'resources'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Resources
              </button>
            </nav>
          </div>

          <div className="p-6">
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

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">User Guide</h3>
                  <p className="text-gray-600 text-sm mb-4">Complete guide to using the ODR platform</p>
                  <button className="text-orange-600 hover:text-orange-700 font-medium">
                    Download PDF →
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Video Tutorials</h3>
                  <p className="text-gray-600 text-sm mb-4">Step-by-step video guides</p>
                  <button className="text-orange-600 hover:text-orange-700 font-medium">
                    Watch Videos →
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">API Documentation</h3>
                  <p className="text-gray-600 text-sm mb-4">Technical integration guides</p>
                  <button className="text-orange-600 hover:text-orange-700 font-medium">
                    View Docs →
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Troubleshooting</h3>
                  <p className="text-gray-600 text-sm mb-4">Common issues and solutions</p>
                  <button className="text-orange-600 hover:text-orange-700 font-medium">
                    View Guide →
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Security Guide</h3>
                  <p className="text-gray-600 text-sm mb-4">Best practices for data security</p>
                  <button className="text-orange-600 hover:text-orange-700 font-medium">
                    Read More →
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Resources</h3>
                  <p className="text-gray-600 text-sm mb-4">Legal templates and guidelines</p>
                  <button className="text-orange-600 hover:text-orange-700 font-medium">
                    Access →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
