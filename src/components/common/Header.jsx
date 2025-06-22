"use client"

import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { useCart } from "../../contexts/CartContext"
import { ShoppingCart, Menu, X, Search, Star } from "lucide-react"
import { foodService } from "../../services/api/food"
import { vendorService } from "../../services/api/vendor"

const Header = () => {
  const { user, logout } = useAuth()
  const { getCartItemsCount } = useCart()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState({ foods: [], vendors: [] })
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const searchRef = useRef(null)

  // Search functionality
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setSearchLoading(true)
        try {
          const [foods, vendors] = await Promise.all([
            foodService.searchFoods(searchQuery),
            vendorService.getAllVendors(),
          ])

          const filteredVendors = vendors.filter(
            (vendor) =>
              vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              vendor.foodTypes.some((type) => type.toLowerCase().includes(searchQuery.toLowerCase())),
          )

          setSearchResults({
            foods: foods.slice(0, 5),
            vendors: filteredVendors.slice(0, 3),
          })
          setIsSearchOpen(true)
        } catch (error) {
          console.error("Search error:", error)
        } finally {
          setSearchLoading(false)
        }
      } else {
        setSearchResults({ foods: [], vendors: [] })
        setIsSearchOpen(false)
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [searchQuery])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  const handleResultClick = (type, id) => {
    setIsSearchOpen(false)
    setSearchQuery("")
    if (type === "food") {
      navigate(`/food/${id}`)
    } else if (type === "vendor") {
      navigate(`/vendors/${id}`)
    }
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">FD</span>
            </div>
            <span className="text-xl font-bold text-gray-800">FoodDelivery</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-orange-500 transition-colors">
              Home
            </Link>
            <Link to="/menu" className="text-gray-700 hover:text-orange-500 transition-colors">
              Menu
            </Link>
            <Link to="/vendors" className="text-gray-700 hover:text-orange-500 transition-colors">
              Restaurants
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search food, restaurants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length > 2 && setIsSearchOpen(true)}
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent hidden md:block"
                  />
                </div>
              </form>

              {/* Search Results Dropdown */}
              {isSearchOpen &&
                (searchResults.foods.length > 0 || searchResults.vendors.length > 0 || searchLoading) && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                    {searchLoading ? (
                      <div className="p-4 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
                        <p className="text-gray-500 text-sm mt-2">Searching...</p>
                      </div>
                    ) : (
                      <>
                        {/* Food Results */}
                        {searchResults.foods.length > 0 && (
                          <div className="p-2">
                            <h3 className="text-sm font-semibold text-gray-700 px-3 py-2">Food Items</h3>
                            {searchResults.foods.map((food) => (
                              <button
                                key={food.id}
                                onClick={() => handleResultClick("food", food.id)}
                                className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg text-left"
                              >
                                <img
                                  src={food.images || "/placeholder.svg?height=40&width=40"}
                                  alt={food.name}
                                  className="w-10 h-10 rounded-lg object-cover mr-3"
                                />
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800">{food.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {food.category} • ${food.price}
                                  </p>
                                </div>
                                <div className="flex items-center text-yellow-400">
                                  <Star size={14} className="fill-current" />
                                  <span className="text-sm text-gray-600 ml-1">{food.rating}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Vendor Results */}
                        {searchResults.vendors.length > 0 && (
                          <div className="p-2 border-t border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700 px-3 py-2">Restaurants</h3>
                            {searchResults.vendors.map((vendor) => (
                              <button
                                key={vendor.id}
                                onClick={() => handleResultClick("vendor", vendor.id)}
                                className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg text-left"
                              >
                                <img
                                  src={vendor.image || "/placeholder.svg?height=40&width=40"}
                                  alt={vendor.name}
                                  className="w-10 h-10 rounded-lg object-cover mr-3"
                                />
                              <div className="flex-1">
                                  <p className="font-medium text-gray-800">{vendor.name}</p>
                                  <p className="text-sm text-gray-600">{vendor.foodTypes.join(", ")}</p>
                                </div>
                                <div className="flex items-center text-yellow-400">
                                  <Star size={14} className="fill-current" />
                                  <span className="text-sm text-gray-600 ml-1">{vendor.rating}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* View All Results */}
                        {(searchResults.foods.length > 0 || searchResults.vendors.length > 0) && (
                          <div className="p-2 border-t border-gray-100">
                            <button
                              onClick={handleSearchSubmit}
                              className="w-full p-3 text-center text-orange-500 hover:bg-orange-50 rounded-lg font-medium"
                            >
                              View all results for "{searchQuery}"
                            </button>
                          </div>
                        )}

                        {/* No Results */}
                        {!searchLoading &&
                          searchResults.foods.length === 0 &&
                          searchResults.vendors.length === 0 &&
                          searchQuery.length > 2 && (
                            <div className="p-4 text-center">
                              <p className="text-gray-500">No results found for "{searchQuery}"</p>
                              <p className="text-sm text-gray-400 mt-1">
                                Try searching for food items or restaurant names
                              </p>
                            </div>
                          )}
                      </>
                    )}
                  </div>
                )}

              {/* Mobile Search Button */}
              <button
                className="p-2 text-gray-600 hover:text-orange-500 transition-colors md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Search size={20} />
              </button>
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors">
              <ShoppingCart size={20} />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-orange-500 transition-colors">
                  <img
                    src={user.image || "/placeholder.svg?height=32&width=32"}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                  />
                  <span className="hidden md:block font-medium">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Orders
                  </Link>
                  {user.role === "admin" && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-gray-700 hover:text-orange-500 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="py-2 text-gray-700 hover:text-orange-500 transition-colors">
                Home
              </Link>
              <Link to="/menu" className="py-2 text-gray-700 hover:text-orange-500 transition-colors">
                Menu
              </Link>
              <Link to="/vendors" className="py-2 text-gray-700 hover:text-orange-500 transition-colors">
                Restaurants
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
