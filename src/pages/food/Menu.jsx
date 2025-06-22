"use client"

import { useState, useEffect } from "react"
import FoodCard from "../../components/food/FoodCard"
import FoodCategory from "../../components/food/FoodCategory"
import SearchBar from "../../components/common/SearchBar"
import { foodService } from "../../services/api/food"

const Menu = () => {
  const [foods, setFoods] = useState([])
  const [filteredFoods, setFilteredFoods] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const data = await foodService.getAllFoods()
        setFoods(data)
        setFilteredFoods(data)
      } catch (error) {
        console.error("Error fetching foods:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFoods()
  }, [])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const searchParam = urlParams.get("search")
    if (searchParam) {
      setSearchQuery(searchParam)
    }
  }, [])

  useEffect(() => {
    let filtered = foods

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((food) => food.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (food) =>
          food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          food.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredFoods(filtered)
  }, [foods, selectedCategory, searchQuery])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (searchQuery) {
      urlParams.set("search", searchQuery)
    } else {
      urlParams.delete("search")
    }

    const newUrl = `${window.location.pathname}${urlParams.toString() ? "?" + urlParams.toString() : ""}`
    window.history.replaceState({}, "", newUrl)
  }, [searchQuery])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

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
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Our Menu</h1>
        <p className="text-gray-600 mb-6">Discover delicious dishes from our partner restaurants</p>

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} placeholder="Search for dishes..." />
        </div>

        <FoodCategory selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
      </div>

      {filteredFoods.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No dishes found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Menu
