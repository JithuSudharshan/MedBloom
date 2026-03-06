export default function ReviewsList() {

    const reviews = [
        {
            name: "Akshay suresh",
            avatar: "https://i.pravatar.cc/40",
            comment: "Awesome experience.."
        },
        {
            name: "Akshay suresh",
            avatar: "https://i.pravatar.cc/41",
            comment: "Awesome experience.."
        },
        {
            name: "Akshay suresh",
            avatar: "https://i.pravatar.cc/42",
            comment: "Awesome experience.."
        },
        {
            name: "Akshay suresh",
            avatar: "https://i.pravatar.cc/43",
            comment: "Awesome experience.."
        }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">

            <h3 className="text-teal-700 font-semibold text-lg mb-4">
                Reviews & Ratings
            </h3>

            <div className="space-y-3">

                {reviews.map((review, index) => (
                    <div
                        key={index}
                        className="border border-teal-200 rounded-lg p-3 flex gap-3"
                    >

                        <img
                            src={review.avatar}
                            alt=""
                            className="w-8 h-8 rounded-full"
                        />

                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                {review.name}
                            </p>

                            <p className="text-xs text-gray-500">
                                {review.comment}
                            </p>
                        </div>

                    </div>
                ))}

            </div>
        </div>
    );
}