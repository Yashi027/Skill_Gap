import { createContext, useEffect, useState } from 'react';
import api from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const isUserLogin = async () => {
      if(!token){
        setAuthLoading(false);
        return;
      }
      try {
        const data = await api("/auth/me");
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }finally{
        setAuthLoading(false);
      }
    }

  useEffect (() => {
    isUserLogin();
  },[])

  const register = async ({name,email,password}) => {
    setAuthError("");
    try {
      const data = await api("/auth/register",{
        method: "POST",
        body: {name, email,password}
      });
      localStorage.setItem("token",data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  }

  const login = async ({email,password}) => {
    setAuthError("");
    try {
      const data = await api("/auth/login",{
        method: "POST",
        body: {email,password}
      });
      localStorage.setItem("token",data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  }

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  return(
    <AuthContext.Provider
    value={{
      token,
      user,
      setUser,
      authLoading,
      authError,
      setAuthError,
      isAuthenticated: Boolean(token && user),
      register,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}