"use client"

import { useState, useEffect } from "react"
import { Users, Store, Package, DollarSign, TrendingUp, TrendingDown, Clock, Star } from "lucide-react"
import Card from "../../components/common/Card"
import { useAuth } from "../../hooks/useAuth"
import { mockData } from "../../data/mockData"
import { ORDER_STATUS_COLORS } from "../../data/constants"

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalVendors: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    averageOrderValue: 0,
    topVendor: null,
  })

  const [recentOrders, setRecentOrders] = useState([])
  const [recentCustomers, setRecentCustomers] = useState([])

  useEffect(() => {
    // Calculate statistics from mock data
    const totalCustomers = mockData.customers.length
    const totalVendors = mockData.vendors.length
    const totalOrders = mockData.orders.length
    const totalRevenue = mockData.orders.reduce((sum, order) => sum + order.totalAmount, 0)
    const pendingOrders = mockData.orders.filter((order) => order.status_id === 1).length
    const completedOrders = mockData.orders.filter((order) => order.status_id === 5).length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Find top vendor by rating
    const topVendor = mockData.vendors.reduce((prev, current) => (prev.rating > current.rating ? prev : current))

    setStats({
      totalCustomers,
      totalVendors,
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      averageOrderValue,
      topVendor,
    })

    // Set recent data
    setRecentOrders(mockData.orders.slice(0, 5))
    setRecentCustomers(mockData.customers.slice(0, 5))
  }, [])

  const getStatusLabel = (statusId) => {
    const status = mockData.order_statuses.find((s) => s.id === statusId)
    return status ? status.label : "Unknown"
  }

  const getStatusKey = (statusId) => {
    const status = mockData.order_statuses.find((s) => s.id === statusId)
    return status ? status.key : "unknown"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <Users className="text-blue-500" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalCustomers}</p>
              <p className="text-gray-600 text-sm">Total Customers</p>
              <div className="flex items-center mt-1">
                <TrendingUp size={12} className="text-green-500 mr-1" />
                <span className="text-green-500 text-xs">+12% this month</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <Store className="text-purple-500" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalVendors}</p>
              <p className="text-gray-600 text-sm">Total Vendors</p>
              <div className="flex items-center mt-1">
                <TrendingUp size={12} className="text-green-500 mr-1" />
                <span className="text-green-500 text-xs">+5% this month</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
              <Package className="text-orange-500" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <div className="flex items-center mt-1">
                <TrendingDown size={12} className="text-red-500 mr-1" />
                <span className="text-red-500 text-xs">-3% this week</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <DollarSign className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">${stats.totalRevenue.toFixed(0)}</p>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <div className="flex items-center mt-1">
                <TrendingUp size={12} className="text-green-500 mr-1" />
                <span className="text-green-500 text-xs">+8% this month</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Order Status</h3>
            <Clock className="text-gray-400" size={20} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending</span>
              <span className="font-semibold text-yellow-600">{stats.pendingOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed</span>
              <span className="font-semibold text-green-600">{stats.completedOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Order Value</span>
              <span className="font-semibold text-blue-600">${stats.averageOrderValue.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Top Performer</h3>
            <Star className="text-yellow-400" size={20} />
          </div>
          {stats.topVendor && (
            <div>
              <h4 className="font-semibold text-gray-800">{stats.topVendor.name}</h4>
              <p className="text-gray-600 text-sm mb-2">{stats.topVendor.foodTypes.join(", ")}</p>
              <div className="flex items-center">
                <Star className="text-yellow-400 mr-1" size={16} />
                <span className="font-semibold">{stats.topVendor.rating}</span>
                <span className="text-gray-600 text-sm ml-2">rating</span>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            <button className="w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
              Add New Vendor
            </button>
            <button className="w-full text-left p-2 text-sm text-green-600 hover:bg-green-50 rounded">
              View Pending Orders
            </button>
            <button className="w-full text-left p-2 text-sm text-purple-600 hover:bg-purple-50 rounded">
              Generate Report
            </button>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-600">Customer ID: {order.customer_id}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[getStatusKey(order.status_id)] || "bg-gray-100 text-gray-800"}`}
                  >
                    {getStatusLabel(order.status_id)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Customers */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Customers</h3>
          <div className="space-y-4">
            {recentCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <img
                  src={customer.image || "/placeholder.svg?height=40&width=40"}
                  alt={customer.name}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{customer.location}</p>
                  <p className="text-xs text-gray-500">{new Date(customer.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart placeholder - Revenue over time</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Order Distribution</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart placeholder - Orders by status</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
