import { Star } from "lucide-react";

const RatingStars = ({
    rating = 0,
    size = 19,
}) => {
    const numericRating = Number(rating) || 0;

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={size}
                    strokeWidth={1.8}
                    className={
                        star <= Math.round(numericRating)
                            ? "fill-[#f2a033] text-[#f2a033]"
                            : "fill-transparent text-[#c5d0df]"
                    }
                />
            ))}
        </div>
    );
};

export default RatingStars;