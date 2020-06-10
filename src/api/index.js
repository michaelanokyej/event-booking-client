export const submitHandler = (event) => {
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
      password
    }
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
      password
    }
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

export const fetchEvents = () => {
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
      if(this.isActive) {
      this.setState({ events, isLoading: false });
      }
    })
    .catch((err) => {
      console.log(err);
      if(this.isActive) {
      this.setState({ isLoading: false });
      }
    });
};

export const modalConfirmHandler = () => {
  this.setState({ creating: false });
  const title = this.titleElRef.current.value;
  const price = +this.priceElRef.current.value;
  const date = this.dateElRef.current.value;
  const description = this.descriptionElRef.current.value;

  if (
    title.trim().length === 0 ||
    price <= 0 ||
    date.trim().length === 0 ||
    description.trim().length === 0
  ) {
    return;
  }

  const event = {
    title,
    price,
    date,
    description,
  };
  console.log(event);

  const requestBody = {
    query: `
    mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String! ) {
      createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date}) {
        _id
        title
        description
        date
        price
      }
    }
    `,
    variables: {
      title,
      price,
      date,
      description,
    }
  };

  const token = this.context.token;

  fetch("http://localhost:5000/graphql", {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed");
      }
      return res.json();
    })
    .then((resData) => {
      this.setState((prevState) => {
        const updatedEvents = [...prevState.events];
        updatedEvents.push({
          _id: resData.data.createEvent._id,
          title: resData.data.createEvent.title,
          description: resData.data.createEvent.description,
          date: resData.data.createEvent.date,
          price: resData.data.createEvent.price,
          creator: {
            _id: this.context.userId,
          },
        });
        return { events: updatedEvents };
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const bookEventHandler = () => {
  if(!this.context.token) {
    this.setState({selectedEvent: null})
    return;
  }

  const requestBody = {
    query: `
    mutation BookEvent($eventId: ID!) {
      bookEvent(eventId: $eventId) {
        _id
        createdAt
        updatedAt
      }
    }
    `,
    variables: {
      eventId: this.state.selectedEvent._id
    }
  };


  fetch("http://localhost:5000/graphql", {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.context.token
    },
  })
    .then((res) => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed");
      }
      return res.json();
    })
    .then((resData) => {
      console.log(resData)
    this.setState({selectedEvent: null})
    })
    .catch((err) => {
      console.log(err);
    });
};

export const fetchBookings = () => {
  this.setState({ isLoading: true });
  const requestBody = {
    query: `
    query {
      bookings {
        _id
       createdAt
       event {
         _id
         title
         date
         price
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
      Authorization: "Bearer " + this.context.token,
    },
  })
    .then((res) => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed");
      }
      return res.json();
    })
    .then((resData) => {
      const bookings = resData.data.bookings;
      this.setState({ bookings, isLoading: false });
    })
    .catch((err) => {
      console.log(err);
      this.setState({ isLoading: false });
    });
};

export const deleteBookingHandler = (bookingId) => {
  this.setState({ isLoading: true });
  const requestBody = {
    query: `
    mutation CancelBooking($id: ID!) {
      cancelBooking(bookingId: $id){
        _id
        title
      }
    }
    `,
    variables: {
      id: bookingId,
    },
  };

  fetch("http://localhost:5000/graphql", {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.context.token,
    },
  })
    .then((res) => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed");
      }
      return res.json();
    })
    .then((resData) => {
      this.setState((prevState) => {
        const updatedBookings = prevState.bookings.filter((booking) => {
          return booking._id !== bookingId;
        });
        return { bookings: updatedBookings, isLoading: false };
      });
    })
    .catch((err) => {
      console.log(err);
      this.setState({ isLoading: false });
    });
};