import axios from "axios";

// Default backend endpoint is http://localhost:4000 without /api suffix based on NestJS controller mappings
const RAW_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const API_BASE_URL = RAW_URL.replace(/\/api\/?$/, "");

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized on protected routes, wipe token and signal re-auth
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      !error.config?.url?.includes("/auth/login")
    ) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    }
    return Promise.reject(error);
  }
);

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface AdminProfileResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string | null;
  phone?: string | null;
  lastLoginAt?: string | null;
  emailVerified?: boolean;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>("/auth/login", payload);
    return res.data;
  },
  getProfile: async (): Promise<AdminProfileResponse> => {
    const res = await apiClient.get<AdminProfileResponse>("/user/me");
    return res.data;
  },
};

export const analyticsApi = {
  getAdminOverview: async () => {
    const res = await apiClient.get("/analytics/admin");
    return res.data;
  },
};

export const ordersApi = {
  getAll: async () => {
    const res = await apiClient.get("/orders/all");
    return res.data;
  },
};

export const coursesApi = {
  getAll: async () => {
    const res = await apiClient.get("/courses");
    return res.data;
  },
  create: async (data: any) => {
    const res = await apiClient.post("/courses", data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete(`/courses/${id}`);
    return res.data;
  },
};

export const categoriesApi = {
  getAll: async () => {
    const res = await apiClient.get("/categories");
    return res.data;
  },
};

export const aiApi = {
  generateCourseOutline: async (payload: { title: string; description?: string; level?: string }) => {
    const res = await apiClient.post("/ai/generate-course-outline", payload);
    return res.data;
  },
};


