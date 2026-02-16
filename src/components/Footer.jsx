import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__logo">Logo</div>
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
