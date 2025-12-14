import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import Products from "./Products"; 

const Dashboard = ({ setAuth }) => {
  // State for data
  const [name, setName] = useState("");
  const [salesTotal, setSalesTotal] = useState(0);
  const [stockCount, setStockCount] = useState(0);

  // 1. Fetch Dashboard Data (Name, Sales, Stock)
  async function getDashboardData() {
    try {
      const response = await fetch("https://pos-server-km8a.onrender.com/dashboard", {
        method: "GET",
        headers: { token: localStorage.getItem("token") }
      });

      const parseRes = await response.json();
      
      setName(parseRes.full_name);
      setSalesTotal(parseRes.total_sales); // Update Sales Number
      setStockCount(parseRes.total_items); // Update Stock Count

    } catch (err) {
      console.error(err.message);
    }
  }

  // 2. Logout Function
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div>
        {/* TOP NAVBAR */}
        <nav className="navbar navbar-dark bg-dark px-4 shadow">
            <span className="navbar-brand mb-0 h1">POS SaaS System</span>
            <div className="d-flex align-items-center">
                 <span className="text-white me-3">User: {name}</span>
                 <button className="btn btn-outline-danger btn-sm" onClick={e => logout(e)}>
                    Logout
                </button>
            </div>
        </nav>

        <div className="container mt-4">
            {/* HEADER & POS ACTION */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Overview</h2>
                {/* BUTTON TO OPEN POS */}
                <Link to="/pos" className="btn btn-primary btn-lg shadow">
                    <i className="bi bi-cart4"></i> + Open POS Terminal
                </Link>
            </div>

            {/* STATISTICS CARDS */}
            <div className="row mb-5">
                {/* CARD 1: TOTAL SALES */}
                <div className="col-md-4">
                    <div className="card text-white bg-primary mb-3 shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Total Sales</h5>
                            <p className="card-text fs-2 fw-bold">₦ {Number(salesTotal).toLocaleString()}</p>
                            
                            {/* LINK TO SALES HISTORY */}
                            <Link to="/sales-history" className="text-white text-decoration-underline">
                                View Sales History
                            </Link>
                        </div>
                    </div>
                </div>

                {/* CARD 2: NET INCOME (Placeholder for now) */}
                <div className="col-md-4">
                    <div className="card text-white bg-success mb-3 shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Net Income</h5>
                            <p className="card-text fs-2 fw-bold">₦ {Number(salesTotal).toLocaleString()}</p>
                            <small>Revenue (Expenses not deducted yet)</small>
                        </div>
                    </div>
                </div>

                 {/* CARD 3: INVENTORY COUNT */}
                 <div className="col-md-4">
                    <div className="card text-dark bg-warning mb-3 shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Products in Stock</h5>
                            <p className="card-text fs-2 fw-bold">{stockCount}</p>
                            <small>Manage inventory below</small>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="my-4"/>

            {/* INVENTORY MANAGEMENT SECTION */}
            <Products /> 
            
        </div>
    </div>
  );
};

export default Dashboard;