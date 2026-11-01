import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Building2, 
  Stethoscope, 
  Ambulance, 
  HeartPulse, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Search, 
  CheckCircle, 
  Activity, 
  PhoneCall, 
  FileText 
} from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import Button from '../../components/ui/Button'

export default function LandingPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLocation, setSearchLocation] = useState('Greater Noida')

  const handleQuickSearch = (e) => {
    e.preventDefault()
    navigate(`/patient/dashboard?q=${encodeURIComponent(searchQuery)}&loc=${encodeURIComponent(searchLocation)}`)
  }

  const categories = [
    { name: 'Government District Hospitals', count: 'Official District Sourced', icon: Building2, desc: 'District & state medical institutes (GIMS Kasna & Sec-30)' },
    { name: 'Primary Health Centres (PHC)', count: 'Awaiting District Confirmation', icon: HeartPulse, desc: 'Block & village essential primary care units' },
    { name: 'Qualified Doctors & Specialists', count: 'Credential Auditing Active', icon: Stethoscope, desc: 'Registered medical practitioners & consultants' },
    { name: 'Community Health Centres (CHC)', count: 'Awaiting District Confirmation', icon: Building2, desc: 'Secondary block-level referral facilities' },
    { name: 'National Emergency Ambulance (108/102)', count: 'Official 24x7 Helplines', icon: Ambulance, desc: 'Immediate trauma & ALS/BLS ambulance transit' },
    { name: 'Ayushman Bharat (PM-JAY)', count: 'Official Empanelled Scheme', icon: ShieldCheck, desc: 'Cashless healthcare at empannelled hospitals' },
  ]

  return (
    <div className="min-h-screen bg-soft-blue flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-700 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Powered by TinyFish Autonomous Web Intelligence</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy-900 tracking-tight leading-[1.15] mb-6">
            Healthcare Within <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-500">
              Everyone's Reach.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            JeevanSetu connects patients across India with nearby hospitals, verified specialists, rural health centres, and emergency responders through continuous AI web discovery.
          </p>
        </div>

        {/* Search Bar Widget */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-teal-900/5 border border-gray-100 p-3 md:p-4 mb-16">
          <form onSubmit={handleQuickSearch} className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hospital, specialty (e.g. Cardiology, OPD, ICU)..."
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-navy-900"
              />
            </div>
            <div className="relative w-full md:w-64">
              <MapPin className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="City or PIN Code"
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-navy-900"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto px-7 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-teal-600/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Facilities</span>
            </button>
          </form>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center border-y border-gray-200/80 py-8">
          <div>
            <div className="text-3xl font-extrabold text-navy-900">Official</div>
            <div className="text-xs text-gray-500 font-medium mt-1">District Directory Sourced</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-teal-600">500 Beds</div>
            <div className="text-xs text-gray-500 font-medium mt-1">GIMS Tertiary Facility</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-navy-900">108 / 112</div>
            <div className="text-xs text-gray-500 font-medium mt-1">National Emergency Numbers</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-teal-600">Live Sync</div>
            <div className="text-xs text-gray-500 font-medium mt-1">TinyFish Monitored Updates</div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-3">Comprehensive Healthcare Spectrum</h2>
            <p className="text-gray-600 text-sm">
              Discover verified care at every tier of India’s healthcare system, with clearly differentiated practitioner credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => navigate('/patient/dashboard')}
                className="p-6 rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all cursor-pointer bg-white group"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-50 group-hover:bg-teal-600 flex items-center justify-center text-teal-600 group-hover:text-white transition-colors mb-4">
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-navy-900 text-base mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{cat.desc}</p>
                <span className="text-xs font-semibold text-teal-600">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TinyFish AI Intelligence Showcase */}
      <section className="py-20 bg-navy-900 text-white px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold mb-6">
              <Activity className="w-3.5 h-3.5" />
              <span>Real-Time Autonomous Agent Integration</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">
              Powered by TinyFish Web Intelligence Engine
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
              Unlike static hospital aggregators, JeevanSetu deploys autonomous TinyFish agents that actively scan government portals, state health department bulletins, and official clinic registries in real time.
            </p>

            <ul className="space-y-3.5 text-sm text-gray-300 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-teal-400 shrink-0" />
                <span><strong>TinyFish Search:</strong> Discovers fresh un-cached facilities by geo-coordinates & PIN code</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-teal-400 shrink-0" />
                <span><strong>TinyFish Fetch:</strong> Strips noise and parses clean Markdown from complex hospital portals</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-teal-400 shrink-0" />
                <span><strong>TinyFish Monitors:</strong> Auto-alerts administrators when hospital contact info or bed quotas change</span>
              </li>
            </ul>

            <Link
              to="/patient/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-900 font-bold text-sm transition-all shadow-md active:scale-95"
            >
              <span>Try Live AI Discovery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-navy-800 rounded-2xl p-6 border border-navy-700 shadow-2xl font-mono text-xs text-gray-300">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-navy-700 text-gray-400">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-2 text-[11px]">tinyfish-agent-execution.log</span>
            </div>
            <div className="space-y-2 text-emerald-400">
              <p>&gt; tinyfish.search(query="CHC & Trauma Care Dadri", location="Greater Noida")</p>
              <p className="text-gray-400">&gt; Status 200 OK — 10 matching government sources resolved.</p>
              <p>&gt; tinyfish.fetch(urls=["https://www.gims.ac.in/hospital.html", "https://gbnagar.nic.in/public-utility-category/hospitals/"])</p>
              <p className="text-gray-400">&gt; Parsing clean Markdown content via Chromium headless instance...</p>
              <p className="text-teal-300">&gt; Structured Extraction Completed: 2 Verified Facilities Normalized.</p>
              <p className="text-amber-300">&gt; PostgreSQL Synced — Source URLs Preserved.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rural Accessibility Section */}
      <section className="py-20 bg-soft-blue px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Addressing the Rural Healthcare Divide</h2>
            <p className="text-gray-600 text-sm md:text-base">
              Nearly 65% of India's population lives in rural areas, where finding trusted doctors, verified RMPs, and functional emergency transit is traditionally difficult.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 mb-6">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">Emergency Assistance First</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                One-tap SOS alerts dispatching to local 108/102 ambulance nodes without relying on complex web search during critical golden hours.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">Consent-Driven Health Records</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Patients securely upload test reports and grant time-limited, role-based viewing permissions to consulting doctors.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">Government Scheme Discovery</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Direct guidance on Ayushman Bharat (PM-JAY), Janani Suraksha, and CGHS benefits to eliminate catastrophic out-of-pocket medical bills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-navy-900 to-navy-800 rounded-3xl p-8 md:p-12 text-center text-white relative shadow-xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Start Using JeevanSetu Today</h2>
          <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto mb-8">
            Access healthcare discovery, upload medical records, or register your clinic to connect with thousands of patients.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-teal-500 hover:bg-teal-400 text-navy-900 font-bold rounded-xl text-sm transition-all shadow-md active:scale-95"
            >
              Register for Free
            </Link>
            <Link
              to="/patient/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/20 transition-all"
            >
              Explore Healthcare Map
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
