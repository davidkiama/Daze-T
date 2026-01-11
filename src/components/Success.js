import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function Success({ darkMode }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // These come from the URL constructed in the Node redirect
  const kes = searchParams.get("amount");
  const phone = searchParams.get("phone");

  return (
    <main className={`${darkMode ? "dark-2" : ""} main`}>
      <section className="content">
        <div className="contact" style={{ textAlign: "center", padding: "2rem" }}>
          <h2 style={{ color: "#28a745" }}>🎉 Order Submitted!</h2>

          <div
            style={{
              background: darkMode ? "#333" : "#f4f4f4",
              padding: "20px",
              borderRadius: "10px",
              margin: "20px 0",
            }}
          >
            <p>
              <strong>Amout:</strong> {kes || "Processing..."}
            </p>
            <p>
              <strong>Mpesa number:</strong> {phone || "Processing..."}
            </p>
          </div>

          <p>
            {!kes && !phone ? "Awaiting Blockchain confirmation..." : "Thank you for your order"}
          </p>

          <input
            type="submit"
            value="Back to Home"
            className={`${darkMode ? "dark" : ""} btn`}
            onClick={() => navigate("/")}
            style={{ marginTop: "20px" }}
          />
        </div>
      </section>
    </main>
  );
}

export default Success;
