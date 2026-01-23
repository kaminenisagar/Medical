import { Component } from "react";
import axios from "axios";
import "./login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";

class Login extends Component {
  state = {
    email: "",
    password: "",
    isLoading: false
  };

  componentDidMount() {
    // Check if user is already logged in
    // This will be handled by ProtectedRoute, but we keep as backup
    const user = localStorage.getItem("user");
    if (user) {
      window.location.href = "/home";
    }
  }

  onChangeEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  onChangePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  onSubmitForm = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true });

    const { email, password } = this.state;

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password
      });

      alert(response.data.message);

      // Save user data
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect using window.location to ensure full page reload
      window.location.href = "/home";

    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server error. Try again later.");
      }
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { isLoading } = this.state;

    return (
      <div className="login-container">
        <form className="login-form" onSubmit={this.onSubmitForm}>
          <h2 className="login-title">Login</h2>

          {/* Email */}
          <label className="login-label">Email:</label>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Enter email"
              required
              onChange={this.onChangeEmail}
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <label className="login-label">Password:</label>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Enter password"
              required
              onChange={this.onChangePassword}
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <p className="login-line">
            Don't have an account?{" "}
            <a href="/register" className="register-link">
              Register
            </a>
          </p>
        </form>
      </div>
    );
  }
}

export default Login;