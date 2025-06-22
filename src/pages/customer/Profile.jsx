"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { User, CreditCard, Shield, ArrowLeft, Edit, Save, X } from "lucide-react"
import Card from "../../components/common/Card"
import Button from "../../components/common/Button"
import ImageUpload from "../../components/common/ImageUpload"
import { useAuth } from "../../hooks/useAuth"

const Profile = () => {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: "",
  })

  const [paymentMethods] = useState([
    {
      id: 1,
      type: "card",
      brand: "visa",
      last4: "4242",
      expiry: "12/25",
      isDefault: true,
    },
    {
      id: 2,
      type: "card",
      brand: "mastercard",
      last4: "8888",
      expiry: "08/26",
      isDefault: false,
    },
  ])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        image: user.image || "",
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (imageUrl) => {
    setFormData({
      ...formData,
      image: imageUrl,
    })
  }

  const handleSave = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would update the user context here
      setSuccess("Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      setError("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      image: user.image || "",
    })
    setIsEditing(false)
    setError("")
    setSuccess("")
  }

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        await logout()
      } catch (error) {
        setError("Failed to delete account. Please try again.")
      }
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view your profile</h1>
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>
        <Link to="/dashboard">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">{success}</div>
      )}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <User className="mr-2 text-orange-500" size={20} />
                Personal Information
              </h2>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit size={16} className="mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleSave} disabled={loading}>
                    <Save size={16} className="mr-2" />
                    {loading ? "Saving..." : "Save"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X size={16} className="mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-800 py-2">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-800 py-2">{user.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-800 py-2">{user.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input-field resize-none"
                    rows="3"
                  />
                ) : (
                  <p className="text-gray-800 py-2">{user.address}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Payment Methods */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <CreditCard className="mr-2 text-orange-500" size={20} />
                Payment Methods
              </h2>
              <Button variant="outline" size="sm">
                Add New Card
              </Button>
            </div>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center mr-4">
                      <span className="text-xs font-bold text-gray-600">{method.brand.toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• {method.last4}</p>
                      <p className="text-sm text-gray-600">Expires {method.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.isDefault && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Default</span>
                    )}
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Security Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold flex items-center mb-6">
              <Shield className="mr-2 text-orange-500" size={20} />
              Security Settings
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Password</h3>
                  <p className="text-sm text-gray-600">Last updated 3 months ago</p>
                </div>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm">
                  Enable 2FA
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Picture */}
          <Card className="p-6 text-center">
            {isEditing ? (
              <ImageUpload currentImage={formData.image} onImageChange={handleImageChange} />
            ) : (
              <img
                src={user.image || "/placeholder.svg?height=120&width=120"}
                alt={user.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200"
              />
            )}
            <h3 className="font-semibold text-lg mb-2">{user.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{user.email}</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Active Customer</span>
            </div>
          </Card>

          {/* Account Stats */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Account Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Member since</span>
                <span className="font-medium">Jan 2023</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total orders</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Favorite cuisine</span>
                <span className="font-medium">Italian</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total spent</span>
                <span className="font-medium text-green-600">$486.50</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/orders" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  View Order History
                </Button>
              </Link>
              <Link to="/favorites" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Manage Favorites
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Download Data
              </Button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-red-200">
            <h3 className="font-semibold mb-4 text-red-600">Danger Zone</h3>
            <p className="text-sm text-gray-600 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-red-600 border-red-300 hover:bg-red-50"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile
