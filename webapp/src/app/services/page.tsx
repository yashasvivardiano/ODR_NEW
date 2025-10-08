'use client'

import Link from 'next/link'

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-semibold text-gray-800">(company name)</Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link href="/services" className="text-orange-600 font-medium">Services</Link>
              <Link href="/public-help" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/signup" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Sign Up
              </Link>
              <Link href="/login" className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-orange-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Our Services
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive dispute resolution services designed to meet your specific needs, 
                from simple consumer complaints to complex business disputes.
              </p>
            </div>
          </div>
        </section>

        {/* Main Services */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Services</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Professional dispute resolution services tailored to your requirements
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <div className="text-orange-500 text-4xl mb-4">⚖️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Mediation Services</h3>
                <p className="text-gray-600 mb-6">
                  Professional mediation to help parties reach mutually acceptable agreements 
                  through facilitated negotiation.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>• Neutral third-party facilitation</li>
                  <li>• Confidential proceedings</li>
                  <li>• Flexible scheduling</li>
                  <li>• Cost-effective resolution</li>
                </ul>
                <button className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                  Learn More
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <div className="text-blue-500 text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Arbitration Services</h3>
                <p className="text-gray-600 mb-6">
                  Binding arbitration decisions by qualified arbitrators for faster, 
                  more efficient dispute resolution.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>• Expert arbitrator selection</li>
                  <li>• Binding decisions</li>
                  <li>• Streamlined process</li>
                  <li>• Enforceable outcomes</li>
                </ul>
                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                  Learn More
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <div className="text-green-500 text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Negotiation Support</h3>
                <p className="text-gray-600 mb-6">
                  Guided negotiation processes with expert support to help parties 
                  reach amicable settlements.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>• Structured negotiation</li>
                  <li>• Expert guidance</li>
                  <li>• Document preparation</li>
                  <li>• Settlement agreements</li>
                </ul>
                <button className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Specialized Services */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Specialized Services</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Industry-specific dispute resolution expertise
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">🛒</div>
                  <h3 className="text-xl font-semibold text-gray-900">Consumer Disputes</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Resolve consumer complaints, product defects, service issues, and warranty disputes 
                  quickly and fairly.
                </p>
                <div className="text-sm text-gray-500">
                  <p>• Product liability cases</p>
                  <p>• Service quality disputes</p>
                  <p>• Warranty claims</p>
                  <p>• Consumer rights violations</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">💼</div>
                  <h3 className="text-xl font-semibold text-gray-900">Business Disputes</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Handle complex business conflicts including contract disputes, partnership issues, 
                  and commercial disagreements.
                </p>
                <div className="text-sm text-gray-500">
                  <p>• Contract breaches</p>
                  <p>• Partnership disputes</p>
                  <p>• Commercial conflicts</p>
                  <p>• Intellectual property</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">🏠</div>
                  <h3 className="text-xl font-semibold text-gray-900">Property Disputes</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Resolve real estate conflicts, boundary disputes, landlord-tenant issues, 
                  and property damage claims.
                </p>
                <div className="text-sm text-gray-500">
                  <p>• Boundary disputes</p>
                  <p>• Landlord-tenant conflicts</p>
                  <p>• Property damage claims</p>
                  <p>• Real estate transactions</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">💻</div>
                  <h3 className="text-xl font-semibold text-gray-900">E-commerce Disputes</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Specialized resolution for online transactions, digital services, 
                  and technology-related disputes.
                </p>
                <div className="text-sm text-gray-500">
                  <p>• Online transaction disputes</p>
                  <p>• Digital service issues</p>
                  <p>• Technology conflicts</p>
                  <p>• Platform disputes</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Simple, transparent process from start to finish
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit Dispute</h3>
                <p className="text-gray-600">File your dispute with all relevant information and documents</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Case Review</h3>
                <p className="text-gray-600">Our experts review your case and recommend the best approach</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Resolution Process</h3>
                <p className="text-gray-600">Participate in mediation, arbitration, or negotiation sessions</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Resolution</h3>
                <p className="text-gray-600">Reach a fair, binding resolution that all parties can accept</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Transparent Pricing</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                No hidden fees, no surprises. Clear, upfront pricing for all our services.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Mediation</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">$150</div>
                <p className="text-gray-600 mb-6">Per session</p>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>• 2-hour mediation session</li>
                  <li>• Professional mediator</li>
                  <li>• Online platform access</li>
                  <li>• Basic documentation</li>
                </ul>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Choose Plan
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-orange-500 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Standard Arbitration</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">$500</div>
                <p className="text-gray-600 mb-6">Per case</p>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>• Full arbitration process</li>
                  <li>• Expert arbitrator</li>
                  <li>• Comprehensive documentation</li>
                  <li>• Binding decision</li>
                  <li>• Follow-up support</li>
                </ul>
                <button className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                  Choose Plan
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Enterprise</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">Custom</div>
                <p className="text-gray-600 mb-6">Tailored pricing</p>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>• Unlimited cases</li>
                  <li>• Dedicated support</li>
                  <li>• Custom workflows</li>
                  <li>• API integration</li>
                  <li>• Priority processing</li>
                </ul>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-orange-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Resolve Your Dispute?</h2>
            <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
              Get started today and experience the future of dispute resolution
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup"
                className="px-8 py-3 bg-white text-orange-500 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                Start Your Case
              </Link>
              <Link 
                href="/public-help"
                className="px-8 py-3 border border-white text-white rounded-md hover:bg-orange-600 transition-colors font-medium"
              >
                Get Support
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
