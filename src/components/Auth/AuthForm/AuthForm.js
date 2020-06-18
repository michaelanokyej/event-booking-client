import React, { Component } from "react";
import "./AuthForm.css"

class authForm extends Component {
  state = {
    signUpToggle: "container",
    signInForm
  };

  handleSignUpToggle = () => {
    this.setState({ signUpToggle: "container right-panel-active" });
  };

  handleSignInToggle = () => {
    this.setState({
      signUpToggle: "container",
    });
  };

  handleSubmitSignIn = (e) => {
    e.preventDefault();

    const { email, password } = e.target;
    const userInfo = {
      email: email.value,
      password: password.value,
    };

    this.context.logIn(userInfo);
  };

  handleSubmitSignUp = (e) => {
    e.preventDefault();

    const { username, first_name, last_name, email, password } = e.target;
    const newUser = {
      username: username.value,
      first_name: first_name.value,
      last_name: last_name.value,
      email: email.value,
      password: password.value,
    };

    this.context.signUp(newUser);
  };

render(){
  return (
    <>
    {this.state.signInForm ? (
      <div className="form-container sign-in-container">
      <form
        action="#"
        className="sign-in-container-form"
        onSubmit={this.submitHandler}
      >
        <section className="demoUser">
          <p>TEST USER</p>
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
        onSubmit={this.submitHandler}
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
    </>
  )
}
}


export default authForm;