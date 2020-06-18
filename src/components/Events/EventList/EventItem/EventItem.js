import React from "react";
import "./EventItem.css";

const eventItem = (props) => {
  return (
    <>
      {/* <li className="event__list-item" key={props.eventId}>
        <div>
          <h1>{props.title}</h1>
          <h2>
            ${props.price} - {new Date(props.date).toLocaleDateString()}
          </h2>
        </div>
        <div>
          {props.userId === props.creatorId ? (
            <p>You're the owner of this event</p>
          ) : (
            <button
              className="btn"
              onClick={props.onDetail.bind(this, props.eventId)}
            >
              View Details
            </button>
          )}
        </div>
      </li> */}
      <li key={props.eventId} className="event">
        <div className="event__item-img">
          <img
            src={
              props.category === "indoor"
                ? "indoor-event-img.jpg"
                : "outdoor-event-img.jpg"
            }
            alt="event"
          />
        </div>
        <div className="event__item-content">
          <h4>{props.title}</h4>
          <div className="event__item-content_details">
            <p>
              {new Date(props.date).toLocaleDateString()}{" "}
              {new Date(props.date).toLocaleTimeString()}{" "}
            </p>
          </div>
          <div>
            {props.userId === props.creatorId ? (
              <p>You're the owner of this event</p>
            ) : (
              <button
                className="event__item-button"
                onClick={props.onDetail.bind(this, props.eventId)}
              >
                View Details
              </button>
            )}
          </div>
        </div>
      </li>
    </>
  );
};

export default eventItem;
