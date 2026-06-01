import { Star, StarHalf } from 'lucide-react';

export default function ReviewsList({ reviews, ratingStats, variant = "public" }) {

    if (!reviews || reviews.length === 0) {
        return (
            <div className="bg-white rounded-3xl shadow-sm p-8 text-center border border-slate-100">
                <p className="text-slate-500">No reviews yet for this doctor.</p>
            </div>
        );
    }

    const isDashboard = variant === "dashboard";

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const stars = [];

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <div key={i} className="relative w-5 h-5">
                        <Star className="absolute w-5 h-5 fill-slate-200 text-slate-200" />
                        <div className="absolute overflow-hidden w-[50%] h-full">
                            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                        </div>
                    </div>
                );
            } else {
                stars.push(<Star key={i} className="w-5 h-5 fill-slate-200 text-slate-200" />);
            }
        }
        return stars;
    };

    return (
        <div className={`bg-white rounded-3xl shadow-sm p-8 border border-slate-100 ${isDashboard ? 'h-full flex flex-col' : 'mt-8'}`}>

            {isDashboard ? (
                <>
                    <h2 className="text-[#6B3B3D] font-bold text-2xl mb-6">Patient Reviews</h2>
                    
                    {ratingStats && (
                        <div className="mb-8 p-6 bg-[#FCF5F5] rounded-2xl flex flex-col sm:flex-row gap-8 items-center border border-[#B08B8C]/10">
                            {/* Overall Rating */}
                            <div className="flex flex-col items-center justify-center text-center sm:pr-8 sm:border-r border-[#B08B8C]/20">
                                <h3 className="text-5xl font-black text-[#6B3B3D] mb-2">{ratingStats.overallRating?.toFixed(1) || "0.0"}</h3>
                                <div className="flex gap-1 mb-2">
                                    {renderStars(ratingStats.overallRating || 0)}
                                </div>
                                <p className="text-sm font-medium text-slate-500">{ratingStats.totalReviews} Total Reviews</p>
                            </div>

                            {/* Breakdown */}
                            <div className="flex-1 w-full space-y-2">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = ratingStats.breakdown?.[star] || 0;
                                    const percentage = ratingStats.totalReviews > 0 ? (count / ratingStats.totalReviews) * 100 : 0;
                                    return (
                                        <div key={star} className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 w-8">
                                                <span className="font-semibold text-sm text-slate-700">{star}</span>
                                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                            </div>
                                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-amber-400 rounded-full" 
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-slate-500 w-8 text-right">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <h3 className="font-semibold text-lg text-[#6B3B3D] mb-4">Recent Reviews</h3>
                </>
            ) : (
                <h3 className="text-[#006D6F] font-bold text-2xl mb-6 flex items-center gap-2">
                    <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                    Patient Reviews ({reviews.length})
                </h3>
            )}

            <div className={`space-y-4 ${isDashboard ? 'overflow-y-auto flex-1 pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E8D3D4] hover:[&::-webkit-scrollbar-thumb]:bg-[#D4B8B9]' : ''}`}>
                {reviews.map((review, index) => {
                    const patientName = review.patient?.name || review.patient?.user?.name || "Anonymous";
                    const avatar = review.patient?.profile_url || review.patient?.user?.profile_url || `https://ui-avatars.com/api/?name=${patientName}&background=random`;
                    
                    return (
                        <div
                            key={index}
                            className="bg-slate-50 rounded-2xl p-5 flex gap-4 transition-all hover:bg-slate-100"
                        >
                            <img
                                src={avatar}
                                alt={patientName}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                            />

                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">
                                            {patientName}
                                        </p>
                                        <div className="flex gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">
                                        {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>

                                {review.reviewText && (
                                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                                        "{review.reviewText}"
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}