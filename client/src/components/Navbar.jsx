import React, { useContext } from "react";
import profileIcon from "../assets/profile_icon.png";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
    navigate('/login')
  };

  return (
    <header className="mx-4 mt-4 px-6 py-4 bg-white border border-gray-200 shadow-sm rounded-2xl flex items-center justify-between">

      <div
        onClick={() => navigate("/")}
        className="text-3xl font-bold cursor-pointer tracking-tight">
        <span className="text-gray-900">Skill</span>
        <span className="text-blue-600">Gap</span>
      </div>
      {isAuthenticated && (
        <nav className="flex items-center gap-3">
          <Link
            to="/analysis"
            className="px-4 py-2 rounded-xl text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition">
            Skill Analysis
          </Link>

          <Link
            to="/github"
            className="px-4 py-2 rounded-xl text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition">
            GitHub Analyzer
          </Link>

          <Link
            to="/progress"
            className="px-4 py-2 rounded-xl text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition">
            Progress
          </Link>

          <Link
            to="/roadmap"
            className="px-4 py-2 rounded-xl text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition">
            Roadmap
          </Link>
        </nav>
      )}

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm">
              Dashboard
            </button>

            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-xl transition">
              <img
                src={profileIcon}
                alt="Profile"
                className="h-11 w-11 rounded-full border border-gray-300 object-cover" />
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-800">User</p>
                <p className="text-xs text-gray-500">Developer</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-gray-500 font-medium hover:bg-gray-100 transition">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to='/login'
              className="px-4 py-2 rounded-xl text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition">
              Log in
            </Link>

            <Link
              to="/signup"
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm">
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;