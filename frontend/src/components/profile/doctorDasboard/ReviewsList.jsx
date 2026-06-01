export default function ReviewsList({ reviews }) {



    return (
        <div className="bg-white rounded-2xl shadow-md p-6">

            <h3 className="text-[#6B3B3D] font-semibold text-lg mb-4">
                Reviews & Ratings
            </h3>

            <div className="space-y-3">

                {reviews?.map((review, index) => (
                    <div
                        key={index}
                        className="border border-[#B08B8C]/30 rounded-lg p-3 flex gap-3"
                    >

                        <img
                            src={review.avatar}
                            alt=""
                            className="w-8 h-8 rounded-full"
                        />

                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                {review?.name}
                            </p>

                            <p className="text-xs text-gray-500">
                                {review?.comment}
                            </p>
                        </div>

                    </div>
                ))}

            </div>
        </div>
    );
}