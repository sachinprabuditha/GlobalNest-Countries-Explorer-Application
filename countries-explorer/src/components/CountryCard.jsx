import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CountryCard = ({ country }) => {
  const { user, addFavoriteCountry, removeFavoriteCountry } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const isFavorite = user?.favoriteCountries?.includes(country.cca3);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setIsLoading(true);
      if (isFavorite) {
        await removeFavoriteCountry(country.cca3);
      } else {
        await addFavoriteCountry(country.cca3);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPopulation = (population) => {
    if (population >= 1000000000) {
      return (population / 1000000000).toFixed(1) + 'B';
    } else if (population >= 1000000) {
      return (population / 1000000).toFixed(1) + 'M';
    } else if (population >= 1000) {
      return (population / 1000).toFixed(1) + 'K';
    }
    return population.toLocaleString();
  };

  return (
    <Link 
      to={`/countries/${country.cca3}`}
      className="block h-full transform transition duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={country.flags?.svg || country.flags?.png} 
            alt={`Flag of ${country.name.common}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
          {user && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                handleFavoriteToggle(e);
              }}
              disabled={isLoading}
              className={`absolute top-3 right-3 p-2 rounded-full 
                ${isFavorite 
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-500' 
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-500 hover:text-yellow-500'}
                backdrop-blur-sm shadow-md transform transition-all duration-200 
                ${isLoading ? 'opacity-50' : 'hover:scale-110'}`}
            >
              <Star className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
        
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-1">
            {country.name.common}
          </h3>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-4">
            <MapPin className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
            <span className="truncate font-medium">{country.capital?.[0] || 'No capital'}</span>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs font-medium px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-full">
              {country.region}
            </span>
            
            <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Users className="h-4 w-4 mr-1.5 text-green-500 dark:text-green-400" />
              <span>{formatPopulation(country.population)}</span>
            </div>
          </div>
        </div>
        
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-white-400/90 to-black/60 flex items-center justify-center transition-opacity duration-300 opacity-90">
            <div className="text-black dark:text-white text-center px-6 transform translate-y-2 hover:translate-y-0 transition duration-300">
              <p className="font-semibold text-lg mb-1">View {country.name.common}</p>
              <p className="text-green-400 dark:text-green-200 text-sm">Click for more details</p>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default CountryCard;
