import React from "react";

function Contact({ darkMode }) {
  return (
    <main className={`${darkMode ? "dark-2" : ""} main`}>
      <div className="content contact">
        <h3 className="contact__heading heading-3">Contact Me</h3>

        <form>
          <label htmlFor="name">Name</label>
          <input type="text" required className={`${darkMode ? "dark" : ""}`} />

          <label htmlFor="email">Email</label>
          <input type="email" required className={`${darkMode ? "dark" : ""}`} />

          <label htmlFor="message">Message</label>
          <textarea cols="20" rows="5" required className={`${darkMode ? "dark" : ""}`}></textarea>

          <input type="submit" value="Send" className={`${darkMode ? "dark" : ""} btn`} />
        </form>
      </div>
    </main>
  );
}

export default Contact;
