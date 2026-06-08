import { useState, useEffect } from 'react';
import ServiceCard from '../landing page/ServiceCard';
import { fetchDepartmentsList } from '../../api/landingPageApi';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ServicesSection = () => {
    const [allServices, setAllServices] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const INITIAL_LIMIT = 12;

    useEffect(() => {
        const getDepartments = async () => {
            try {
                const res = await fetchDepartmentsList();
                if (res.data?.success) {
                    const formattedServices = res.data.data.map((dept, index) => ({
                        title: dept.departmentName,
                        description: dept.description || 'Comprehensive and specialized care for your health and well-being.',
                        isHighlighted: index === 0
                    }));
                    setAllServices(formattedServices);
                }
            } catch (err) {
                console.error("Failed to fetch departments", err);
            } finally {
                setIsLoading(false);
            }
        };
        getDepartments();
    }, []);

    const visibleServices = showAll ? allServices : allServices.slice(0, INITIAL_LIMIT);

    return (
        <section className="bg-white py-20 px-6 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Heading */}
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
                    We make healthcare simple and stress-free. Your well-being{' '}
                    <span className="text-teal-600">starts right here.</span>
                </h2>

                {/* Services Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-40 mt-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                    </div>
                ) : (
                    <>
                        <motion.div 
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
                        >
                            <AnimatePresence>
                                {visibleServices.map((service, index) => (
                                    <motion.div
                                        key={service.title}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ServiceCard
                                            title={service.title}
                                            description={service.description}
                                            isHighlighted={service.isHighlighted}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Show More / Less Button */}
                        {allServices.length > INITIAL_LIMIT && (
                            <motion.div layout className="flex justify-center mt-12">
                                <button
                                    onClick={() => setShowAll(!showAll)}
                                    className="flex items-center gap-2 px-8 py-3 rounded-full border border-teal-200 text-teal-700 bg-teal-50/50 hover:bg-teal-50 hover:border-teal-300 font-medium transition-all duration-300 shadow-sm"
                                >
                                    {showAll ? (
                                        <>
                                            Show Less <ChevronUp className="w-4 h-4" />
                                        </>
                                    ) : (
                                        <>
                                            Show More <ChevronDown className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </section>
    )
}

export default ServicesSection;
