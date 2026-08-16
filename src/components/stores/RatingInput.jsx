import { Star } from "lucide-react";

const RatingInput = ({
    value = 0,
    onChange,
    disabled = false,
    size = 28,
}) => {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(star)}
                    aria-label={`Rate ${star} out of 5`}
                    aria-pressed={star === value}
                    className="rounded-md p-1 transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Star
                        size={size}
                        strokeWidth={1.8}
                        className={
                            star <= value
                                ? "fill-[#f2a033] text-[#f2a033]"
                                : "text-[#b8bec7]"
                        }
                    />
                </button>
            ))}
        </div>
    );
};

export default RatingInput;