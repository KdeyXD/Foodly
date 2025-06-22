"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, MapPin, Phone } from "lucide-react"
import Rating from "../../components/common/Rating"
import FoodCard from "../../components/food/FoodCard"
import Button from "../../components/common/Button"
import { vendorService } from "../../services/api/vendor"
import { foodService } from "../../services/api/food"

const VendorDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vendor, setVendor] = useState(null)
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const [vendorData, foodsData] = await Promise.all([
          vendorService.getVendorById(id),
          foodService.getFoodsByVendor(id),
        ])
        setVendor(vendorData)
        setFoods(foodsData)
      } catch (error) {
        console.error("Error fetching vendor details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVendorDetails()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Restaurant not found</h1>
        <Button onClick={() => navigate("/vendors")}>Back to Restaurants</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-800 mb-6">
        <ArrowLeft size={20} className="mr-2" />
        Back
      </button>

      {/* Vendor Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <img src={vendor.image || "/placeholder.svg"} alt={vendor.name} className="w-full h-64 object-cover" />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{vendor.name}</h1>

          <div className="flex items-center space-x-6 mb-4">
            <Rating rating={vendor.rating} />
            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-1" />
              {vendor.address}
            </div>
            <div className="flex items-center text-gray-600">
              <Phone size={16} className="mr-1" />
              {vendor.phone}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {vendor.foodTypes.map((type) => (
              <span key={type} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu</h2>
        {foods.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No menu items available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default VendorDetails
