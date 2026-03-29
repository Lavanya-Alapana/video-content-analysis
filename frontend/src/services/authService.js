import api from "./api";
import { STORAGE_KEYS } from "../constants";

class AuthService {
  async login(email, password) {
    const { data } = await api.post("/api/auth/login", { email, password });
    this.setAuthData(data);
    return data;
  }

  async register(email, password, role, orgId) {
    const { data } = await api.post("/api/auth/register", {
      email,
      password,
      role,
      orgId,
    });
    this.setAuthData(data);
    return data;
  }

  async getCurrentUser() {
    const { data } = await api.get("/api/auth/me");
    return data.user;
  }

  setAuthData({ token, user }) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  }

  getStoredUser() {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }

  getStoredToken() {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  isAuthenticated() {
    return !!this.getStoredToken();
  }
}

export default new AuthService();
