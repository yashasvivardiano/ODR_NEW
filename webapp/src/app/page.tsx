'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-800 rounded mr-2"></div>
                <span className="text-lg font-semibold text-gray-800">(company name)</span>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <nav className="hidden md:flex space-x-8">
                <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How it Works</a>
                <Link href="/public-resources" className="text-gray-600 hover:text-gray-900">Resources</Link>
                <Link href="/public-help" className="text-gray-600 hover:text-gray-900">Contact Us</Link>
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

      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Resolve Disputes Online with Ease
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our platform offers a streamlined, efficient, and cost-effective way to resolve disputes without the need for traditional litigation. Get started today and experience a new approach to conflict resolution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/ai-filing" 
                  className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600 transition-colors font-medium inline-block text-center"
                >
                  Submit a New Dispute
                </Link>
                <Link 
                  href="/hearings" 
                  className="bg-blue-500 text-white px-8 py-3 rounded-md hover:bg-blue-600 transition-colors font-medium inline-block text-center"
                >
                  View Hearings
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-80 h-80 bg-gradient-to-br from-orange-100 to-green-100 rounded-lg overflow-hidden flex items-center justify-center">
                <div className="text-6xl">⚖️</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Disputes */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Types of Disputes We Resolve</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Consumer Complaints */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-orange-500 text-3xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Consumer Complaints</h3>
              <p className="text-gray-600 text-sm">
                Resolve issues between consumers and businesses, such as product defects or service disagreements, efficiently and fairly.
              </p>
            </div>

            {/* Contract Disputes */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-orange-500 text-3xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Contract Disputes</h3>
              <p className="text-gray-600 text-sm">
                Address disagreements arising from contracts, including breaches or interpretation disputes, through mediated negotiation.
              </p>
            </div>

            {/* E-commerce Issues */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-orange-500 text-3xl mb-4">💻</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">E-commerce Issues</h3>
              <p className="text-gray-600 text-sm">
                Handle disputes related to online transactions, including payment issues, delivery problems, or product discrepancies.
              </p>
            </div>

            {/* Property Disputes */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-orange-500 text-3xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Property Disputes</h3>
              <p className="text-gray-600 text-sm">
                Facilitate resolution of property-related conflicts, such as boundary disputes or lease disagreements, with expert guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How (company name) Works</h2>
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg mr-6">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Submit Your Dispute</h3>
                <p className="text-gray-600">
                  Provide details about your dispute and upload any supporting documents.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg mr-6">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Mediation and Negotiation</h3>
                <p className="text-gray-600">
                  Our platform facilitates communication and negotiation between parties, guided by experienced mediators.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg mr-6">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Resolution</h3>
                <p className="text-gray-600">
                  Reach a mutually agreeable resolution and finalize the terms online.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Story 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 relative overflow-hidden">
                <Image
                  src="/success-story-1.jpg"
                  alt="Dispute Resolved in 2 Weeks"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling.style.display = 'flex'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center" style={{display: 'none'}}>
                  <div className="text-4xl">✅</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Dispute Resolved in 2 Weeks</h3>
                <p className="text-gray-600 text-sm">
                  "I was amazed at how quickly and efficiently we resolved our dispute using (company name). It saved us time and money."
                </p>
              </div>
            </div>

            {/* Story 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 relative overflow-hidden">
                <Image
                  src="/success-story-2.png"
                  alt="Business Partnership Saved"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling.style.display = 'flex'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center" style={{display: 'none'}}>
                  <div className="text-4xl">🤝</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Business Partnership Saved</h3>
                <p className="text-gray-600 text-sm">
                  "Thanks to (company name), we were able to save our business partnership and avoid a lengthy legal battle."
                </p>
              </div>
            </div>

            {/* Story 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 relative overflow-hidden">
                <Image
                  src="/success-story-3.jpg"
                  alt="Quick and Cost-Effective Resolution"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling.style.display = 'flex'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center" style={{display: 'none'}}>
                  <div className="text-4xl">📋</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Quick and Cost-Effective Resolution</h3>
                <p className="text-gray-600 text-sm">
                  "The platform was easy to use, and the mediator was incredibly helpful in guiding us to a resolution."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Ready to Resolve Your Dispute?</h2>
          <Link 
            href="/ai-filing" 
            className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600 transition-colors font-medium inline-block"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <a href="#" className="text-gray-600 hover:text-gray-900">Resources/FAQ</a>
            </div>
            <div>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact Us</a>
            </div>
            <div>
              <a href="#" className="text-gray-600 hover:text-gray-900">Terms of Service</a>
            </div>
            <div>
              <a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
            </div>
          </div>
          
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <span className="sr-only">Email</span>
              📧
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <span className="sr-only">Phone</span>
              📞
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <span className="sr-only">LinkedIn</span>
              💼
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <span className="sr-only">Twitter</span>
              🐦
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <span className="sr-only">Facebook</span>
              📘
            </a>
          </div>
          
          <div className="text-center text-gray-500 text-sm">
            © 2024 ResolveRight. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}