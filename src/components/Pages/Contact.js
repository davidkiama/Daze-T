import React, { useState } from "react";

function Contact({ darkMode }) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", msg: "" });

    try {
      const response = await fetch("https://api.daze-t.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({ type: "success", msg: "Message sent! We'll get back to you soon." });
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error();
      }
    } catch (err) {
      setStatus({ type: "error", msg: "Something went wrong. Please try WhatsApp." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`${darkMode ? "dark-2" : ""} main`}>
      <div className="content contact">
        <h3 className="contact__heading heading-3">Contact Me</h3>

        {status.msg && (
          <div
            className={`status-banner ${status.type}`}
            style={{
              color: status.type === "success" ? "#4CAF50" : "#f44336",
              textAlign: "center",
              marginBottom: "15px",
            }}
          >
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            required
            className={`${darkMode ? "dark" : ""}`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <label>Email</label>
          <input
            type="email"
            required
            className={`${darkMode ? "dark" : ""}`}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <label>Message</label>
          <textarea
            cols="20"
            rows="5"
            required
            className={`${darkMode ? "dark" : ""}`}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          ></textarea>

          <input
            type="submit"
            value={loading ? "Sending..." : "Send"}
            disabled={loading}
            className={`${darkMode ? "dark" : ""} btn`}
          />
        </form>

        <a
          target="blank"
          href="https://wa.me/254756861096?text=Hello support"
          className="whatsapp-link"
        >
          Contact us on WhatsApp
        </a>
      </div>
    </main>
  );
}

export default Contact;
