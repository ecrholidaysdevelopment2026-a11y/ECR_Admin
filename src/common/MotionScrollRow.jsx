import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import Image from "./Image";

export const MotionScrollRow = ({
    data,
    speed = 100,
    direction = "left",
}) => {
    if (!data?.length) {
        return <p className="text-gray-400">No data available</p>;
    }

    const controls = useAnimation();
    const fromX = direction === "left" ? "0%" : "-50%";
    const toX = direction === "left" ? "-50%" : "0%";

    return (
        <div className="overflow-hidden w-full pb-3 ">
            <motion.div
                className="flex gap-4 w-max"
                animate={controls}
                initial={{ x: fromX }}
                onHoverStart={() => {
                    controls.stop();
                }}
                onHoverEnd={() => {
                    controls.start({
                        x: [fromX, toX],
                        transition: {
                            ease: "linear",
                            duration: speed,
                            repeat: Infinity,
                        },
                    });
                }}
                onViewportEnter={() => {
                    controls.start({
                        x: [fromX, toX],
                        transition: {
                            ease: "linear",
                            duration: speed,
                            repeat: Infinity,
                        },
                    });
                }}
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
                            <p className="text-xs text-gray-700">
                                Check-in:{" "}
                                {item.checkInDate
                                    ? new Date(item.checkInDate).toDateString()
                                    : "—"}
                            </p>

                            <p className="text-xs text-gray-700">
                                Check-out:{" "}
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
