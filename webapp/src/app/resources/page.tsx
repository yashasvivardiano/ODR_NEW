'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'

interface FAQItem {
  id: number
  question: string
  answer: string
  isOpen: boolean
}

interface ResourceCard {
  id: number
  title: string
  description: string
  icon: string
}

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: 1,
      question: "How does (company name) work?",
      answer: "ResolveRight provides a secure and user-friendly platform for resolving disputes online. It facilitates communication between parties, offers tools for negotiation and mediation, and provides access to qualified mediators. The process typically involves submitting a dispute, exchanging information, engaging in negotiation or mediation, and reaching a resolution agreement.",
      isOpen: true
    },
    {
      id: 2,
      question: "What types of disputes can be resolved through (company name)?",
      answer: "Our platform handles a wide range of disputes including commercial disputes, consumer complaints, employment issues, landlord-tenant conflicts, and many other civil matters. We work with qualified mediators who specialize in different areas of law.",
      isOpen: false
    },
    {
      id: 3,
      question: "How much does it cost to use (company name)?",
      answer: "Our pricing is transparent and affordable. We offer different packages based on the complexity of your dispute, starting from $99 for simple cases. There are no hidden fees, and you only pay when you reach a resolution.",
      isOpen: false
    },
    {
      id: 4,
      question: "How long does the dispute resolution process typically take?",
      answer: "Most disputes are resolved within 30-90 days, depending on the complexity and cooperation of all parties involved. Simple cases can be resolved in as little as 2-4 weeks, while more complex matters may take longer.",
      isOpen: false
    },
    {
      id: 5,
      question: "What happens if we can't reach an agreement?",
      answer: "If mediation doesn't result in an agreement, you still have all your legal rights and options available. You can pursue traditional litigation, arbitration, or other dispute resolution methods. Our mediators will provide guidance on next steps.",
      isOpen: false
    }
  ])

  const resourceCards: ResourceCard[] = [
    {
      id: 1,
      title: "Dispute Resolution Guide",
      description: "A comprehensive guide to understanding the dispute resolution process on (company name).",
      icon: "📄"
    },
    {
      id: 2,
      title: "Mediation Best Practices",
      description: "Tips and strategies for effective mediation and negotiation.",
      icon: "📖"
    },
    {
      id: 3,
      title: "Legal Information",
      description: "Access legal information and resources related to dispute resolution.",
      icon: "⚖️"
    }
  ]

  const toggleFAQ = (id: number) => {
    setFaqs(faqs.map(faq => 
      faq.id === id 
        ? { ...faq, isOpen: !faq.isOpen }
        : { ...faq, isOpen: false }
    ))
  }

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="/resources" />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resources & FAQs
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions and access helpful resources to guide you through the dispute resolution process.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
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

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="font-medium text-gray-900 text-lg">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                      faq.isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {faq.isOpen && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Resources Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Additional Resources
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {resourceCards.map((card) => (
              <div key={card.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="text-4xl mb-4">
                  {card.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {card.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
