import { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { verifyPayment } from "../store/slice/bookingSlice";
import { errorAlert } from "../utils/alertService";
console.log("Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY_ID);

const Payment = forwardRef(({ totalAmount, dispatch }, ref) => {
    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        if (window.Razorpay) {
            setIsReady(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => setIsReady(true);
        script.onerror = () => errorAlert("Razorpay SDK failed to load");
        document.body.appendChild(script);
    }, []);

    const initiatePayment = (orderId) => {
        if (!isReady) {
            errorAlert("Payment system not ready. Try again.");
            return;
        }

        if (!orderId) {
            errorAlert("Invalid order ID");
            return;
        }
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: totalAmount * 100,
            currency: "INR",
            name: "ECR",
            description: "Payment for your order",
            order_id: orderId,
            theme: { color: "#0C8040" },
            handler: (response) => {
                console.log("Payment success response:", response);
                dispatch(
                    verifyPayment({
                        razorpayOrderId: response.razorpay_order_id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpaySignature: response.razorpay_signature,
                    })
                );
            },
        };
        const razor = new window.Razorpay(options);
        razor.on("payment.failed", (res) =>
            errorAlert(res.error.description || "Payment failed")
        );
        razor.open();
    };

    useImperativeHandle(ref, () => ({
        initiatePayment,
    }));

    return null;
});

export default Payment;
