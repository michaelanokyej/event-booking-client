import React from "react";
import "./EventList.css";
import EventItem from "./EventItem/EventItem";

const eventList = (props) => {
  const events = props.events.map((event) => {
    return (
      <EventItem
        key={event._id}
        eventId={event._id}
        description={event.description}
        category={event.category}
        title={event.title}
        price={event.price}
        date={event.date}
        userId={props.loggedInUserId}
        creatorId={event.creator._id}
        onDetail={props.onViewDetail}
      />
    );
  });

  return <div className="home_event_list"><ul className="event__list">{events}</ul></div>;
};

export default eventList;
