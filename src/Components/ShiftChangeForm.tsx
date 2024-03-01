import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import ShiftChangeFormComp from "./ShiftChangeFormComp";

const ShiftChangeForm: React.FC = () => {
  return (
    <div className="emp-main-div">
      <div
        style={{
          margin: '3rem'
        }}
      >
        <ShiftChangeFormComp />
      </div>
    </div>

  );
};

export default ShiftChangeForm;
