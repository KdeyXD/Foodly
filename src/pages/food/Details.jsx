"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Clock, ArrowLeft, Plus, Minus } from "lucide-react"
import Rating from "../../components/common/Rating"
import Button from "../../components/common/Button"
import { useCart } from "../../contexts/CartContext"
import { foodService } from "../../services/api/food"
import { vendorService } from "../../services/api/vendor"

const FoodDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [food, setFood] = useState(null)
  const [vendor, setVendor] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const foodData = await foodService.getFoodById(id)
        const vendorData = await vendorService.getVendorById(foodData.vendor_id)
        setFood(foodData)
        setVendor(vendorData)
      } catch (error) {
        console.error("Error fetching food details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFoodDetails()
  }, [id])

  const handleAddToCart = () => {
    addToCart(food, quantity)
    navigate("/cart")
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!food) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Food not found</h1>
        <Button onClick={() => navigate("/menu")}>Back to Menu</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-800 mb-6">
        <ArrowLeft size={20} className="mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Food Image */}
        <div>
          <img
            src={food.images || "/placeholder.svg"}
            alt={food.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Food Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{food.name}</h1>

          <div className="flex items-center space-x-4 mb-4">
            <Rating rating={food.rating} />
            <div className="flex items-center text-gray-500">
              <Clock size={16} className="mr-1" />
              {food.readyTime} min
            </div>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">{food.category}</span>
          </div>

          <p className="text-gray-600 mb-6 text-lg">{food.description}</p>

          <div className="mb-6">
            <span className="text-3xl font-bold text-orange-500">${food.price}</span>
          </div>

          {/* Vendor Info */}
          {vendor && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-lg mb-2">From {vendor.name}</h3>
              <p className="text-gray-600 text-sm">{vendor.address}</p>
              <div className="flex items-center mt-2">
                <Rating rating={vendor.rating} size={14} />
                <span className="text-sm text-gray-500 ml-2">Restaurant Rating</span>
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4 mb-6">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={decrementQuantity}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button onClick={handleAddToCart} className="w-full py-3 text-lg" size="lg">
            Add to Cart - ${(food.price * quantity).toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FoodDetails
