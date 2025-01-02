import axios from "axios";

const api = axios.create({
  baseURL: 'http://192.168.8.103:6300',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});


// baseURL: import.meta.env.VITE_API_URL || 'http://localhost:6300',

// api.interceptors.request.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       switch (error.response.status) {
//         case 401:
//           break
//       }
//     }
//
//     return Promise.reject(error)
//   }
// );

export default api;
