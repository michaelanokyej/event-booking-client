import React from "react";
import { NavLink } from "react-router-dom";
import "./MainNavigation.css";
import AuthContext from "../../context/auth-context";

const mainNavigation = (props) => {
  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <header className="main-navigation">
            <div className="main-navigation__logo">
              {/* <h1>AfriConnect</h1> */}
              <h1>Evently</h1>
            </div>
            <nav className="main-navigation__items">
              <ul>
                {!context.token && (
                  <>
                  <li>
                    <NavLink to="/auth">Auth</NavLink>
                  </li>
                  {/* <li>
                  <button onClick={context.logout}>Sign In</button>
                </li> */}
                </>
                )}
                {/* <li>
                  <NavLink to="/events">Events</NavLink>
                </li> */}
                {context.token && (
                  <>
                  <li>
                  <NavLink to="/events">Events</NavLink>
                </li>
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                  <li>
                    <NavLink to="/me">Profile</NavLink>
                  </li>
                  <li>
                    <button onClick={context.logout}>Logout</button>
                  </li>
                  </>
                )}
              </ul>
            </nav>
          </header>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default mainNavigation;
