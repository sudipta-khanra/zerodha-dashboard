import React, { useState, useEffect } from "react";
import axios from "axios";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3002/allData");
      setAllOrders(res.data.orders || []);
      setAllHoldings(res.data.holdings || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders & Holdings</h1>

      {allOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-12">
          <p className="text-gray-500 text-lg mb-4">No orders placed yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="text-gray-600 border-b">
                <th className="text-left py-4 px-6">Stock</th>
                <th className="text-left py-4 px-6">Quantity</th>
                <th className="text-left py-4 px-6">Avg. cost</th>
                <th className="text-left py-4 px-6">LTP</th>
                <th className="text-left py-4 px-6">Cur. val</th>
                <th className="text-left py-4 px-6">P&L</th>
                <th className="text-left py-4 px-6">Net chg.</th>
                <th className="text-left py-4 px-6">Mode</th>
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
                const isProfit = pnl >= 0;
                const profClass = isProfit ? "text-green-600" : "text-red-600";
                const netChange = avg > 0 ? ((ltp - avg) / avg) * 100 : 0;

                return (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors border-b"
                  >
                    <td className="py-4 px-6 font-medium text-gray-800">{order.name}</td>
                    <td className="py-4 px-6 text-gray-600">{qty}</td>
                    <td className="py-4 px-6 text-gray-600">₹{avg.toFixed(2)}</td>
                    <td className="py-4 px-6 text-gray-600">₹{ltp.toFixed(2)}</td>
                    <td className="py-4 px-6 text-gray-800 font-semibold">₹{curValue.toFixed(2)}</td>
                    <td className={`py-4 px-6 ${profClass}`}>₹{pnl.toFixed(2)}</td>
                    <td className={`py-4 px-6 ${profClass}`}>{avg > 0 ? netChange.toFixed(2) + "%" : "-"}</td>
                    <td className={`py-4 px-6 font-semibold ${order.mode === "BUY" ? "text-green-600" : "text-red-600"}`}>
                      {order.mode}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
