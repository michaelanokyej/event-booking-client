import React, { Component } from "react";
import "./Events.css";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/auth-context";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

class Events extends Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null,
  };

  isActive = true;

  MySwal = withReactContent(Swal)


  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
    this.categoryElRef = React.createRef();
  }

  componentWillMount = () => {
    this.fetchEvents();
  };

  startCreatEventHandler = () => {
    this.setState({ creating: true });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const category = this.categoryElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      category.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    // const event = {
    //   title,
    //   price,
    //   date,
    //   description,
    //   category
    // };

    const requestBody = {
      query: `
      mutation CreateEvent($title: String!, $description: String!, $category: String!, $price: Float!, $date: String! ) {
        createEvent(eventInput: {title: $title, description: $description, category: $category, price: $price, date: $date}) {
          _id
          title
          category
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
        category
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
            category: resData.data.createEvent.category,
            description: resData.data.createEvent.description,
            date: resData.data.createEvent.date,
            price: resData.data.createEvent.price,
            creator: {
              _id: this.context.userId,
            },
          });
          return { events: updatedEvents };
        });
        this.MySwal.fire({
          icon: 'success',
          title: 'Created!',
          text: `Your event: ${resData.data.createEvent.title} has been created!`,
        })
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
        if(this.isActive) {
        this.setState({ events, isLoading: false });
        }
      })
      .catch((err) => {
        if(this.isActive) {
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

  showDetailHandler = (eventId) => {
    this.setState((prevState) => {
      const selectedEvent = prevState.events.find((e) => e._id === eventId);
      return { selectedEvent: selectedEvent };
    });
  };

  bookEventHandler = () => {
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
        this.MySwal.fire({
          icon: 'success',
          title: 'Booked!',
          text: "Your booking was successful!!!",
        })
      this.setState({selectedEvent: null})
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

  componentWillUnmount = () => {
    this.isActive = false;
  }

  render() {
    return (
      <>
        {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
            confirmText="Confirm"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.dateElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="category">Category</label>
                <select ref={this.categoryElRef}>
                  <option value=""></option>
                  <option value="indoor">InDoor</option>
                  <option value="outdoor">OutDoor</option>
                </select>
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  ref={this.descriptionElRef}
                ></textarea>
              </div>
            </form>
          </Modal>
        )}
        {this.state.selectedEvent && (
          <Modal
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.bookEventHandler}
            confirmText={this.context.token ? "Book" : "Confirm" }
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>
              ${this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share you own Events!</p>
            <button className="btn" onClick={this.startCreatEventHandler}>
              Create Event
            </button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EventList
            events={this.state.events}
            loggedInUserId={this.context.userId}
            onViewDetail={this.showDetailHandler}
          />
        )}
      </>
    );
  }
}

export default Events;
