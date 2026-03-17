import React, { useState } from 'react'
import { useCreatePartnerMutation } from '../redux/api/shipApi'
import { X, Truck, Mail, Phone, Lock, User, CheckCircle } from 'lucide-react'

export default function CreatePartnerModal({ onClose }) {
  const [create, { isLoading }] = useCreatePartnerMutation()
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)
  const [form, setForm]         = useState({
    name:     '',
    email:    '',
    phone:    '',
    password: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async () => {
    setError('')
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError('Please fill all required fields')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address')
      return
    }
    if (form.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    try {
      await create(form).unwrap()
      setSuccess(true)
    } catch (err) {
      setError(err?.data?.detail || 'Failed to create partner')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-xl">
              <Truck size={18} className="text-orange-500" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Add Delivery Partner</h2>
              <p className="text-xs text-slate-400 mt-0.5">Create a new partner account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">

          {/* Success state */}
          {success ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={28} className="text-green-500" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Partner Created!</p>
                <p className="text-sm text-slate-500 mt-1">
                  <span className="font-medium text-slate-700">{form.name}</span> has been added as a delivery partner.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-4">

              {/* Name */}
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ramesh Kumar"
                    className="w-full pl-9 pr-4 border border-slate-200 rounded-xl py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="ramesh@example.com"
                    className="w-full pl-9 pr-4 border border-slate-200 rounded-xl py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">
                  Phone <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-4 border border-slate-200 rounded-xl py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className="w-full pl-9 pr-4 border border-slate-200 rounded-xl py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700 placeholder-slate-400"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">Partner will use this to log in to their portal</p>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                  ) : (
                    <><Truck size={15} /> Create Partner</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}