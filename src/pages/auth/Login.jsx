"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import Button from "../../components/common/Button"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await login(formData.email, formData.password)
      navigate("/dashboard")
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text">Welcome Back</h1>
        <p className="text-gray-600 mt-2">Sign in to your account</p>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-gray-100 border outline-0 border-gray-300 rounded-full block w-full py-2.5 px-5"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="bg-gray-100 border outline-0 border-gray-300 rounded-full block w-full py-2.5 px-5"
              required
          />
        </div>

      <div className="mt-6 text-center">
        <p className="text-white">
          Don't have an account?{" "}
          <Link to="/register" className="text-pink-500 hover:text-pink-600 font-medium">
            Sign up
          </Link>
        </p>
      </div>
        <Button type="submit" className="w-full bg-pink-700 hover:bg-pink-600" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>


      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">Demo credentials: john.doe@example.com / 1234</p>
      </div>
    </div>
  )
}

export default Login
