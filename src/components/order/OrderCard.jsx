import { ORDER_STATUS_COLORS } from "../../data/constants"
import { mockData } from "../../data/mockData"

const OrderCard = ({ order }) => {
  const status = mockData.order_statuses.find((s) => s.id === order.status_id)
  const orderItems = mockData.food_orders.filter((fo) => fo.order_id === order.id)

  return (
    <div className="card mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">Order #{order.id}</h3>
          <p className="text-gray-600 text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${ORDER_STATUS_COLORS[status?.key] || "bg-gray-100 text-gray-800"}`}
        >
          {status?.label || "Unknown"}
        </span>
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Items:</h4>
        {orderItems.map((item) => {
          const food = mockData.foods.find((f) => f.id === item.food_id)
          return (
            <div key={item.id} className="flex justify-between text-sm text-gray-600">
              <span>
                {food?.name} x{item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          )
        })}
      </div>

      {order.remarks && (
        <div className="mb-4">
          <h4 className="font-medium mb-1">Remarks:</h4>
          <p className="text-sm text-gray-600">{order.remarks}</p>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t">
        <span className="font-semibold">Total: ${order.totalAmount.toFixed(2)}</span>
        <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">View Details</button>
      </div>
    </div>
  )
}

export default OrderCard
