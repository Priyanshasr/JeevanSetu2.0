import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
                <Heart size={16} className="text-white fill-white" />
              </div>
              <span className="font-bold text-lg text-white">JeevanSetu <span className="text-teal-400">2.0</span></span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Healthcare Within Everyone's Reach. AI-powered discovery connecting rural India with quality healthcare.
            </p>
            <p className="text-xs text-gray-500">Powered by TinyFish AI</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              {[['About', '/about'], ['How It Works', '/how-it-works'], ['Services', '/services'], ['Contact', '/contact']].map(([label, to]) => (
                <li key={to}><Link to={to} className="hover:text-teal-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Healthcare */}
          <div>
            <h4 className="text-white font-semibold mb-4">Healthcare</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://pmjay.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">Ayushman Bharat (PMJAY)</a></li>
              <li><a href="https://cghs.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">CGHS</a></li>
              <li><a href="https://nhp.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">National Health Portal</a></li>
              <li><a href="https://mohfw.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">MoHFW India</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Emergency</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Phone size={14} className="text-teal-400" /><span>108 — National Ambulance</span></li>
              <li className="flex items-center gap-2"><Phone size={14} className="text-teal-400" /><span>1102 — CATS Ambulance</span></li>
              <li className="flex items-center gap-2"><Mail size={14} className="text-teal-400" /><span>support@jeevansetu.in</span></li>
              <li className="flex items-center gap-2"><MapPin size={14} className="text-teal-400" /><span>Pan India Service</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>© 2024 JeevanSetu 2.0. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built with ❤️ for rural India • Powered by TinyFish AI</p>
        </div>
      </div>
    </footer>
  )
}
