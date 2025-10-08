'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function SuccessStoriesPage() {
  const stories = [
    {
      id: 1,
      title: "Dispute Resolved in 2 Weeks",
      description: "I was amazed at how quickly and efficiently we resolved our dispute using (company name). It saved us time and money.",
      image: "/success-story-1.jpg",
      icon: "✅"
    },
    {
      id: 2,
      title: "Business Partnership Saved",
      description: "Thanks to (company name), we were able to save our business partnership and avoid a lengthy legal battle.",
      image: "/success-story-2.png",
      icon: "🤝"
    },
    {
      id: 3,
      title: "Quick and Cost-Effective Resolution",
      description: "The platform was easy to use, and the mediator was incredibly helpful in guiding us to a resolution.",
      image: "/success-story-3.jpg",
      icon: "📋"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">⚖️</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">(company name)</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/login" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link href="/signup" className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how our platform has helped resolve disputes quickly and efficiently
          </p>
        </div>

        {/* Success Stories Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div key={story.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Image Section */}
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to gradient background if image fails to load
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <span className="text-6xl">{story.icon}</span>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {story.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  "{story.description}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Resolve Your Dispute?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of satisfied customers who have successfully resolved their disputes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup"
              className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium"
            >
              Get Started Today
            </Link>
            <Link 
              href="/login"
              className="px-8 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors duration-200 font-medium"
            >
              Login to Your Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
