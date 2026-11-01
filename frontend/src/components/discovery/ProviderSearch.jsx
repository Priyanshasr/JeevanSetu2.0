import React, { useState } from 'react'
import { Search, MapPin, Sparkles, Filter, Building } from 'lucide-react'
import Button from '../ui/Button'

export default function ProviderSearch({ onSearch, onTinyFishDiscover, isDiscovering }) {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('All')
  const [providerType, setProviderType] = useState('all')

  const handleSimpleSearch = (e) => {
    e.preventDefault()
    onSearch({ query: query.trim(), location, providerType })
  }

  const handleAIDiscover = (e) => {
    e.preventDefault()
    onTinyFishDiscover({ 
      query: query.trim() || 'hospitals emergency services', 
      location: location === 'All' ? 'Gautam Buddha Nagar' : location, 
      providerType 
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search by name / specialty */}
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by facility name (e.g. GIMS, Kailash, Max, District Hospital)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-navy-900"
          />
        </div>

        {/* Filter by Location */}
        <div className="relative w-full md:w-52">
          <MapPin className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-navy-900 appearance-none cursor-pointer"
          >
            <option value="All">All Locations</option>
            <option value="Noida">Noida</option>
            <option value="Greater Noida">Greater Noida</option>
          </select>
        </div>

        {/* Filter by Facility Type */}
        <div className="w-full md:w-56">
          <select
            value={providerType}
            onChange={(e) => setProviderType(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-navy-900 cursor-pointer"
          >
            <option value="all">All Facility Types</option>
            <option value="Government Hospital">Government Hospitals</option>
            <option value="Hospital">Hospitals & Centers</option>
            <option value="PHC">Primary Health Centres (PHC)</option>
            <option value="CHC">Community Health Centres (CHC)</option>
            <option value="Doctor">Doctors / Specialists</option>
            <option value="Ambulance">Ambulance Hubs</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button type="button" onClick={handleSimpleSearch} variant="secondary" className="flex-1 md:flex-initial">
            Apply Filter
          </Button>

          <button
            type="button"
            onClick={handleAIDiscover}
            disabled={isDiscovering}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-medium text-sm transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isDiscovering ? 'animate-spin' : ''}`} />
            <span>{isDiscovering ? 'Searching...' : 'AI Web Discovery'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
