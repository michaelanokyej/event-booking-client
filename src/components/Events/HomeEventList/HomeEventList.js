import React from "react";
// import HomeEventListItem from "./HomeEventListItem/HomeEventListItem"
import "./HomeEventList.css";

const homeEventList = (props) => {
  return (
    <div className="home_event_list">
      <ul>
        {props.events.map((event) => {
          return (
            <li key={event._id} className="event">
              <div className="event__item-img">
                <img src={event.category === "indoor" ? "indoor-event-img.jpg" : "outdoor-event-img.jpg"} alt="event" />
              </div>
              <div className="event__item-content">
                <h4>{event.title}</h4>
                <div className="event__item-content_details">
                  <p>
                    {new Date(event.date).toLocaleDateString()}{" "}
                    {new Date(event.date).toLocaleTimeString()}{" "}
                  </p>
                  <p>{event.description}</p>
                </div>
                <button
                  className="event__item-button"
                  onClick={props.onButtonClick}
                >
                  Sign in to book
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default homeEventList;
