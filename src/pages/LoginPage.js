import React, { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { authService } from "../services/auth.service";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { Lock, User, Mail, Book, LogIn, UserPlus } from "lucide-react";
import "../App.css";

const LoginPage = () => {
  const [authState, setAuthState] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isLogin) {
        await createUserWithEmailAndPassword(
          auth,
          authState.email,
          authState.password
        );
      } else {
        await authService.login(authState.email, authState.password);
      }
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-4">
            <Book className="mx-auto text-blue-600 mb-4" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Username"
                className="w-full p-4 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                value={authState.username}
                onChange={(e) =>
                  setAuthState({ ...authState, username: e.target.value })
                }
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              value={authState.email}
              onChange={(e) =>
                setAuthState({ ...authState, email: e.target.value })
              }
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              value={authState.password}
              onChange={(e) =>
                setAuthState({ ...authState, password: e.target.value })
              }
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
          >
            {isLogin ? (
              <LogIn className="mr-2" />
            ) : (
              <UserPlus className="mr-2" />
            )}
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:underline focus:outline-none"
            >
              {isLogin
                ? "Need an account? Sign Up"
                : "Already have an account? Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
