import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
import BookingList from "../components/Bookings/BookingList/BookingList";
import BookingsChart from "../components/Bookings/BookingsChart/BookingsChart";
import BookingsControl from "../components/Bookings/BookingsControls/BookingsControls";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

class Bookings extends Component {
  state = {
    isLoading: false,
    bookings: [],
    outputType: "list",
  };

  MySwal = withReactContent(Swal);

  static contextType = AuthContext;

  componentDidMount = () => {
    this.fetchBookings();
  };

  fetchBookings = () => {
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
        this.setState({ isLoading: false });
        this.MySwal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed!: Something went wrong.",
          footer: `<p>ERROR: ${" "} ${err}</p>`,
        });
      });
  };

  deleteBookingHandler = (bookingId) => {
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
        this.MySwal.fire({
          icon: "success",
          title: "Cancelled!",
          text: `Your booking for ${resData.data.cancelBooking.title} has been cancelled`,
        });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        this.MySwal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed!: Something went wrong.",
          footer: `<p>ERROR: ${" "} ${err}</p>`,
        });
      });
  };

  changeOutputTypeHandler = (outputType) => {
    if (outputType === "list") {
      this.setState({ outputType: "list" });
    } else {
      this.setState({ outputType: "chart" });
    }
  };
  render() {
    let content = <Spinner />;
    if (!this.state.isLoading) {
      content = (
        <>
          <BookingsControl
            activeOutputType={this.state.outputType}
            onChange={this.changeOutputTypeHandler}
          />
          <div>
            {this.state.outputType === "list" ? (
              <BookingList
                bookings={this.state.bookings}
                onDelete={this.deleteBookingHandler}
              />
            ) : (
              <BookingsChart bookings={this.state.bookings} />
            )}
          </div>
        </>
      );
    }

    return (
      <>
        {this.state.bookings.length === 0 ? (
          <h1>You do not have any bookings yet!</h1>
        ) : (
          content
        )}
      </>
    );
  }
}

export default Bookings;
