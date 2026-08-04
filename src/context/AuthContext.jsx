import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [fullName, setFullName] = useState(localStorage.getItem("fullName"));
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem("token");
    return t ? decodeToken(t) : null;
  });

  const login = (authResponse) => {
    const { token: newToken, role: newRole, fullName: newFullName } = authResponse;

    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    localStorage.setItem("fullName", newFullName);

    setToken(newToken);
    setRole(newRole);
    setFullName(newFullName);
    setUser(decodeToken(newToken));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("fullName");
    setToken(null);
    setRole(null);
    setFullName(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, role, fullName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}