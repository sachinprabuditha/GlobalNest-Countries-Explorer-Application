import { useState, useEffect } from 'react';

const CountryFilter = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [region, setRegion] = useState('');
  const [isAdvancedFilter, setIsAdvancedFilter] = useState(false);
  
  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onFilterChange({ searchTerm, region });
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, region, onFilterChange]);
  
  const handleReset = () => {
    setSearchTerm('');
    setRegion('');
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a country..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        <div className="md:w-64">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="block w-full py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "0.8em" }}
          >
            <option value="">Filter by Region</option>
            {regions.map((regionOption) => (
              <option key={regionOption} value={regionOption}>
                {regionOption}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            onClick={handleReset}
            className="w-full md:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
        
        <div className="md:ml-2">
          <button
            onClick={() => setIsAdvancedFilter(!isAdvancedFilter)}
            className="w-full md:w-auto px-6 py-3 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/40 text-green-700 dark:text-green-300 rounded-lg transition-colors flex items-center justify-center"
          >
            <span>Advanced</span>
            <svg 
              className={`ml-2 h-4 w-4 transition-transform ${isAdvancedFilter ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      {isAdvancedFilter && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Population
            </label>
            <div className="flex items-center space-x-2">
              <select className="block w-full py-2 px-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option>Any population</option>
                <option>&lt; 1 million</option>
                <option>1-10 million</option>
                <option>10-100 million</option>
                <option>&gt; 100 million</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Languages
            </label>
            <select className="block w-full py-2 px-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option>Any language</option>
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>Arabic</option>
              <option>Chinese</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort By
            </label>
            <select className="block w-full py-2 px-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option>Name (A-Z)</option>
              <option>Name (Z-A)</option>
              <option>Population (High-Low)</option>
              <option>Population (Low-High)</option>
              <option>Area (Large-Small)</option>
              <option>Area (Small-Large)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryFilter;