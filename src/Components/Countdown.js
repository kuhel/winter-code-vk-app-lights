import React from "react";
import ReactDOM from "react-dom";
import Countdown from "react-countdown-now";

export default ({ time, renderer }) => {
  return <Countdown date={time} renderer={renderer} />;
}
