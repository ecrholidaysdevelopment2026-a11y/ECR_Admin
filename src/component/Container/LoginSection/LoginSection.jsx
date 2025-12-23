import { useState, useEffect } from "react";
import AdminLogo from "../../../assets/ecr-logo.svg";
import loginbging from "../../../assets/login_bg-img.jpg";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
    loginAdmin,
    clearMessage,
    clearError,
} from "../../../store/slice/loginSlice";
import { successAlert, errorAlert } from "../../../utils/alertService";
import { useNavigate } from "react-router-dom";

const LoginSection = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, message, firstName } = useSelector(
        (state) => state.auth
    );

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        dispatch(clearMessage());
        dispatch(clearError());
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(
            loginAdmin({ email: formData?.email, password: formData?.password })
        );
    };

    useEffect(() => {
        if (message) {
            successAlert(`Welcome, ${firstName || "Admin"}!`);
            const timer = setTimeout(() => {
                dispatch(clearMessage());
                navigate("/");
            }, 1000); 
            return () => clearTimeout(timer);
        }

        if (error) {
            errorAlert(error);
            dispatch(clearError());
        }
    }, [message, error, firstName, dispatch, navigate]);



    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url(${loginbging})`,
                backgroundColor: "transparent",
            }}
        >

            <div className="backdrop-blur-lg bg-blue-500/10  rounded-2xl shadow-2xl py-5 px-10 max-w-xl w-full mx-4">
                <div className="text-center">
                    <div className="flex justify-center ">
                        <img
                            src={AdminLogo}
                            alt="Admin Logo"
                            className="h-16 w-16 drop-shadow-lg"
                        />
                    </div>
                    <h1 className="text-xl font-bold text-white  drop-shadow-md">
                        Welcome Back Admin!
                    </h1>
                </div>
                <h4 className="text-md font-semibold mb-5 text-center text-white">Login</h4>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            className="w-full px-4 py-3 bg-blue-500/10 border border-white rounded-lg text-white placeholder-white transition-all duration-200 outline-none"
                            placeholder="Enter your Email"
                        />
                    </div>
                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            className="w-full px-4 py-3 bg-blue-500/10 border border-white/40 rounded-lg text-white placeholder-white transition-all duration-200 outline-none focus:none"
                            placeholder="Enter your Password"
                        />
                        <span
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-white"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                        </span>
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg_green rounded-full hover:bg-white/40 backdrop-blur-sm border border-white/40 text-white font-medium py-2 px-8 transition-all duration-200 hover:scale-105"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginSection;
