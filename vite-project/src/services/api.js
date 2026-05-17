import axios from "axios";

const api = axios.create({
  baseURL: "https://fluxo-caixa-back.onrender.com"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN ENVIADO:", token);

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    };
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("ERRO API:", error.response?.data);

    return Promise.reject(error);
  }
);

export default api;