import { Outlet, Navigate } from "react-router-dom";
import Header from "../component/Common/Header/Header";
import Sidebar from "../component/Common/Sidebar/Sidebar";
import { useSelector } from "react-redux";

const ProtectedLayout = () => {
  const { accessToken, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <aside className="w-16 md:w-60 h-screen sticky top-0 overflow-y-auto">
          <Sidebar />
        </aside>
        <div className="flex-1 overflow-auto">
          <Header />
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
