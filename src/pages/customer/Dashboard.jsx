"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingBag, Clock, Heart, User, MapPin, Package, CreditCard, ArrowRight } from "lucide-react"
import Card from "../../components/common/Card"
import Button from "../../components/common/Button"
import Rating from "../../components/common/Rating"
import OrderCard from "../../components/order/OrderCard"
import { useAuth } from "../../hooks/useAuth"
import { useCart } from "../../contexts/CartContext"
import { orderService } from "../../services/api/order"
import { foodService } from "../../services/api/food"
import { vendorService } from "../../services/api/vendor"
import { mockData } from "../../data/mockData"
import { ORDER_STATUS_COLORS } from "../../data/constants"

const Dashboard = () => {
  const { user } = useAuth()
  const { getCartItemsCount } = useCart()
  const navigate = useNavigate()

  const [recentOrders, setRecentOrders] = useState([])
  const [favoriteVendors, setFavoriteVendors] = useState([])
  const [popularFoods, setPopularFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    favoriteRestaurants: 0,
  })

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    const fetchDashboardData = async () => {
      try {
        const [orders, vendors, foods] = await Promise.all([
          orderService.getOrdersByCustomer(user.id),
          vendorService.getAllVendors(),
          foodService.getAllFoods(),
        ])

        // Get recent orders (last 3)
        setRecentOrders(orders.slice(0, 3))

        // Get top rated vendors as favorites
        setFavoriteVendors(vendors.sort((a, b) => b.rating - a.rating).slice(0, 4))

        // Get popular foods (top rated)
        setPopularFoods(foods.sort((a, b) => b.rating - a.rating).slice(0, 6))

        // Calculate stats
        const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0)
        setStats({
          totalOrders: orders.length,
          totalSpent,
          favoriteRestaurants: 3, // Mock favorite count
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, navigate])

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {getGreeting()}, {user.name}! 👋
        </h1>
        <p className="text-gray-600">Welcome back to your food delivery dashboard</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
              <Package className="text-orange-500" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
              <p className="text-gray-600 text-sm">Total Orders</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <CreditCard className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">${stats.totalSpent.toFixed(0)}</p>
              <p className="text-gray-600 text-sm">Total Spent</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <Heart className="text-red-500" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.favoriteRestaurants}</p>
              <p className="text-gray-600 text-sm">Favorites</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <ShoppingBag className="text-blue-500" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{getCartItemsCount()}</p>
              <p className="text-gray-600 text-sm">Cart Items</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8 p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/menu">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
              <ShoppingBag size={24} className="mb-2" />
              <span className="text-sm">Browse Menu</span>
            </Button>
          </Link>

          <Link to="/cart">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
              <Package size={24} className="mb-2" />
              <span className="text-sm">View Cart</span>
            </Button>
          </Link>

          <Link to="/orders">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
              <Clock size={24} className="mb-2" />
              <span className="text-sm">Order History</span>
            </Button>
          </Link>

          <Link to="/profile">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
              <User size={24} className="mb-2" />
              <span className="text-sm">My Profile</span>
            </Button>
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
            <Link to="/orders" className="flex items-center text-orange-500 hover:text-orange-600 font-medium">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <Card className="p-8 text-center">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-4">Start by browsing our delicious menu</p>
              <Link to="/menu">
                <Button>Browse Menu</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>

        {/* Account Info & Quick Links */}
        <div className="space-y-6">
          {/* Account Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <User size={16} className="text-gray-500 mr-3" />
                <span className="text-gray-700">{user.name}</span>
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
            <Link to="/profile" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                Edit Profile
              </Button>
            </Link>
          </Card>

          {/* Current Order Status */}
          {recentOrders.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Current Order Status</h3>
              {(() => {
                const latestOrder = recentOrders[0]
                const status = mockData.order_statuses.find((s) => s.id === latestOrder.status_id)
                return (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Order #{latestOrder.id}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[status?.key] || "bg-gray-100 text-gray-800"}`}
                      >
                        {status?.label || "Unknown"}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">${latestOrder.totalAmount.toFixed(2)}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: status?.key === "delivered" ? "100%" : status?.key === "preparing" ? "60%" : "30%",
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {status?.key === "delivered"
                        ? "Order delivered!"
                        : status?.key === "preparing"
                          ? "Being prepared..."
                          : "Order confirmed"}
                    </p>
                  </div>
                )
              })()}
            </Card>
          )}
        </div>
      </div>

      {/* Favorite Restaurants */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Favorite Restaurants</h2>
          <Link to="/vendors" className="flex items-center text-orange-500 hover:text-orange-600 font-medium">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteVendors.map((vendor) => (
            <Link key={vendor.id} to={`/vendors/${vendor.id}`}>
              <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
                <img
                  src={vendor.image || "/placeholder.svg"}
                  alt={vendor.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-gray-800 mb-1">{vendor.name}</h3>
                <div className="flex items-center justify-between">
                  <Rating rating={vendor.rating} size={14} showNumber={false} />
                  <span className="text-xs text-gray-500">{vendor.foodTypes[0]}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular This Week */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Popular This Week</h2>
          <Link to="/menu" className="flex items-center text-orange-500 hover:text-orange-600 font-medium">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularFoods.slice(0, 3).map((food) => (
            <Link key={food.id} to={`/food/${food.id}`}>
              <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
                <img
                  src={food.images || "/placeholder.svg"}
                  alt={food.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-gray-800 mb-1">{food.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{food.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-orange-500">${food.price}</span>
                  <Rating rating={food.rating} size={14} showNumber={false} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
