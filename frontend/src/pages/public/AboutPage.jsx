import React from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { HeartPulse, Target, Shield, Users } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-soft-blue flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 max-w-5xl mx-auto px-4 py-16 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-navy-900 mb-4">About JeevanSetu 2.0</h1>
          <p className="text-gray-600 text-lg">
            Bridging India’s healthcare accessibility gap through compassionate design and cutting-edge autonomous web intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-navy-900 mb-2">Our Mission</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              To ensure that every individual in India, regardless of geography or economic status, can locate the nearest qualified doctor, community health centre, or emergency ambulance within minutes.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center text-navy-700 mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-navy-900 mb-2">Data Privacy & Consent</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Medical records belong exclusively to the patient. JeevanSetu implements strict role-based access control and never exposes identifiable health data to public crawlers or third-party scrapers.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-navy-900 mb-4">The TinyFish Advantage</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Traditional health directories decay rapidly as phone numbers change, doctors transfer, and clinic hours shift. JeevanSetu integrates <strong>TinyFish autonomous web agents</strong> to constantly discover, verify, and monitor public healthcare websites.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            By combining AI web extraction with human administrator verification, we deliver up-to-date facility listings that rural families and urban patients can trust with confidence.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
