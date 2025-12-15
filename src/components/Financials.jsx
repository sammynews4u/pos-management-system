import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const Financials = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, net_profit: 0 });
  
  // Date State (Default: First day of current month to Today)
  const today = new Date().toISOString().split('T')[0];
  const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  
  const [inputs, setInputs] = useState({
    start_date: firstDay,
    end_date: today
  });

  const generateReport = async () => {
    try {
      const response = await fetch("https://pos-server-km8a.onrender.com/reports", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            token: localStorage.getItem("token") 
        },
        body: JSON.stringify(inputs)
      });
      const data = await response.json();
      setTransactions(data.transactions);
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    generateReport();
  }, []); // Run once on load

  // --- EXPORT TO PDF ---
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Financial Report", 20, 10);
    doc.text(`Period: ${inputs.start_date} to ${inputs.end_date}`, 20, 20);
    
    // Summary
    doc.text(`Income: ${summary.total_income} | Expense: ${summary.total_expense} | Profit: ${summary.net_profit}`, 20, 30);

    const tableColumn = ["Date", "Type", "Description", "Amount"];
    const tableRows = [];

    transactions.forEach(t => {
      const transactionData = [
        new Date(t.date).toLocaleDateString(),
        t.type.toUpperCase(),
        t.description,
        t.amount
      ];
      tableRows.push(transactionData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 40 });
    doc.save(`financial_report_${inputs.start_date}.pdf`);
  };

  // --- EXPORT TO EXCEL ---
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Financials");
    XLSX.writeFile(workbook, `financial_report_${inputs.start_date}.xlsx`);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Financial Reports</h2>
        <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      {/* FILTERS */}
      <div className="card p-4 shadow-sm mb-4">
        <div className="row align-items-end">
            <div className="col-md-4">
                <label>Start Date</label>
                <input type="date" className="form-control" 
                    value={inputs.start_date} 
                    onChange={e => setInputs({...inputs, start_date: e.target.value})} 
                />
            </div>
            <div className="col-md-4">
                <label>End Date</label>
                <input type="date" className="form-control" 
                    value={inputs.end_date} 
                    onChange={e => setInputs({...inputs, end_date: e.target.value})} 
                />
            </div>
            <div className="col-md-4">
                <button className="btn btn-primary w-100" onClick={generateReport}>Generate Report</button>
            </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row mb-4 text-center">
        <div className="col-md-4">
            <div className="card bg-success text-white p-3">
                <h5>Total Income</h5>
                <h3>₦{Number(summary.total_income).toLocaleString()}</h3>
            </div>
        </div>
        <div className="col-md-4">
            <div className="card bg-danger text-white p-3">
                <h5>Total Expenses</h5>
                <h3>₦{Number(summary.total_expense).toLocaleString()}</h3>
            </div>
        </div>
        <div className="col-md-4">
            <div className={`card text-white p-3 ${summary.net_profit >= 0 ? 'bg-primary' : 'bg-dark'}`}>
                <h5>Net Profit</h5>
                <h3>₦{Number(summary.net_profit).toLocaleString()}</h3>
            </div>
        </div>
      </div>

      {/* EXPORT BUTTONS */}
      <div className="mb-3 d-flex gap-2">
        <button className="btn btn-danger" onClick={exportPDF}>
            <i className="bi bi-file-earmark-pdf"></i> Export PDF
        </button>
        <button className="btn btn-success" onClick={exportExcel}>
            <i className="bi bi-file-earmark-excel"></i> Export Excel
        </button>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm">
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th className="text-end">Amount</th>
                </tr>
            </thead>
            <tbody>
                {transactions.length === 0 ? <tr><td colSpan="4" className="text-center">No records found</td></tr> : (
                    transactions.map((t, index) => (
                        <tr key={index}>
                            <td>{new Date(t.date).toLocaleDateString()}</td>
                            <td>
                                <span className={`badge ${t.type === 'income' ? 'bg-success' : 'bg-danger'}`}>
                                    {t.type.toUpperCase()}
                                </span>
                            </td>
                            <td>{t.description}</td>
                            <td className="text-end fw-bold">₦{Number(t.amount).toLocaleString()}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default Financials;