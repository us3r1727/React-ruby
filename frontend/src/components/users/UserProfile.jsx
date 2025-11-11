import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import api from "../../services/api";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [useUrl, setUseUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Load current profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        setUser(res.data.data);
        setFullName(res.data.data.full_name || "");
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setEditing(!editing);
    setMessage("");
    setAvatarFile(null);
    setAvatarUrl("");
    setAvatarPreview(user?.avatar_url || null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setUseUrl(false);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setAvatarUrl(url);
    setAvatarPreview(url);
    setUseUrl(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("user[full_name]", fullName);

      if (useUrl && avatarUrl) {
        formData.append("user[avatar_url]", avatarUrl);
      } else if (avatarFile) {
        formData.append("user[avatar]", avatarFile);
      }

      const res = await api.put(`/users/${user.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data.data);
      setEditing(false);
      setAvatarPreview(null);
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    navigate("/login", { replace: true });
  };

  if (!user) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5">
      <div
        className="card shadow-lg p-4 mx-auto"
        style={{ maxWidth: "600px", borderRadius: "15px" }}
      >
        <div className="text-center mb-4">
          <h3 className="fw-bold mb-3">My Profile</h3>

          {user.role === "admin" && (
            <button
              onClick={() => {
                navigate("/dashboard");
              }}
              className="btn btn-warning w-100 mb-3 fw-semibold"
            >
              Dashboard
            </button>
          )}

          <img
            src={
              avatarPreview ||
              user.avatar_url ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png"
            }
            alt="Avatar"
            className="rounded-circle shadow-sm mb-3"
            width="120"
            height="120"
            style={{
              objectFit: "cover",
              border: "3px solid #dee2e6",
            }}
          />
        </div>

        {!editing ? (
          <>
            <p>
              <strong>Name:</strong> {user.full_name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong>{" "}
              <span
                className={`badge ${
                  user.role === "admin" ? "bg-danger" : "bg-secondary"
                }`}
              >
                {user.role || "user"}
              </span>
            </p>

            <div className="d-flex gap-2 mt-3">
              <button
                onClick={handleEditToggle}
                className="btn btn-primary flex-grow-1"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger flex-grow-1"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Profile Picture</label>

              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="avatarOption"
                  id="uploadFile"
                  checked={!useUrl}
                  onChange={() => setUseUrl(false)}
                />
                <label className="form-check-label" htmlFor="uploadFile">
                  File upload
                </label>
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="avatarOption"
                  id="useLink"
                  checked={useUrl}
                  onChange={() => setUseUrl(true)}
                />
                <label className="form-check-label" htmlFor="useLink">
                  Use link (URL)
                </label>
              </div>

              {!useUrl ? (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="form-control"
                />
              ) : (
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={avatarUrl}
                  onChange={handleUrlChange}
                  className="form-control"
                />
              )}
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-success flex-grow-1"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn btn-secondary flex-grow-1"
                onClick={handleEditToggle}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {message && (
          <div
            className={`alert mt-3 ${
              message.includes("successfully") ? "alert-success" : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
