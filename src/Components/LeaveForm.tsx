import React from "react";
import "react-datepicker/dist/react-datepicker.css";
// import { Button, DatePickerProps } from "antd";
// import { DatePicker} from "antd";
import Menu from "./Menu";
import Navbar from "./Navbar";
// import TableNavbar from "./TableNavbar";
import LeaveFormComp from "./LeaveFormComp";
// import axios from "axios";
// import { GlobalInfo } from "../App";
// import dayjs from "dayjs";

// const { RangePicker } = DatePicker;
// interface Project {
//   ProID: string | number;
//   clientName: string;
//   projectName: string;
//   projectDescription: string;
// }

// interface Task {
//   EvngTaskID: number;
//   projectName: string;
//   phaseName: string;
//   module: string;
//   task: string;
//   actTime: string;
//   estTime: string;
//   upWorkHrs: number;
//   employeeID: string;
//   currDate: string;
// }

// interface Employee {
//   EmpID: string | number;
//   firstName: string;
//   role: string;
//   dob: string | Date;
//   EmployeeID: string;
// }

// interface AssignedEmployees {
//   PhaseAssigneeID: number;
//   projectName: string;
//   phaseName: string;
//   assignedNames: string[];
//   EmployeeID: string[];
// }

// interface AssignedEmployee {
//   assignedNames: string[];
//   EmployeeID: string[];
// }

const LeaveForm: React.FC = () => {

  return (
    <div className="emp-main-div">
      <div
        style={{
          display: "flex", flexDirection: "column", width: 'auto'
        }}
        className="form-container"
      >
        <LeaveFormComp />
      </div>
    </div>
  );
};

export default LeaveForm;
