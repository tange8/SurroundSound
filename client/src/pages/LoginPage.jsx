import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from '../assets/icons/Logo.svg?react'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      await signIn({ email, password })
      navigate(from, { replace: true })
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-5 w-full max-w-sm">

        {/* Logo */}
        <Logo className="h-16 w-auto" />

        <h2 className="text-white font-display font-bold text-2xl">Log In</h2>

        {/* Email */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-lavendar font-body text-xs px-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/10 text-white placeholder-lavendar/40 font-body text-sm rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-blurple"
          />
        </div>

        {/* Password */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-lavendar font-body text-xs px-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/10 text-white placeholder-lavendar/40 font-body text-sm rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-blurple"
          />
          <button className="text-lavendar/60 font-body text-xs text-left px-1 mt-1 hover:text-lavendar">
            Forgot Password?
          </button>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-400 font-body text-xs text-center">{error}</p>
        )}

        {/* Sign up link */}
        <p className="text-lavendar/60 font-body text-xs">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-red-orange font-semibold hover:underline"
          >
            SIGN UP
          </button>
        </p>

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-red-orange hover:bg-purple transition-colors text-white font-display font-bold text-base rounded-full py-3 mt-2 disabled:opacity-50"
        >
          {loading ? 'Logging in…' : 'Log In'}
        </button>

      </div>
    </div>
  )
}

export default LoginPage