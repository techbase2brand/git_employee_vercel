import React from "react";
import "react-datepicker/dist/react-datepicker.css";
// import { Button, DatePickerProps } from "antd";
// import { DatePicker} from "antd";
import Menu from "./Menu";
import Navbar from "./Navbar";
// import TableNavbar from "./TableNavbar";
import HrLeaveAutoFillComp from "./HrLeaveAutoFillComp";

const HrLeaveAutoFill: React.FC = () => {

  return (
    <div className="emp-main-div">
      <div
        style={{
          display: "flex", flexDirection: "column", width: 'auto'
        }}
        className="form-container"
      >
          <HrLeaveAutoFillComp />
          </div>
      </div>
  );
};

export default HrLeaveAutoFill;
