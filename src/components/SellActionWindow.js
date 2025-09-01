import React, { useState, useContext } from "react";
import GeneralContext from "./GeneralContext";
import axios from "axios";
import "./SellActionWindow.css";

const SellActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [modalMessage, setModalMessage] = useState(""); // For modal
  const [showModal, setShowModal] = useState(false);

  const { closeSellWindow } = useContext(GeneralContext);

  const handleSellClick = async () => {
    try {
      const response = await axios.post("http://localhost:3002/sellOrder", {
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode: "SELL",
      });

      if (response.data.success) {
        // Sell order successful
        closeSellWindow();
      } else {
        // Show modal with error message and auto-close
        setModalMessage(response.data.message);
        setShowModal(true);

        setTimeout(() => {
          setShowModal(false);
          setModalMessage("");
          closeSellWindow();
        }, 2500);
      }
    } catch (error) {
      setModalMessage("An unexpected error occurred");
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        setModalMessage("");
        closeSellWindow();
      }, 2500);

      console.error(error);
    }
  };

  const handleCancelClick = () => {
    closeSellWindow();
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
    closeSellWindow(); // Close the window if user clicks manually
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
              onChange={(e) => setStockQuantity(e.target.value)}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              value={stockPrice}
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
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
