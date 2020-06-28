import React, { Component } from "react";
import "./Auth.css";
import AuthContext from "../context/auth-context";
import HomeEventList from "../components/Events/HomeEventList/HomeEventList";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import Spinner from "../components/Spinner/Spinner";
import { Redirect } from "react-router-dom";
// import AuthForm from "../components/Auth/AuthForm/AuthForm"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

class Auth extends Component {
  state = {
    events: [],
    isLogin: true,
    signingIn: false,
    signUpToggle: "container",
    signInForm: true,
  };

  isActive = true;

  MySwal = withReactContent(Swal)

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
          category
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
      })
      .catch((err) => {
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
        this.MySwal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed!: Something went wrong.',
          footer: `<p>ERROR: ${" "} ${err}</p>`
        })
      });
  };

  switchModeHandler = () => {
    this.setState((prevState) => {
      return {
        isLogin: !prevState.isLogin,
        signInForm: !prevState.signInForm,
      };
    });
  };

  signInHandler = (event) => {
    event.preventDefault();
    // the ref prop gives us a "current" prop
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    // lets check if both inputs have values
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    // lets send request if both have values
    const requestBody = {
      query: `
        query Login($email: String!, $password: String!){
          login(email: $email, password: $password){
            userId
            token
            tokenExpiration
            username
          }
        }
      `,
      variables: {
        email,
        password,
      },
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
          this.MySwal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed!: Something went wrong.',
            footer: '<p>Please check your input!</p>'
          })
          // throw new Error("Failed!: Something went wrong. Please check your input!");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.data.login.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration,
            resData.data.login.username
          );
        }
      })
      .catch((err) => {
        this.MySwal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed!: Something went wrong.',
          footer: `<p>ERROR: ${" "} ${err}</p>`
        })
      });
  };

  signUpHandler = (event) => {
    event.preventDefault();
    // the ref prop gives us a "current" prop
    const first_name = this.userFirstNameEl.current.value;
    const last_name = this.userLastNameEl.current.value;
    const username = this.usernameEl.current.value;
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    // lets check if both inputs have values
    if (
      email.trim().length === 0 ||
      password.trim().length === 0 ||
      first_name.trim().length === 0 ||
      last_name.trim().length === 0 ||
      username.trim().length === 0
    ) {
      return;
    }

    // lets send request all inputs have values
    const requestBody = {
      query: `
      mutation CreateUser($email: String!, $password: String!, $first_name: String!, $last_name: String!, $username: String!){
        createUser(userInput: {email: $email, password: $password, first_name: $first_name, last_name: $last_name, username: $username}) {
          userId
          token
          tokenExpiration
          username
        }
      }
      `,
      variables: {
        email,
        password,
        first_name,
        last_name,
        username,
      },
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
          this.MySwal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed!: Something went wrong.',
            footer: '<p>Please check your input!</p>'
          })
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData)
        console.log("token:", resData.data.createUser.token)
        if (resData.data.createUser.token) {
          this.context.login(
            resData.data.createUser.token,
            resData.data.createUser.userId,
            resData.data.createUser.tokenExpiration,
            resData.data.createUser.username
          );
        }
      })
      .catch((err) => {
        this.MySwal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed!: Something went wrong.',
          footer: `<p>ERROR: ${" "} ${err}</p>`
        })
      });
  };

  modalCancelHandler = () => {
    this.setState({ signingIn: false });
  };

  handleEventButton = () => {
    this.setState({ signingIn: true });
  };

  // handleShownForm = () => {
  //   if(this.state.signInSignUpForm === "signUp") {
  //     return
  //   }
  // }

  render() {
    const content =
      this.state.events.length === 0 ? (
        <Spinner />
      ) : (
        <HomeEventList
          events={this.state.events}
          onButtonClick={this.handleEventButton}
        />
      );
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
                  onSubmit={this.signInHandler}
                >
                  <section className="demoUser">
                    <p>TEST USER</p>
                    <p>Email: test@test.com</p>
                    <p>Password: test</p>
                  </section>
                  <h1>Sign in</h1>
                  <div className="welcome__text">
                    <h4>Welcome Back!</h4>
                    <h4>Please login with your info</h4>
                  </div>
                  <label htmlFor="email">Email</label>
                  <input
                    required
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    ref={this.emailEl}
                  />
                  <label htmlFor="password">Password</label>
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
                  onSubmit={this.signUpHandler}
                >
                  <h1>Create Account</h1>
                  <div className="welcome__text">
                    <h4>Hello, Friend!</h4>
                    <p>Explore all events around you!</p>
                  </div>
                  <label htmlFor="first_name">First Name</label>
                  <input
                    required
                    placeholder="First name"
                    type="text"
                    name="first_name"
                    id="first_name"
                    ref={this.userFirstNameEl}
                  />
                  <label htmlFor="last_name">Last Name</label>
                  <input
                    required
                    placeholder="Last name"
                    type="text"
                    name="last_name"
                    id="last_name"
                    ref={this.userLastNameEl}
                  />
                  <label htmlFor="email">Email</label>
                  <input
                    required
                    type="email"
                    name="email"
                    id="email"
                    placeholder="test@test.com"
                    ref={this.emailEl}
                  />
                  <label htmlFor="username"> Username</label>
                  <input
                    required
                    type="username"
                    name="username"
                    id="username"
                    placeholder="username"
                    ref={this.usernameEl}
                  />
                  <label htmlFor="password">Password</label>
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
        {/* <form className="auth-form" onSubmit={this.signInHandler}>
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
        </form> */}
        {/* <AuthForm onSubmit={this.switchModeHandler}/> */}
        {/* <HomeEventList
          events={this.state.events}
          onButtonClick={this.handleEventButton}
        /> */}
        <div className="welcome__div">
          <h1>Welcome!</h1>
          <img className="construction_logo" src="web-under-construction.jpeg" alt="under construction" />
          <button onClick={this.handleEventButton}>Sign In</button>
        </div>
        {content}
      </>
    );
  }
}

export default Auth;
