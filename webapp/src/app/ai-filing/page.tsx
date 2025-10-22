'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AIFiling() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    disputeDescription: '',
    amountInDispute: '',
    disputeCategory: '',
    opposingParty: '',
    contactInfo: '',
    supportingDocuments: null as File[] | null,
    additionalInfo: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalSteps = 4
  const progressPercentage = (currentStep / totalSteps) * 100

  const disputeCategories = [
    'Contract Dispute',
    'Payment Dispute', 
    'Service Dispute',
    'Property Dispute',
    'Employment Dispute',
    'Consumer Complaint',
    'Business Dispute',
    'Other'
  ]

  const handleNext = () => {
    // Validate required fields for current step
    if (currentStep === 1) {
      if (!formData.disputeDescription.trim() || !formData.amountInDispute.trim() || !formData.disputeCategory) {
        alert('Please fill in all required fields before proceeding.')
        return
      }
    }
    if (currentStep === 2) {
      if (!formData.opposingParty.trim() || !formData.contactInfo.trim()) {
        alert('Please fill in all required fields before proceeding.')
        return
      }
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate case submission
    setTimeout(() => {
      const caseId = `ODR-${Date.now()}`
      alert(`Dispute submitted successfully! Case ID: ${caseId}`)
      
      // Save to history (localStorage for demo)
      const history = JSON.parse(localStorage.getItem('caseHistory') || '[]')
      history.push({
        id: caseId,
        ...formData,
        submittedAt: new Date().toISOString(),
        status: 'Submitted'
      })
      localStorage.setItem('caseHistory', JSON.stringify(history))
      
      // Reset form
      setFormData({
        disputeDescription: '',
        amountInDispute: '',
        disputeCategory: '',
        opposingParty: '',
        contactInfo: '',
        supportingDocuments: null,
        additionalInfo: ''
      })
      setCurrentStep(1)
      setIsSubmitting(false)
    }, 2000)
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Describe Your Dispute'
      case 2: return 'Identify Opposing Party'
      case 3: return 'Upload Supporting Documents'
      case 4: return 'Review and Submit'
      default: return 'Submit a New Dispute'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-orange-600 hover:text-orange-500">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Submit a New Dispute</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Title and Instructions */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Submit a New Dispute</h2>
            <p className="text-gray-600 text-lg">
              Follow these steps to submit your dispute. Each step is designed to gather necessary information efficiently.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Step {currentStep} of {totalSteps}: {getStepTitle()}
              </h3>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Describe Your Dispute */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-3">
                    Dispute Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.disputeDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, disputeDescription: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder-gray-500"
                    placeholder="Describe your dispute in detail..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-3">
                    Amount in Dispute <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.amountInDispute}
                    onChange={(e) => setFormData(prev => ({ ...prev, amountInDispute: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder-gray-500"
                    placeholder="Enter the total amount of money or value involved in the dispute"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-3">
                    Dispute Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.disputeCategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, disputeCategory: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                    required
                  >
                    <option value="">Select a category</option>
                    {disputeCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Identify Opposing Party */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-3">
                    Opposing Party Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.opposingParty}
                    onChange={(e) => setFormData(prev => ({ ...prev, opposingParty: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder-gray-500"
                    placeholder="Enter the name of the opposing party"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-3">
                    Contact Information <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.contactInfo}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder-gray-500"
                    placeholder="Enter contact information for the opposing party (email, phone, address)"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 3: Upload Supporting Documents */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-3">
                    Supporting Documents
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="text-gray-500 mb-4">
                      <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-2">Upload relevant documents</p>
                    <p className="text-sm text-gray-500">Contracts, emails, receipts, photos, etc.</p>
                    <input
                      type="file"
                      multiple
                      className="mt-4"
                      onChange={(e) => setFormData(prev => ({ ...prev, supportingDocuments: Array.from(e.target.files || []) }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-3">
                    Additional Information
                  </label>
                  <textarea
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder-gray-500"
                    placeholder="Any additional information that might be relevant to your dispute"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review and Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Your Dispute</h3>
                
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Dispute Description:</h4>
                    <p className="text-gray-700">{formData.disputeDescription}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Amount in Dispute:</h4>
                    <p className="text-gray-700">{formData.amountInDispute}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Category:</h4>
                    <p className="text-gray-700">{formData.disputeCategory}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Opposing Party:</h4>
                    <p className="text-gray-700">{formData.opposingParty}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Contact Information:</h4>
                    <p className="text-gray-700">{formData.contactInfo}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentStep === 1 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && (!formData.disputeDescription.trim() || !formData.amountInDispute.trim() || !formData.disputeCategory)) ||
                    (currentStep === 2 && (!formData.opposingParty.trim() || !formData.contactInfo.trim()))
                  }
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    (currentStep === 1 && (!formData.disputeDescription.trim() || !formData.amountInDispute.trim() || !formData.disputeCategory)) ||
                    (currentStep === 2 && (!formData.opposingParty.trim() || !formData.contactInfo.trim()))
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  Next: {currentStep === 1 ? 'Identify Opposing Party' : 
                         currentStep === 2 ? 'Upload Supporting Documents' : 
                         'Review and Submit'}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
