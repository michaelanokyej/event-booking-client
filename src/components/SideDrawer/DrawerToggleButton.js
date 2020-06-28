import React from "react";
import "./DrawerToggleButton.css";
import AuthContext from "../../context/auth-context";

const DrawerToggleButton = () => (
  <AuthContext.Consumer>
  {(context) => {
    return (
      <button
        className="toggle-button"
        onClick={e => context.drawerToggleClickHandler()}
      >
        <div className="toggle-button__line"></div>
        <div className="toggle-button__line"></div>
        <div className="toggle-button__line"></div>
      </button>
    );
  }
  }
  </AuthContext.Consumer>
)

export default DrawerToggleButton;
