import Header from "../components/common/Header"
import Footer from "../components/common/Footer"

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default MainLayout
