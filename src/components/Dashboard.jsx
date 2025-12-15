import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import Products from "./Products"; 

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState("");
  const [financials, setFinancials] = useState({
      total_income: 0,
      total_expenses: 0,
      net_profit: 0,
      total_items: 0
  });
  
  // Filter State (Default: This Month)
  const [period, setPeriod] = useState("month"); 

  // Expense Form State
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseData, setExpenseData] = useState({ title: "", amount: "" });

  // 1. Fetch Dashboard Data with Filter
  async function getDashboardData() {
    try {
      const response = await fetch(`https://pos-server-km8a.onrender.com/dashboard?period=${period}`, {
        method: "GET",
        headers: { token: localStorage.getItem("token") }
      });

      const parseRes = await response.json();

      if (parseRes.is_active === false) {
          window.location.href = "/subscribe"; 
          return;
      }
      
      setName(parseRes.full_name);
      setFinancials(parseRes); // Store all financial data

    } catch (err) {
      console.error(err.message);
      if(err.message.includes("token")) logout();
    }
  }

  // 2. Add Expense Function
  const handleAddExpense = async (e) => {
      e.preventDefault();
      try {
          await fetch("https://pos-server-km8a.onrender.com/expenses", {
              method: "POST",
              headers: { 
                  "Content-Type": "application/json", 
                  token: localStorage.getItem("token") 
              },
              body: JSON.stringify(expenseData)
          });
          alert("Expense Recorded!");
          setExpenseData({ title: "", amount: "" });
          setShowExpenseForm(false);
          getDashboardData(); // Refresh numbers
      } catch (err) {
          console.error(err);
      }
  };

  const logout = (e) => {
    if(e) e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
  };

  // Fetch when page loads OR when 'period' changes
  useEffect(() => {
    getDashboardData();
  }, [period]); 

  return (
    <div>
        {/* TOP NAVBAR */}
        <nav className="navbar navbar-dark bg-dark px-4 shadow">
            <span className="navbar-brand mb-0 h1">POS SaaS System</span>
            <div className="d-flex align-items-center">
                 <span className="text-white me-3">User: {name}</span>
                 <button className="btn btn-outline-danger btn-sm" onClick={e => logout(e)}>Logout</button>
            </div>
        </nav>

        <div className="container mt-4">
            
            {/* HEADER & CONTROLS */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <h2>Financial Overview</h2>
                <div className="d-flex gap-2">
                    {/* TIME FILTER DROPDOWN */}
                    <select 
                        className="form-select" 
                        value={period} 
                        onChange={(e) => setPeriod(e.target.value)}
                        style={{width: "150px"}}
                    >
                        <option value="today">Today</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                        <option value="all">All Time</option>
                    </select>

                    <Link to="/pos" className="btn btn-primary shadow">
                        <i className="bi bi-cart4"></i> Open POS
                    </Link>
                </div>
            </div>

            {/* EXPENSE FORM (Collapsible) */}
            <div className="mb-4">
                <button className="btn btn-outline-danger btn-sm mb-2" onClick={() => setShowExpenseForm(!showExpenseForm)}>
                    {showExpenseForm ? "- Close Form" : "+ Record Expense (Rent, Fuel, etc)"}
                </button>
                
                {showExpenseForm && (
                    <div className="card p-3 bg-light border-danger">
                        <form onSubmit={handleAddExpense} className="d-flex gap-2">
                            <input type="text" placeholder="Expense Title (e.g. Fuel)" className="form-control" required 
                                value={expenseData.title} onChange={e => setExpenseData({...expenseData, title: e.target.value})} />
                            <input type="number" placeholder="Amount" className="form-control" required 
                                value={expenseData.amount} onChange={e => setExpenseData({...expenseData, amount: e.target.value})} />
                            <button className="btn btn-danger">Save</button>
                        </form>
                    </div>
                )}
            </div>

            {/* FINANCIAL CARDS */}
            <div className="row mb-5">
                {/* 1. TOTAL INCOME */}
                <div className="col-md-3">
                    <div className="card text-white bg-primary mb-3 shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Total Income</h5>
                            <p className="card-text fs-3 fw-bold">₦ {Number(financials.total_income).toLocaleString()}</p>
                            <small className="opacity-75">Sales Revenue ({period})</small>
                        </div>
                    </div>
                </div>

                {/* 2. EXPENSES */}
                <div className="col-md-3">
                    <div className="card text-white bg-danger mb-3 shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Expenses</h5>
                            <p className="card-text fs-3 fw-bold">₦ {Number(financials.total_expenses).toLocaleString()}</p>
                            <small className="opacity-75">Operational Costs ({period})</small>
                        </div>
                    </div>
                </div>

                {/* 3. NET PROFIT */}
                <div className="col-md-3">
                    <div className={`card text-white mb-3 shadow-sm h-100 ${financials.net_profit >= 0 ? 'bg-success' : 'bg-dark'}`}>
                        <div className="card-body">
                            <h5 className="card-title">Net Profit</h5>
                            <p className="card-text fs-3 fw-bold">₦ {Number(financials.net_profit).toLocaleString()}</p>
                            <small className="opacity-75">Income - (Product Cost + Expenses)</small>
                        </div>
                    </div>
                </div>

                 {/* 4. STOCK */}
                 <div className="col-md-3">
                    <div className="card text-dark bg-warning mb-3 shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Inventory</h5>
                            <p className="card-text fs-3 fw-bold">{financials.total_items} Items</p>
                            <small>Manage below</small>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="my-4"/>

            {/* INVENTORY & SALES LINKS */}
            <div className="d-flex justify-content-between mb-3">
                <h4>Inventory Management</h4>
                <Link to="/sales-history" className="text-primary text-decoration-underline">View Full Sales History</Link>
            </div>
            
            <Products /> 
            
        </div>
    </div>
  );
};

export default Dashboard;