"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { User, Shield, ArrowLeft, Edit, Save, X, Settings, Key, Bell } from "lucide-react"
import Card from "../../components/common/Card"
import Button from "../../components/common/Button"
import ImageUpload from "../../components/common/ImageUpload"
import { useAuth } from "../../hooks/useAuth"

const AdminProfile = () => {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
  })

  const [adminSettings, setAdminSettings] = useState({
    emailNotifications: true,
    orderAlerts: true,
    systemUpdates: false,
    weeklyReports: true,
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
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

  const handleSettingChange = (setting) => {
    setAdminSettings({
      ...adminSettings,
      [setting]: !adminSettings[setting],
    })
  }

  const handleSave = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

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
      image: user.image || "",
    })
    setIsEditing(false)
    setError("")
    setSuccess("")
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Profile</h1>
          <p className="text-gray-600">Manage your admin account and system preferences</p>
        </div>
        <Link to="/admin">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>
      )}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <User className="mr-2 text-orange-500" size={20} />
                Admin Information
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Level</label>
                <div className="flex items-center py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.is_super ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.is_super ? "Super Admin" : "Admin"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Created</label>
                <p className="text-gray-800 py-2">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>

          {/* Admin Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold flex items-center mb-6">
              <Settings className="mr-2 text-orange-500" size={20} />
              Admin Preferences
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive email alerts for important events</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adminSettings.emailNotifications}
                    onChange={() => handleSettingChange("emailNotifications")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Order Alerts</h3>
                  <p className="text-sm text-gray-600">Get notified about new orders and status changes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adminSettings.orderAlerts}
                    onChange={() => handleSettingChange("orderAlerts")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">System Updates</h3>
                  <p className="text-sm text-gray-600">Receive notifications about system maintenance</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adminSettings.systemUpdates}
                    onChange={() => handleSettingChange("systemUpdates")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Weekly Reports</h3>
                  <p className="text-sm text-gray-600">Receive weekly analytics and performance reports</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adminSettings.weeklyReports}
                    onChange={() => handleSettingChange("weeklyReports")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
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
                  <p className="text-sm text-gray-600">Last updated 1 month ago</p>
                </div>
                <Button variant="outline" size="sm">
                  <Key size={16} className="mr-2" />
                  Change Password
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">Required for all admin accounts</p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Enabled</span>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Session Management</h3>
                  <p className="text-sm text-gray-600">Manage active sessions and devices</p>
                </div>
                <Button variant="outline" size="sm">
                  View Sessions
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
            <p className="text-gray-600 text-sm mb-2">{user.email}</p>
            <div className="flex items-center justify-center space-x-2 text-sm">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.is_super ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                }`}
              >
                {user.is_super ? "Super Admin" : "Admin"}
              </span>
            </div>
          </Card>

          {/* Admin Stats */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Admin Activity</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Last login</span>
                <span className="font-medium">Today, 9:30 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Actions today</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Orders managed</span>
                <span className="font-medium">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Admin since</span>
                <span className="font-medium">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/admin/customers" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Manage Customers
                </Button>
              </Link>
              <Link to="/admin/vendors" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Manage Vendors
                </Button>
              </Link>
              <Link to="/admin/orders" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  View Orders
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Bell size={16} className="mr-2" />
                System Logs
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminProfile
