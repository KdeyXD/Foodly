"use client"

import { Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Navigate } from "react-router-dom"

const AdminLayout = () => {
  const { user } = useAuth()

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-white shadow-md">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="mt-4">
            <a href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Dashboard
            </a>
            <a href="/admin/customers" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Customers
            </a>
            <a href="/admin/vendors" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Vendors
            </a>
            <a href="/admin/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Orders
            </a>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
