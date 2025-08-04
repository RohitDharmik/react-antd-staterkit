import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });
export default api;
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for handling errors globally
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access, e.g., redirect to login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// // give me exampple of how to use this api.js file in a component
// import React, { useEffect, useState } from 'react';
// import api from '../services/api';
// const ExampleComponent = () => {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await api.get('/endpoint'); // replace '/endpoint' with your API endpoint
//         setData(response.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       {data ? (
//         <pre>{JSON.stringify(data, null, 2)}</pre>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };
// export default ExampleComponent;