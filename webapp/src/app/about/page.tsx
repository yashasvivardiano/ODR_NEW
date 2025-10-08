'use client'

import Link from 'next/link'

export default function AboutPage() {
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
              <Link href="/about" className="text-orange-600 font-medium">About</Link>
              <Link href="/services" className="text-gray-600 hover:text-gray-900">Services</Link>
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
        <section className="bg-gradient-to-r from-orange-50 to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                About Our ODR Platform
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Revolutionizing dispute resolution through technology, making justice accessible, 
                efficient, and cost-effective for everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-6">
                  We believe that everyone deserves access to fair, efficient, and affordable dispute resolution. 
                  Our Online Dispute Resolution (ODR) platform bridges the gap between traditional legal systems 
                  and modern technology, making justice more accessible than ever before.
                </p>
                <p className="text-lg text-gray-600">
                  By leveraging cutting-edge technology, we've created a platform that reduces costs, 
                  saves time, and provides transparent, secure resolution processes for all types of disputes.
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-blue-100 rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">⚖️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Justice for All</h3>
                <p className="text-gray-600">Making dispute resolution accessible, efficient, and fair</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                These principles guide everything we do and shape our commitment to excellence
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Security</h3>
                <p className="text-gray-600">Enterprise-grade encryption and data protection</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Efficiency</h3>
                <p className="text-gray-600">Fast, streamlined resolution processes</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Affordability</h3>
                <p className="text-gray-600">Cost-effective alternatives to litigation</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Accessibility</h3>
                <p className="text-gray-600">Available to everyone, anywhere, anytime</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experienced professionals dedicated to transforming dispute resolution
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">👨‍💼</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Legal Experts</h3>
                <p className="text-gray-600">Experienced judges, mediators, and legal professionals</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">👩‍💻</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tech Innovators</h3>
                <p className="text-gray-600">Cutting-edge technology and user experience experts</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Support Team</h3>
                <p className="text-gray-600">Dedicated customer success and support professionals</p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-orange-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Our Impact</h2>
              <p className="text-lg text-orange-100 max-w-2xl mx-auto">
                Numbers that demonstrate our commitment to excellence
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">10,000+</div>
                <div className="text-orange-100">Disputes Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">95%</div>
                <div className="text-orange-100">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">70%</div>
                <div className="text-orange-100">Cost Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-orange-100">Platform Availability</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Experience the Future of Dispute Resolution?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied users who have discovered a better way to resolve disputes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup"
                className="px-8 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium"
              >
                Get Started Today
              </Link>
              <Link 
                href="/public-help"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
