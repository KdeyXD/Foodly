import { mockData } from "../../data/mockData"

// Mock implementation - replace with actual API calls
export const authService = {
  async login(email, password) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check customers
    const customer = mockData.customers.find((c) => c.email === email && c.password === password)
    if (customer) {
      const userData = { ...customer, role: "customer" }
      localStorage.setItem("user", JSON.stringify(userData))
      return userData
    }

    // Check vendors
    const vendor = mockData.vendors.find((v) => v.email === email && v.password === password)
    if (vendor) {
      const userData = { ...vendor, role: "vendor" }
      localStorage.setItem("user", JSON.stringify(userData))
      return userData
    }

    // Check admins
    const admin = mockData.admins.find((a) => a.email === email && a.password === password)
    if (admin) {
      const userData = { ...admin, role: "admin" }
      localStorage.setItem("user", JSON.stringify(userData))
      return userData
    }

    throw new Error("Invalid credentials")
  },

  async logout() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    localStorage.removeItem("user")
  },

  async register(userData) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newUser = {
      id: Date.now(),
      ...userData,
      role: "customer",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    localStorage.setItem("user", JSON.stringify(newUser))
    return newUser
  },

  async getCurrentUser() {
    const userData = localStorage.getItem("user")
    return userData ? JSON.parse(userData) : null
  },
}
