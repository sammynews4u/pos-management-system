import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SalesHistory = () => {
  const [sales, setSales] = useState([]);

  // Fetch Sales from API
  const getSales = async () => {
    try {
      const response = await fetch("https://pos-server-km8a.onrender.com", {
        method: "GET",
        headers: { token: localStorage.getItem("token") }
      });
      const jsonData = await response.json();
      setSales(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getSales();
  }, []);

  // Format Date (e.g., "Dec 14, 2025")
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-4">
        <h2>Transaction History</h2>
        <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
            <table className="table table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Receipt No</th>
                        <th>Date</th>
                        <th>Payment Method</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.length === 0 ? (
                        <tr><td colSpan="5" className="text-center">No sales recorded yet</td></tr>
                    ) : (
                        sales.map((sale) => (
                            <tr key={sale.id}>
                                <td className="fw-bold">{sale.receipt_no}</td>
                                <td>{formatDate(sale.sale_date)}</td>
                                <td>
                                    <span className="badge bg-info text-dark">{sale.payment_method}</span>
                                </td>
                                <td className="text-success fw-bold">₦{sale.total_amount}</td>
                                <td><span className="badge bg-success">Paid</span></td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default SalesHistory;