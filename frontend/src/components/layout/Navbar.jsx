import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, Menu, X } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
              <Heart size={16} className="text-white fill-white" />
            </div>
            <span className="font-bold text-lg text-navy-900">JeevanSetu <span className="text-teal-600">2.0</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === l.to ? 'text-teal-600' : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-navy-700 hover:text-teal-600 transition-colors px-3 py-2">
              Login
            </Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4 rounded-xl">
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 flex flex-col gap-3">
            {navLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium px-2 py-1 rounded ${
                  location.pathname === l.to ? 'text-teal-600' : 'text-gray-600'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary text-sm py-2 px-4 flex-1 text-center">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm py-2 px-4 flex-1 text-center">Get Started</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
