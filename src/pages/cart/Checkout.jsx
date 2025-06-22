"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, CreditCard, Truck, MapPin, Clock, Check } from "lucide-react"
import Button from "../../components/common/Button"
import Card from "../../components/common/Card"
import { useCart } from "../../contexts/CartContext"
import { useAuth } from "../../hooks/useAuth"
import { orderService } from "../../services/api/order"

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [error, setError] = useState("")

  const [deliveryInfo, setDeliveryInfo] = useState({
    address: user?.address || "",
    phone: user?.phone || "",
    instructions: "",
  })

  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      navigate("/cart")
    }
  }, [cartItems, navigate, orderPlaced])

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])

  const subtotal = getCartTotal()
  const deliveryFee = 2.99
  const tax = subtotal * 0.08
  const total = subtotal + deliveryFee + tax

  const handleDeliveryInfoChange = (e) => {
    setDeliveryInfo({
      ...deliveryInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handleCardInfoChange = (e) => {
    setCardInfo({
      ...cardInfo,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    if (!deliveryInfo.address.trim()) {
      setError("Delivery address is required")
      return false
    }
    if (!deliveryInfo.phone.trim()) {
      setError("Phone number is required")
      return false
    }

    if (paymentMethod === "card") {
      if (
        !cardInfo.cardNumber.trim() ||
        !cardInfo.expiryDate.trim() ||
        !cardInfo.cvv.trim() ||
        !cardInfo.cardholderName.trim()
      ) {
        setError("Please fill in all card details")
        return false
      }
    }

    return true
  }

  const handlePlaceOrder = async () => {
    setError("")

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Simulate order creation
      const orderData = {
        customer_id: user.id,
        totalAmount: total,
        remarks: deliveryInfo.instructions,
        items: cartItems.map((item) => ({
          food_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        delivery_address: deliveryInfo.address,
        phone: deliveryInfo.phone,
        payment_method: paymentMethod,
      }

      await orderService.createOrder(orderData)

      // Clear cart and show success
      clearCart()
      setOrderPlaced(true)

      // Redirect to orders page after 3 seconds
      setTimeout(() => {
        navigate("/orders")
      }, 3000)
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError("Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">Thank you for your order. You will receive a confirmation email shortly.</p>
          <p className="text-sm text-gray-500">Redirecting to your orders...</p>
        </div>
      </div>
    )
  }

  if (!user || cartItems.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate("/cart")} className="flex items-center text-gray-600 hover:text-gray-800 mb-6">
        <ArrowLeft size={20} className="mr-2" />
        Back to Cart
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Information */}
          <Card>
            <div className="flex items-center mb-4">
              <MapPin className="text-orange-500 mr-2" size={20} />
              <h2 className="text-xl font-semibold">Delivery Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={deliveryInfo.address}
                  onChange={handleDeliveryInfoChange}
                  className="input-field resize-none"
                  rows="3"
                  placeholder="Enter your complete delivery address"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={deliveryInfo.phone}
                  onChange={handleDeliveryInfoChange}
                  className="input-field"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div>
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  id="instructions"
                  name="instructions"
                  value={deliveryInfo.instructions}
                  onChange={handleDeliveryInfoChange}
                  className="input-field resize-none"
                  rows="2"
                  placeholder="Any special instructions for delivery..."
                />
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card>
            <div className="flex items-center mb-4">
              <CreditCard className="text-orange-500 mr-2" size={20} />
              <h2 className="text-xl font-semibold">Payment Method</h2>
            </div>

            <div className="space-y-4">
              {/* Payment Options */}
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <CreditCard size={16} className="mr-2" />
                  Credit/Debit Card
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <Truck size={16} className="mr-2" />
                  Cash on Delivery
                </label>
              </div>

              {/* Card Details */}
              {paymentMethod === "card" && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      id="cardholderName"
                      name="cardholderName"
                      value={cardInfo.cardholderName}
                      onChange={handleCardInfoChange}
                      className="input-field"
                      placeholder="Name on card"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={cardInfo.cardNumber}
                      onChange={handleCardInfoChange}
                      className="input-field"
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={cardInfo.expiryDate}
                        onChange={handleCardInfoChange}
                        className="input-field"
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV *
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={cardInfo.cvv}
                        onChange={handleCardInfoChange}
                        className="input-field"
                        placeholder="123"
                        maxLength="4"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Delivery Time */}
          <Card>
            <div className="flex items-center mb-4">
              <Clock className="text-orange-500 mr-2" size={20} />
              <h2 className="text-xl font-semibold">Estimated Delivery Time</h2>
            </div>
            <p className="text-gray-600">
              Your order will be delivered in approximately{" "}
              <span className="font-semibold text-orange-500">25-35 minutes</span>
            </p>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {/* Order Items */}
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            {/* Price Breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <Button onClick={handlePlaceOrder} className="w-full" size="lg" disabled={loading}>
              {loading ? "Placing Order..." : `Place Order - $${total.toFixed(2)}`}
            </Button>

            <p className="text-xs text-gray-500 text-center mt-3">
              By placing this order, you agree to our terms and conditions
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Checkout
