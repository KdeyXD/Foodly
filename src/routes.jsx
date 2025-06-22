import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import Loading from "./components/common/Loading"
import AuthLayout from "./layouts/AuthLayout"
import AdminLayout from "./layouts/AdminLayout"

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/auth/Login"))
const Register = lazy(() => import("./pages/auth/Register"))
const Menu = lazy(() => import("./pages/food/Menu"))
const FoodDetails = lazy(() => import("./pages/food/Details"))
const VendorList = lazy(() => import("./pages/vendor/List"))
const VendorDetails = lazy(() => import("./pages/vendor/Details"))
const Cart = lazy(() => import("./pages/cart/Cart"))
const Checkout = lazy(() => import("./pages/cart/Checkout"))
const CustomerDashboard = lazy(() => import("./pages/customer/Dashboard"))
const CustomerOrders = lazy(() => import("./pages/customer/Orders"))
const CustomerProfile = lazy(() => import("./pages/customer/Profile"))
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"))
const AdminCustomers = lazy(() => import("./pages/admin/Customers"))
const AdminVendors = lazy(() => import("./pages/admin/Vendors"))
const AdminOrders = lazy(() => import("./pages/admin/Orders"))
const AdminProfile = lazy(() => import("./pages/admin/Profile"))
const VendorProfile = lazy(() => import("./pages/vendor/Profile"))
const NotFound = lazy(() => import("./pages/NotFound"))

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/food/:id" element={<FoodDetails />} />
        <Route path="/vendors" element={<VendorList />} />
        <Route path="/vendors/:id" element={<VendorDetails />} />

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Customer Routes */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/orders" element={<CustomerOrders />} />
        <Route path="/profile" element={<CustomerProfile />} />

        {/* Vendor Routes */}
        <Route path="/vendor/profile" element={<VendorProfile />} />

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/vendors" element={<AdminVendors />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
