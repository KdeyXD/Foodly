"use client"

import { useState, useEffect } from "react"
import { Search, Download, Eye, Edit, Package, CheckCircle } from "lucide-react"
import Card from "../../components/common/Card"
import Button from "../../components/common/Button"
import { mockData } from "../../data/mockData"
import { ORDER_STATUS_COLORS } from "../../data/constants"

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedOrders, setSelectedOrders] = useState([])

  useEffect(() => {
    // Add some additional mock orders for demonstration
    const allOrders = [
      ...mockData.orders,
      {
        id: 105,
        customer_id: 1,
        status_id: 4,
        totalAmount: 45.25,
        remarks: "Ring doorbell twice",
        created_at: "2024-01-12T14:20:00Z",
        updated_at: "2024-01-12T15:30:00Z",
      },
      {
        id: 106,
        customer_id: 2,
        status_id: 2,
        totalAmount: 32.75,
        remarks: "",
        created_at: "2024-01-11T18:45:00Z",
        updated_at: "2024-01-11T19:00:00Z",
      },
    ]
    setOrders(allOrders)
    setFilteredOrders(allOrders)
  }, [])

  useEffect(() => {
    let filtered = [...orders]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(searchQuery) ||
          order.customer_id.toString().includes(searchQuery) ||
          order.remarks.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      const statusObj = mockData.order_statuses.find((s) => s.key === statusFilter)
      if (statusObj) {
        filtered = filtered.filter((order) => order.status_id === statusObj.id)
      }
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter((order) => new Date(order.created_at) >= filterDate)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          filtered = filtered.filter((order) => new Date(order.created_at) >= filterDate)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          filtered = filtered.filter((order) => new Date(order.created_at) >= filterDate)
          break
      }
    }

    // Sort
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
        case "status":
          return a.status_id - b.status_id
        default:
          return 0
      }
    })

    setFilteredOrders(filtered)
  }, [orders, searchQuery, statusFilter, dateFilter, sortBy])

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const handleSelectAll = () => {
    setSelectedOrders(selectedOrders.length === filteredOrders.length ? [] : filteredOrders.map((o) => o.id))
  }

  const handleUpdateOrderStatus = (orderId, newStatusId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status_id: newStatusId, updated_at: new Date().toISOString() } : order,
      ),
    )
  }

  const getStatusLabel = (statusId) => {
    const status = mockData.order_statuses.find((s) => s.id === statusId)
    return status ? status.label : "Unknown"
  }

  const getStatusKey = (statusId) => {
    const status = mockData.order_statuses.find((s) => s.id === statusId)
    return status ? status.key : "unknown"
  }

  const getCustomerName = (customerId) => {
    const customer = mockData.customers.find((c) => c.id === customerId)
    return customer ? customer.name : `Customer ${customerId}`
  }

  const getOrderItems = (orderId) => {
    return mockData.food_orders.filter((fo) => fo.order_id === orderId)
  }

  const getOrderItemsText = (orderId) => {
    const items = getOrderItems(orderId)
    if (items.length === 0) return "No items"
    if (items.length === 1) {
      const food = mockData.foods.find((f) => f.id === items[0].food_id)
      return food ? food.name : "Unknown item"
    }
    return `${items.length} items`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Management</h1>
          <p className="text-gray-600">Monitor and manage all customer orders</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
            <p className="text-gray-600 text-sm">Total Orders</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{orders.filter((o) => o.status_id === 1).length}</p>
            <p className="text-gray-600 text-sm">Pending</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{orders.filter((o) => o.status_id === 3).length}</p>
            <p className="text-gray-600 text-sm">Preparing</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{orders.filter((o) => o.status_id === 5).length}</p>
            <p className="text-gray-600 text-sm">Completed</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(0)}
            </p>
            <p className="text-gray-600 text-sm">Total Revenue</p>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
            </select>
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="input-field">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Amount: High to Low</option>
              <option value="amount-low">Amount: Low to High</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        {selectedOrders.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-blue-800">{selectedOrders.length} orders selected</span>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                Export Selected
              </Button>
              <Button size="sm" variant="outline">
                Bulk Update Status
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Package size={16} className="text-gray-400 mr-2" />
                      <span className="font-medium text-gray-800">#{order.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{getCustomerName(order.customer_id)}</p>
                      <p className="text-sm text-gray-600">ID: {order.customer_id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">{getOrderItemsText(order.id)}</p>
                    {order.remarks && <p className="text-sm text-gray-600">Note: {order.remarks}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-800">${order.totalAmount.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status_id}
                      onChange={(e) => handleUpdateOrderStatus(order.id, Number.parseInt(e.target.value))}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${ORDER_STATUS_COLORS[getStatusKey(order.status_id)] || "bg-gray-100 text-gray-800"}`}
                    >
                      {mockData.order_statuses.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-800">{new Date(order.created_at).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleTimeString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-800" title="Edit Order">
                        <Edit size={16} />
                      </button>
                      {order.status_id !== 5 && (
                        <button
                          className="text-green-600 hover:text-green-800"
                          title="Mark as Delivered"
                          onClick={() => handleUpdateOrderStatus(order.id, 5)}
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found matching your criteria.</p>
          </div>
        )}
      </Card>
    </div>
  )
}

export default AdminOrders
