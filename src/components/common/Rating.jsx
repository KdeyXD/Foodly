import { Star } from "lucide-react"

const Rating = ({ rating, maxRating = 5, size = 16, showNumber = true }) => {
  return (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {[...Array(maxRating)].map((_, index) => (
          <Star
            key={index}
            size={size}
            className={`${
              index < Math.floor(rating)
                ? "text-yellow-400 fill-current"
                : index < rating
                  ? "text-yellow-400 fill-current opacity-50"
                  : "text-gray-300"
            }`}
          />
        ))}
      </div>
      {showNumber && <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>}
    </div>
  )
}

export default Rating
