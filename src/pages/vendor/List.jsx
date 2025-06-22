"use client"

import { useState, useEffect } from "react"
import VendorCard from "../../components/vendor/VendorCard"
import SearchBar from "../../components/common/SearchBar"
import { vendorService } from "../../services/api/vendor"

const VendorList = () => {
  const [vendors, setVendors] = useState([])
  const [filteredVendors, setFilteredVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await vendorService.getAllVendors()
        setVendors(data)
        setFilteredVendors(data)
      } catch (error) {
        console.error("Error fetching vendors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = vendors.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.foodTypes.some((type) => type.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredVendors(filtered)
    } else {
      setFilteredVendors(vendors)
    }
  }, [vendors, searchQuery])

  const handleSearch = (query) => {
    setSearchQuery(query)
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Restaurants</h1>
        <p className="text-gray-600 mb-6">Discover amazing restaurants in your area</p>

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} placeholder="Search restaurants..." />
        </div>
      </div>

      {filteredVendors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No restaurants found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      )}
    </div>
  )
}

export default VendorList
