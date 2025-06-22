"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Truck, Clock, Star } from "lucide-react"
import FoodCard from "../components/food/FoodCard"
import VendorCard from "../components/vendor/VendorCard"
import { foodService } from "../services/api/food"
import { vendorService } from "../services/api/vendor"

const Home = () => {
  const [featuredFoods, setFeaturedFoods] = useState([])
  const [topVendors, setTopVendors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foods, vendors] = await Promise.all([foodService.getAllFoods(), vendorService.getAllVendors()])

        // Get top rated foods
        setFeaturedFoods(foods.sort((a, b) => b.rating - a.rating).slice(0, 6))

        // Get top rated vendors
        setTopVendors(vendors.sort((a, b) => b.rating - a.rating).slice(0, 4))
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[url(/images/banner1.jpg)] bg-cover bg-center text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Delicious Food, Delivered Fast</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Order from your favorite restaurants and get fresh, hot food delivered right to your doorstep in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/menu"
              className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Order Now
            </Link>
            <Link
              to="/vendors"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-500 transition-colors"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-orange-500" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your food delivered in 30 minutes or less</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-orange-500" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Service</h3>
              <p className="text-gray-600">Order anytime, anywhere with our round-the-clock service</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-orange-500" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Food</h3>
              <p className="text-gray-600">Fresh ingredients and top-rated restaurants</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Foods */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Featured Dishes</h2>
            <Link to="/menu" className="flex items-center text-orange-500 hover:text-orange-600 font-medium">
              View All <ArrowRight size={20} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Restaurants */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Top Restaurants</h2>
            <Link to="/vendors" className="flex items-center text-orange-500 hover:text-orange-600 font-medium">
              View All <ArrowRight size={20} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers</p>
          <Link
            to="/register"
            className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
