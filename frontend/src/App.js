import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register/register";
import Login from "./components/Login/login";
import HomePage from "./components/HomePage/home";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute requireAuth={false}> 
          <Home />
        </ProtectedRoute>
      } />

      {/* 🔒 Register Route - Only accessible when NOT logged in */}
      <Route
        path="/register"
        element={
          <ProtectedRoute requireAuth={false}>
            <Register />
          </ProtectedRoute>
        }
      />
      
      {/* 🔒 Login Route - Only accessible when NOT logged in */}
      <Route
        path="/login"
        element={
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        }
      />

      {/* 🔒 Home Route - Only accessible when logged in */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      
      {/* Optional: Catch-all route for 404 */}
    </Routes>
  );
};

export default App;