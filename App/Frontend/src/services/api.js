import axios from "axios";


// Backend API URL
// Change this based on your environment

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080/api";



const api = axios.create({

  baseURL: API_BASE_URL,

  timeout: 10000,

  headers: {

    "Content-Type": "application/json",

  },

});




// Request interceptor

api.interceptors.request.use(

  (config) => {


    const token =
      localStorage.getItem("token");


    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }


    return config;


  },


  (error) => {

    return Promise.reject(error);

  }

);




// Response interceptor

api.interceptors.response.use(


  (response) => {

    return response;

  },


  (error) => {


    if (error.response) {


      const status =
        error.response.status;



      switch(status) {


        case 401:

          console.error(
            "Unauthorized request"
          );

          break;



        case 403:

          console.error(
            "Access forbidden"
          );

          break;



        case 500:

          console.error(
            "Server error"
          );

          break;



        default:

          console.error(
            "API Error:",
            error.message
          );


      }


    }


    return Promise.reject(error);


  }

);





// Common API methods

export const get = (url, params = {}) => {

  return api.get(url, { params });

};



export const post = (url, data = {}) => {

  return api.post(url, data);

};



export const put = (url, data = {}) => {

  return api.put(url, data);

};



export const remove = (url) => {

  return api.delete(url);

};



export default api;
