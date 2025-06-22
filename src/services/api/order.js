import { mockData } from "../../data/mockData"

export const orderService = {
  async createOrder(orderData) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newOrder = {
      id: Date.now(),
      ...orderData,
      status_id: 1, // pending
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return newOrder
  },

  async getOrdersByCustomer(customerId) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockData.orders.filter((o) => o.customer_id === Number.parseInt(customerId))
  },

  async getOrderById(id) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const order = mockData.orders.find((o) => o.id === Number.parseInt(id))
    if (!order) throw new Error("Order not found")
    return order
  },

  async updateOrderStatus(orderId, statusId) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { success: true }
  },

  async getAllOrders() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockData.orders
  },
}
