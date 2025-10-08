'use client'

import { useState } from 'react'
import Link from 'next/link'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

export default function PublicResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'What is Online Dispute Resolution (ODR)?',
      answer: 'Online Dispute Resolution (ODR) is a digital platform that helps parties resolve disputes without going to court. It uses technology to facilitate mediation, arbitration, and negotiation processes online.',
      category: 'general'
    },
    {
      id: '2',
      question: 'How does the ODR platform work?',
      answer: 'Our platform allows you to submit disputes, schedule virtual hearings, upload documents, and communicate with mediators and other parties. The process is designed to be faster and more cost-effective than traditional litigation.',
      category: 'general'
    },
    {
      id: '3',
      question: 'What types of disputes can be resolved?',
      answer: 'We handle consumer complaints, contract disputes, e-commerce issues, property disputes, employment matters, and business conflicts. Our platform is suitable for most civil disputes.',
      category: 'disputes'
    },
    {
      id: '4',
      question: 'How much does it cost to use the platform?',
      answer: 'Our pricing is transparent and significantly lower than traditional legal fees. Costs vary based on dispute complexity and resolution method. Contact us for a personalized quote.',
      category: 'pricing'
    },
    {
      id: '5',
      question: 'Is the platform secure and confidential?',
      answer: 'Yes, we use enterprise-grade encryption and security measures. All communications and documents are confidential and protected. We comply with international data protection standards.',
      category: 'security'
    },
    {
      id: '6',
      question: 'How long does the resolution process take?',
      answer: 'Resolution times vary depending on case complexity. Simple disputes can be resolved in days, while complex cases may take weeks. Our platform is designed to be much faster than traditional court processes.',
      category: 'process'
    },
    {
      id: '7',
      question: 'Do I need a lawyer to use the platform?',
      answer: 'While you can represent yourself, having legal representation is often beneficial. Our platform supports both self-represented parties and those with legal counsel.',
      category: 'legal'
    },
    {
      id: '8',
      question: 'What if the other party doesn\'t agree to use ODR?',
      answer: 'We encourage all parties to participate, but ODR is voluntary. If one party refuses, you may need to pursue traditional legal options. Our team can help explain the benefits to reluctant parties.',
      category: 'process'
    },
    {
      id: '9',
      question: 'Can I access the platform from my mobile device?',
      answer: 'Yes, our platform is fully responsive and works on desktop, tablet, and mobile devices. You can participate in hearings and manage your cases from anywhere.',
      category: 'technical'
    },
    {
      id: '10',
      question: 'What happens if we can\'t reach an agreement?',
      answer: 'If mediation fails, you can pursue arbitration through our platform or take your case to traditional courts. Our mediators will help explore all possible solutions before concluding the process.',
      category: 'process'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Topics', count: faqs.length },
    { id: 'general', name: 'General', count: faqs.filter(f => f.category === 'general').length },
    { id: 'disputes', name: 'Disputes', count: faqs.filter(f => f.category === 'disputes').length },
    { id: 'pricing', name: 'Pricing', count: faqs.filter(f => f.category === 'pricing').length },
    { id: 'security', name: 'Security', count: faqs.filter(f => f.category === 'security').length },
    { id: 'process', name: 'Process', count: faqs.filter(f => f.category === 'process').length },
    { id: 'legal', name: 'Legal', count: faqs.filter(f => f.category === 'legal').length },
    { id: 'technical', name: 'Technical', count: faqs.filter(f => f.category === 'technical').length }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
                <Link href="/public-resources" className="text-orange-600 font-medium">Resources</Link>
                <Link href="/help-support" className="text-gray-600 hover:text-gray-900">Contact Us</Link>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resources & FAQs</h1>
          <p className="text-gray-600">Find answers to common questions and learn more about our platform</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder="Search for topics or keywords"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="p-6">
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
        </div>

        {/* Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-orange-500 text-3xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">User Guide</h3>
            <p className="text-gray-600 text-sm mb-4">Complete guide to using our ODR platform</p>
            <button className="text-orange-600 hover:text-orange-700 font-medium">
              Download PDF →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-orange-500 text-3xl mb-4">🎥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Video Tutorials</h3>
            <p className="text-gray-600 text-sm mb-4">Step-by-step video guides for platform features</p>
            <button className="text-orange-600 hover:text-orange-700 font-medium">
              Watch Videos →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-orange-500 text-3xl mb-4">⚖️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Resources</h3>
            <p className="text-gray-600 text-sm mb-4">Legal templates and dispute resolution guidelines</p>
            <button className="text-orange-600 hover:text-orange-700 font-medium">
              Access Resources →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-orange-500 text-3xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Security Guide</h3>
            <p className="text-gray-600 text-sm mb-4">Best practices for data security and privacy</p>
            <button className="text-orange-600 hover:text-orange-700 font-medium">
              Read Guide →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-orange-500 text-3xl mb-4">💰</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Pricing Information</h3>
            <p className="text-gray-600 text-sm mb-4">Transparent pricing and cost comparison</p>
            <button className="text-orange-600 hover:text-orange-700 font-medium">
              View Pricing →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-orange-500 text-3xl mb-4">📞</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Get Support</h3>
            <p className="text-gray-600 text-sm mb-4">Contact our support team for assistance</p>
            <Link href="/help-support" className="text-orange-600 hover:text-orange-700 font-medium">
              Contact Us →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
