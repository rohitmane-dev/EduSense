import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { FaRocket, FaBook, FaUsers, FaChartLine } from 'react-icons/fa';
import useAuthModalStore from '../store/useAuthModalStore';
import useAuthStore from '../store/useAuthStore';
import api from '../config/api';

const LandingPage = () => {
    const { openLogin, openSignup } = useAuthModalStore();
    const { isAuthenticated } = useAuthStore();

    // Warm up the backend on page load (for Render free tier)
    useEffect(() => {
        const warmUpBackend = async () => {
            try {
                // Send a simple health check request to wake up the backend
                await api.get('/health').catch(() => {
                    // Silently fail if health endpoint doesn't exist
                    // The request still wakes up the server
                });
                console.log('Backend warm-up request sent');
            } catch (error) {
                // Ignore errors - the goal is just to wake up the server
                console.log('Backend warming up...');
            }
        };

        warmUpBackend();
    }, []);

    const features = [
        {
            icon: <FaBook className="text-4xl text-blue-500" />,
            title: 'Expert Lectures',
            description: 'Learn from industry experts with comprehensive video lectures',
        },
        {
            icon: <FaUsers className="text-4xl text-green-500" />,
            title: 'Community Support',
            description: 'Get your doubts cleared by our active community',
        },
        {
            icon: <FaChartLine className="text-4xl text-purple-500" />,
            title: 'Track Progress',
            description: 'Monitor your learning journey with detailed analytics',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-8">
                        <FaRocket className="text-white text-3xl" />
                    </div>

                    <h1 className="text-6xl font-bold text-gray-900 mb-6">
                        Welcome to <span className="text-black">EduSense</span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                        Your gateway to knowledge. Learn, grow, and excel with our comprehensive
                        educational platform designed for modern learners.
                    </p>

                    {!isAuthenticated && (
                        <div className="flex gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={openSignup}
                                className="px-8 py-4 bg-black text-white rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors shadow-lg"
                            >
                                Get Started
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={openLogin}
                                className="px-8 py-4 bg-white text-black rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg border-2 border-gray-200"
                            >
                                Sign In
                            </motion.button>
                        </div>
                    )}
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="grid md:grid-cols-3 gap-8 mt-24"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPage;
