import React, { useState, useEffect } from "react";
import Select from "react-select";

function Backtest({ darkMode }) {
  const [formData, setFormData] = useState({
    instrument: "AUD_USD",
    month: "1",
    year: "2026",
  });

  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const [currencyPairs, setCurrencyPairs] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await fetch("https://api.daze-t.com/api/currency-pairs");
        const data = await res.json();
        setCurrencyPairs(data || []);
      } catch (e) {
        console.error("Currency load failed");
      }
    };

    fetchCurrencies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", msg: "Pulling data and generating report..." });

    try {
      // Point this to your Flask backend URL
      const response = await fetch("https://api.daze-t.com/api/run-backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to generate report");

      // Handle the binary Excel file response
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${formData.instrument}_${formData.year}_${formData.month}_backtest.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      setStatus({ type: "success", msg: "Backtest complete! Downloading file..." });
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", msg: "An error occurred while running the backtest." });
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
    <main className={`${darkMode ? "dark-2" : ""} main p-8`}>
      <div className="content contact">
        <h1 className="text-2xl font-bold mb-4">Backtest Engine</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
          <Select
            name="instrument"
            options={currencyPairs}
            styles={selectStyles}
            // 1. react-select needs the full object to display the currently selected item
            value={currencyPairs.find((pair) => pair.value === formData.instrument) || null}
            onChange={(option) => {
              // 2. We still update selectedCurrency if you need it elsewhere...
              setSelectedCurrency(option);

              // 3. THE FIX: Update the actual formData so it gets sent to the backend!
              setFormData({ ...formData, instrument: option.value });
            }}
            placeholder="Select currency"
          />

          {/* Month Select */}
          <label className="flex flex-col">
            Month:
            <select
              name="month"
              value={formData.month}
              onChange={handleChange}
              className={`${darkMode ? "dark" : ""}`}
            >
              {[...Array(12).keys()].map((m) => (
                <option key={m + 1} value={m + 1}>
                  {m + 1}
                </option>
              ))}
            </select>
          </label>

          {/* Year Input */}
          <label className="flex flex-col">
            Year:
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={`${darkMode ? "dark" : ""}`}
            />
          </label>

          <input
            type="submit"
            disabled={loading}
            value={loading ? "Generating..." : "Run Backtest"}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          />
        </form>

        {/* Status Messages */}
        {status.msg && (
          <div
            className={`mt-4 p-2 rounded ${status.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
          >
            {status.msg}
          </div>
        )}
      </div>
    </main>
  );
}

export default Backtest;
