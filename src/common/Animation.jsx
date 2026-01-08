import { motion } from "framer-motion";
import * as Icons from "lucide-react";

export const SimpleNoVillas = ({
    title = "No villas available",
    message = "Try adjusting your search criteria",
    Icon = Icons.Home,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="relative flex flex-col items-center justify-center p-12 mt-10 text-center rounded-3xl bg-linear-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 border-2 border-blue-200 dark:border-blue-800"
        >
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="mb-6 p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-xl"
            >
                <Icon className="w-12 h-12 text-orange-500" />
            </motion.div>

            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 ">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">
                {message}
            </p>
        </motion.div>
    );
};



export const ProfileCart = ({ emojis, logo }) => {
    return (
        <motion.div
            className="flex items-center justify-center p-10 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {emojis.map((emoji, index) => (
                <motion.div
                    key={index}
                    className="absolute text-2xl pointer-events-none"
                    initial={{
                        x: Math.random() * 400 - 200,
                        y: Math.random() * 400 - 200,
                        scale: 0,
                        opacity: 0
                    }}
                    animate={{
                        x: [
                            Math.random() * 400 - 200,
                            Math.random() * 400 - 200,
                            Math.random() * 400 - 200
                        ],
                        y: [
                            Math.random() * 300 - 150,
                            Math.random() * 300 - 150,
                            Math.random() * 300 - 150
                        ],
                        rotate: [0, 180, 360],
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{
                        duration: 8 + Math.random() * 5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: index * 0.3
                    }}
                    style={{
                        left: '50%',
                        top: '50%',
                        zIndex: 0
                    }}
                >
                    {emoji}
                </motion.div>
            ))}

            <motion.div
                className="bg-black/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl p-8 w-full max-w-xs shadow-2xl flex flex-col items-center relative z-10 overflow-hidden"
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{
                    scale: 1,
                    rotate: 0,
                    boxShadow: [
                        "0 10px 30px rgba(59, 130, 246, 0.3)",
                        "0 15px 40px rgba(16, 185, 129, 0.3)",
                        "0 10px 30px rgba(59, 130, 246, 0.3)"
                    ]
                }}
                transition={{
                    scale: { type: "spring", stiffness: 200 },
                    rotate: { type: "spring", stiffness: 100 },
                    boxShadow: {
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }
                }}
                whileHover={{
                    scale: 1.05,
                    borderColor: "rgba(59, 130, 246, 0.5)",
                    transition: { duration: 0.2 }
                }}
            >
                <motion.div
                    className="absolute top-0 left-0 w-full h-1 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        className="text-lg"
                        animate={{ x: ["-100%", "400%"] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        🛺🛺🛺
                    </motion.div>
                </motion.div>
                <div className="relative mb-6">
                    <motion.div
                        className="absolute -top-2 -right-2 text-xl"
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, 20, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    >
                        ✨
                    </motion.div>
                    <motion.div
                        className="absolute -bottom-2 -left-2 text-xl"
                        animate={{
                            y: [0, 10, 0],
                            rotate: [0, -20, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 0.5
                        }}
                    >
                        ✨
                    </motion.div>

                    <motion.img
                        src={logo}
                        alt="ECR Logo"
                        className="w-24 h-24 relative z-10"
                        animate={{
                            y: [0, -5, 0],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                        whileHover={{
                            rotate: [0, 10, -10, 0],
                            scale: 1.2,
                            transition: { duration: 0.5 }
                        }}
                    />
                </div>
                <motion.div className="relative mb-2">
                    <motion.h2
                        className="text-3xl font-bold bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent"
                        animate={{
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                        style={{
                            backgroundSize: "200% auto"
                        }}
                    >
                        ECR
                    </motion.h2>
                    <motion.div
                        className="absolute -top-1 -right-4 text-lg"
                        animate={{
                            rotate: 360,
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            rotate: {
                                duration: 4,
                                repeat: Infinity,
                                ease: "linear"
                            },
                            scale: {
                                duration: 1,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }
                        }}
                    >
                        🌴
                    </motion.div>
                </motion.div>
                <motion.div className="text-center space-y-2 relative">
                    <motion.p
                        className="text-white text-sm font-medium"
                        animate={{
                            color: ["#ffffff", "#93c5fd", "#ffffff"]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity
                        }}
                    >
                        ECR Holidays Admin
                    </motion.p>

                    <motion.div className="relative">
                        <motion.p
                            className="text-emerald-600 text-sm"
                            animate={{
                                scale: [1, 1.02, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity
                            }}
                        >
                            Discover the best ESR Holiday
                        </motion.p>
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-blue-400 to-transparent"
                            animate={{
                                x: ["-100%", "100%"]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    </motion.div>
                </motion.div>
                <motion.div
                    className="absolute -bottom-2 -right-1 text-2xl"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, -20, 0],
                        rotate: [0, 360]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                >
                    ✈️
                </motion.div>
                <motion.div
                    className="absolute -bottom-2 -left-1 text-2xl"
                    animate={{
                        y: [0, -30, 0],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                >
                    🏀
                </motion.div>
            </motion.div>
        </motion.div>
    )

}