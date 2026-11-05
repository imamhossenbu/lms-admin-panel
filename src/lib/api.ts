import axios from "axios";

// Default backend endpoint is http://localhost:4000 without /api suffix based on NestJS controller mappings
const RAW_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const API_BASE_URL = RAW_URL.replace(/\/api\/?$/, "");

/** Fired when the API answers 403 TWO_FACTOR_SETUP_REQUIRED (handled by AuthGuard). */
export const TWO_FACTOR_REQUIRED_EVENT = "edupro:two-factor-setup-required";

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

/** One-time message the sign-in page shows (e.g. why the session ended). */
export const LOGIN_NOTICE_KEY = "edupro_login_notice";

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
      // Settings › Security › Session timeout: say why on the sign-in page.
      const message = String(error.response?.data?.message ?? "");
      if (/inactivity/i.test(message) && window.location.pathname !== "/login") {
        sessionStorage.setItem(LOGIN_NOTICE_KEY, message);
        window.location.assign("/login");
      }
    }
    // Settings › Maintenance: this account can't use the panel while maintenance mode is on.
    if (typeof window !== "undefined" && error.response?.status === 503 && error.response?.data?.code === "MAINTENANCE" && !error.config?.url?.includes("/auth/login")) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      sessionStorage.setItem(LOGIN_NOTICE_KEY, String(error.response.data.message ?? "We're doing some maintenance."));
      if (window.location.pathname !== "/login") window.location.assign("/login");
    }
    // Workspace requires admin 2FA and this account hasn't set it up: AuthGuard sends the user to setup.
    if (typeof window !== "undefined" && error.response?.status === 403 && error.response?.data?.code === "TWO_FACTOR_SETUP_REQUIRED") {
      window.dispatchEvent(new Event(TWO_FACTOR_REQUIRED_EVENT));
    }
    return Promise.reject(error);
  }
);

export interface LoginPayload {
  email: string;
  password: string;
}

/** Password step: either a session token, or a 2FA challenge to finish with POST /auth/2fa/login. */
export type LoginResponse =
  | { token: string; twoFactorSetupRequired?: boolean; twoFactorRequired?: undefined }
  | { twoFactorRequired: true; challengeToken: string; token?: undefined };

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
  /** Second sign-in step for accounts with 2FA. */
  twoFactorLogin: async (challengeToken: string, code: string): Promise<{ token: string; twoFactorSetupRequired?: boolean }> => {
    const res = await apiClient.post("/auth/2fa/login", { challengeToken, code });
    return res.data;
  },
  getProfile: async (): Promise<AdminProfileResponse> => {
    const res = await apiClient.get<AdminProfileResponse>("/user/me");
    return res.data;
  },
};

export const coursesApi = {
  getAll: async (params?: any) => {
    const res = await apiClient.get("/courses", { params });
    if (res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    if (Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },
  getOne: async (id: string) => {
    const res = await apiClient.get(`/courses/${id}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await apiClient.post("/courses", data);
    return res.data;
  },
  update: async (id: string, data: any) => {
    const res = await apiClient.patch(`/courses/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete(`/courses/${id}`);
    return res.data;
  },
  uploadThumbnail: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post<{ url: string }>("/courses/upload-thumbnail", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
  uploadMedia: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post<{ url: string }>("/courses/upload-media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
  // Modules CRUD
  getModules: async (courseId: string) => {
    const res = await apiClient.get(`/courses/${courseId}/modules`);
    return res.data;
  },
  createModule: async (
    courseId: string,
    data: { title: string; description?: string; order: number; isLocked?: boolean }
  ) => {
    const res = await apiClient.post(`/courses/${courseId}/modules`, data);
    return res.data;
  },
  updateModule: async (
    courseId: string,
    moduleId: string,
    data: { title?: string; description?: string; order?: number; isLocked?: boolean }
  ) => {
    const res = await apiClient.patch(`/courses/${courseId}/modules/${moduleId}`, data);
    return res.data;
  },
  deleteModule: async (courseId: string, moduleId: string) => {
    const res = await apiClient.delete(`/courses/${courseId}/modules/${moduleId}`);
    return res.data;
  },
  // Lessons CRUD
  getLessons: async (courseId: string, moduleId: string) => {
    const res = await apiClient.get(`/courses/${courseId}/modules/${moduleId}/lessons`);
    return res.data;
  },
  createLesson: async (
    courseId: string,
    moduleId: string,
    data: {
      title: string;
      type: string;
      durationMinutes: number;
      order: number;
      content?: string | null;
      videoUrl?: string | null;
      resources?: string | null;
      isPreview?: boolean;
      status?: string;
    }
  ) => {
    const res = await apiClient.post(`/courses/${courseId}/modules/${moduleId}/lessons`, data);
    return res.data;
  },
  updateLesson: async (
    courseId: string,
    moduleId: string,
    lessonId: string,
    data: {
      title?: string;
      type?: string;
      durationMinutes?: number;
      order?: number;
      content?: string | null;
      videoUrl?: string | null;
      resources?: string | null;
      isPreview?: boolean;
      status?: string;
      /** Moves the lesson to another module. */
      moduleId?: string;
      /** Editor fields without their own column (staff-only JSON; replaces the stored object). */
      editorSettings?: Record<string, unknown>;
    }
  ) => {
    const res = await apiClient.patch(
      `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
      data
    );
    return res.data;
  },
  deleteLesson: async (courseId: string, moduleId: string, lessonId: string) => {
    const res = await apiClient.delete(
      `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`
    );
    return res.data;
  },
};

export const categoriesApi = {
  getAll: async () => {
    const res = await apiClient.get("/categories");
    return res.data;
  },
  create: async (data: { name: string; slug: string; description?: string; icon?: string }) => {
    const res = await apiClient.post("/categories", data);
    return res.data;
  },
  update: async (id: string, data: { name?: string; description?: string; status?: string }) => {
    const res = await apiClient.patch(`/categories/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete(`/categories/${id}`);
    return res.data;
  },
};

export const aiApi = {
  generateCourseOutline: async (payload: { title: string; description?: string; level?: string }) => {
    const res = await apiClient.post("/ai/generate-course-outline", payload);
    return res.data;
  },
  generateQuiz: async (payload: {
    topic: string;
    numQuestions?: number;
    difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    lessonContent?: string;
    lessonTitle?: string;
  }) => {
    const res = await apiClient.post("/ai/generate-quiz", payload);
    return res.data;
  },
};



