const Button = ({
    children,
    type,
    onClick,
    className = "",
    loading = false,
    disabled = false
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                relative overflow-hidden px-6 py-2 rounded-md text-sm font-medium
                text-white bg-black cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed
                ${className}
            `}
        >
            <span className="relative z-10 transition-colors duration-500 ">
                {loading ? "Loading..." : children}
            </span>
        </button>
    );
};

export default Button;
