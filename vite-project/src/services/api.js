import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://fluxo-caixa-back.onrender.com"
});

// adiciona token automaticamente
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

    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;