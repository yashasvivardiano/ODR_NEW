'use client'

import Link from 'next/link'

export default function EmailResetPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-orange-600 text-2xl">📧</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Email</h1>
          <p className="text-gray-600">This is a simulation of the email that would be sent to users</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">From: noreply@odr-platform.com</h2>
            <h2 className="text-lg font-semibold text-gray-900">To: user@example.com</h2>
            <h2 className="text-lg font-semibold text-gray-900">Subject: Reset Your Password - ODR Platform</h2>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700">Hello,</p>
            <p className="text-gray-700">
              We received a request to reset your password for your ODR Platform account. 
              If you made this request, click the button below to reset your password:
            </p>
            
            <div className="text-center my-6">
              <Link 
                href="/reset-password"
                className="inline-block px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium"
              >
                Reset My Password
              </Link>
            </div>

            <p className="text-gray-700">
              This link will expire in 24 hours for security reasons.
            </p>
            <p className="text-gray-700">
              If you didn't request a password reset, you can safely ignore this email. 
              Your password will remain unchanged.
            </p>
            <p className="text-gray-700">
              Best regards,<br />
              The ODR Platform Team
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/login"
            className="text-orange-600 hover:text-orange-500 font-medium"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
