import React from "react";
import Countdown from "react-countdown-now";

export default ({ time, renderer }) => {
  return <Countdown date={time} renderer={renderer} />;
}
