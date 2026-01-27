import React, { useState, useEffect } from "react";

function Home({ darkMode }) {
  const [usdAmount, setUsdAmount] = useState("");
  const [kesAmount, setKesAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [rate, setRate] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(""); // Holds the OxaPay link

  const markup = -20;
  const MAX_KES = 1000;
  const MIN_USD = 0.1;

  // 1. Fetch Exchange Rate
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await response.json();
        setRate(data.rates.KES + markup);
      } catch (err) {
        console.error("Rate fetch failed", err);
      }
    };
    fetchRate();
  }, [markup]);

  const validateAmounts = (usd, kes) => {
    if (usd !== "" && parseFloat(usd) < MIN_USD) {
      setError(`Minimum trade is $${MIN_USD} USD`);
    } else if (kes !== "" && parseFloat(kes) > MAX_KES) {
      setError(`Maximum limit is ${MAX_KES} KES`);
    } else {
      setError("");
    }
  };

  const handleUsdChange = (e) => {
    const val = e.target.value;
    setUsdAmount(val);
    const convertedKes = val && rate ? (val * rate).toFixed(2) : "";
    setKesAmount(convertedKes);
    validateAmounts(val, convertedKes);
  };

  const handleKesChange = (e) => {
    const val = e.target.value;
    setKesAmount(val);
    const convertedUsd = val && rate ? (val / rate).toFixed(2) : "";
    setUsdAmount(convertedUsd);
    validateAmounts(convertedUsd, val);
  };

  // 2. Handle Payment Creation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final check before sending to backend
    if (error || !usdAmount || !phone) {
      return alert("Please correct the errors before proceeding.");
    }

    setLoading(true);

    const transactionData = {
      usd: parseFloat(usdAmount),
      kes: parseFloat(kesAmount),
      phone: phone,
    };

    try {
      // Point this to your Node.js server URL
      // Use "http://localhost:8080/api/create-trade" for local testing
      const response = await fetch("https://api.daze-t.com/api/create-trade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      const data = await response.json();
      console.log("data", data);

      if (response.ok && data.payment_url) {
        // Option 1: Redirect the user immediately to OxaPay
        window.location.href = data.payment_url;

        // Option 2: If you prefer staying on the page, you can set state
        // setPaymentUrl(data.payment_url);
      } else {
        throw new Error(data.error || "Failed to initiate trade");
      }
    } catch (err) {
      console.error("Connection Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (num) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(num);

  return (
    <main className={`${darkMode ? "dark-2" : ""} main`}>
      <section className="content content-home">
        <div className="content contact">
          <h3 className="contact__heading heading-3">Crypto To M-pesa</h3>

          <form onSubmit={handleSubmit}>
            <div className={`${error ? "display" : "disabled"} validation-error`}>⚠️ {error}</div>

            <label>USD Amount</label>
            <input
              type="number"
              value={usdAmount}
              onChange={handleUsdChange}
              placeholder={`Min $${MIN_USD}`}
              required
              className={`${darkMode ? "dark" : ""} ${error.includes("USD") ? "input-error" : ""}`}
            />

            <label>We Pay (KES)</label>
            <input
              type="number"
              value={kesAmount}
              onChange={handleKesChange}
              placeholder={`Max ${MAX_KES} KES`}
              required
              className={`${darkMode ? "dark" : ""} ${error.includes("KES") ? "input-error" : ""}`}
            />

            <p className={`${kesAmount && !error ? "display" : "disabled"} preview`}>
              Total to send: <strong>{formatCurrency(kesAmount)}</strong>
            </p>

            <label>M-Pesa Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              pattern="^(?:254|\+254|0)?(7|1)\d{8}$"
              placeholder="07..."
              required
              className={`${darkMode ? "dark" : ""}`}
            />
            <span className="small-text">Consider Litecoin for small payments</span>

            <input
              type="submit"
              value={loading ? "Generating Invoice..." : "Proceed to Payment"}
              disabled={!!error || !usdAmount || loading}
              className={`${darkMode ? "dark" : ""} btn`}
              style={{ opacity: error || !usdAmount || loading ? 0.5 : 1 }}
            />
          </form>

          {paymentUrl && (
            <div className="payment-link-box">
              <p>
                If you weren't redirected, <a href={paymentUrl}>click here to pay</a>.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Home;
