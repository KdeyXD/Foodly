"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import Button from "../../components/common/Button"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters long")
      return false
    }
    if (!formData.name.trim()) {
      setError("Name is required")
      return false
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required")
      return false
    }
    if (!formData.address.trim()) {
      setError("Address is required")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        image: "/placeholder.svg?height=100&width=100",
        location: "Unknown", // Could be derived from address
        lat_lng: [0, 0], // Could be geocoded from address
      }

      await register(userData)
      navigate("/dashboard")
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
        <p className="text-gray-600 mt-2">Join us and start ordering delicious food</p>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="bg-white border outline-0 border-gray-300 rounded-full block w-full py-2.5 px-5"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-white border outline-0 border-gray-300 rounded-full block w-full py-2.5 px-5"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="bg-white border outline-0 border-gray-300 rounded-full block w-full py-2.5 px-5"
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="bg-white border outline-0 border-gray-300 rounded-full block w-full py-2.5 px-5"
            rows="2"
            placeholder="Enter your delivery address"
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
            className="bg-white border outline-0 border-gray-300 rounded-full block w-full py-2.5 px-5"
            placeholder="Create a password"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="bg-white border outline-0 border-gray-300 rounded-full block w-full py-2.5 px-5"
            placeholder="Confirm your password"
            required
          />
        </div>
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium">
            Sign in
          </Link>
        </p>
      </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>


      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-orange-500 hover:text-orange-600">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-orange-500 hover:text-orange-600">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}

export default Register
