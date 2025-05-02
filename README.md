# Countries App

A React application that displays information about countries using the REST Countries API.

## Features
- View all countries
- Search countries by name
- Filter by region
- View detailed country information
- (Optional) User authentication and favorites

## Technologies Used
- Vite React
- React Router
- Axios
- Tailwind CSS
- REST Countries API
- MongoDB

## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Run the app (Back end): `npm start`
4. Run the app (Front end): `npm run dev`

## API Endpoints Used
- GET /all
- GET /name/{name}
- GET /region/{region}
- GET /alpha/{code}

## Live Demo
https://global-nest-countries-explorer-application-eggh.vercel.app/

## Challenges and Solutions
- Challenge: Handling API rate limits
  Solution: Implemented client-side caching of responses
- Challenge: Responsive design for country cards
  Solution: Used CSS Grid with Tailwind's responsive modifiers