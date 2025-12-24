import React from 'react';

const IsonboardedWarning = ({ onClick }) => {
    return (
        <section className="w-full mx-auto border border-amber-300 bg-amber-50  px-6">
            <div className="flex mx-auto flex-col md:flex-row items-start md:items-center justify-between
         px-6 py-4    ">

                {/* Left content */}
                <div className='flex gap-10'>
                    <p className="text-xs font-semibold text-amber-800">
                        Your profile is incomplete
                    </p>
                    <p className="text-xs text-amber-700">
                        Complete onboarding to unlock appointment booking.
                    </p>
                </div>

                {/* CTA */}
                <button
                    onClick={onClick}
                    className="self-end md:self-auto rounded-md bg-amber-600 px-2 py-1
            text-xs font-medium text-white hover:bg-amber-700 transition"
                >
                    Finish Onboarding
                </button>
            </div>
        </section>
    );
};

export default IsonboardedWarning;
