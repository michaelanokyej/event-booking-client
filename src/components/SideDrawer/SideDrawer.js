import React from "react";
import { NavLink } from "react-router-dom";
import "./SideDrawer.css";
import AuthContext from "../../context/auth-context";

class SideDrawer extends React.Component {
  static contextType = AuthContext;

  render() {
    let drawerClasses = "side-drawer";
    if (this.props.show) {
      drawerClasses = "side-drawer open";
    }

    return (
      <nav
        className={drawerClasses}
        onClick={() => {
          this.context.backDropClickHandler();
        }}
      >
        <ul>
          {!this.context.token && (
            <>
              <li
                onClick={() => {
                  this.context.backDropClickHandler();
                }}
              >
                <NavLink to="/auth">Auth</NavLink>
              </li>
            </>
          )}
          {this.context.token && (
            <>
              <li
                onClick={() => {
                  this.context.backDropClickHandler();
                }}
              >
                <NavLink to="/events">Events</NavLink>
              </li>
              <li
                onClick={() => {
                  this.context.backDropClickHandler();
                }}
              >
                <NavLink to="/bookings">Bookings</NavLink>
              </li>
              <li
                onClick={() => {
                  this.context.backDropClickHandler();
                }}
              >
                <button onClick={this.context.logout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    );
  }
}

export default SideDrawer;
