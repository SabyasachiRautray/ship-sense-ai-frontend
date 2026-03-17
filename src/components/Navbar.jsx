import React from 'react'
import { Ship, Bell, LogOut } from 'lucide-react'
import { useGetAlertsQuery } from '../redux/api/shipApi'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/store'
import { useAuth } from '../redux/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { data }       = useGetAlertsQuery()
  const alertCount     = data?.total_alerts || 0
  const dispatch       = useDispatch()
  const { user }       = useAuth()

  const navigate = useNavigate();

const handleLogout = () => {
  dispatch(logout())
  navigate("/login")
}

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Ship className="text-white" size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">ShipSense AI</h1>
          <p className="text-xs text-slate-500">Early Warning System</p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">

        {/* User avatar + name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'S'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-700 leading-none">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize mt-0.5">{user?.user_type}</p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>

      </div>
    </nav>
  )
}