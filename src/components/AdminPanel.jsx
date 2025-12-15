import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminPanel = () => {
  const [stats, setStats] = useState({ total_businesses: 0, total_volume: 0 });
  const [users, setUsers] = useState([]);

  // Fetch Data
  const getAdminData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // 1. Get Stats
      const statsRes = await fetch("https://pos-server-km8a.onrender.com/admin/stats", {
        headers: { token: token }
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      // 2. Get Users
      const usersRes = await fetch("https://pos-server-km8a.onrender.com/admin/users", {
        headers: { token: token }
      });
      const usersData = await usersRes.json();
      setUsers(usersData);

    } catch (err) {
      console.error(err.message);
      alert("Access Denied: You are not an Admin");
      window.location.href = "/dashboard";
    }
  };

  useEffect(() => {
    getAdminData();
  }, []);

  // Toggle User Status
  const toggleStatus = async (id, currentStatus) => {
    try {
        const confirm = window.confirm(`Are you sure you want to ${currentStatus ? "SUSPEND" : "ACTIVATE"} this user?`);
        if(!confirm) return;

        await fetch(`https://pos-server-km8a.onrender.com/admin/users/${id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                token: localStorage.getItem("token") 
            },
            body: JSON.stringify({ is_active: !currentStatus })
        });

        // Refresh List
        getAdminData();

    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-4">
        <h2 className="text-danger">SUPER ADMIN PANEL</h2>
        <Link to="/dashboard" className="btn btn-secondary">Back to My Dashboard</Link>
      </div>

      {/* STATS */}
      <div className="row mb-5">
        <div className="col-md-6">
            <div className="card bg-dark text-white p-3">
                <h5>Total Businesses</h5>
                <h2>{stats.total_businesses}</h2>
            </div>
        </div>
        <div className="col-md-6">
            <div className="card bg-success text-white p-3">
                <h5>Total Platform Volume (All Sales)</h5>
                <h2>₦ {Number(stats.total_volume).toLocaleString()}</h2>
            </div>
        </div>
      </div>

      {/* USER MANAGEMENT */}
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
            User Management
        </div>
        <table className="table table-hover mb-0">
            <thead>
                <tr>
                    <th>Company</th>
                    <th>Owner Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td className="fw-bold">{user.company_name}</td>
                        <td>{user.full_name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                            <span className={`badge ${user.is_active ? 'bg-success' : 'bg-danger'}`}>
                                {user.is_active ? "Active" : "Suspended"}
                            </span>
                        </td>
                        <td>
                            {user.role !== 'super_admin' && (
                                <button 
                                    className={`btn btn-sm ${user.is_active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                    onClick={() => toggleStatus(user.id, user.is_active)}
                                >
                                    {user.is_active ? "Suspend" : "Activate"}
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;