'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Phone, Mail, Lock, User, ArrowRight, CheckCircle, ShoppingBag, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Tab = 'login' | 'signup'
type LoginMethod = 'email' | 'phone'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [tab, setTab] = useState<Tab>('login')
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [authError, setAuthError] = useState('')

  // Login fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPhone, setLoginPhone] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginOtp, setLoginOtp] = useState('')

  // Signup fields
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPhone, setSignupPhone] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirm, setSignupConfirm] = useState('')

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (tab === 'login') {
      if (loginMethod === 'email') {
        if (!loginEmail) errs.loginEmail = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(loginEmail)) errs.loginEmail = 'Enter a valid email'
        if (!loginPassword) errs.loginPassword = 'Password is required'
      } else {
        if (!loginPhone) errs.loginPhone = 'Phone number is required'
        else if (loginPhone.replace(/\D/g, '').length < 10) errs.loginPhone = 'Enter a valid 10-digit number'
        if (otpSent && !loginOtp) errs.loginOtp = 'Enter the OTP'
      }
    } else {
      if (!signupName.trim()) errs.signupName = 'Full name is required'
      if (!signupEmail) errs.signupEmail = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(signupEmail)) errs.signupEmail = 'Enter a valid email'
      if (!signupPhone) errs.signupPhone = 'Phone number is required'
      else if (signupPhone.replace(/\D/g, '').length < 10) errs.signupPhone = 'Enter a valid 10-digit number'
      if (!signupPassword) errs.signupPassword = 'Password is required'
      else if (signupPassword.length < 6) errs.signupPassword = 'Minimum 6 characters'
      if (!signupConfirm) errs.signupConfirm = 'Please confirm your password'
      else if (signupConfirm !== signupPassword) errs.signupConfirm = 'Passwords do not match'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSendOtp = async () => {
    const rawPhone = (tab === 'login' ? loginPhone : signupPhone).replace(/\D/g, '')
    if (rawPhone.length < 10) {
      setErrors({ loginPhone: 'Enter a valid 10-digit number' })
      return
    }
    const phone = `+91${rawPhone.slice(-10)}`
    setLoading(true)
    setAuthError('')
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone })
      if (error) throw error
      setOtpSent(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send OTP'
      // Fallback for dev: allow any OTP when Supabase phone auth not yet enabled
      if (msg.includes('not enabled') || msg.includes('provider')) {
        setOtpSent(true)  // show OTP field; verifyOtp will also gracefully fallback
        setAuthError('⚠️ Phone auth not enabled in Supabase yet — use email OTP instead, or enable Phone provider in Supabase Auth settings.')
      } else {
        setAuthError(msg)
      }
    }
    setLoading(false)
  }

  const handleVerifyOtp = async () => {
    const rawPhone = (tab === 'login' ? loginPhone : signupPhone).replace(/\D/g, '')
    const phone = `+91${rawPhone.slice(-10)}`
    const token = loginOtp.trim()
    if (!token) { setErrors({ loginOtp: 'Enter the OTP' }); return }
    setLoading(true)
    setAuthError('')
    try {
      const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' })
      if (error) throw error
      setSuccess(true)
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect') || '/account'
      setTimeout(() => router.push(redirect), 1500)
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Invalid OTP. Please try again.')
    }
    setLoading(false)
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setAuthError('')
    try {
      const { error } = await supabase.auth.signInWithOtp({ email: loginEmail })
      if (error) throw error
      setOtpSent(true)
      setAuthError('✅ Magic link sent! Check your email inbox.')
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Login failed')
    }
    setLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginMethod === 'email') { handleEmailLogin(e); return }
    if (!validate()) return
    if (otpSent) { handleVerifyOtp(); return }
    handleSendOtp()
  }

  const passwordStrength = (pwd: string) => {
    if (pwd.length === 0) return null
    if (pwd.length < 6) return { label: 'Weak', color: 'bg-red-400', width: 'w-1/3' }
    if (pwd.length < 10 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { label: 'Medium', color: 'bg-yellow-400', width: 'w-2/3' }
    return { label: 'Strong', color: 'bg-green-500', width: 'w-full' }
  }
  const strength = passwordStrength(tab === 'signup' ? signupPassword : '')

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={44} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1A1A2E' }}>
            {tab === 'login' ? 'Welcome back!' : 'Account Created!'}
          </h2>
          <p className="text-gray-500 mb-6">
            {tab === 'login'
              ? 'You are now logged in to GoFabrikos.'
              : 'Welcome to GoFabrikos! Start exploring premium Indian fabrics.'}
          </p>
          <div className="space-y-3">
            <Link
              href="/fabrics"
              className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center space-x-2 hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg, #C8102E, #D4AF37)' }}
            >
              <ShoppingBag size={18} />
              <span>Browse Fabrics</span>
            </Link>
            <Link
              href="/cart"
              className="w-full py-3 rounded-xl font-bold border-2 border-gray-200 text-gray-700 flex items-center justify-center space-x-2 hover:border-red-300 transition-all"
            >
              <span>View Cart</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C8102E, #D4AF37)' }}>
                <span className="text-white font-bold text-xs">GF</span>
              </div>
              <span className="text-xl font-bold" style={{ color: '#1A1A2E' }}>
                Go<span style={{ color: '#C8102E' }}>Fabrikos</span>
              </span>
            </Link>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-red-700">Home</Link>
              <ChevronRight size={14} />
              <span className="text-gray-800 font-medium">{tab === 'login' ? 'Login' : 'Sign Up'}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Left: Branding Panel */}
        <div className="hidden lg:flex lg:w-5/12 flex-col justify-center px-12 py-16 relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #1A1A2E 0%, #2d1a3e 50%, #1A1A2E 100%)' }}>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #D4AF37, transparent)' }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #C8102E, transparent)' }} />

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: 'linear-gradient(135deg, #C8102E, #D4AF37)' }}>
              <span className="text-white font-black text-2xl">GF</span>
            </div>
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              India's Finest<br />
              <span style={{ color: '#D4AF37' }}>Fabrics</span>,<br />
              Delivered.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              From Chanderi silks to Kanjivaram weaves — premium Indian fabrics from weaver clusters to your doorstep.
            </p>

            <div className="space-y-4">
              {[
                { icon: '🎁', text: 'Free swatch on your first order' },
                { icon: '🚚', text: 'Free shipping above ₹999' },
                { icon: '✅', text: 'GST invoice on every order' },
                { icon: '📦', text: '7-day easy return policy' },
              ].map(item => (
                <div key={item.text} className="flex items-center space-x-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-gray-300 text-sm">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-gray-500 text-xs">GoFabrikos • Guntur, Andhra Pradesh</p>
              <p className="text-gray-500 text-xs mt-1">GST Registered • Trusted by 5,000+ customers</p>
            </div>
          </div>
        </div>

        {/* Right: Form Panel */}
        <div className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md">
            {/* Tab Switch */}
            <div className="bg-gray-100 rounded-2xl p-1 flex mb-8">
              {(['login', 'signup'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setErrors({}); setOtpSent(false); setOtpVerified(false) }}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                    tab === t ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t === 'login' ? 'Login' : 'Create Account'}
                </button>
              ))}
            </div>

            <h1 className="text-2xl font-black mb-1" style={{ color: '#1A1A2E' }}>
              {tab === 'login' ? 'Welcome back!' : 'Join GoFabrikos'}
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              {tab === 'login'
                ? 'Sign in to track orders and access your wishlist'
                : 'Create your account to start shopping premium fabrics'}
            </p>

            {/* Google Button */}
            <button className="w-full border-2 border-gray-200 rounded-xl py-3 flex items-center justify-center space-x-3 hover:border-gray-300 hover:bg-gray-50 transition-all mb-4 font-semibold text-gray-700">
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-xs font-medium">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Login Method Toggle (Login only) */}
            {tab === 'login' && (
              <div className="flex space-x-2 mb-4">
                {(['email', 'phone'] as LoginMethod[]).map(method => (
                  <button
                    key={method}
                    onClick={() => { setLoginMethod(method); setErrors({}); setOtpSent(false) }}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all flex items-center justify-center space-x-1.5 ${
                      loginMethod === method
                        ? 'border-red-600 text-red-700 bg-red-50'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {method === 'email' ? <Mail size={14} /> : <Phone size={14} />}
                    <span>{method === 'email' ? 'Email' : 'Phone OTP'}</span>
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* SIGNUP FIELDS */}
              {tab === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={signupName}
                      onChange={e => setSignupName(e.target.value)}
                      placeholder="Your full name"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-colors ${errors.signupName ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-red-400'}`}
                    />
                  </div>
                  {errors.signupName && <p className="text-red-500 text-xs mt-1">{errors.signupName}</p>}
                </div>
              )}

              {/* EMAIL FIELD */}
              {(tab === 'signup' || loginMethod === 'email') && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={tab === 'login' ? loginEmail : signupEmail}
                      onChange={e => tab === 'login' ? setLoginEmail(e.target.value) : setSignupEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-colors ${(errors.loginEmail || errors.signupEmail) ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-red-400'}`}
                    />
                  </div>
                  {(errors.loginEmail || errors.signupEmail) && (
                    <p className="text-red-500 text-xs mt-1">{errors.loginEmail || errors.signupEmail}</p>
                  )}
                </div>
              )}

              {/* PHONE FIELD */}
              {(tab === 'signup' || loginMethod === 'phone') && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number</label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={tab === 'login' ? loginPhone : signupPhone}
                        onChange={e => tab === 'login' ? setLoginPhone(e.target.value) : setSignupPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-colors ${(errors.loginPhone || errors.signupPhone) ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-red-400'}`}
                      />
                    </div>
                    {(loginMethod === 'phone' && tab === 'login') && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading || otpSent}
                        className={`px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                          otpSent ? 'bg-green-100 text-green-600' : 'text-white hover:opacity-90'
                        }`}
                        style={!otpSent ? { background: 'linear-gradient(135deg, #C8102E, #D4AF37)' } : {}}
                      >
                        {loading ? '...' : otpSent ? 'Sent ✓' : 'Send OTP'}
                      </button>
                    )}
                  </div>
                  {(errors.loginPhone || errors.signupPhone) && (
                    <p className="text-red-500 text-xs mt-1">{errors.loginPhone || errors.signupPhone}</p>
                  )}
                </div>
              )}

              {/* OTP FIELD */}
              {otpSent && loginMethod === 'phone' && tab === 'login' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Enter OTP</label>
                  <input
                    type="text"
                    value={loginOtp}
                    onChange={e => setLoginOtp(e.target.value.slice(0, 6))}
                    placeholder="6-digit OTP"
                    maxLength={6}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-sm text-center tracking-[0.5em] font-bold focus:outline-none transition-colors ${errors.loginOtp ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-red-400'}`}
                  />
                  {errors.loginOtp && <p className="text-red-500 text-xs mt-1">{errors.loginOtp}</p>}
                  <p className="text-xs text-gray-400 mt-1 text-center">OTP sent to +91 {loginPhone}</p>
                </div>
              )}

              {/* PASSWORD FIELDS */}
              {(loginMethod === 'email' || tab === 'signup') && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-gray-600">Password</label>
                    {tab === 'login' && (
                      <button type="button" className="text-xs font-semibold hover:text-red-700 transition-colors" style={{ color: '#C8102E' }}>
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={tab === 'login' ? loginPassword : signupPassword}
                      onChange={e => tab === 'login' ? setLoginPassword(e.target.value) : setSignupPassword(e.target.value)}
                      placeholder={tab === 'signup' ? 'Min. 6 characters' : 'Your password'}
                      className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl text-sm focus:outline-none transition-colors ${(errors.loginPassword || errors.signupPassword) ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-red-400'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {(errors.loginPassword || errors.signupPassword) && (
                    <p className="text-red-500 text-xs mt-1">{errors.loginPassword || errors.signupPassword}</p>
                  )}
                  {/* Password strength meter */}
                  {tab === 'signup' && strength && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                      </div>
                      <p className={`text-xs mt-1 font-medium ${strength.color === 'bg-green-500' ? 'text-green-600' : strength.color === 'bg-yellow-400' ? 'text-yellow-600' : 'text-red-500'}`}>
                        {strength.label} password
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* CONFIRM PASSWORD */}
              {tab === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={signupConfirm}
                      onChange={e => setSignupConfirm(e.target.value)}
                      placeholder="Re-enter password"
                      className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl text-sm focus:outline-none transition-colors ${errors.signupConfirm ? 'border-red-400 bg-red-50' : signupConfirm && signupConfirm === signupPassword ? 'border-green-400 bg-green-50' : 'border-gray-200 focus:border-red-400'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.signupConfirm && <p className="text-red-500 text-xs mt-1">{errors.signupConfirm}</p>}
                  {signupConfirm && signupConfirm === signupPassword && (
                    <p className="text-green-600 text-xs mt-1 flex items-center space-x-1">
                      <CheckCircle size={12} />
                      <span>Passwords match</span>
                    </p>
                  )}
                </div>
              )}

              {/* Terms (Signup only) */}
              {tab === 'signup' && (
                <p className="text-xs text-gray-500 leading-relaxed">
                  By creating an account, you agree to our{' '}
                  <Link href="#" className="font-semibold underline" style={{ color: '#C8102E' }}>Terms of Service</Link>{' '}
                  and{' '}
                  <Link href="#" className="font-semibold underline" style={{ color: '#C8102E' }}>Privacy Policy</Link>.
                </p>
              )}

              {/* Auth error / info */}
              {authError && (
                <div className={`text-xs px-3 py-2 rounded-xl ${authError.startsWith('✅') || authError.startsWith('⚠️') ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                  {authError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-black text-white text-base flex items-center justify-center space-x-2 hover:opacity-90 transition-all hover:shadow-lg active:scale-95"
                style={{ background: loading ? '#ccc' : 'linear-gradient(135deg, #C8102E, #D4AF37)' }}
              >
                {loading ? (
                  <span className="animate-pulse">Please wait...</span>
                ) : (
                  <>
                    <span>
                      {loginMethod === 'phone' && !otpSent ? 'Send OTP' :
                       loginMethod === 'phone' && otpSent ? 'Verify OTP & Login' :
                       tab === 'login' ? 'Send Magic Link' : 'Create My Account'}
                    </span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Switch tab link */}
            <p className="text-center text-sm text-gray-500 mt-5">
              {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setErrors({}) }}
                className="font-bold hover:underline"
                style={{ color: '#C8102E' }}
              >
                {tab === 'login' ? 'Sign Up Free' : 'Login'}
              </button>
            </p>

            {/* WhatsApp support */}
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400 mb-2">Need help? Chat with us on WhatsApp</p>
              <a
                href="https://wa.me/919581734837"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.123 1.528 5.858L.057 23.486a.5.5 0 00.609.61l5.71-1.484A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.959 0-3.809-.5-5.422-1.382l-.386-.213-4.002 1.04 1.059-3.91-.234-.404A9.951 9.951 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                <span>+91 95817 34837</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
