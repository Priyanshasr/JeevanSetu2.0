import React from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { Search, Sparkles, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Enter Healthcare Need or Location',
      desc: 'Type in a specialty, hospital name, or PIN code. Filter by government facilities, primary health centres, or emergency ambulance hubs.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Autonomous TinyFish Web Search',
      desc: 'Our backend triggers TinyFish AI agents to scour official district portals and registry sites in real time to locate un-cached, live provider data.',
      icon: Sparkles,
    },
    {
      num: '03',
      title: 'Structured Validation & Storage',
      desc: 'Raw hospital and clinic details are normalized into structured JSON with original source links, validated for accuracy, and securely indexed.',
      icon: UserCheck,
    },
    {
      num: '04',
      title: 'Secure Coordination & Care Access',
      desc: 'Connect with doctors, request appointments, share encrypted medical records under explicit consent, or trigger instantaneous emergency assistance.',
      icon: ShieldCheck,
    },
  ]

  return (
    <div className="min-h-screen bg-soft-blue flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 max-w-5xl mx-auto px-4 py-16 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-navy-900 mb-4">How JeevanSetu 2.0 Works</h1>
          <p className="text-gray-600 text-lg">
            A 4-step architecture connecting natural language patient queries with live, verified healthcare facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {steps.map((st, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
              <div className="text-3xl font-extrabold text-teal-600/30 mb-2">{st.num}</div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">{st.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/patient/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition-all shadow-md"
          >
            <span>Experience Discovery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
