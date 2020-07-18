import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import Bookings from "./pages/Bookings";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context";
import Footer from "./components/Footer/Footer";
// import SideDrawer from "./components/SideDrawer/SideDrawer";
// import BackDrop from "./components/Backdrop/Backdrop";
import { tokenService } from "./components/TokenService";

class App extends Component {
  state = {
    token: tokenService.token,
    userId: tokenService.myEventlyUserId,
    expiration: null,
    username: tokenService.myEventlyUsername,
    sideDrawerOpen: false
  };
  // Switch works in a way that on one Route,
  // The first matching route is used
  login = (token, userId, expiration, username) => {
    tokenService.create(token);
    tokenService.storeUser(username, userId);
    this.setState({ token, userId, expiration, username });
  };

  logout = () => {
    tokenService.remove();
    this.setState({
      token: null,
      userId: null,
      expiration: null,
      username: null,
    });
  };

  // drawerToggleClickHandler = () => {
  //   this.setState(prevState => {
  //     return { sideDrawerOpen: !prevState.sideDrawerOpen };
  //   });
  // };

  // backDropClickHandler = () => {
  //   this.setState({ sideDrawerOpen: false });
  // };

  render() {
    // let backDrop;

    // if (this.state.sideDrawerOpen) {
    //   backDrop = <BackDrop />;
    // }
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              expiration: this.state.expiration,
              username: this.state.username,
              login: this.login,
              logout: this.logout,
              // backDropClickHandler: this.backDropClickHandler,
              // drawerToggleClickHandler: this.drawerToggleClickHandler,
            }}
          >
            <MainNavigation />
            {/* <SideDrawer show={this.state.sideDrawerOpen} />
            {backDrop} */}
            <main className="main-content">
              <Switch>
                {!this.state.token && <Redirect from="/" to="/auth" exact />}
                {!this.state.token && (
                  <Redirect from="/bookings" to="/auth" exact />
                )}
                {!this.state.token && (
                  <Redirect from="/events" to="/auth" exact />
                )}
                {!this.state.token && <Redirect from="/me" to="/auth" exact />}
                {this.state.token && <Redirect from="/" to="/events" exact />}
                {this.state.token && (
                  <Redirect from="/auth" to="/events" exact />
                )}
                {!this.state.token && <Route path="/auth" component={Auth} />}
                <Route path="/events" component={Events} />
                {this.state.token && (
                  <Route path="/bookings" component={Bookings} />
                )}
              </Switch>
            </main>
            <Footer />
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
