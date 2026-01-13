import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import Image from "./Image";
import { FiCalendar, FiLogIn, FiLogOut } from "react-icons/fi";

export const MotionScrollRow = ({
    data,
    speed = 60,
    direction = "left",
}) => {
    const controls = useAnimation();
    const rowRef = useRef(null);

    useEffect(() => {
        if (!rowRef.current || !data?.length) return;

        const contentWidth = rowRef.current.scrollWidth / 2;
        const duration = contentWidth / speed;
        const fromX = direction === "left" ? 0 : -contentWidth;
        const toX = direction === "left" ? -contentWidth : 0;

        controls.set({ x: fromX });

        controls.start({
            x: toX,
            transition: {
                duration,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
            },
        });
    }, [controls, data, speed, direction]);

    if (!data?.length) {
        return <p className="text-gray-400">No data available</p>;
    }

    return (
        <div className="overflow-hidden w-full pb-3">
            <motion.div
                ref={rowRef}
                className="flex gap-4 w-max"
                animate={controls}
                onHoverStart={() => controls.stop()}
                onHoverEnd={() => controls.start()}
            >
                {data?.map((item, index) => (
                    <div
                        key={`${item._id}-${index}`}
                        className="min-w-[360px] flex items-center gap-3 px-3 py-2 bg-white rounded-lg shadow-md shrink-0"
                    >
                        <div className="relative h-[81px] w-[120px] rounded-md overflow-hidden bg-gray-100 shrink-0">
                            <Image
                                src={item.villaId?.images?.villaImage}
                                alt={item.villaId?.villaName || "villa"}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col justify-between min-w-0">
                            <h4 className="text-black font-semibold text-sm line-clamp-1">
                                {item.villaId?.villaName}
                            </h4>
                            <p className="text-xs text-gray-700 flex items-center gap-1">
                                <FiLogIn />
                                {item.checkInDate
                                    ? new Date(item.checkInDate).toDateString()
                                    : "—"}
                            </p>

                            <p className="text-xs text-gray-700 flex items-center gap-1">
                                <FiLogOut />
                                {item.checkOutDate
                                    ? new Date(item.checkOutDate).toDateString()
                                    : "—"}
                            </p>
                            <p className="text-green-500 font-semibold text-sm mt-1">
                                ₹ {item.totalAmount}
                            </p>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};
