import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ECRHolidays404 = () => {
    return (
        <div className="min-h-screen bg-linear-to-br flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply blur-3xl opacity-30"
                    animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                />
                <motion.div
                    className="absolute top-1/2 right-1/4 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply blur-3xl opacity-30"
                    animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
                    transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
                />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/30 mb-8">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="mb-8"
                    >
                        <div className="relative inline-block">
                            <span className="text-9xl font-bold text-teal-700">404</span>
                            <motion.div
                                className="absolute -top-4 -right-4 text-5xl"
                                animate={{ rotate: [0, 20, 0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                🧭
                            </motion.div>
                        </div>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
                    >
                        Looks like you're exploring uncharted territory!
                    </motion.h2>
                    <motion.div
                        className="flex justify-center space-x-6 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        {["🏖️", "⛰️", "🏕️", "🌊"].map((icon, index) => (
                            <motion.div
                                key={index}
                                className="text-4xl"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                            >
                                {icon}
                            </motion.div>
                        ))}
                    </motion.div>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                    >
                        <Link to="/">
                            <motion.button
                                className="px-8 py-4 bg-linear-to-r from-teal-600 to-teal-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                ← Back to Home
                            </motion.button>
                        </Link>

                        <Link to="/packages">
                            <motion.button
                                className="px-8 py-4 bg-white text-teal-600 font-semibold rounded-2xl shadow-lg border-2 border-teal-600 hover:-translate-y-1 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                View Holiday Packages
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
                <motion.div
                    className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-2xl max-w-xs "
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.5, type: "spring" }}
                >
                    <div className="flex items-start space-x-3">
                        <div className="text-2xl">💬</div>
                        <div>
                            <p className="text-sm text-gray-600">
                                Need help finding your way? Our travel experts are just a call away!
                            </p>
                            <p className="text-teal-600 font-semibold mt-1">
                                📞 +91 94986 56273
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ECRHolidays404;
