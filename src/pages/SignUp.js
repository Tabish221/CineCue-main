import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import "../styles/Auth.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Success! Please check your email for the confirmation link."
        );
        // Clear form
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <header style={{ padding: "5rem 3rem" }}>
      </header>

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
            Create a new account
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
              {loading ? "Creating account..." : "Sign Up"}
            </button>

            {message && (
              <div
                style={{
                  color: message.includes("Success") ? "#4BB543" : "#e87c03",
                  marginBottom: "16px",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                {message}
              </div>
            )}

            <div
              style={{
                color: "#737373",
                fontSize: "16px",
                textAlign: "center",
              }}
            >
              Already have an account?{" "}
              <Link
                to="/auth"
                style={{
                  color: "white",
                  textDecoration: "none",
                  marginLeft: "4px",
                }}
              >
                Sign in now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
