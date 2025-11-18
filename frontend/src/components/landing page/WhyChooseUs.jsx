import FeatureCard from '../landing page/FeautureCard';

const WhyChooseSection = () => {
    const features = [
        {
            icon: '✓',
            title: 'Easy Booking',
            description:
                'Appointments are just a few clicks away with our simple, intuitive platform. No long waits or complicated steps - healthcare made effortless.'
        },
        {
            icon: '✓',
            title: 'Verified Doctors',
            description:
                'Every doctor on MedBloom is licensed, experienced, and patient-reviewed. You can book with confidence knowing your care is in safe hands.'
        },
        {
            icon: '✓',
            title: 'Secure Health Records',
            description:
                'Your prescriptions, reports, and history are stored safely in one place. Only you and your doctor have access, ensuring complete privacy.'
        },
        {
            icon: '✓',
            title: '24 x 7 Access',
            description:
                'Whether it’s day or night, doctors are available for you. Get timely consultations online or offline whenever you need care most.'
        }
    ]

    return (
        <section className="bg-white py-24 px-6 md:px-10">

            {/* Heading */}
            <h2 className="text-center text-gray-900 font-bold text-5xl md:text-6xl mb-4">
                Why <span className="text-[#00A3A1]">choose</span> our service
            </h2>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 mt-10">

                {/* LEFT SIDE */}
                <div className="flex flex-col gap-10 pr-6">

                    <div>
                        <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                            At <span className="font-semibold text-gray-900">MedBloom</span>, healthcare is not just about
                            appointments – it’s about trust, accessibility, and care designed around your needs. We connect
                            you with the right doctors and reliable support so that you feel confident in every step of your
                            health journey.
                        </p>
                    </div>



                    {/* Paragraph 2 */}
                    <div>
                        <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                            We make healthcare simpler and safer through trusted doctors and secure technology. With{' '}
                            <span className="font-semibold text-gray-900">MedBloom</span>, quality care is always closer to you.
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>

            </div>

        </section>
    )
}

export default WhyChooseSection;
