import { Link } from "react-router-dom"
import { MapPin, Phone } from "lucide-react"
import Rating from "../common/Rating"

const VendorCard = ({ vendor }) => {
  return (
    <Link to={`/vendors/${vendor.id}`} className="block">
      <div className="card hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <img src={vendor.image || "/placeholder.svg"} alt={vendor.name} className="w-full h-48 object-cover" />

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 text-gray-800">{vendor.name}</h3>

          <div className="flex items-center mb-2">
            <MapPin size={14} className="text-gray-500 mr-1" />
            <span className="text-gray-600 text-sm">{vendor.address}</span>
          </div>

          <div className="flex items-center mb-3">
            <Phone size={14} className="text-gray-500 mr-1" />
            <span className="text-gray-600 text-sm">{vendor.phone}</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <Rating rating={vendor.rating} />
            <div className="flex flex-wrap gap-1">
              {vendor.foodTypes.slice(0, 2).map((type) => (
                <span key={type} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default VendorCard
