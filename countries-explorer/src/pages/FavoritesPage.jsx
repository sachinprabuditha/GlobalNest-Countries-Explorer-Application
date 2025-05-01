// src/pages/FavoritesPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCountriesByCodes } from '../services/countriesApi';
import CountryCard from '../components/CountryCard';
import { Heart, Globe, Loader, AlertTriangle, ArrowRight } from 'lucide-react';

const FavoritesPage = () => {
  const { user } = useAuth();
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchFavoriteCountries = async () => {
      if (!user?.favoriteCountries?.length) {
        setFavoriteCountries([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const countries = await getCountriesByCodes(user.favoriteCountries);
        setFavoriteCountries(countries);
      } catch (err) {
        setError('Failed to fetch favorite countries. Please try again later.');
        console.error('Error fetching favorite countries:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavoriteCountries();
  }, [user]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-20 mt-16">
        <div className="flex flex-col justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <Loader className="h-12 w-12 text-green-500 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading your favorite countries...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-20 mt-16">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 mr-2" />
            <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">Error</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-5 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-md transition-colors font-medium flex items-center"
          >
            <span>Retry</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-16 md:py-20 mt-16">
      <div className="mb-8 flex items-center">
        <Heart className="h-8 w-8 text-red-500 mr-3" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Your Favorite Countries</h1>
      </div>
      
      {favoriteCountries.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-8 text-center">
            <div className="inline-flex justify-center items-center w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-6">
              <Globe className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">No favorites yet</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6">
              You haven't added any countries to your favorites yet. Explore our collection and add countries you're interested in!
            </p>
            <Link 
              to="/countries" 
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-md transition-colors font-medium"
            >
              <Globe className="mr-2 h-5 w-5" />
              <span>Explore Countries</span>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              {favoriteCountries.length} {favoriteCountries.length === 1 ? 'country' : 'countries'} in your collection
            </p>
            <Link 
              to="/countries" 
              className="text-green-600 dark:text-green-400 hover:underline flex items-center"
            >
              <span>Explore more</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteCountries.map(country => (
              <CountryCard key={country.cca3} country={country} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;