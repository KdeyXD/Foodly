import { mockData } from "../../data/mockData"

export const foodService = {
  async getAllFoods() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockData.foods
  },

  async getFoodById(id) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const food = mockData.foods.find((f) => f.id === Number.parseInt(id))
    if (!food) throw new Error("Food not found")
    return food
  },

  async getFoodsByCategory(category) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (category === "All") return mockData.foods
    return mockData.foods.filter((f) => f.category === category)
  },

  async getFoodsByVendor(vendorId) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockData.foods.filter((f) => f.vendor_id === Number.parseInt(vendorId))
  },

  async searchFoods(query) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockData.foods.filter(
      (f) =>
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.description.toLowerCase().includes(query.toLowerCase()) ||
        f.category.toLowerCase().includes(query.toLowerCase()),
    )
  },
}
