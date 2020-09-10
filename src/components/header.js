import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import Logo from "../images/i-want-to-book-court.png";

import "./header.scss"

const Header = ({ siteTitle }) => (
  <header>
    <h1>
      <img src={Logo} alt="" />
      {siteTitle}
    </h1>

    <button>
      網站推送通知
    </button>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
