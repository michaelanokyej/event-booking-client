import React from "react";
import { NavLink } from "react-router-dom";
import "./MainNavigation.css";
import AuthContext from "../../context/auth-context";
// import DrawerToggleButton from "../SideDrawer/DrawerToggleButton";

const mainNavigation = (props) => {
  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <header className="main-navigation__toolbar">
            <nav className="toolbar__navigation">
              <div className="toolbar__logo">
                <h1>
                  <NavLink to="/">evently</NavLink>
                </h1>
              </div>
              <div className="spacer" />
              <div className="main-navigation__items">
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
                      {/* <li>
                <NavLink to="/me">{context.username}</NavLink>
                  </li> */}
                      <li>
                        <button onClick={context.logout}>Logout</button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              {/* <div className="toolbar__toggle-button">
                <DrawerToggleButton />
              </div> */}
            </nav>
          </header>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default mainNavigation;
