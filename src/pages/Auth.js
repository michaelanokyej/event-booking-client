import React, { Component, createRef } from "react";
import "./Auth.css";
import AuthContext from "../context/auth-context";
import HomeEventList from "../components/Events/HomeEventList/HomeEventList";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import Spinner from "../components/Spinner/Spinner";
import { Redirect } from "react-router-dom";

class Auth extends Component {
  state = {
    events: [],
    isLogin: true,
    signingIn: false,
    signUpToggle: "container",
    signInForm: true
  };

  isActive = true;

  static contextType = AuthContext;
  // I am using references here to reference the input elements
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
    this.userFirstNameEl = React.createRef();
    this.userLastNameEl = React.createRef();
    this.usernameEl = React.createRef();
  }

  componentWillMount = () => {
    this.fetchEvents();
  };

  fetchEvents = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
      query {
        events {
          _id
          title
          description
          date
          price
          creator {
            _id
            email
          }
        }
      }
      `,
    };

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        const events = resData.data.events;
        if (this.isActive) {
          this.setState({ events, isLoading: false });
        }
        console.log(this.state.events);
      })
      .catch((err) => {
        console.log(err);
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  };

  switchModeHandler = () => {
    this.setState((prevState) => {
      return {
        isLogin: !prevState.isLogin,
        signInForm: !prevState.signInForm
      };
    });
  };

  submitHandler = (event) => {
    event.preventDefault();
    // the ref prop gives us a "current" prop
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    // lets check if both inputs have values
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    // lets send request if both have values
    let requestBody = {
      query: `
        query Login($email: String!, $password: String!){
          login(email: $email, password: $password){
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email,
        password,
      },
    };
    if (!this.state.isLogin) {
      requestBody = {
        query: `
      mutation CreateUser($email: String!, $password: String!){
        createUser(userInput: {email: $email, password: $password}) {
          _id
          email
        }
      }
      `,
        variables: {
          email,
          password,
        },
      };
    }

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.data.login.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  modalCancelHandler = () => {
    this.setState({ signingIn: false });
  };

  handleEventButton = () => {
    console.log("button clicked!!!");
    this.setState({ signingIn: true });
  };

  // handleShownForm = () => {
  //   if(this.state.signInSignUpForm === "signUp") {
  //     return
  //   }
  // }

  render() {
    return (
      <>
        {this.context.token && <Redirect to="/events" />}
        {this.state.signingIn && <Backdrop />}
        {this.state.signingIn && (
          <Modal
            title="Welcome"
            styleClasses="modal signUp__signIn"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.switchModeHandler}
            confirmText={this.state.isLogin ? "SignUp" : "Login"}
          >
            {this.state.signInForm ? (
              <div className="form-container sign-in-container">
              <form
                action="#"
                className="sign-in-container-form"
                onSubmit={this.submitHandler}
              >
                <section className="demoUser">
                  <p>Email: test@test.com</p>
                  <p>Password: test</p>
                </section>
                <h1>Sign in</h1>
                <div className="welcome__text">
                <h4>Welcome Back!</h4>
                <p>
                  Please login with your info
                </p>
                </div>
                <input
                  required
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  ref={this.emailEl}
                />
                <input
                  required
                  type="password"
                  placeholder="Password"
                  name="password"
                  id="password"
                  ref={this.passwordEl}
                />
                <button type="submit">Sign In</button>
              </form>
            </div>
            ) : (
              <div className="form-container sign-up-container">
              <form
                action="#"
                className="signUp__signIn-form"
                onSubmit={this.submitHandler}
              >
                <h1>Create Account</h1>
                <div className="welcome__text">
                  <h4>Hello, Friend!</h4>
                  <p>Explore all events around you!</p>
                </div>
                <input
                  required
                  placeholder="First name"
                  type="text"
                  name="first_name"
                  id="first_name"
                  ref={this.userFirstNameEl}
                />
                <input
                  required
                  placeholder="Last name"
                  type="text"
                  name="last_name"
                  id="last_name"
                  ref={this.userLastNameEl}
                />
                <input
                  required
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  ref={this.emailEl}
                />
                <input
                  required
                  type="username"
                  name="username"
                  id="username"
                  placeholder="username"
                  ref={this.usernameEl}
                />
                <input
                  required
                  type="password"
                  placeholder="Password"
                  name="password"
                  id="password"
                  ref={this.passwordEl}
                />
                <button type="submit">Sign Up</button>
              </form>
            </div>
            )}
            
            
          </Modal>
        )}
        <form className="auth-form" onSubmit={this.submitHandler}>
          <div className="form-control">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" ref={this.emailEl} />
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" ref={this.passwordEl} />
          </div>
          <div className="form-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={this.switchModeHandler}>
              Switch to {this.state.isLogin ? "SignUp" : "Login"}
            </button>
          </div>
        </form>
        <HomeEventList
          events={this.state.events}
          onButtonClick={this.handleEventButton}
        />
      </>
    );
  }
}

export default Auth;