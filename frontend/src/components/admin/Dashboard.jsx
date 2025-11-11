import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Papa from "papaparse";
import api from "../../services/api";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: null, full_name: "", email: "", role: "user" });
  const [importProgress, setImportProgress] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const navigate = useNavigate();

  // Load user list
  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Error loading users:", err);
      if (err.response?.status === 403) {
        alert("Access denied: only administrators can enter.");
        navigate("/profile");
      }
    } finally {
      setLoading(false);
    }
  };

  // User statistics
  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalRegular = totalUsers - totalAdmins;

  // Check permissions and load data
  useEffect(() => {
    const role = Cookies.get("role");
    if (role !== "admin") {
      alert("Only administrators can access the Dashboard.");
      navigate("/profile");
    } else {
      loadUsers();
    }
  }, [navigate]);

  // Logout
  const handleLogout = async () => {
    try {
      await api.delete("/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      Cookies.remove("token");
      Cookies.remove("role");
      navigate("/login");
    }
  };

  // Create or update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await api.put(`/users/${form.id}`, form);
      } else {
        await api.post("/users", form);
      }
      setForm({ id: null, full_name: "", email: "", role: "user" });
      loadUsers();
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Error saving user. Please check the data and try again.");
    }
  };

  // Delete user
  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.full_name}?`)) {
      try {
        await api.delete(`/users/${user.id}`);
        loadUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete this user.");
      }
    }
  };

  // Toggle user role
  const handleToggleRole = async (user) => {
    try {
      const newRole = user.role === "admin" ? "user" : "admin";
      await api.put(`/users/${user.id}`, { ...user, role: newRole });
      loadUsers();
    } catch (err) {
      console.error("Error toggling role:", err);
      alert("Failed to update user role.");
    }
  };

  // CSV import handled in the frontend
  const handleCSVUpload = (e) => {
    e.preventDefault();
    if (!csvFile) return alert("Please select a CSV file first.");

    setImportProgress(0);

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const parsedUsers = results.data;
        let imported = 0;

        for (const user of parsedUsers) {
          if (!user.full_name || !user.email) continue; // skip invalid rows
          try {
            await api.post("/users", {
              full_name: user.full_name,
              email: user.email,
              role: user.role || "user",
            });
            imported++;
          } catch (err) {
            console.warn("Skipping invalid user:", user, err);
          }

          // Update progress
          const percent = Math.round((imported / parsedUsers.length) * 100);
          setImportProgress(percent);
        }

        alert(`Import completed! ${imported} users added.`);
        loadUsers();
        setImportProgress(null);
        setCsvFile(null);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        alert("Failed to process CSV file.");
        setImportProgress(null);
      },
    });
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="container mt-5 mb-5">
      <div
        className="card shadow-lg p-4"
        style={{ borderRadius: "15px", maxWidth: "1000px", margin: "0 auto" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-primary">Admin Dashboard</h2>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/profile")}
            >
              Back
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* User Statistics */}
        <div className="row text-center mb-4">
          <div className="col-md-4">
            <div className="card p-3">
              <h5>Total Users</h5>
              <h3>{totalUsers}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3">
              <h5>Administrators</h5>
              <h3>{totalAdmins}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3">
              <h5>Regular Users</h5>
              <h3>{totalRegular}</h3>
            </div>
          </div>
        </div>

        {/* CRUD Form */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="col-md-2">
              <label>Role</label>
              <select
                className="form-select"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                {form.id ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </form>

        {/* CSV Upload */}
        <div className="mb-4">
          <form onSubmit={handleCSVUpload}>
            <label className="form-label">Import users via CSV</label>
            <div className="d-flex gap-2">
              <input
                type="file"
                accept=".csv"
                className="form-control"
                onChange={(e) => setCsvFile(e.target.files[0])}
              />
              <button className="btn btn-success" type="submit">
                Import
              </button>
            </div>
          </form>
          {importProgress !== null && (
            <div className="progress mt-2">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                style={{ width: `${importProgress}%` }}
              >
                {importProgress}%
              </div>
            </div>
          )}
        </div>

        {/* User List */}
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.full_name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === "admin" ? "bg-danger" : "bg-secondary"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setForm(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => handleToggleRole(u)}
                      >
                        Toggle
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(u)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
