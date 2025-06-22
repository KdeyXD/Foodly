"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Package, Filter, Search, Calendar, ArrowLeft } from 'lucide-react'
import Card from "../../components/common/Card"
import Button from "../../components/common/Button"
import OrderCard from "../../components/order/OrderCard"
import { useAuth } from "../../hooks/useAuth"
import { orderService } from "../../services/api/order"
import { mockData } from "../../data/mockData"
import { ORDER_STATUS_COLORS } from "../../data/constants"

const Orders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    if (!user) return

    const fetchOrders = async () => {
      try {
        const customerOrders = await orderService.getOrdersByCustomer(user.id)
        // Add some mock orders for demonstration
        const allOrders = [
          ...customerOrders,
          {
            id: 103,
            customer_id: user.id,
            status_id: 5,
            totalAmount: 28.75,
            remarks: "Extra spicy please",
            created_at: "2024-01-10T19:30:00Z",
            updated_at: "2024-01-10T20:15:00Z",
          },
          {
            id: 104,
            customer_id: user.id,
            status_id: 2,
            totalAmount: 15.50,
            remarks: "",
            created_at: "2024-01-08T12:45:00Z",
            updated_at: "2024-01-08T13:00:00Z",
          },
        ]
        setOrders(allOrders)
        setFilteredOrders(allOrders)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  useEffect(() => {
    let filtered = [...orders]

    // Filter by status
    if (selectedStatus !== "all") {
      const statusObj = mockData.order_statuses.find((s) => s.key === selectedStatus)
      if (statusObj) {
        filtered = filtered.filter((order) => order.status_id === statusObj.id)
      }
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((order) => order.id.toString().includes(searchQuery))
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at)
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at)
        case "amount-high":
          return b.totalAmount - a.totalAmount
        case "amount-low":
          return a.totalAmount - b.totalAmount
        default:
          return 0
      }
    })

    setFilteredOrders(filtered)
  }, [orders, selectedStatus, searchQuery, sortBy])

  const handleReorder = async (orderId) => {
    // Get order items and add to cart
    const orderItems = mockData.food_orders.filter((fo) => fo.order_id === orderId)
    console.log("Reordering items:", orderItems)
    // This would integrate with cart context to add items
    alert("Items added to cart! (Demo)")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your food orders</p>
        </div>
        <Link to="/dashboard">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Amount: High to Low</option>
              <option value="amount-low">Amount: Low to High</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <input type="date" className="input-field" />
          </div>
        </div>
      </Card>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card className="p-12 text-center">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {orders.length === 0 ? "No orders yet" : "No orders match your filters"}
          </h3>
          <p className="text-gray-600 mb-6">
            {orders.length === 0
              ? "Start by browsing our delicious menu and placing your first order"
              : "Try adjusting your filters to see more orders"}
          </p>
          <Link to="/menu">
            <Button>Browse Menu</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="relative">
              <OrderCard order={order} />
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleReorder(order.id)}>
                  Reorder
                </Button>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Statistics */}
      {orders.length > 0 && (
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">Order Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{orders.length}</p>
              <p className="text-gray-600 text-sm">Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">
                ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
              </p>
              <p className="text-gray-600 text-sm">Total Spent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">
                ${orders.length > 0 ? (orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length).toFixed(2) : "0.00"}
              </p>
              <p className="text-gray-600 text-sm">Average Order</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-500">
                {orders.filter((order) => order.status_id === 5).length}
              </p>
              <p className="text-gray-600 text-sm">Completed</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Orders
