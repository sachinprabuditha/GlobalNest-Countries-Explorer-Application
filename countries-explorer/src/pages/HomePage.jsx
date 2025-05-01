import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sun, Moon, Search, Filter, Globe, Map, Users, ChevronDown, X, Compass, BookOpen, Layers } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchParams, setSearchParams] = useState({
    name: '',
    region: '',
    population: { min: '', max: '' },
    language: '',
    currency: ''
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    console.log('Auth state:', { user });
  }, [user]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSearchParamChange = (key, value) => {
    setSearchParams(prev => ({ ...prev, [key]: value }));
  };

  const handlePopulationChange = (key, value) => {
    setSearchParams(prev => ({
      ...prev,
      population: { ...prev.population, [key]: value }
    }));
  };

  const clearSearchFilters = () => {
    setSearchParams({
      name: '',
      region: '',
      population: { min: '', max: '' },
      language: '',
      currency: ''
    });
  };

  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  const languages = ['English', 'Spanish', 'French', 'Arabic', 'Chinese', 'Russian', 'Portuguese', 'German'];
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR', 'BRL', 'RUB'];

  const shouldHideSection = !!user;

  return (
    <div className="min-h-screen bg-gradient-to-br mt-20 from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section - Updated with curved design and interactive elements */}
        <section className="relative mb-16 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 to-green-400 dark:from-blue-700 dark:to-green-600 opacity-10 rounded-3xl"></div>
          
          {/* Decorative elements */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-green-300 dark:bg-green-700 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-blue-300 dark:bg-blue-700 rounded-full opacity-20 blur-3xl"></div>
          
          {/* Hero content */}
          <div className="text-center relative py-20 px-6">
            <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-600">
              Explore the World in One Place
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Discover information about countries around the globe with our interactive explorer.
            </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/countries" 
                  className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  <span className="flex items-center">
                    <Globe className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    Explore Countries
                  </span>
                </Link>
                <button 
                  onClick={() => setShowAdvancedSearch(!showAdvancedSearch)} 
                  className="group px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-50 flex items-center"
                >
                  <Compass className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400 group-hover:rotate-45 transition-transform duration-300" />
                  Find Your Destination
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-300 ${showAdvancedSearch ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Search Panel - Updated with card design */}
        {showAdvancedSearch && (
          <section className="mb-16 relative">
            <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-xl opacity-80 backdrop-blur-lg"></div>
            <div className="relative p-8 rounded-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Search className="w-6 h-6 mr-3 text-blue-500 dark:text-blue-400" />
                  Custom Country Search
                </h2>
                <button 
                  onClick={clearSearchFilters}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300 text-sm flex items-center transition-colors duration-200"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reset Filters
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pl-1">
                    Country Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchParams.name}
                      onChange={(e) => handleSearchParamChange('name', e.target.value)}
                      placeholder="Search by name..."
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-all duration-300"
                    />
                    <Search className="absolute right-4 top-4 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pl-1">
                    Region
                  </label>
                  <div className="relative">
                    <select
                      value={searchParams.region}
                      onChange={(e) => handleSearchParamChange('region', e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-all duration-300"
                    >
                      <option value="">Any region</option>
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                    <Globe className="absolute right-4 top-4 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pl-1">
                    Language
                  </label>
                  <div className="relative">
                    <select
                      value={searchParams.language}
                      onChange={(e) => handleSearchParamChange('language', e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-all duration-300"
                    >
                      <option value="">Any language</option>
                      {languages.map(language => (
                        <option key={language} value={language}>{language}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-4 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pl-1">
                    Currency
                  </label>
                  <div className="relative">
                    <select
                      value={searchParams.currency}
                      onChange={(e) => handleSearchParamChange('currency', e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-all duration-300"
                    >
                      <option value="">Any currency</option>
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-4 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                  </div>
                </div>
                
                <div className="md:col-span-2 lg:col-span-1 group">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pl-1">
                    Population Range
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={searchParams.population.min}
                        onChange={(e) => handlePopulationChange('min', e.target.value)}
                        placeholder="Min"
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-all duration-300"
                      />
                      <Users className="absolute right-4 top-4 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={searchParams.population.max}
                        onChange={(e) => handlePopulationChange('max', e.target.value)}
                        placeholder="Max"
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-all duration-300"
                      />
                      <Users className="absolute right-4 top-4 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <Link 
                  to={{
                    pathname: "/countries",
                    search: `?name=${searchParams.name}&region=${searchParams.region}&language=${searchParams.language}&currency=${searchParams.currency}&minPop=${searchParams.population.min}&maxPop=${searchParams.population.max}`
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-50 flex items-center"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Countries
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Main Content Sections - Redesigned with dynamic cards */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl opacity-90 transform group-hover:scale-105 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-black opacity-40 rounded-2xl"></div>
            <div className="relative p-8 text-white z-10">
              <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform duration-300">
                <Map className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">World Atlas</h2>
              <p className="mb-6 text-gray-100 leading-relaxed">
                Immerse yourself in a comprehensive database of countries with detailed information about capitals, 
                populations, languages, currencies, and cultural highlights. Our interactive atlas brings the world to your fingertips.
              </p>
              <Link 
                to="/countries" 
                className="inline-flex items-center text-white bg-white bg-opacity-20 hover:bg-opacity-30 px-5 py-2 rounded-lg backdrop-filter backdrop-blur-lg transition-all duration-300"
              >
                Explore Atlas
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl opacity-90 transform group-hover:scale-105 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-black opacity-40 rounded-2xl"></div>
            <div className="relative p-8 text-white z-10">
              <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform duration-300">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Your Favorites</h2>
              <p className="mb-6 text-gray-100 leading-relaxed">
                Create your own personalized collection of countries that fascinate you. Build a curated list
                of favorite destinations, research your ancestry, or plan your next adventure with our intuitive
                bookmarking system.
              </p>
              {!shouldHideSection ? (
                <Link 
                  to="/register" 
                  className="inline-flex items-center text-white bg-white bg-opacity-20 hover:bg-opacity-30 px-5 py-2 rounded-lg backdrop-filter backdrop-blur-lg transition-all duration-300"
                >
                  Create Account
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </Link>
              ) : (
                <Link 
                  to="/favorites" 
                  className="inline-flex items-center text-white bg-white bg-opacity-20 hover:bg-opacity-30 px-5 py-2 rounded-lg backdrop-filter backdrop-blur-lg transition-all duration-300"
                >
                  Your Favorites
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features Section - Reimagined with hexagonal design */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 dark:from-blue-400 dark:to-green-300">Discover The Experience</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl blur opacity-25 group-hover:opacity-70 transition duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 transition-all duration-300 transform group-hover:-translate-y-2">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform duration-300">
                  <Search className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-center text-gray-900 dark:text-white">Intelligent Search</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Find exactly what you're looking for with our powerful filtering system that adapts to your interests
                </p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-70 transition duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 transition-all duration-300 transform group-hover:-translate-y-2">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform duration-300">
                  <BarChart2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-center text-gray-900 dark:text-white">Visual Insights</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Understand global patterns through beautiful visualizations of demographics, economics, and cultural data
                </p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-70 transition duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 transition-all duration-300 transform group-hover:-translate-y-2">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform duration-300">
                  <Layers className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-center text-gray-900 dark:text-white">Customized View</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Organize information your way with personalized collections, custom filters, and adaptive layouts
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action - Reimagined with immersive design */}
        <section className="relative overflow-hidden rounded-3xl mb-8">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-green-500 dark:from-blue-800 dark:to-green-700"></div>
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="absolute top-0 right-0 w-full h-full">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 right-0 w-full h-full opacity-20">
              <path fill="white" d="M45.3,-54.1C59.9,-41.9,73.5,-28.7,77.2,-13.1C80.9,2.5,74.8,20.4,65.2,35.8C55.7,51.2,42.8,64.1,26.9,70.5C11.1,76.9,-7.6,76.8,-24.9,71.1C-42.2,65.3,-58.1,54,-67.2,39C-76.3,24,-78.5,5.2,-74.3,-11.7C-70.1,-28.6,-59.4,-43.8,-45.7,-55.8C-32,-67.7,-16,-76.5,-0.2,-76.2C15.5,-76,31.1,-66.8,45.3,-54.1Z" transform="translate(100 100)" />
            </svg>
          </div>
          
          {/* Content */}
          <div className="relative px-8 py-16 text-center">
            <h2 className="text-4xl font-extrabold mb-6 text-white">Begin Your Global Journey</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-white opacity-90">
              Uncover the stories, facts, and wonders of our planet's diverse nations
            </p>
            <Link 
              to="/countries" 
              className="inline-flex items-center px-10 py-5 bg-white text-blue-600 rounded-xl shadow-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <BookOpen className="w-6 h-6 mr-3 group-hover:animate-pulse" />
              Start Exploring
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

// These components are needed for the code to work
const Star = ({ className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );
};

const BarChart2 = ({ className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  );
};

export default HomePage;