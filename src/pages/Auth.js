import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { signIn, setShowSuggestMovieModal } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await signIn({ email, password });

      if (error) {
        setMessage(error.message);
      } else {
        navigate("/");
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div
      className="auth-page"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(rgba(0,0,0,.75),rgba(0,0,0,.75)), url(https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 1rem",
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,.75)",
            padding: "60px 68px 40px",
            borderRadius: "4px",
            width: "100%",
            maxWidth: "450px",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: "32px",
              fontWeight: "500",
              marginBottom: "28px",
            }}
          >
            Sign In
          </h1>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  background: "#333",
                  border: "none",
                  borderRadius: "4px",
                  color: "white",
                  height: "50px",
                  lineHeight: "50px",
                  padding: "16px 20px 0",
                  fontSize: "16px",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  background: "#333",
                  border: "none",
                  borderRadius: "4px",
                  color: "white",
                  height: "50px",
                  lineHeight: "50px",
                  padding: "16px 20px 0",
                  fontSize: "16px",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: "#e50914",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: "500",
                margin: "24px 0 12px",
                padding: "16px",
                cursor: "pointer",
              }}
            >
              {loading ? "Please wait..." : "Sign In"}
            </button>

            {message && (
              <div
                style={{
                  color: "#e87c03",
                  marginBottom: "16px",
                  fontSize: "14px",
                }}
              >
                {message}
              </div>
            )}

            <div
              style={{
                color: "#737373",
                fontSize: "16px",
              }}
            >
              New to CineCue?{" "}
              <Link
                to="/signup"
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "16px",
                  textDecoration: "none",
                }}
              >
                Sign up now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
