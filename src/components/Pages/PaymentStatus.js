import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

function PaymentStatus({ darkMode }) {
  const { paymentId } = useParams();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let intervalId;

    const pollStatus = async () => {
      try {
        const res = await fetch(`https://api.daze-t.com/api/check-payment?payment_id=${paymentId}`);
        const data = await res.json();
        setPaymentData(data);
        setLoading(false);

        if (["finished", "failed", "expired"].includes(data.status)) {
          clearInterval(intervalId);
        }
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

  const status = paymentData?.status;

  // Status UI mapping
  const statusMap = {
    finished: { color: "#22c55e", icon: "✅" },
    failed: { color: "#ef4444", icon: "❌" },
    expired: { color: "#ef4444", icon: "⛔" },
    partial_payment: { color: "#f59e0b", icon: "🟠" },
    confirming: { color: "#3b82f6", icon: "⏳" },
    waiting: { color: "#3b82f6", icon: "⏳" },
  };

  const currentStatus = statusMap[status] || {
    color: "#3b82f6",
    icon: "⏳",
  };

  const isBlinking = !["finished", "failed", "expired"].includes(status);

  return (
    <main className={`${darkMode ? "dark-2" : ""} main`}>
      <div className="content content-payment">
        <div className="card payment-card" style={{ textAlign: "center" }}>
          <h3 className="contact__heading">Payment Details</h3>

          {/* QR Code */}
          <div className="payment__qr-code">
            <QRCodeSVG value={paymentData?.pay_address || ""} size={180} />
          </div>

          <div className="payment-info">
            <p>
              Send{" "}
              <strong>
                {paymentData?.pay_amount} {paymentData?.pay_currency?.toUpperCase()}
              </strong>
            </p>

            <small>Please send the exact amount shown to avoid delay.</small>
            <br />

            <small>(Approx {paymentData?.amount_kes} KES)</small>

            <div className="payment__address-container" style={{ marginTop: "1.5rem" }}>
              <label>Address:</label>

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
                <div className="payment__copy-address">
                  {copied ? "✅ Copied!" : "Click to copy address"}
                </div>
              </div>
            </div>
          </div>

          {/* STATUS BANNER */}
          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              borderRadius: "6px",
              fontWeight: "bold",
              border: `2px solid ${currentStatus.color}`,
              color: currentStatus.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <span>{currentStatus.icon}</span>

            <span>{status?.toUpperCase()}</span>

            {isBlinking && (
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: currentStatus.color,
                  animation: "blink 1s infinite",
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Blink animation */}
      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </main>
  );
}

export default PaymentStatus;
