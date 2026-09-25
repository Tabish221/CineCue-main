import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { X } from "lucide-react";

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = isLogin
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) {
        setMessage(error.message);
      } else {
        if (!isLogin) {
          setMessage("Check your email for the confirmation link!");
        } else {
          onClose();
        }
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="auth-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#1a1a1a",
          padding: "2rem",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "400px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: "1rem",
            top: "1rem",
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          <X size={24} />
        </button>

        <h2 style={{ marginBottom: "1.5rem", color: "white" }}>
          {isLogin ? "Sign In" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "4px",
                border: "1px solid #333",
                background: "#333",
                color: "white",
                marginBottom: "1rem",
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "4px",
                border: "1px solid #333",
                background: "#333",
                color: "white",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "#e50914",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </button>

          {message && (
            <div
              style={{
                color: message.includes("Check your email")
                  ? "#4BB543"
                  : "#ff6b6b",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {message}
            </div>
          )}

          <div style={{ textAlign: "center", color: "#999" }}>
            {isLogin ? (
              <>
                New to CineCue?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#e50914",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Sign up now
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#e50914",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
