/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect,useContext} from "react";
import "react-datepicker/dist/react-datepicker.css";
// import type { DatePickerProps } from "antd";
// import { RadioChangeEvent } from "antd";
import Menu from "./Menu";
import Navbar from "./Navbar";
import ViewShiftChangeTable  from "./ViewShiftChangeTable";
// import DashboardTable from "./DashboardTable";
import axios from "axios";
import { format } from "date-fns";
import { GlobalInfo } from "../App";

// type TabPosition = "morning" | "evening";
// interface Employee {
//   EmpID: number;
//   firstName: string;
//   role: string;
//   dob: Date;
// }

interface Task {
  MrngTaskID: number;
  projectName: string;
  phaseName: string;
  module: string;
  task: string;
  estTime: string;
  upWorkHrs: number;
  employeeID: string;
  currDate: string;
}

const ViewShiftChange: React.FC = () => {
  // const [mode, setMode] = useState<TabPosition>("morning");
  // const [data, setData] = useState<any>();
  const [employeeID] = useState<string>("");
  const [currentDate] = useState<Date>(new Date());
  const[editID ] = useState<unknown>()

  const {  setMrngEditID,  } = useContext(GlobalInfo);

  if(editID){
    setMrngEditID(editID)
  }

  const formattedDate = format(currentDate, "yyyy-MM-dd");



  return (
    <div className="emp-main-div">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#F7F9FF",
        }}
      >
        <div style={{ height: "8%" }}>
          <Navbar />
        </div>
        <div style={{  width: "92%", display: "flex", flexDirection: "row", height: "90%" }}>
          <div className="menu-div">
            <Menu />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column" }}
            className="form-container"
          >
            <div
              style={{
                display: "flex",
                width: "80%",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
            </div>
            <div style={{ width: "90%", height: "80%", marginTop: "3%" }}>
            <div
              style={{
                display: "flex",
                width: "80%",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <p
                style={{
                  color: "#094781",
                  justifyContent: "flex-start",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
              >
               Shift Change List
              </p>
            </div>
                <ViewShiftChangeTable  />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ViewShiftChange;
