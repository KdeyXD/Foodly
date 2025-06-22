"use client"

import { Link } from "react-router-dom"
import { Clock, Plus } from "lucide-react"
import Rating from "../common/Rating"
import Button from "../common/Button"
import { useCart } from "../../contexts/CartContext"

const FoodCard = ({ food }) => {
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(food)
  }

  return (
    <Link to={`/food/${food.id}`} className="block">
      <div className="card hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="relative">
          <img src={food.images || "/placeholder.svg"} alt={food.name} className="w-full h-48 object-cover" />
          <div className="absolute top-2 right-2">
            <Button size="sm" onClick={handleAddToCart} className="rounded-full p-2 shadow-lg">
              <Plus size={16} />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 text-gray-800">{food.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{food.description}</p>

          <div className="flex items-center justify-between mb-3">
            <Rating rating={food.rating} />
            <div className="flex items-center text-gray-500 text-sm">
              <Clock size={14} className="mr-1" />
              {food.readyTime} min
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-orange-500">${food.price}</span>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{food.category}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default FoodCard
