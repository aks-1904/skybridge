import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Bell, User, ArrowLeft } from "lucide-react";
import { useContext } from "react";

const Navigation = ({ title = "BaggageShare", showBackButton }) => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="hover:bg-white/10 p-2 rounded"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <Link
              to="/notifications"
              className="hover:bg-white/10 p-2 rounded relative"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 text-xs flex items-center justify-center">
                2
              </span>
            </Link>
            <Link to="/profile" className="hover:bg-white/10 p-2 rounded">
              <User size={20} />
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
