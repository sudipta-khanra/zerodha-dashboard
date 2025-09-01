import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";
const API_URL = process.env.REACT_APP_API_URL;

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [modalMessage, setModalMessage] = useState(""); // modal text
  const [showModal, setShowModal] = useState(false); // modal visibility

  const { closeBuyWindow } = useContext(GeneralContext);

  // JWT token from localStorage
  const token = localStorage.getItem("token");

  // const handleBuyClick = async () => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:3002/newOrder",
  //       {
  //         name: uid,
  //         qty: Number(stockQuantity),
  //         price: Number(stockPrice),
  //         mode: "BUY",
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     // Show success message in modal
  //     setModalMessage(response.data.message || "Order placed successfully!");
  //     setShowModal(true);

  //     setTimeout(() => {
  //       setShowModal(false);
  //       setModalMessage("");
  //       closeBuyWindow(); // close window after success
  //     }, 2500);
  //   } catch (error) {
  //     setModalMessage(
  //       error.response?.data?.message || "Failed to place order"
  //     );
  //     setShowModal(true);

  //     setTimeout(() => {
  //       setShowModal(false);
  //       setModalMessage("");
  //       closeBuyWindow(); // close window on error too
  //     }, 2500);
  //   }
  // };
const handleBuyClick = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/newOrder`, // ✅ use environment variable
      {
        name: uid,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode: "BUY",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Show success message in modal
    setModalMessage(response.data.message || "Order placed successfully!");
    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
      setModalMessage("");
      closeBuyWindow(); // close window after success
    }, 2500);
  } catch (error) {
    setModalMessage(error.response?.data?.message || "Failed to place order");
    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
      setModalMessage("");
      closeBuyWindow(); // close window on error too
    }, 2500);
  }
};

  const handleCancelClick = () => {
    closeBuyWindow();
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(Number(e.target.value))}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <button className="btn btn-blue" onClick={handleBuyClick}>
            Buy
          </button>
          <button className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p style={{ color: "green", fontWeight: "bold", fontSize: "1.1rem" }}>
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

export default BuyActionWindow;
