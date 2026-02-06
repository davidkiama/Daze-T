import React, { useState, useEffect } from "react";
import Select from "react-select";

function Home({ darkMode }) {
  const [usdAmount, setUsdAmount] = useState("");
  const [kesAmount, setKesAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [baseRate, setBaseRate] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");

  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const MARKUP_LOW_VOLUME = -10;
  const MARKUP_HIGH_VOLUME = -5;
  const THRESHOLD_KES = 1000;
  const MIN_USD = 0.1;

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await response.json();
        setBaseRate(data.rates.KES);
      } catch (err) {
        console.error("Rate fetch failed", err);
      }
    };
    fetchRate();
  }, []);

  // ================= Currencies =================
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await fetch("https://api.daze-t.com/api/currencies");
        const data = await res.json();
        setCurrencies(data || []);
      } catch (e) {
        console.error("Currency load failed");
      }
    };

    fetchCurrencies();
  }, []);

  const getActiveRate = (currentKes) => {
    const markup = parseFloat(currentKes) < THRESHOLD_KES ? MARKUP_LOW_VOLUME : MARKUP_HIGH_VOLUME;
    return baseRate + markup;
  };

  const validateAmounts = (usd) => {
    if (usd !== "" && parseFloat(usd) < MIN_USD) {
      setError(`Minimum trade is $${MIN_USD} USD`);
    } else {
      setError("");
    }
  };

  const handleUsdChange = (e) => {
    const val = e.target.value;
    setUsdAmount(val);

    if (val && baseRate) {
      // Logic: Determine rate tier based on potential KES
      let potentialKes = val * (baseRate + MARKUP_HIGH_VOLUME);
      let finalRate =
        potentialKes < THRESHOLD_KES ? baseRate + MARKUP_LOW_VOLUME : baseRate + MARKUP_HIGH_VOLUME;

      // ROUND DOWN: Use Math.floor so the state is an integer
      const convertedKes = Math.floor(val * finalRate);
      setKesAmount(convertedKes);
    } else {
      setKesAmount("");
    }
    validateAmounts(val);
  };

  const handleKesChange = (e) => {
    const val = e.target.value;
    setKesAmount(val);

    if (val && baseRate) {
      const activeRate = getActiveRate(val);
      // We keep USD as a decimal for precision
      const convertedUsd = (val / activeRate).toFixed(2);
      setUsdAmount(convertedUsd);
      validateAmounts(convertedUsd);
    } else {
      setUsdAmount("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error || !usdAmount || !phone || !selectedCurrency)
      return alert("Please select currency and correct the errors.");

    setLoading(true);

    // Ensure data sent to database is rounded down
    const transactionData = {
      usd: parseFloat(usdAmount),
      kes: Math.floor(parseFloat(kesAmount)),
      phone: phone,
      currency: selectedCurrency?.value,
    };

    try {
      const response = await fetch("https://api.daze-t.com/api/create-trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      const data = await response.json();
      if (response.ok && data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        setError(data.error || "Transaction failed");
      }
    } catch (err) {
      console.error("Connection Error:", err);
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: darkMode ? "#202020" : "#f8f8f8",
      borderColor: "#c0c0c0",
      boxShadow: "none",
      minHeight: "5.5rem",
      fontSize: "2rem",
    }),

    singleValue: (base) => ({
      ...base,
      color: darkMode ? "#fff" : "#000",
    }),

    input: (base) => ({
      ...base,
      color: darkMode ? "#fff" : "#000",
    }),

    placeholder: (base) => ({
      ...base,
      color: darkMode ? "#aaa" : "#666",
    }),

    menu: (base) => ({
      ...base,
      backgroundColor: darkMode ? "#202020" : "#fff",
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? darkMode
          ? "#333"
          : "#eee"
        : darkMode
          ? "#202020"
          : "#fff",
      color: darkMode ? "#fff" : "#000",
      cursor: "pointer",
    }),
  };

  return (
    <main className={`${darkMode ? "dark-2" : ""} main`}>
      <section className="content content-home">
        <div className="content contact">
          <h3 className="contact__heading heading-3">Crypto To M-pesa</h3>

          <form onSubmit={handleSubmit}>
            <Select
              options={currencies}
              styles={selectStyles}
              value={selectedCurrency}
              onChange={(option) => {
                setSelectedCurrency(option);
                setUsdAmount("");
                setKesAmount("");
                setError("");
              }}
              placeholder="Select currency"
            />

            <label>USD Amount</label>
            <input
              type="number"
              step="any"
              value={usdAmount}
              onChange={handleUsdChange}
              placeholder={`Min $${MIN_USD}`}
              required
              className={`${darkMode ? "dark" : ""} ${error.includes("USD") ? "input-error" : ""}`}
            />

            <label>Amount to receive (KES)</label>
            <input
              type="number"
              value={kesAmount}
              onChange={handleKesChange}
              placeholder="Enter amount"
              required
              className={`${darkMode ? "dark" : ""}`}
            />

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
            <span className="small-text">Consider Litecoin for low fees</span>

            {error && (
              <div className="validation-error display" style={{ marginTop: "0.5rem" }}>
                ⚠️ {error}
              </div>
            )}

            <input
              type="submit"
              value={loading ? "Generating Invoice..." : "Proceed to Payment"}
              disabled={!!error || !usdAmount || !selectedCurrency || loading}
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
