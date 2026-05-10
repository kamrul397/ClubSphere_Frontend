import axios from "axios";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Replace with your backend API URL
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
