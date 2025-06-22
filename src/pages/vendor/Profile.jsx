"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Store, MapPin, Phone, ArrowLeft, Edit, Save, X, Star, Clock } from "lucide-react"
import Card from "../../components/common/Card"
import Button from "../../components/common/Button"
import ImageUpload from "../../components/common/ImageUpload"
import Rating from "../../components/common/Rating"
import { useAuth } from "../../hooks/useAuth"

const VendorProfile = () => {
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
    foodTypes: [],
  })

  const [businessSettings, setBusinessSettings] = useState({
    isOpen: true,
    acceptingOrders: true,
    deliveryEnabled: true,
    pickupEnabled: true,
  })

  const availableFoodTypes = [
    "Italian",
    "American",
    "Thai",
    "Indian",
    "Chinese",
    "Mexican",
    "Japanese",
    "Pizza",
    "Burgers",
    "Dessert",
  ]

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        image: user.image || "",
        foodTypes: user.foodTypes || [],
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

  const handleFoodTypeToggle = (foodType) => {
    setFormData({
      ...formData,
      foodTypes: formData.foodTypes.includes(foodType)
        ? formData.foodTypes.filter((type) => type !== foodType)
        : [...formData.foodTypes, foodType],
    })
  }

  const handleBusinessSettingChange = (setting) => {
    setBusinessSettings({
      ...businessSettings,
      [setting]: !businessSettings[setting],
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
      phone: user.phone || "",
      address: user.address || "",
      image: user.image || "",
      foodTypes: user.foodTypes || [],
    })
    setIsEditing(false)
    setError("")
    setSuccess("")
  }

  if (!user || user.role !== "vendor") {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-4">You need vendor privileges to access this page.</p>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Restaurant Profile</h1>
          <p className="text-gray-600">Manage your restaurant information and settings</p>
        </div>
        <Link to="/vendor/dashboard">
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
        {/* Restaurant Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <Store className="mr-2 text-orange-500" size={20} />
                Restaurant Information
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Types</label>
                {isEditing ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {availableFoodTypes.map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.foodTypes.includes(type)}
                          onChange={() => handleFoodTypeToggle(type)}
                          className="mr-2 rounded"
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 py-2">
                    {user.foodTypes?.map((type) => (
                      <span key={type} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                        {type}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Business Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold flex items-center mb-6">
              <Clock className="mr-2 text-orange-500" size={20} />
              Business Settings
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Restaurant Open</h3>
                  <p className="text-sm text-gray-600">Toggle restaurant availability</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={businessSettings.isOpen}
                    onChange={() => handleBusinessSettingChange("isOpen")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Accepting Orders</h3>
                  <p className="text-sm text-gray-600">Allow new orders to be placed</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={businessSettings.acceptingOrders}
                    onChange={() => handleBusinessSettingChange("acceptingOrders")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Delivery Service</h3>
                  <p className="text-sm text-gray-600">Offer delivery to customers</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={businessSettings.deliveryEnabled}
                    onChange={() => handleBusinessSettingChange("deliveryEnabled")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Pickup Service</h3>
                  <p className="text-sm text-gray-600">Allow customers to pickup orders</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={businessSettings.pickupEnabled}
                    onChange={() => handleBusinessSettingChange("pickupEnabled")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>
          </Card>

          {/* Operating Hours */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Operating Hours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{day}</span>
                  <div className="flex items-center space-x-2">
                    <input type="time" defaultValue="09:00" className="text-sm border rounded px-2 py-1" />
                    <span>-</span>
                    <input type="time" defaultValue="22:00" className="text-sm border rounded px-2 py-1" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Restaurant Picture */}
          <Card className="p-6 text-center">
            {isEditing ? (
              <ImageUpload currentImage={formData.image} onImageChange={handleImageChange} />
            ) : (
              <img
                src={user.image || "/placeholder.svg?height=120&width=120"}
                alt={user.name}
                className="w-32 h-32 rounded-lg mx-auto mb-4 object-cover border-4 border-gray-200"
              />
            )}
            <h3 className="font-semibold text-lg mb-2">{user.name}</h3>
            <div className="flex items-center justify-center mb-2">
              <Rating rating={user.rating || 4.5} />
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm">
              <span
                className={`w-2 h-2 rounded-full ${businessSettings.isOpen ? "bg-green-400" : "bg-red-400"}`}
              ></span>
              <span className={businessSettings.isOpen ? "text-green-600" : "text-red-600"}>
                {businessSettings.isOpen ? "Open" : "Closed"}
              </span>
            </div>
          </Card>

          {/* Restaurant Stats */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Restaurant Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Menu Items</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Rating</span>
                <span className="font-medium">{user.rating || 4.5}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue (Month)</span>
                <span className="font-medium text-green-600">$12,450</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Store size={16} className="mr-2" />
                Manage Menu
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MapPin size={16} className="mr-2" />
                View Orders
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Star size={16} className="mr-2" />
                View Reviews
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Analytics
              </Button>
            </div>
          </Card>

          {/* Contact Info */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone size={16} className="text-gray-500 mr-3" />
                <span className="text-gray-700">{user.phone}</span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="text-gray-500 mr-3" />
                <span className="text-gray-700 text-sm">{user.address}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 mr-3">📧</span>
                <span className="text-gray-700 text-sm">{user.email}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default VendorProfile
