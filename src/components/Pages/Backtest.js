import React, { useState } from "react";

function Backtest({ darkMode }) {
  const [formData, setFormData] = useState({
    instrument: "AUD_USD",
    month: "1",
    year: "2026",
  });

  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", msg: "Pulling data and generating report..." });

    try {
      // Point this to your Flask backend URL
      const response = await fetch("http://localhost:8080/api/run-backtest", {
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

  return (
    <main className={`${darkMode ? "dark-2" : ""} main p-8`}>
      <h1 className="text-2xl font-bold mb-4">Backtest Engine</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        {/* Instrument Select */}
        <label className="flex flex-col">
          Pair:
          <select
            name="instrument"
            value={formData.instrument}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="AUD_USD">AUD_USD</option>
            <option value="NZD_JPY">NZD_JPY</option>
            <option value="EUR_USD">EUR_USD</option>
            {/* Add more pairs based on your hardcoded strings [cite: 4] */}
          </select>
        </label>

        {/* Month Select */}
        <label className="flex flex-col">
          Month:
          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            className="p-2 border rounded"
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
            className="p-2 border rounded"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Run Backtest"}
        </button>
      </form>

      {/* Status Messages */}
      {status.msg && (
        <div
          className={`mt-4 p-2 rounded ${status.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
        >
          {status.msg}
        </div>
      )}
    </main>
  );
}

export default Backtest;
