import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './redux/useAuth'
import Dashboard from './pages/Dashboard'
import UserDashboard from './pages/UserDashboard'
import PartnerDashboard from './pages/PartnerDashboard'
import LoginPage from './pages/LoginPage'
import Navbar from './components/NavBar'
import LandingPage from './pages/LandingPage'

export default function App() {
  const { isLoggedIn, isAdmin, isPartner } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Only show navbar for users and admins — partners have their own nav */}
      {isLoggedIn && !isPartner && <Navbar />}

      <main className="flex-1 flex flex-col">
        <Routes>

          {/* Landing */}
          <Route
            path="/"
            element={
              isLoggedIn
                ? <Navigate to="/dashboard" />
                : <LandingPage onGetStarted={() => window.location.href = '/login'} />
            }
          />

          {/* Login */}
          <Route
            path="/login"
            element={
              isLoggedIn
                ? <Navigate to="/dashboard" />
                : <LoginPage />
            }
          />

          {/* Dashboard — splits by role */}
          <Route
            path="/dashboard"
            element={
              !isLoggedIn ? (
                <Navigate to="/login" />
              ) : isPartner ? (
                <PartnerDashboard />
              ) : isAdmin ? (
                <Dashboard />
              ) : (
                <UserDashboard />
              )
            }
          />

          {/* Partner portal — direct URL access */}
          <Route
            path="/partner"
            element={
              isPartner
                ? <PartnerDashboard />
                : <Navigate to="/login" />
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </main>
    </div>
  )
}