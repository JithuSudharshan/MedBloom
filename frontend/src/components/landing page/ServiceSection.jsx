import ServiceCard from '../landing page/ServiceCard';

const ServicesSection = () => {
    const services = [
        {
            title: 'General Medicine',
            description: 'For primary care and routine consultations.',
            isHighlighted: true
        },
        {
            title: 'Pediatrics',
            description: 'Child health, vaccinations, and growth monitoring.'
        },
        {
            title: 'Gynecology & Obstetrics',
            description: "Women's health, pregnancy care, fertility"
        },
        {
            title: 'Dermatology',
            description: 'Skin, hair, and cosmetic concerns.'
        },
        {
            title: 'Cardiology',
            description: 'Heart health, Blood pressure, preventive checkups.'
        },
        {
            title: 'ENT (Ear, Nose, Throat)',
            description: 'Common infections, allergies, hearing issues.'
        },
        {
            title: 'Orthopedics',
            description: 'Heart health, blood pressure, preventive checkups.'
        },
        {
            title: 'Dentistry',
            description: 'Dental checkups, cosmetic and preventive care.'
        }
    ];

    return (
        <section className="bg-white py-20 px-6 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Heading */}
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
                    We make healthcare simple and stress-free. Your well-being{' '}
                    <span className="text-teal-600">starts right here.</span>
                </h2>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={index}
                            title={service.title}
                            description={service.description}
                            isHighlighted={service.isHighlighted}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ServicesSection;
