import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-slate-900 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        
        <Link
          to="/"
          className="text-white text-lg sm:text-xl font-semibold tracking-wide hover:text-blue-400 transition"
        >
          Job Tracker
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          
          <Link
            to="/login"
            className="text-gray-300 text-sm sm:text-base hover:text-white transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base px-3 sm:px-4 py-2 rounded-lg font-medium transition shadow hover:shadow-md"
          >
            Register
          </Link>

        </div>
      </div>
    </nav>
  );
}