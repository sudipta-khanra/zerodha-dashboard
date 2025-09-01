import React, { useState, useContext } from "react";
import GeneralContext from "./GeneralContext";
import axios from "axios";
import "./SellActionWindow.css";

const SellActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [modalMessage, setModalMessage] = useState(""); // Modal text
  const [showModal, setShowModal] = useState(false); // Modal visibility

  const { closeSellWindow } = useContext(GeneralContext);
  const token = localStorage.getItem("token"); // JWT token

  const handleSellClick = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3002/sellOrder",
        {
          name: uid,
          qty: Number(stockQuantity),
          price: Number(stockPrice),
          mode: "SELL",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show message in modal (success or error)
      setModalMessage(response.data.message || "Order processed");
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        setModalMessage("");
        if (response.data.success) closeSellWindow(); // Close window only on success
      }, 2500);
    } catch (error) {
      setModalMessage(
        error.response?.data?.message || "An unexpected error occurred"
      );
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        setModalMessage("");
        closeSellWindow();
      }, 2500);
    }
  };

  const handleCancelClick = () => {
    closeSellWindow();
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  return (
    <div className="container" id="sell-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              value={stockPrice}
              step="0.05"
              onChange={(e) => setStockPrice(Number(e.target.value))}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <button className="btn btn-red" onClick={handleSellClick}>
            Sell
          </button>
          <button className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p style={{ color: "red", fontWeight: "bold", fontSize: "1.1rem" }}>
              {modalMessage}
            </p>
            <button className="btn btn-grey" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellActionWindow;
