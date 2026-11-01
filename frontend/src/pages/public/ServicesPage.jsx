import React from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { Building2, Stethoscope, Ambulance, FileText, Activity, ShieldCheck } from 'lucide-react'

export default function ServicesPage() {
  const services = [
    {
      title: 'Facility & Doctor Discovery',
      desc: 'Locate tertiary government hospitals, PHCs, CHCs, private super-specialty centres, and verified RMPs with clear qualifications.',
      icon: Building2,
    },
    {
      title: 'TinyFish Autonomous Web Monitor',
      desc: 'Continuous monitoring of official state hospital URLs to immediately reflect changed contact numbers, ICU availability, or OPD hours.',
      icon: Activity,
    },
    {
      title: 'Encrypted Health Record Vault',
      desc: 'Store diagnostic tests, prescriptions, and radiology scans with patient-governed, time-bound doctor access tokens.',
      icon: FileText,
    },
    {
      title: 'Consultation & Appointments',
      desc: 'Request outpatient appointments with verified practitioners and track confirmed consult times and clinical observations.',
      icon: Stethoscope,
    },
    {
      title: '24x7 Emergency Assistance',
      desc: 'One-touch SOS routing to 108/102 emergency ambulance dispatches, nearby trauma centres, and blood bank availability.',
      icon: Ambulance,
    },
    {
      title: 'Welfare Scheme Navigator',
      desc: 'Guidance and direct eligibility checks for Ayushman Bharat (PM-JAY), CGHS, ESIC, and Janani Suraksha Yojana.',
      icon: ShieldCheck,
    },
  ]

  return (
    <div className="min-h-screen bg-soft-blue flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto px-4 py-16 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-navy-900 mb-4">Healthcare Services</h1>
          <p className="text-gray-600 text-lg">
            Empowering patients, medical practitioners, and emergency responders with purpose-built healthcare infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv, idx) => (
            <div key={idx} className="bg-white p-7 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 mb-4">
                <srv.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-navy-900 text-base mb-2">{srv.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{srv.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
