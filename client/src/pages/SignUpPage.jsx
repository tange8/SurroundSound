import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/icons/Logo.svg?react'

function SignUpPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSignUp = () => {
    // wire to supabase later
    console.log({ email, username, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-5 w-full max-w-sm">

        {/* Logo */}
        <Logo className="h-16 w-auto" />

        <h2 className="text-white font-display font-bold text-2xl">Sign Up</h2>

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

        {/* Username */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-lavendar font-body text-xs px-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        </div>

        {/* Login link */}
        <p className="text-lavendar/60 font-body text-xs">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-red-orange font-semibold hover:underline"
          >
            LOG IN
          </button>
        </p>

        {/* Sign up button */}
        <button
          onClick={handleSignUp}
          className="w-full bg-red-orange hover:bg-purple transition-colors text-white font-display font-bold text-base rounded-full py-3 mt-2"
        >
          Sign Up
        </button>

      </div>
    </div>
  )
}

export default SignUpPage