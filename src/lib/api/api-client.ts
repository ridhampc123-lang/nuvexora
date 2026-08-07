import axios from "axios";

export const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    const { hostname, protocol } = window.location;

    // 1. Localhost development
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000/api/v1";
    }

    // 2. Mobile device connected on local LAN IP (e.g. 192.168.x.x)
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      return `http://${hostname}:5000/api/v1`;
    }

    // 3. Deployed production web (Vercel, custom domain with HTTPS)
    // Relative /api/v1 prevents Mixed Content errors on mobile browsers
    if (protocol === "https:") {
      return "/api/v1";
    }

    return `http://${hostname}:5000/api/v1`;
  }
  return "http://localhost:5000/api/v1";
};

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Access Token and resolve dynamic baseURL
apiClient.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl();
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("nuvexora_access_token") ||
        localStorage.getItem("nuvexora_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto-rotate token on 401 Unauthorized
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${getApiBaseUrl()}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.data.accessToken;
        if (typeof window !== "undefined") {
          localStorage.setItem("nuvexora_access_token", newAccessToken);
          localStorage.setItem("nuvexora_token", newAccessToken);
        }

        apiClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("nuvexora_access_token");
          localStorage.removeItem("nuvexora_token");
          localStorage.removeItem("nuvexora_user");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
