import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react"; // Import the QR library

function PaymentStatus({ darkMode }) {
  const { paymentId } = useParams();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let intervalId;
    const pollStatus = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/check-payment?payment_id=${paymentId}`);
        const data = await res.json();
        setPaymentData(data);
        setLoading(false);
        if (["finished", "failed", "expired"].includes(data.status)) clearInterval(intervalId);
      } catch (err) {
        console.error("Poll error:", err);
      }
    };

    pollStatus();
    intervalId = setInterval(pollStatus, 15000);
    return () => clearInterval(intervalId);
  }, [paymentId]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="content">Loading...</div>;

  return (
    <main className={`${darkMode ? "dark-2" : ""} main`}>
      <div className="content">
        <div className="card payment-card" style={{ textAlign: "center" }}>
          <h3 className="contact__heading">Payment Details</h3>

          {/* QR Code Section */}
          <div
            style={{
              background: "white",
              padding: "1rem",
              display: "inline-block",
              borderRadius: "8px",
              margin: "1rem 0",
            }}
          >
            <QRCodeSVG value={paymentData?.pay_address || ""} size={180} />
          </div>

          <div className="payment-info">
            <p>
              Send{" "}
              <strong>
                {paymentData?.pay_amount} {paymentData?.pay_currency?.toUpperCase()}
              </strong>
            </p>
            <small>(Approx {paymentData?.amount_kes} KES)</small>

            <div className="address-container" style={{ marginTop: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", color: "#888" }}>
                Address:
              </label>
              <div
                className="copy-box"
                onClick={() => copyToClipboard(paymentData?.pay_address)}
                style={{
                  cursor: "pointer",
                  background: darkMode ? "#333" : "#f4f4f4",
                  padding: "10px",
                  borderRadius: "5px",
                  wordBreak: "break-all",
                  border: "1px solid #555",
                }}
              >
                <code>{paymentData?.pay_address}</code>
                <div style={{ fontSize: "0.7rem", marginTop: "5px", color: "green" }}>
                  {copied ? "✅ Copied!" : "Click to copy address"}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`status-banner ${paymentData?.status}`}
            style={{
              marginTop: "2rem",
              padding: "1rem",
              borderRadius: "5px",
              fontWeight: "bold",
              border: "1px solid",
            }}
          >
            Status: {paymentData?.status?.toUpperCase()}
          </div>
        </div>
      </div>
    </main>
  );
}

export default PaymentStatus;
