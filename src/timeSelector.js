import React, { useState } from "react";
import { TimePicker } from "react-ios-time-picker";

const MyApp = () => {
  const [value, setValue] = useState("10:00");

  const onChange = (timeValue) => {
    setValue(timeValue);
  };

  return (
    <div>
      <TimePicker onChange={onChange} value={value} />
    </div>
  );
};

export default MyApp;
