import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__logo">Logo</div>
        <div className="footer__copy">
          © 2026 서비스이름. All rights reserved.
        </div>
        <div className="footer__links">
          <a href="#terms">이용약관</a>
          <a href="#about">서비스소개</a>
          <a href="#privacy">개인정보처리방침</a>
        </div>
      </div>
    </footer>
  );
}
