// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { Menu, X, Globe, Heart, Home, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="relative">
      <nav 
        className={`z-50 transition-all duration-500 fixed w-full ${
          scrolled 
            ? 'bg-transparent dark:bg-gray-900/90 backdrop-blur-lg shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 py-2 sm:px-6 sm:py-3"> {/* Reduced padding on mobile */}
          <div className="flex justify-between items-center">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center space-x-2 sm:space-x-3 group" /* Reduced space on mobile */
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg transition-transform group-hover:scale-110"> {/* Smaller on mobile */}
                  <span className="bg-clip-text text-transparent bg-white">GN</span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
                    Global<span className="text-gray-800 dark:text-white">Nest</span>
                  </span>
                  <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-300"></div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Centered Pills */}
            <div className="hidden md:flex items-center">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1.5 mx-auto">
                <div className="flex space-x-2">
                  <Link 
                    to="/" 
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all duration-300 ${
                      isActive('/') 
                        ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-md' 
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Home className="h-5 w-5" />
                    <span className="text-base">Home</span>
                  </Link>
                  
                  <Link 
                    to="/countries" 
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all duration-300 ${
                      isActive('/countries') 
                        ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-md' 
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Globe className="h-5 w-5" />
                    <span className="text-base">Countries</span>
                  </Link>
                  
                  {user && (
                    <Link 
                      to="/favorites" 
                      className={`flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all duration-300 ${
                        isActive('/favorites') 
                          ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-md' 
                          : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Heart className="h-5 w-5" />
                      <span className="text-base">Favorites</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2 sm:space-x-5"> {/* Reduced spacing on mobile */}
              <ThemeToggle />
              
              {user ? (
                <div className="flex items-center">
                  <div className="hidden md:flex items-center">
                    <div className="relative group">
                      <button className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 hover:shadow-md transition-all duration-300">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center text-white font-semibold text-base">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 text-base">{user.username}</span>
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100 dark:border-gray-800">
                        <button
                          onClick={handleLogout}
                          className="flex w-full text-left px-4 py-3 text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="md:hidden bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-medium transition-all hover:shadow-lg" /* Smaller on mobile */
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 sm:space-x-3"> {/* Reduced spacing on mobile */}
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:shadow-lg" /* Smaller on mobile */
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:inline-block border border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 text-gray-800 dark:text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 hover:shadow-md text-base"
                  >
                    Register
                  </Link>
                </div>
              )}
              
              {/* Mobile menu button */}
              <button
                className="md:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 focus:outline-none bg-gray-100 dark:bg-gray-800 p-1.5 sm:p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" /* Smaller on mobile */
                onClick={toggleMenu}
              >
                {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />} {/* Smaller icon on mobile */}
              </button>
            </div>
          </div>
        </div>
        {/* Navbar underline */}
        <div className="h-0.5 sm:h-0.8 w-full bg-gradient-to-r from-blue-500 to-green-400"></div> {/* Thinner on mobile */}
      </nav>
        
      {/* Mobile menu - slide down */}
      <div 
        className={`md:hidden fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className={`w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-xl border-t dark:border-gray-800 transition-all duration-300 transform ${
            isOpen ? 'translate-y-14 sm:translate-y-20' : '-translate-y-full' /* Adjusted for smaller navbar */
          }`}
        >
          <div className="p-3 sm:p-5 space-y-2 sm:space-y-3"> {/* Reduced padding and spacing on mobile */}
            <Link 
              to="/" 
              className={`flex items-center space-x-2 sm:space-x-3 px-3 py-2.5 sm:px-5 sm:py-4 rounded-lg sm:rounded-xl ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Home className="h-5 w-5 sm:h-6 sm:w-6" /> {/* Smaller icon on mobile */}
              <span className="font-medium text-base sm:text-lg">Home</span> {/* Smaller text on mobile */}
            </Link>
            
            <Link 
              to="/countries" 
              className={`flex items-center space-x-2 sm:space-x-3 px-3 py-2.5 sm:px-5 sm:py-4 rounded-lg sm:rounded-xl ${
                isActive('/countries') 
                  ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Globe className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="font-medium text-base sm:text-lg">Countries</span>
            </Link>
            
            {user && (
              <Link 
                to="/favorites" 
                className={`flex items-center space-x-2 sm:space-x-3 px-3 py-2.5 sm:px-5 sm:py-4 rounded-lg sm:rounded-xl ${
                  isActive('/favorites') 
                    ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="font-medium text-base sm:text-lg">Favorites</span>
              </Link>
            )}
            
            {!user && (
              <Link
                to="/register"
                className="flex items-center space-x-2 sm:space-x-3 px-3 py-2.5 sm:px-5 sm:py-4 rounded-lg sm:rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 sm:hidden"
              >
                <span className="font-medium text-base sm:text-lg">Register</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;