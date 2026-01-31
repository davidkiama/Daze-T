import React from "react";

function Footer() {
  return (
    <footer
      className="footer"
      style={{ padding: "2rem", backgroundColor: "#1a1a1a", borderTop: "2px solid #C0C0C0" }}
    >
      <div
        className="footer__content"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          className="footer__icons"
          style={{ display: "flex", gap: "2rem", marginBottom: "1rem" }}
        >
          <a href="https://x.com/Daze_T_official" target="_blank" rel="noopener noreferrer">
            <svg style={{ width: "2.5rem", height: "2.5rem", fill: "#C0C0C0" }}>
              <use xlinkHref="img/sprite.svg#twitter-svgrepo-com"></use>
            </svg>
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61587418375785"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg style={{ width: "2.5rem", height: "2.5rem", fill: "#C0C0C0" }}>
              <use xlinkHref="img/sprite.svg#facebook-svgrepo-com"></use>
            </svg>
          </a>
          <a
            href="https://www.instagram.com/daze_t_official/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg style={{ width: "2.5rem", height: "2.5rem", fill: "#C0C0C0" }}>
              <use xlinkHref="img/sprite.svg#instagram-svgrepo-com"></use>
            </svg>
          </a>

          <a
            href="https://wa.me/254756861096?text=Hello support"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg style={{ width: "2.5rem", height: "2.5rem", fill: "#C0C0C0" }}>
              <use xlinkHref="img/sprite.svg#whatsapp-svgrepo-com"></use>
            </svg>
          </a>
        </div>
        <p className="copyright" style={{ color: "#C0C0C0", fontSize: "1.2rem" }}>
          &copy; {new Date().getFullYear()} CryptoMpesa. All rights reserved.
        </p>

        <p className="copyright" style={{ color: "#C0C0C0", fontSize: "1.2rem" }}>
          Email: admin@daze-t.com
        </p>
      </div>
    </footer>
  );
}

export default Footer;
