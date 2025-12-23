import { Link, useLocation } from "react-router-dom";
import Button from "./Button";

const MainLayout = ({
    style,
    className = "",
    children,
    Inputvalue,
    InputOnChange,
    displayTitle,
    itemsCount,
    onAddClick,
    addButtonText = "Add",
}) => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter(Boolean);

    const currentPage =
        pathnames.length > 0
            ? pathnames[pathnames.length - 1]
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())
            : "Dashboard";

    const finalTitle = displayTitle || `Manage Your ${currentPage}`;

    return (
        <section style={style} className={`px-4 ${className}`}>
            <div className="mb-2 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                {InputOnChange && (
                    <div className="mt-2 md:mt-0">
                        <input
                            type="text"
                            value={Inputvalue}
                            onChange={(e) => InputOnChange(e.target.value)}
                            placeholder="Search..."
                            className="px-4 py-2 border border-gray-300 rounded-lg 
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                                       focus:border-blue-500 w-full md:w-64"
                        />
                    </div>
                )}

                <div className="flex items-center gap-2 font-semibold text-sm">
                    <Link to="/" className="text-gray-500 hover:text-blue-600">
                        Dashboard
                    </Link>
                    {onAddClick && (
                        <Button className="bg-amber-50" onClick={onAddClick}>
                            {addButtonText} {currentPage}
                        </Button>
                    )}
                </div>
            </div>

            <div className=" flex items-center justify-between">
                <h2 className="text-md font-semibold text-gray-700 px-2">
                    {finalTitle}
                    {typeof itemsCount === "number" && (
                        <span className="ml-1 text-gray-500">({itemsCount})</span>
                    )}
                </h2>
            </div>
            <div className="px-2">{children}</div>
        </section>
    );
};

export default MainLayout;
