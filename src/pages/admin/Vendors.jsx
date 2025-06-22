"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, Eye, Filter, Download } from "lucide-react"
import Card from "../../components/common/Card"
import Button from "../../components/common/Button"
import Rating from "../../components/common/Rating"
import { mockData } from "../../data/mockData"

const AdminVendors = () => {
  const [vendors, setVendors] = useState([])
  const [filteredVendors, setFilteredVendors] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filterByRating, setFilterByRating] = useState("all")
  const [selectedVendors, setSelectedVendors] = useState([])

  useEffect(() => {
    setVendors(mockData.vendors)
    setFilteredVendors(mockData.vendors)
  }, [])

  useEffect(() => {
    let filtered = [...vendors]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.foodTypes.some((type) => type.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Rating filter
    if (filterByRating !== "all") {
      const minRating = Number.parseFloat(filterByRating)
      filtered = filtered.filter((vendor) => vendor.rating >= minRating)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "rating":
          return b.rating - a.rating
        case "newest":
          return b.id - a.id
        case "oldest":
          return a.id - b.id
        default:
          return 0
      }
    })

    setFilteredVendors(filtered)
  }, [vendors, searchQuery, sortBy, filterByRating])

  const handleSelectVendor = (vendorId) => {
    setSelectedVendors((prev) => (prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]))
  }

  const handleSelectAll = () => {
    setSelectedVendors(selectedVendors.length === filteredVendors.length ? [] : filteredVendors.map((v) => v.id))
  }

  const handleDeleteVendor = (vendorId) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      setVendors((prev) => prev.filter((v) => v.id !== vendorId))
      setSelectedVendors((prev) => prev.filter((id) => id !== vendorId))
    }
  }

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedVendors.length} vendors?`)) {
      setVendors((prev) => prev.filter((v) => !selectedVendors.includes(v.id)))
      setSelectedVendors([])
    }
  }

  const getVendorFoodCount = (vendorId) => {
    return mockData.foods.filter((food) => food.vendor_id === vendorId).length
  }

  const getVendorOrderCount = (vendorId) => {
    const vendorFoodIds = mockData.foods.filter((food) => food.vendor_id === vendorId).map((food) => food.id)
    return mockData.food_orders.filter((fo) => vendorFoodIds.includes(fo.food_id)).length
  }

  const getVendorRevenue = (vendorId) => {
    const vendorFoodIds = mockData.foods.filter((food) => food.vendor_id === vendorId).map((food) => food.id)
    return mockData.food_orders
      .filter((fo) => vendorFoodIds.includes(fo.food_id))
      .reduce((sum, fo) => sum + fo.price * fo.quantity, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Vendor Management</h1>
          <p className="text-gray-600">Manage restaurant partners and their information</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button className="flex items-center">
            <Plus size={16} className="mr-2" />
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{vendors.length}</p>
            <p className="text-gray-600 text-sm">Total Vendors</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{vendors.filter((v) => v.rating >= 4.5).length}</p>
            <p className="text-gray-600 text-sm">Top Rated (4.5+)</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {vendors.filter((v) => getVendorOrderCount(v.id) > 0).length}
            </p>
            <p className="text-gray-600 text-sm">Active Vendors</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {(vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length).toFixed(1)}
            </p>
            <p className="text-gray-600 text-sm">Average Rating</p>
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
              placeholder="Search vendors..."
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
              <option value="rating">Highest Rated</option>
            </select>
            <select value={filterByRating} onChange={(e) => setFilterByRating(e.target.value)} className="input-field">
              <option value="all">All Ratings</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
            </select>
            <Button variant="outline" className="flex items-center">
              <Filter size={16} className="mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {selectedVendors.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-blue-800">{selectedVendors.length} vendors selected</span>
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

      {/* Vendors Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedVendors.length === filteredVendors.length && filteredVendors.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cuisine Types
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Menu Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(vendor.id)}
                      onChange={() => handleSelectVendor(vendor.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={vendor.image || "/placeholder.svg?height=40&width=40"}
                        alt={vendor.name}
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{vendor.name}</p>
                        <p className="text-sm text-gray-600">ID: {vendor.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-800">{vendor.email}</p>
                      <p className="text-sm text-gray-600">{vendor.phone}</p>
                      <p className="text-sm text-gray-600">{vendor.address}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {vendor.foodTypes.map((type) => (
                        <span key={type} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                          {type}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Rating rating={vendor.rating} size={14} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">{getVendorFoodCount(vendor.id)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">{getVendorOrderCount(vendor.id)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">${getVendorRevenue(vendor.id).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteVendor(vendor.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No vendors found matching your criteria.</p>
          </div>
        )}
      </Card>
    </div>
  )
}

export default AdminVendors
