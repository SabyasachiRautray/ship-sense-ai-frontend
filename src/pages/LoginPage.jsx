import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation, useRegisterMutation, usePartnerLoginMutation } from '../redux/api/shipApi'
import { setCredentials, setPartnerCredentials } from '../redux/store'
import { Ship, LogIn, UserPlus, Eye, EyeOff, Truck } from 'lucide-react'

export default function LoginPage() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()

  const [tab, setTab]                       = useState('user')
  const [isRegister, setIsRegister]         = useState(false)
  const [showPassword, setShowPassword]     = useState(false)
  const [error, setError]                   = useState('')
  const [form, setForm] = useState({
    name: '', email: '', password: '', user_type: 'user'
  })

  const [login,        { isLoading: loggingIn }]      = useLoginMutation()
  const [register,     { isLoading: registering }]    = useRegisterMutation()
  const [partnerLogin, { isLoading: partnerLoading }] = usePartnerLoginMutation()

  const isLoading = loggingIn || registering || partnerLoading

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async () => {
    setError('')

    // Basic validation
    if (!form.email || !form.password) {
      setError('Email and password are required')
      return
    }
    if (tab === 'user' && isRegister && !form.name) {
      setError('Name is required')
      return
    }

    try {
      if (tab === 'partner') {
        const res = await partnerLogin({
          email:    form.email,
          password: form.password,
        }).unwrap()
        dispatch(setPartnerCredentials(res))
        navigate('/dashboard')
        return
      }

      if (isRegister) {
        await register({
          name:      form.name,
          email:     form.email,
          password:  form.password,
          user_type: form.user_type,
        }).unwrap()
        const res = await login({
          email:    form.email,
          password: form.password,
        }).unwrap()
        dispatch(setCredentials(res))
      } else {
        const res = await login({
          email:    form.email,
          password: form.password,
        }).unwrap()
        dispatch(setCredentials(res))
      }
      navigate('/dashboard')

    } catch (err) {
      setError(err?.data?.detail || 'Something went wrong. Please try again.')
    }
  }

  // Allow submit on Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 p-2.5 rounded-xl">
            <Ship className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">ShipSense AI</h1>
            <p className="text-xs text-slate-400">Early Warning System</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setTab('user'); setError('') }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === 'user'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LogIn size={14} /> User / Admin
          </button>
          <button
            onClick={() => { setTab('partner'); setIsRegister(false); setError('') }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === 'partner'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Truck size={14} /> Delivery Partner
          </button>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-slate-800 mb-1">
          {tab === 'partner' ? 'Partner Login' : isRegister ? 'Create account' : 'Welcome back'}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {tab === 'partner'
            ? 'Sign in to view your assigned shipments'
            : isRegister
            ? 'Register to access the dashboard'
            : 'Sign in to your account'}
        </p>

        {/* Form */}
        <div className="space-y-4" onKeyDown={handleKeyDown}>

          {/* Name — user register only */}
          {tab === 'user' && isRegister && (
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">Full Name</label>
              <input
                name="name" value={form.name} onChange={handleChange}
                placeholder="John Doe"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Email</label>
            <input
              name="email" type="email" value={form.email} onChange={handleChange}
              placeholder={tab === 'partner' ? 'partner@shipsense.com' : 'admin@shipsense.com'}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Password</label>
            <div className="relative">
              <input
                name="password" type={showPassword ? 'text' : 'password'}
                value={form.password} onChange={handleChange}
                placeholder="password"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700 pr-10"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Role — user register only */}
          {tab === 'user' && isRegister && (
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">Role</label>
              <select name="user_type" value={form.user_type} onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Partner info note */}
          {tab === 'partner' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
              Partner accounts are created by your admin. Contact them if you don't have access.
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-2 ${
              tab === 'partner'
                ? 'bg-amber-500 hover:bg-amber-600'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
            ) : tab === 'partner' ? (
              <><Truck size={16} /> Sign in as Partner</>
            ) : isRegister ? (
              <><UserPlus size={16} /> Create Account</>
            ) : (
              <><LogIn size={16} /> Sign In</>
            )}
          </button>
        </div>

        {/* Toggle register — user tab only */}
        {tab === 'user' && (
          <p className="text-center text-sm text-slate-500 mt-6">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => { setIsRegister(!isRegister); setError('') }}
              className="text-blue-600 font-semibold hover:underline"
            >
              {isRegister ? 'Sign in' : 'Register'}
            </button>
          </p>
        )}

        {/* Back to home */}
        <p className="text-center mt-4">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← Back to home
          </button>
        </p>

      </div>
    </div>
  )
}