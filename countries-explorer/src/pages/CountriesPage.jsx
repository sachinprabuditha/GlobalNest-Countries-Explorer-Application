import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Globe, Loader, RefreshCw, Users, X, Filter, SlidersHorizontal, ArrowUp, ArrowDown, Map } from 'lucide-react';
import CountryCard from '../components/CountryCard';
import { getAllCountries } from '../services/countriesApi';

const CountriesPage = () => {
  const location = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(queryParams.get('name') || '');
  const [region, setRegion] = useState(queryParams.get('region') || '');
  const [language, setLanguage] = useState(queryParams.get('language') || '');
  const [currency, setCurrency] = useState(queryParams.get('currency') || '');
  const [population, setPopulation] = useState({
    min: queryParams.get('minPop') || '',
    max: queryParams.get('maxPop') || ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Determine if we should show advanced filters based on URL params
  useEffect(() => {
    const hasAdvancedFilters = queryParams.get('language') || 
                              queryParams.get('currency') || 
                              queryParams.get('minPop') || 
                              queryParams.get('maxPop');
    
    setShowAdvancedFilters(!!hasAdvancedFilters);
  }, [queryParams]);
  
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await getAllCountries();
        setCountries(data);
        setFilteredCountries(data);
      } catch (err) {
        setError('Failed to fetch countries. Please try again later.');
        console.error('Error fetching countries:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCountries();
  }, []);
  
  // Rest of your filtering logic remains the same
  const handleFilterChange = useCallback(() => {
    // Your existing filter logic
    let filtered = [...countries];
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(country => 
        country.name.common.toLowerCase().includes(search) ||
        (country.name.official && country.name.official.toLowerCase().includes(search))
      );
    }
    
    // Filter by region
    if (region) {
      filtered = filtered.filter(country => country.region === region);
    }
    
    // Filter by language
    if (language) {
      filtered = filtered.filter(country => {
        if (!country.languages) return false;
        return Object.values(country.languages).some(
          lang => lang.toLowerCase().includes(language.toLowerCase())
        );
      });
    }
    
    // Filter by currency
    if (currency) {
      filtered = filtered.filter(country => {
        if (!country.currencies) return false;
        return Object.keys(country.currencies).some(
          curr => curr.toLowerCase().includes(currency.toLowerCase())
        );
      });
    }
    
    // Filter by population range
    if (population.min) {
      filtered = filtered.filter(country => 
        country.population >= parseInt(population.min)
      );
    }
    
    if (population.max) {
      filtered = filtered.filter(country => 
        country.population <= parseInt(population.max)
      );
    }
    
    // Apply sorting if configured
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        
        if (sortConfig.key === 'name') {
          aValue = a.name.common.toLowerCase();
          bValue = b.name.common.toLowerCase();
        } else if (sortConfig.key === 'population') {
          aValue = a.population;
          bValue = b.population;
        } else if (sortConfig.key === 'area') {
          aValue = a.area || 0;
          bValue = b.area || 0;
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredCountries(filtered);
  }, [countries, searchTerm, region, language, currency, population, sortConfig]);
  
  useEffect(() => {
    handleFilterChange();
  }, [handleFilterChange]);
  
  const clearAllFilters = () => {
    setSearchTerm('');
    setRegion('');
    setLanguage('');
    setCurrency('');
    setPopulation({ min: '', max: '' });
    setSortConfig({ key: null, direction: 'asc' });
  };
  
  const handleSortChange = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  const languages = ['English', 'French', 'Spanish', 'Arabic', 'Portuguese', 'Russian', 'Chinese', 'German', 'Japanese'];
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'AUD', 'CAD', 'CHF', 'INR', 'BRL'];
  
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br mt-20 from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col items-center">
          <div className="relative">
            <Globe className="w-16 h-16 text-green-400 opacity-30 animate-pulse" />
            <Loader className="w-16 h-16 text-blue-500 animate-spin absolute top-0" />
          </div>
          <p className="mt-6 text-lg font-medium bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
            Exploring the world...
          </p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-red-900">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 max-w-md transform hover:scale-105 transition-transform duration-300">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900 mb-6">
            <svg className="w-10 h-10 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-400 bg-clip-text text-transparent mb-4">Expedition Halted</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Resume Expedition
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br mt-20 from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 p-6 md:p-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <header className="relative mb-16 text-center py-10">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-500 opacity-5 rounded-3xl -rotate-1"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-green-500 opacity-5 rounded-3xl rotate-1"></div>
          <Map className="inline-block w-10 h-10 text-green-500 mb-2" />
          <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
            GlobalNest World Explorer
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Embark on a virtual journey to discover fascinating details about every nation
          </p>
        </header>
        
        {/* Basic Filters */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 transform hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-70">
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-green-400 rounded-2xl -z-10 opacity-50 animate-pulse"></div>
          <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a country..."
                className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
              />
            </div>
            
            <div className="md:w-64 w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="block w-full pl-12 pr-10 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                >
                  <option value="">All Regions</option>
                  {regions.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="md:w-auto w-full px-5 py-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-green-500 transform hover:-translate-y-1 transition-all duration-300"
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>Advanced Filters</span>
            </button>
          </div>
          
          {/* Sorting Options */}
          <div className="flex flex-wrap gap-3 mt-3">
            <button 
              onClick={() => handleSortChange('name')}
              className={`px-4 py-2 text-sm flex items-center gap-1 rounded-xl shadow-sm transition-all duration-200 ${
                sortConfig.key === 'name' 
                  ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              Name
              {sortConfig.key === 'name' && (
                sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
              )}
            </button>
            <button 
              onClick={() => handleSortChange('population')}
              className={`px-4 py-2 text-sm flex items-center gap-1 rounded-xl shadow-sm transition-all duration-200 ${
                sortConfig.key === 'population' 
                  ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              Population
              {sortConfig.key === 'population' && (
                sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
              )}
            </button>
            <button 
              onClick={() => handleSortChange('area')}
              className={`px-4 py-2 text-sm flex items-center gap-1 rounded-xl shadow-sm transition-all duration-200 ${
                sortConfig.key === 'area' 
                  ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              Area
              {sortConfig.key === 'area' && (
                sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-10 transform hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-70 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent flex items-center">
                <Filter className="w-5 h-5 mr-2 text-blue-500" />
                Advanced Discovery Tools
              </h2>
              <button 
                onClick={clearAllFilters}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm flex items-center border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-hover:text-green-500 transition-colors duration-200">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                >
                  <option value="">Any language</option>
                  {languages.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-hover:text-green-500 transition-colors duration-200">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                >
                  <option value="">Any currency</option>
                  {currencies.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2 lg:col-span-1 group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-hover:text-green-500 transition-colors duration-200">
                  Population Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={population.min}
                      onChange={(e) => setPopulation({...population, min: e.target.value})}
                      placeholder="Minimum"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    />
                    <Users className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={population.max}
                      onChange={(e) => setPopulation({...population, max: e.target.value})}
                      placeholder="Maximum"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    />
                    <Users className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Results Summary */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md backdrop-blur-sm bg-opacity-80 dark:bg-opacity-70">
          <div className="text-lg text-gray-700 dark:text-gray-300 font-medium">
            <span className="font-bold text-green-600 dark:text-green-400">{filteredCountries.length}</span> {filteredCountries.length === 1 ? 'country' : 'countries'} discovered
          </div>
          
          {/* Active Filters Pills */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            {searchTerm && (
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm px-4 py-2 rounded-full flex items-center shadow-sm">
                <span className="mr-2">"{searchTerm}"</span>
                <button onClick={() => setSearchTerm('')} className="hover:bg-green-600 hover:bg-opacity-50 rounded-full p-1">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {region && (
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm px-4 py-2 rounded-full flex items-center shadow-sm">
                <span className="mr-2">{region}</span>
                <button onClick={() => setRegion('')} className="hover:bg-green-600 hover:bg-opacity-50 rounded-full p-1">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {language && (
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm px-4 py-2 rounded-full flex items-center shadow-sm">
                <span className="mr-2">{language}</span>
                <button onClick={() => setLanguage('')} className="hover:bg-purple-600 hover:bg-opacity-50 rounded-full p-1">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {currency && (
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-sm px-4 py-2 rounded-full flex items-center shadow-sm">
                <span className="mr-2">{currency}</span>
                <button onClick={() => setCurrency('')} className="hover:bg-yellow-600 hover:bg-opacity-50 rounded-full p-1">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {(population.min || population.max) && (
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm px-4 py-2 rounded-full flex items-center shadow-sm">
                <span className="mr-2">Pop: {population.min || '0'}-{population.max || '∞'}</span>
                <button onClick={() => setPopulation({min: '', max: ''})} className="hover:bg-red-600 hover:bg-opacity-50 rounded-full p-1">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Results */}
        {filteredCountries.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 text-center transition-all duration-300 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-70">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-green-400 mb-6 animate-pulse">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent mb-4">No Destinations Found</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-lg mx-auto mb-8">
              Your current search filters didn't match any countries. Adjust your expedition parameters to continue exploring.
            </p>
            <button 
              onClick={clearAllFilters} 
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Reset Exploration
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCountries.map(country => (
              <CountryCard key={country.cca3} country={country} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CountriesPage;