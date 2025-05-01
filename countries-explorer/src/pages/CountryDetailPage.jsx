import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCountryByCode } from '../services/countriesApi';
import { useAuth } from '../contexts/AuthContext';
import { Map, Star, Globe, Info, Map as MapIcon, ArrowLeft, Loader, AlertTriangle, Flag, Users, Briefcase, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const CountryDetailPage = () => {
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const { user, addFavoriteCountry, removeFavoriteCountry } = useAuth();
  
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const isFavorite = user?.favoriteCountries?.includes(countryCode);
  
  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        setLoading(true);
        const data = await getCountryByCode(countryCode);
        setCountry(data);
      } catch (err) {
        setError('Failed to fetch country details. Please try again later.');
        console.error('Error fetching country:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCountryData();
  }, [countryCode]);
  
  const handleFavoriteToggle = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/country/${countryCode}` } });
      return;
    }
    
    try {
      if (isFavorite) {
        await removeFavoriteCountry(countryCode);
      } else {
        await addFavoriteCountry(countryCode);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 mt-20">
        <div className="flex flex-col justify-center items-center h-96 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-lg">
          <div className="relative">
            <Loader className="w-16 h-16 text-green-500 animate-spin mb-4" />
            <div className="absolute inset-0 animate-ping opacity-30">
              <Globe className="w-16 h-16 text-blue-400" />
            </div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">Discovering country...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Please wait while we gather the information</p>
        </div>
      </div>
    );
  }
  
  if (error || !country) {
    return (
      <div className="container mx-auto px-4 py-12 mt-16">
        <div className="text-center p-8 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-red-900/10 rounded-2xl shadow-lg border border-red-100 dark:border-red-800">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <AlertTriangle className="w-16 h-16 text-red-500" />
              <div className="absolute -inset-1 blur-sm opacity-30">
                <AlertTriangle className="w-18 h-18 text-red-400" />
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">Country Not Found</h3>
          <p className="text-red-600 dark:text-red-300 mb-6">{error || 'The requested country could not be found or loaded.'}</p>
          <Link 
            to="/countries" 
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Countries
          </Link>
        </div>
      </div>
    );
  }
  
  // Extract languages as array
  const languages = country.languages ? Object.values(country.languages) : [];
  
  // Extract currencies as array
  const currencies = country.currencies 
    ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol || ''})`) 
    : [];
  
  // Format population with commas
  const formattedPopulation = country.population?.toLocaleString() || 'N/A';
  
  // Format area with commas and km²
  const formattedArea = country.area ? `${country.area.toLocaleString()} km²` : 'N/A';
  
  // Setup map coordinates
  const mapPosition = country.latlng || [0, 0];
  const mapZoom = 4;
  
  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-16">
      <div className="mb-8 flex justify-between items-center">
        <Link 
          to="/countries" 
          className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Countries
        </Link>
        
        {user && (
          <button 
            onClick={handleFavoriteToggle}
            className={`inline-flex items-center px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all ${
              isFavorite 
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white hover:from-yellow-500 hover:to-amber-600 dark:from-yellow-600 dark:to-amber-700' 
                : 'bg-gradient-to-r from-white to-gray-100 text-gray-700 border border-gray-200 hover:from-gray-100 hover:to-gray-200 dark:from-gray-800 dark:to-gray-900 dark:text-gray-300 dark:border-gray-700'
            }`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star 
              className={`h-5 w-5 ${isFavorite ? 'text-white fill-white' : 'text-gray-400 dark:text-gray-500'} mr-2`}
            />
            {isFavorite ? "Saved to Favorites" : "Add to Favorites"}
          </button>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-10">
        <div className="relative">
          <div className="w-full h-72 md:h-96 lg:h-[28rem] overflow-hidden bg-gray-200 dark:bg-gray-700">
            <img 
              src={country.flags?.svg || country.flags?.png} 
              alt={`Flag of ${country.name.common}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent mix-blend-multiply"></div>
          </div>
          
          <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 mr-3 rounded-full overflow-hidden border-4 border-white/30">
                <img 
                  src={country.flags?.svg || country.flags?.png} 
                  alt={`Flag of ${country.name.common}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="uppercase tracking-wide text-yellow-300 font-medium">
                {country.cca3} • {country.region}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-2 drop-shadow-lg">
              {country.name.common}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 drop-shadow-md flex items-center">
              <MapIcon className="h-5 w-5 mr-2" />
              {country.capital?.[0] || 'No capital'} 
              {country.subregion && <span className="ml-2">• {country.subregion}</span>}
            </p>
          </div>
        </div>
        
        <div className="p-8 md:p-12">
          <div className="flex flex-wrap gap-4 border-b border-gray-200 dark:border-gray-700 mb-8 pb-2">
            {[
              { id: 'overview', icon: <Globe className="h-5 w-5" />, label: 'Overview' },
              { id: 'details', icon: <Info className="h-5 w-5" />, label: 'Details' },
              ...(country.borders && country.borders.length > 0 ? [
                { id: 'borders', icon: <MapIcon className="h-5 w-5" />, label: 'Neighbors' }
              ] : [])
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 font-medium text-sm md:text-base transition-all rounded-xl flex items-center gap-2
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
          
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {country.name.official !== country.name.common && (
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl">
                  <h3 className="text-xl font-semibold mb-2 text-green-800 dark:text-green-300">Official Name</h3>
                  <p className="text-green-700 dark:text-green-100 text-lg font-medium">{country.name.official}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                  icon={<Flag className="h-6 w-6 text-white" />}
                  title="Capital" 
                  value={country.capital?.[0] || 'N/A'} 
                  gradient="from-purple-500 to-indigo-600"
                />
                
                <StatCard 
                  icon={<Users className="h-6 w-6 text-white" />}
                  title="Population" 
                  value={formattedPopulation} 
                  gradient="from-emerald-400 to-green-800"
                />
                
                <StatCard 
                  icon={<Globe className="h-6 w-6 text-white" />}
                  title="Region" 
                  value={`${country.region}${country.subregion ? ` (${country.subregion})` : ''}`} 
                  gradient="from-amber-500 to-orange-600"
                />
                
                <StatCard 
                  icon={<MapIcon className="h-6 w-6 text-white" />}
                  title="Area" 
                  value={formattedArea} 
                  gradient="from-blue-500 to-cyan-600"
                />
                
                <StatCard 
                  icon={<Globe className="h-6 w-6 text-white" />}
                  title="Top Level Domain" 
                  value={country.tld?.[0] || 'N/A'} 
                  gradient="from-pink-500 to-rose-600"
                />
                
                <StatCard 
                  icon={<Briefcase className="h-6 w-6 text-white" />}
                  title="Alpha Codes" 
                  value={`${country.cca2}, ${country.cca3}`} 
                  gradient="from-blue-500 to-blue-900"
                />
              </div>
            </div>
          )}
          
          {activeTab === 'details' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-6 text-emerald-800 dark:text-emerald-300 flex items-center">
                    <span className="inline-block mr-3 p-2 bg-emerald-600 rounded-lg text-white">
                      <Globe className="h-5 w-5" />
                    </span>
                    Languages
                  </h3>
                  {languages.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {languages.map(language => (
                        <span 
                          key={language} 
                          className="px-4 py-2 bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm shadow-sm border border-emerald-100 dark:border-emerald-800/50"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No language information available</p>
                  )}
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-8 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-6 text-amber-800 dark:text-amber-300 flex items-center">
                    <span className="inline-block mr-3 p-2 bg-amber-600 rounded-lg text-white">
                      <Briefcase className="h-5 w-5" />
                    </span>
                    Currencies
                  </h3>
                  {currencies.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {currencies.map(currency => (
                        <span 
                          key={currency} 
                          className="px-4 py-2 bg-white dark:bg-gray-800 text-amber-700 dark:text-amber-300 rounded-xl text-sm shadow-sm border border-amber-100 dark:border-amber-800/50"
                        >
                          {currency}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No currency information available</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {country.timezones && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-semibold mb-6 text-blue-800 dark:text-blue-300 flex items-center">
                      <span className="inline-block mr-3 p-2 bg-blue-600 rounded-lg text-white">
                        <Clock className="h-5 w-5" />
                      </span>
                      Timezones
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {country.timezones.map(timezone => (
                        <span 
                          key={timezone} 
                          className="px-4 py-2 bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 rounded-xl text-sm shadow-sm border border-blue-100 dark:border-blue-800/50"
                        >
                          {timezone}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-8 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-6 text-purple-800 dark:text-purple-300 flex items-center">
                    <span className="inline-block mr-3 p-2 bg-purple-600 rounded-lg text-white">
                      <Info className="h-5 w-5" />
                    </span>
                    Additional Info
                  </h3>
                  <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="inline-block p-1.5 rounded-full bg-purple-100 dark:bg-purple-800/30"></span>
                      <strong>Independent:</strong> {country.independent ? 'Yes' : 'No'}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="inline-block p-1.5 rounded-full bg-purple-100 dark:bg-purple-800/30"></span>
                      <strong>UN Member:</strong> {country.unMember ? 'Yes' : 'No'}
                    </li>
                    {country.gini && Object.keys(country.gini).length > 0 && (
                      <li className="flex items-center gap-2">
                        <span className="inline-block p-1.5 rounded-full bg-purple-100 dark:bg-purple-800/30"></span>
                        <strong>Gini Index:</strong> {Object.entries(country.gini).map(([year, value]) => (
                          `${value}% (${year})`
                        )).join(', ')}
                      </li>
                    )}
                    {country.car?.side && (
                      <li className="flex items-center gap-2">
                        <span className="inline-block p-1.5 rounded-full bg-purple-100 dark:bg-purple-800/30"></span>
                        <strong>Driving Side:</strong> {country.car.side}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'borders' && country.borders && country.borders.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 flex items-center">
                <span className="inline-block mr-3 p-2 bg-gradient-to-r from-teal-500 to-green-500 rounded-lg text-white">
                  <MapIcon className="h-5 w-5" />
                </span>
                Neighboring Countries
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {country.borders.map(border => (
                  <Link 
                    key={border} 
                    to={`/country/${border}`}
                    className="group block bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 rounded-2xl text-center transition-all border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl"
                  >
                    <div className="inline-block p-3 rounded-full bg-green-100 dark:bg-green-900/30 group-hover:bg-green-500 dark:group-hover:bg-green-600 transition-colors mb-3">
                      <Flag className="h-5 w-5 text-green-600 dark:text-green-400 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-gray-800 dark:text-gray-200 font-bold text-xl">{border}</div>
                    <div className="text-sm text-green-600 dark:text-green-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">View Details</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Enhanced map with Leaflet */}
      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-xl overflow-hidden p-8">
        <h2 className="flex items-center text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
          <span className="inline-block mr-3 p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white">
            <Map className="h-5 w-5" />
          </span>
          Geographic Location
        </h2>
        
        {country.latlng && (
          <div className="aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
            <LeafletMap position={mapPosition} zoom={mapZoom} country={country} />
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Leaflet Map Component
const LeafletMap = ({ position, zoom, country }) => {
  useEffect(() => {
    // Dynamically import leaflet for client-side only
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  return (
    <MapContainer 
      center={position} 
      zoom={zoom} 
      style={{ height: "100%", width: "100%" }}
      attributionControl={true}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          <div className="text-center p-1">
            <strong className="text-lg">{country.name.common}</strong><br />
            {country.capital && <span className="text-sm">{country.capital[0]}</span>}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

// Enhanced Statistics Card Component
const StatCard = ({ icon, title, value, gradient }) => {
  return (
    <div className="overflow-hidden rounded-2xl shadow-lg relative group">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`}></div>
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
      
      <div className="relative p-6 text-white">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-white/20 rounded-xl mb-4">
            {icon}
          </div>
          <div className="text-5xl font-bold opacity-20">
            {title.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default CountryDetailPage;