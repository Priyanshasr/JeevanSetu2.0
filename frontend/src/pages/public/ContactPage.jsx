import React, { useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { Phone, Mail, MapPin, CheckCircle } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-soft-blue flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-navy-900 mb-4">Contact JeevanSetu</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Have questions about provider verification, hospital onboarding, or technical integration? Reach out to our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-navy-900 text-sm">Emergency Helplines</h3>
                <p className="text-xs text-gray-500 mt-1">National Emergency: 112</p>
                <p className="text-xs text-gray-500">Ambulance: 108 / 102</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-navy-900 text-sm">Email Support</h3>
                <p className="text-xs text-gray-500 mt-1">support@jeevansetu.in</p>
                <p className="text-xs text-gray-500">partnerships@jeevansetu.in</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-navy-900 text-sm">Office Location</h3>
                <p className="text-xs text-gray-500 mt-1">
                  HealthTech Hub, Knowledge Park III, Greater Noida, UP - 201310
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-navy-900 mb-2">Message Received</h3>
                <p className="text-xs text-gray-500">Our coordination desk will respond within 24 business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Your Name"
                  placeholder="e.g. Dr. Ramesh"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="ramesh@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <div>
                  <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-2">
                    Message / Inquiry
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-navy-900"
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
