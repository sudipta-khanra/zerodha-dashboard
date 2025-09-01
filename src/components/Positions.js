import React, { useEffect, useState } from "react";
import axios from "axios";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3002/allPositions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // include token if needed
        },
      })
      .then((res) => {
        setAllPositions(res.data);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch positions. Please try again.");
      });
  }, []);

  // Calculate totals like Holdings
  const totalInvestment = allPositions.reduce(
    (acc, p) => acc + (Number(p.avg) || 0) * (Number(p.qty) || 0),
    0
  );

  const totalCurrentValue = allPositions.reduce(
    (acc, p) => acc + (Number(p.price) || 0) * (Number(p.qty) || 0),
    0
  );

  const totalPnL = totalCurrentValue - totalInvestment;
  const totalChangePct =
    totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

  if (error) {
    return (
      <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>
        {error}
      </p>
    );
  }

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>
          <tbody>
            {allPositions.map((p, index) => {
              const curValue = (Number(p.price) || 0) * (Number(p.qty) || 0);
              const invested = (Number(p.avg) || 0) * (Number(p.qty) || 0);
              const pnl = curValue - invested;
              const netChange = invested > 0 ? (pnl / invested) * 100 : 0;
              const isProfit = pnl >= 0;

              return (
                <tr key={index}>
                  <td>{p.product}</td>
                  <td>{p.name}</td>
                  <td>{p.qty}</td>
                  <td>{(Number(p.avg) || 0).toFixed(2)}</td>
                  <td>{(Number(p.price) || 0).toFixed(2)}</td>
                  <td className={isProfit ? "profit" : "loss"}>
                    {pnl.toFixed(2)}
                  </td>
                  <td className={isProfit ? "profit" : "loss"}>
                    {netChange.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* SUMMARY */}
      <div className="row">
        <div className="col">
          <h5>{totalInvestment.toFixed(2)}</h5>
          <p>Total Investment</p>
        </div>
        <div className="col">
          <h5>{totalCurrentValue.toFixed(2)}</h5>
          <p>Current Value</p>
        </div>
        <div className="col">
          <h5 className={totalPnL >= 0 ? "profit" : "loss"}>
            {totalPnL.toFixed(2)} ({totalChangePct.toFixed(2)}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>
    </>
  );
};

export default Positions;
