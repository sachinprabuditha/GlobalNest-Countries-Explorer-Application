// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { Menu, X, Globe, Heart, Home, ChevronDown, Search } from 'lucide-react';

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
    <nav 
      className={`z-50 transition-all duration-500 fixed w-full ${
        scrolled 
          ? 'bg-white/100 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center text-white font-bold text-lg shadow-lg transition-transform group-hover:scale-110">
                <span className="bg-clip-text text-transparent bg-white">GN</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
                  Global<span className="text-gray-800 dark:text-white">Nest</span>
                </span>
                <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-300"></div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Centered Pills */}
          <div className="hidden md:flex items-center">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1 mx-auto">
              <div className="flex space-x-1">
                <Link 
                  to="/" 
                  className={`flex items-center space-x-1 px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive('/') 
                      ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-md' 
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                
                <Link 
                  to="/countries" 
                  className={`flex items-center space-x-1 px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive('/countries') 
                      ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-md' 
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  <span>Countries</span>
                </Link>
                
                {user && (
                  <Link 
                    to="/favorites" 
                    className={`flex items-center space-x-1 px-4 py-2 rounded-full transition-all duration-300 ${
                      isActive('/favorites') 
                        ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-md' 
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Heart className="h-4 w-4" />
                    <span>Favorites</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center">
                <div className="hidden md:flex items-center">
                  <div className="relative group">
                    <button className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1.5 hover:shadow-md transition-all duration-300">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center text-white font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{user.username}</span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100 dark:border-gray-800">
                      <button
                        onClick={handleLogout}
                        className="flex w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="md:hidden bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full font-medium transition-all hover:shadow-lg text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white px-5 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-lg text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-block border border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 text-gray-800 dark:text-white px-5 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-md text-sm"
                >
                  Register
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 focus:outline-none bg-gray-100 dark:bg-gray-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              onClick={toggleMenu}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu - slide down */}
      <div 
        className={`md:hidden transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
        style={{ position: 'absolute', width: '100%' }}
      >
        <div className="mt-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg p-4 rounded-b-2xl shadow-xl border-t dark:border-gray-800">
          <div className="space-y-2">
            <Link 
              to="/" 
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Home</span>
            </Link>
            
            <Link 
              to="/countries" 
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl ${
                isActive('/countries') 
                  ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Globe className="h-5 w-5" />
              <span className="font-medium">Countries</span>
            </Link>
            
            {user && (
              <Link 
                to="/favorites" 
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl ${
                  isActive('/favorites') 
                    ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Heart className="h-5 w-5" />
                <span className="font-medium">Favorites</span>
              </Link>
            )}
            
            {!user && (
              <Link
                to="/register"
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 sm:hidden"
              >
                <span className="font-medium">Register</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;