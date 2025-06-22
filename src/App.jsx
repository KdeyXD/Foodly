import { BrowserRouter as Router } from "react-router-dom"
import AppRoutes from "./routes"
import { AuthProvider } from "./contexts/AuthContext"
import { CartProvider } from "./contexts/CartContext"
import { ThemeProvider } from "./contexts/ThemeContext"
import MainLayout from "./layouts/MainLayout"
import "./index.css"

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <MainLayout>
              <AppRoutes />
            </MainLayout>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
