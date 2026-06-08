import { CalendarCheck, ShieldCheck, FileKey, Clock } from 'lucide-react';
import FeatureCard from '../landing page/FeautureCard';

const WhyChooseSection = () => {
    const features = [
        {
            icon: CalendarCheck,
            title: 'Easy Booking',
            description:
                'Appointments are just a few clicks away with our simple, intuitive platform. No long waits or complicated steps - healthcare made effortless.'
        },
        {
            icon: ShieldCheck,
            title: 'Verified Doctors',
            description:
                'Every doctor on MedBloom is licensed, experienced, and patient-reviewed. You can book with confidence knowing your care is in safe hands.'
        },
        {
            icon: FileKey,
            title: 'Secure Health Records',
            description:
                'Your prescriptions, reports, and history are stored safely in one place. Only you and your doctor have access, ensuring complete privacy.'
        },
        {
            icon: Clock,
            title: '24 x 7 Access',
            description:
                'Whether it’s day or night, doctors are available for you. Get timely consultations online or offline whenever you need care most.'
        }
    ]

    return (
        <section className="relative bg-gradient-to-b from-white to-slate-50 py-24 px-6 md:px-10 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-teal-50 blur-[100px] opacity-60"></div>
                <div className="absolute top-[60%] -right-[10%] w-[30%] h-[40%] rounded-full bg-blue-50 blur-[120px] opacity-60"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Heading */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-gray-900 font-extrabold text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tight">
                        Why <span className="text-teal-600">choose</span> our service
                    </h2>
                    <p className="text-gray-500 text-lg md:text-xl">
                        Experience healthcare that revolves around you, combining expert medical professionals with seamless technology.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    {/* LEFT SIDE - Content */}
                    <div className="lg:col-span-5 flex flex-col gap-8">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-400 to-blue-500"></div>
                            <p className="text-gray-600 leading-relaxed text-lg mb-6 relative z-10">
                                At <span className="font-semibold text-gray-900">MedBloom</span>, healthcare is not just about
                                appointments – it’s about trust, accessibility, and care designed around your needs. We connect
                                you with the right doctors and reliable support so that you feel confident in every step of your
                                health journey.
                            </p>
                            <p className="text-gray-600 leading-relaxed text-lg relative z-10">
                                We make healthcare simpler and safer through trusted doctors and secure technology. With{' '}
                                <span className="font-semibold text-gray-900">MedBloom</span>, quality care is always closer to you.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-4 pl-4 border-l-4 border-teal-100">
                            <div className="flex -space-x-3">
                                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100" alt="Doctor" />
                                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100" alt="Doctor" />
                                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=100&h=100" alt="Doctor" />
                            </div>
                            <div className="text-sm">
                                <p className="text-gray-900 font-semibold">Trusted by thousands</p>
                                <p className="text-gray-500">of patients worldwide</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE - Features Grid */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            </div>
        </section>
    )
}

export default WhyChooseSection;
