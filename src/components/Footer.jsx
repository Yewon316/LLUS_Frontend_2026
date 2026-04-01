import React from "react";
import logo from "./image/moim_logo.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <img src={logo} alt="Moim" className="footer__logo" />
        <div className="footer__copy">© 2026 LLUS. All rights reserved.</div>
        <div className="footer__links">
          <a href="#terms">Terms of Service</a>
          <a href="#about">About the Service</a>
          <a href="#privacy">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
