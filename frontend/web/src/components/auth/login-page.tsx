'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import toast from 'react-hot-toast'
import {
  validateEmail,
  validatePasswordStrength,
  loginRateLimiter,
  sessionManager,
} from '@/lib/auth-utils'

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('britishce44@gmail.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Check for saved email if user previously selected "Remember Me"
    const savedEmail = localStorage.getItem('remembered_email')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.errors[0]
    }

    if (!password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Rate limiting check
    if (loginRateLimiter.isLimited(email)) {
      const remaining = loginRateLimiter.getRemainingAttempts(email)
      toast.error(`Too many login attempts. Please try again later. (${remaining} attempts remaining)`)
      return
    }

    if (!validateForm()) {
      toast.error('Please fix the errors above')
      return
    }

    setLoading(true)
    try {
      await login(email, password)

      // Store email if remember me is checked
      if (rememberMe) {
        localStorage.setItem('remembered_email', email)
      } else {
        localStorage.removeItem('remembered_email')
      }

      toast.success('Welcome to Britishce44!')
      loginRateLimiter.reset(email)
    } catch (err: any) {
      toast.error(err.message || 'Login failed')
      // Rate limit counter increments automatically
    } finally {
      setLoading(false)
    }
  }

  if (showRegister) return <RegisterForm onBack={() => setShowRegister(false)} />

  return (
    <div className="min-h-screen flex items-center justify-center navy-gradient p-4">
      <div className="glass-panel max-w-md w-full rounded-2xl p-8 shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-navy font-black text-2xl">B44</span>
          </div>
          <h1 className="text-2xl font-bold text-navy">Britishce44</h1>
          <p className="text-sm text-gray-500">Online Digital School</p>
          <p className="text-xs text-gray-400 mt-1">The First British Center Online</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors({ ...errors, email: '' })
                }}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gold outline-none transition ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="britishce44@gmail.com"
                disabled={loading}
              />
              <svg
                className="absolute right-3 top-3 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-gray-700">Password</label>
              <button
                type="button"
                className="text-xs text-gold hover:text-gold/80 transition"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors({ ...errors, password: '' })
                }}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gold outline-none transition ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Remember Me */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded accent-gold"
              disabled={loading}
            />
            <span className="text-xs text-gray-600">Remember me on this device</span>
          </label>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient text-navy font-bold py-2.5 rounded-xl shadow-md hover:shadow-lg transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign In to Platform'
            )}
          </button>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">New to Britishce44?</span>
            </div>
          </div>

          {/* Register Link */}
          <button
            type="button"
            onClick={() => setShowRegister(true)}
            className="w-full border-2 border-gold text-gold font-semibold py-2.5 rounded-xl hover:bg-gold/5 transition text-sm"
          >
            Create Account
          </button>

          {/* Demo Credentials */}
          <div className="mt-6 p-3 bg-gold/10 rounded-lg text-[10px] text-gray-700 text-center space-y-1">
            <p className="font-semibold">Demo Credentials:</p>
            <p>
              Admin: <code className="bg-white px-1 rounded">britishce44@gmail.com</code> / <code className="bg-white px-1 rounded">admin123</code>
            </p>
            <p>
              Teacher: <code className="bg-white px-1 rounded">suhair.almojahid</code> / <code className="bg-white px-1 rounded">teacher123</code>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

function RegisterForm({ onBack }: { onBack: () => void }) {
  const { register } = useAuth()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phone: '',
    address: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!form.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required'

    const emailValidation = validateEmail(form.email)
    if (!emailValidation.valid) newErrors.email = emailValidation.errors[0]

    const passwordValidation = validatePasswordStrength(form.password)
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.errors[0]
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors above')
      return
    }

    setLoading(true)
    try {
      await register({
        ...form,
        role: form.role as 'admin' | 'supervisor' | 'teacher' | 'student' | 'parent',
      })
      toast.success('Registration successful! Please login.')
      onBack()
    } catch (err: any) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center navy-gradient p-4">
      <div className="glass-panel max-w-lg w-full rounded-2xl p-6 shadow-2xl my-4 animate-fade-in">
        <h2 className="text-xl font-bold text-navy mb-4 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 text-sm">
          <input
            placeholder="First Name *"
            value={form.firstName}
            onChange={e => setForm({ ...form, firstName: e.target.value })}
            className={`border rounded-lg px-3 py-2 col-span-2 sm:col-span-1 ${
              errors.firstName ? 'border-red-500' : ''
            }`}
            disabled={loading}
          />
          <input
            placeholder="Last Name *"
            value={form.lastName}
            onChange={e => setForm({ ...form, lastName: e.target.value })}
            className={`border rounded-lg px-3 py-2 col-span-2 sm:col-span-1 ${
              errors.lastName ? 'border-red-500' : ''
            }`}
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Email Address *"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className={`border rounded-lg px-3 py-2 col-span-2 ${
              errors.email ? 'border-red-500' : ''
            }`}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password *"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className={`border rounded-lg px-3 py-2 col-span-2 sm:col-span-1 ${
              errors.password ? 'border-red-500' : ''
            }`}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Confirm Password *"
            value={form.confirmPassword}
            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
            className={`border rounded-lg px-3 py-2 col-span-2 sm:col-span-1 ${
              errors.confirmPassword ? 'border-red-500' : ''
            }`}
            disabled={loading}
          />
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            className="border rounded-lg px-3 py-2 col-span-2"
            disabled={loading}
          >
            <option value="student">Student</option>
            <option value="parent">Parent</option>
          </select>
          <input
            placeholder="Phone Number"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            className="border rounded-lg px-3 py-2 col-span-2"
            disabled={loading}
          />
          <textarea
            placeholder="Address"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            className="border rounded-lg px-3 py-2 col-span-2"
            rows={2}
            disabled={loading}
          />
          <div className="flex gap-3 col-span-2 mt-2">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 border rounded-xl py-2 text-sm hover:bg-gray-50 transition"
              disabled={loading}
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 gold-gradient text-navy font-bold rounded-xl py-2 text-sm hover:shadow-md transition disabled:opacity-50"
            >
              {loading ? 'Registering...' : '✓ Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
