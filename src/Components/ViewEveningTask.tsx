import React, { useState, useEffect, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
// import type { DatePickerProps } from "antd";
// import {RadioChangeEvent } from "antd";
import Menu from "./Menu";
import Navbar from "./Navbar";
import EveningTaskTable from "./EveningTaskTable";
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
  EvngTaskID: number;
  projectName: string;
  phaseName: string;
  module: string;
  task: string;
  estTime: string;
  upWorkHrs: string;
  employeeID: string;
  currDate: string;
  actTime : string;
}
const ViewEveningTask: React.FC = () => {
  // const [mode, setMode] = useState<TabPosition>("morning");
  const [data, setData] = useState<Task[]>([]);
  const [employeeID, setEmployeeID] = useState<string>("");
  // const [selectedDateRange, setSelectedDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [currentDate] = useState<Date>(new Date());
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const { evngEditID, setEvngEditID } = useContext(GlobalInfo);
  //  const handleChange = (value: string) => {
  //     console.log(`selected ${value}`);
  //   };

  // const handleModeChange = (e: RadioChangeEvent) => {
  //   setMode(e.target.value);
  // };

  useEffect(() => {
    console.log("234567890234567890-");
    axios
      .get<Task[]>("http://localhost:5000/get/addTaskEvening",{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        const arr = response?.data?.filter(
          (e) => e?.employeeID === employeeID && e?.currDate === formattedDate
        ) || [];

        // sort the data array in reverse order based on ProID
        const sortedData = arr.sort(
          (a, b) => Number(b.EvngTaskID) - Number(a.EvngTaskID)
        );
        setData(sortedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [employeeID, formattedDate]);

  const dataString = localStorage.getItem("myData");

  // Parse the JSON string back into an array
  useEffect(() => {
    const employeeInfo = dataString ? JSON.parse(dataString) : [];
    const firstEmployeeID = employeeInfo?.EmployeeID;
    setEmployeeID(firstEmployeeID);
  }, [formattedDate, dataString]);

  return (
    <div className="emp-main-div">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{ height: "8%" }}>
          <Navbar />
        </div>
        <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
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
            ></div>
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
                  Evening Tasks
                </p>
              </div>
              <EveningTaskTable
                data={data}
                evngEditID={evngEditID}
                setEvngEditID={setEvngEditID}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEveningTask;
