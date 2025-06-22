"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, Eye, Filter, Download } from "lucide-react"
import Card from "../../components/common/Card"
import Button from "../../components/common/Button"
import { mockData } from "../../data/mockData"

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedCustomers, setSelectedCustomers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)

  useEffect(() => {
    // Add some additional mock customers for demonstration
    const allCustomers = [
      ...mockData.customers,
      {
        id: 3,
        email: "alice.johnson@example.com",
        name: "Alice Johnson",
        image: "/placeholder.svg?height=100&width=100",
        address: "789 Pine St, Chicago",
        phone: "5551234567",
        location: "Chicago",
        created_at: "2023-03-15T08:20:00Z",
        updated_at: "2023-03-15T08:20:00Z",
      },
      {
        id: 4,
        email: "bob.wilson@example.com",
        name: "Bob Wilson",
        image: "/placeholder.svg?height=100&width=100",
        address: "321 Oak Rd, Miami",
        phone: "5559876543",
        location: "Miami",
        created_at: "2023-04-01T16:45:00Z",
        updated_at: "2023-04-01T16:45:00Z",
      },
    ]
    setCustomers(allCustomers)
    setFilteredCustomers(allCustomers)
  }, [])

  useEffect(() => {
    let filtered = [...customers]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at)
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at)
        case "name":
          return a.name.localeCompare(b.name)
        case "location":
          return a.location.localeCompare(b.location)
        default:
          return 0
      }
    })

    setFilteredCustomers(filtered)
  }, [customers, searchQuery, sortBy])

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId) ? prev.filter((id) => id !== customerId) : [...prev, customerId],
    )
  }

  const handleSelectAll = () => {
    setSelectedCustomers(
      selectedCustomers.length === filteredCustomers.length ? [] : filteredCustomers.map((c) => c.id),
    )
  }

  const handleDeleteCustomer = (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers((prev) => prev.filter((c) => c.id !== customerId))
      setSelectedCustomers((prev) => prev.filter((id) => id !== customerId))
    }
  }

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedCustomers.length} customers?`)) {
      setCustomers((prev) => prev.filter((c) => !selectedCustomers.includes(c.id)))
      setSelectedCustomers([])
    }
  }

  const getCustomerOrderCount = (customerId) => {
    return mockData.orders.filter((order) => order.customer_id === customerId).length
  }

  const getCustomerTotalSpent = (customerId) => {
    return mockData.orders
      .filter((order) => order.customer_id === customerId)
      .reduce((sum, order) => sum + order.totalAmount, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Customer Management</h1>
          <p className="text-gray-600">Manage and monitor customer accounts</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button className="flex items-center">
            <Plus size={16} className="mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{customers.length}</p>
            <p className="text-gray-600 text-sm">Total Customers</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {customers.filter((c) => new Date(c.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
            </p>
            <p className="text-gray-600 text-sm">New This Month</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {customers.filter((c) => getCustomerOrderCount(c.id) > 0).length}
            </p>
            <p className="text-gray-600 text-sm">Active Customers</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              $
              {(
                customers.reduce((sum, c) => sum + getCustomerTotalSpent(c.id), 0) /
                  customers.filter((c) => getCustomerOrderCount(c.id) > 0).length || 1
              ).toFixed(0)}
            </p>
            <p className="text-gray-600 text-sm">Avg. Customer Value</p>
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
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="location">Location A-Z</option>
            </select>
            <Button variant="outline" className="flex items-center">
              <Filter size={16} className="mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {selectedCustomers.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-blue-800">{selectedCustomers.length} customers selected</span>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                Export Selected
              </Button>
              <Button size="sm" variant="outline" className="text-red-600" onClick={handleBulkDelete}>
                Delete Selected
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Customers Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleSelectCustomer(customer.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={customer.image || "/placeholder.svg?height=40&width=40"}
                        alt={customer.name}
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{customer.name}</p>
                        <p className="text-sm text-gray-600">ID: {customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-800">{customer.email}</p>
                      <p className="text-sm text-gray-600">{customer.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">{customer.location}</p>
                    <p className="text-sm text-gray-600">{customer.address}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">{getCustomerOrderCount(customer.id)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">${getCustomerTotalSpent(customer.id).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{new Date(customer.created_at).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Edit size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteCustomer(customer.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No customers found matching your criteria.</p>
          </div>
        )}
      </Card>
    </div>
  )
}

export default AdminCustomers
