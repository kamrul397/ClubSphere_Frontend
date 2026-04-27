import axios from "axios";
import React, { useEffect } from "react";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
});

const useAxiosSecure = () => {
  const { user } = useAuth();
  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        // Add any secure headers or authentication logic here
        config.headers.Authorization = `Bearer ${user?.accessToken}`;
        return config;
      },
    );
    // intercept the response to handle errors or refresh tokens if needed
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          // Handle unauthorized errors, e.g., redirect to login or refresh token
          console.error("Unauthorized! Please log in again.");
          return Promise.reject(error);
        }
      },
    );
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user]);
  return axiosSecure;
};

export default useAxiosSecure;
