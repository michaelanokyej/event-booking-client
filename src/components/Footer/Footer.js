import React from "react";
import "./Footer.css";
import AuthContext from "../../context/auth-context";
import { NavLink } from "react-router-dom";

const footer = (props) => {
  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <footer>
            <div className="footer-navigation__items">
              <ul>
                {!context.token && (
                  <>
                    <li className="footer__auth-link">
                      <NavLink to="/auth">Auth</NavLink>
                    </li>
                  </>
                )}
                {context.token && (
                  <>
                    <li>
                      <NavLink to="/events">
                        <img src="events-icon.png" alt="events" />
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/bookings">
                        <img src="bookings-icon.png" alt="bookings" />
                      </NavLink>
                    </li>
                    <li>
                      <button onClick={context.logout}>
                        <img src="logout.png" alt="logout" />
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="portfolio__link-div">
              <a href="https://michaelanokye.com/">
                <h4>© Michael Anokye</h4>
              </a>
            </div>
          </footer>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default footer;
