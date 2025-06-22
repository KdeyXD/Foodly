import { mockData } from "../../data/mockData"

export const vendorService = {
  async getAllVendors() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockData.vendors
  },

  async getVendorById(id) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const vendor = mockData.vendors.find((v) => v.id === Number.parseInt(id))
    if (!vendor) throw new Error("Vendor not found")
    return vendor
  },

  async getVendorsByFoodType(foodType) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockData.vendors.filter((v) =>
      v.foodTypes.some((type) => type.toLowerCase().includes(foodType.toLowerCase())),
    )
  },
}
