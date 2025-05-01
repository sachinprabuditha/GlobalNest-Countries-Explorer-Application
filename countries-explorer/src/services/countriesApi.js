// src/services/countriesApi.js
import axios from 'axios';

const API_BASE_URL = 'https://restcountries.com/v3.1';

// Get all countries
export const getAllCountries = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all countries:', error);
    throw error;
  }
};

// Get country by name
export const getCountryByName = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/name/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching country by name (${name}):`, error);
    throw error;
  }
};

// Get countries by region
export const getCountriesByRegion = async (region) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/region/${region}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching countries by region (${region}):`, error);
    throw error;
  }
};

// Get country by code
export const getCountryByCode = async (code) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/alpha/${code}`);
    return response.data[0]; // API returns an array with a single object
  } catch (error) {
    console.error(`Error fetching country by code (${code}):`, error);
    throw error;
  }
};

// Get countries by codes (for favorites)
export const getCountriesByCodes = async (codes) => {
  if (!codes || codes.length === 0) return [];
  
  try {
    const codesString = codes.join(',');
    const response = await axios.get(`${API_BASE_URL}/alpha?codes=${codesString}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching countries by codes:`, error);
    throw error;
  }
};