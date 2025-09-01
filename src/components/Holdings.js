// Holdings.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchHoldings = async () => {
      try {
        const res = await axios.get("http://localhost:3002/allHoldings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // console.log("Holdings API response:", res.data);

        // Safely extract holdings array
        let holdingsData = [];
        if (Array.isArray(res.data)) {
          holdingsData = res.data;
        } else if (Array.isArray(res.data.allHoldings)) {
          holdingsData = res.data.allHoldings;
        } else if (Array.isArray(res.data.data)) {
          holdingsData = res.data.data;
        }

        setAllHoldings(holdingsData);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Please log in to see data");
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3002/allOrders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // console.log("Orders API response:", res.data);

        // Safely extract orders array
        let ordersData = [];
        if (Array.isArray(res.data)) {
          ordersData = res.data;
        } else if (Array.isArray(res.data.allOrders)) {
          ordersData = res.data.allOrders;
        } else if (Array.isArray(res.data.data)) {
          ordersData = res.data.data;
        }

        setAllOrders(ordersData);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Please log in to see data");
      }
    };

    fetchHoldings();
    fetchOrders();
  }, []);

  if (error) {
    return (
      <p style={{ color: "red", fontSize: "21px", textAlign: "center" }}>
        {error}
      </p>
    );
  }

  // ---------- SUMMARY CALC ----------
  const totalInvestment =
    allHoldings.reduce(
      (acc, h) => acc + (Number(h.avg) || 0) * (Number(h.qty) || 0),
      0
    ) +
    allOrders.reduce(
      (acc, o) => acc + (Number(o.price) || 0) * (Number(o.qty) || 0),
      0
    );

  const totalCurrentValue =
    allHoldings.reduce(
      (acc, h) => acc + (Number(h.price) || 0) * (Number(h.qty) || 0),
      0
    ) +
    allOrders.reduce((acc, o) => {
      const holding = allHoldings.find((h) => h.name === o.name);
      const ltp = holding ? Number(holding.price) || 0 : Number(o.price) || 0;
      return acc + ltp * (Number(o.qty) || 0);
    }, 0);

  const totalPnL = totalCurrentValue - totalInvestment;
  const totalChangePct =
    totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

  // ---------- GRAPH DATA ----------
  const combinedData = [];

  allHoldings.forEach((h) => {
    combinedData.push({
      name: h.name,
      value: (Number(h.price) || 0) * (Number(h.qty) || 0),
    });
  });

  allOrders.forEach((o) => {
    const holding = allHoldings.find((h) => h.name === o.name);
    const ltp = holding ? Number(holding.price) || 0 : Number(o.price) || 0;
    const value = o.mode === "BUY" ? ltp * o.qty : -ltp * o.qty;

    const existing = combinedData.find((item) => item.name === o.name);
    if (existing) existing.value += value;
    else combinedData.push({ name: o.name, value });
  });

  const labels = combinedData.map((item) => item.name);
  const data = {
    labels,
    datasets: [
      {
        label: "Current Value",
        data: combinedData.map((item) => item.value),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <>
      {/* ---------- HOLDINGS TABLE ---------- */}
      <div className="section">
        <h3 className="title">Holdings ({allHoldings.length})</h3>
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Instrument</th>
                <th>Qty.</th>
                <th>Avg. cost</th>
                <th>LTP</th>
                <th>Cur. val</th>
                <th>P&L</th>
                <th>Net chg.</th>
                <th>Day chg.</th>
              </tr>
            </thead>
            <tbody>
              {allHoldings.map((stock, index) => {
                const avg = Number(stock.avg) || 0;
                const price = Number(stock.price) || 0;
                const qty = Number(stock.qty) || 0;
                const curValue = price * qty;
                const pnl = curValue - avg * qty;
                const netChange = avg > 0 ? ((price - avg) / avg) * 100 : 0;
                const profClass = pnl >= 0 ? "profit" : "loss";
                const dayClass = stock.isLoss ? "loss" : "profit";

                return (
                  <tr key={index}>
                    <td>{stock.name}</td>
                    <td>{qty}</td>
                    <td>{avg.toFixed(2)}</td>
                    <td>{price.toFixed(2)}</td>
                    <td>{curValue.toFixed(2)}</td>
                    <td className={profClass}>{pnl.toFixed(2)}</td>
                    <td className={profClass}>{netChange.toFixed(2)}%</td>
                    <td className={dayClass}>{stock.day || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- ORDERS TABLE ---------- */}
      <div className="section">
        <h3 className="title">Orders ({allOrders.length})</h3>
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Instrument</th>
                <th>Qty.</th>
                <th>Avg. cost</th>
                <th>LTP</th>
                <th>Cur. val</th>
                <th>P&L</th>
                <th>Net chg.</th>
                <th>Day chg.</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((order, index) => {
                const avg = Number(order.price) || 0;
                const qty = Number(order.qty) || 0;
                const holding = allHoldings.find((h) => h.name === order.name);
                const ltp = holding ? Number(holding.price) || 0 : avg;
                const curValue = ltp * qty;
                const pnl = curValue - avg * qty;
                const netChange = avg > 0 ? ((ltp - avg) / avg) * 100 : 0;
                const profClass = pnl >= 0 ? "profit" : "loss";
                const dayChange = holding ? holding.day : "-";

                return (
                  <tr key={index}>
                    <td>{order.name}</td>
                    <td>{qty}</td>
                    <td>{avg.toFixed(2)}</td>
                    <td>{ltp.toFixed(2)}</td>
                    <td>{curValue.toFixed(2)}</td>
                    <td className={profClass}>{pnl.toFixed(2)}</td>
                    <td className={profClass}>{netChange.toFixed(2)}%</td>
                    <td>{dayChange}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- SUMMARY ---------- */}
      <div className="row">
        <div className="col">
          <h5>{totalInvestment.toFixed(2)}</h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>{totalCurrentValue.toFixed(2)}</h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 className={totalPnL >= 0 ? "profit" : "loss"}>
            {totalPnL.toFixed(2)} ({totalChangePct.toFixed(2)}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>

      {/* ---------- GRAPH ---------- */}
      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
