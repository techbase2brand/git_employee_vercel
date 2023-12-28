import React, { useState, useEffect, useContext, useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
// import type { DatePickerProps } from "antd";
// import { DatePicker, Space, Select, Radio, Tabs, RadioChangeEvent } from "antd";
import Menu from "./Menu";
import Navbar from "./Navbar";
import MorningTaskTable from "./MorningTaskTable";
// import DashboardTable from "./DashboardTable";
import axios from "axios";
import { format } from "date-fns";
import { GlobalInfo } from "../App";

// type TabPosition = "morning" | "evening";

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
  selectDate: string;
}

const ViewMorningTask: React.FC = () => {
  // const [mode, setMode] = useState<TabPosition>("morning");
  const [data, setData] = useState<any>();
  const [employeeID, setEmployeeID] = useState<string>("");
  const [currentDate] = useState<Date>(new Date());
  const [editID] = useState<any>();
  const { mrngEditID, setMrngEditID } = useContext(GlobalInfo);
  if (editID) {
    setMrngEditID(editID);
  }
  const formattedDate = format(currentDate, "yyyy-MM-dd");

  useEffect(() => {
    axios
      .get<Task[]>(`${process.env.REACT_APP_API_BASE_URL}/get/addTaskMorning`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        console.log(response.data,employeeID,"gghhhhhppppp------====");

        const res = response.data.filter((e) => e?.employeeID == employeeID && e?.currDate == formattedDate);




        // console.log(res,"aassssdddfff");


        const sortedData = res.sort(
          (a, b) => Number(b.MrngTaskID) - Number(a.MrngTaskID)
        );
        console.log(sortedData, "bbbb----");

        setData(sortedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [employeeID, formattedDate]);

  const dataString = localStorage.getItem("myData");

  // Parse the JSON string back into an array
  const employeeInfo = useMemo(
    () => (dataString ? JSON.parse(dataString) : []),
    [dataString]
  );


  useEffect(() => {
    setEmployeeID(employeeInfo?.EmployeeID);
  }, []);

  console.log(employeeID,"ggfff---rrrrr");


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
                  Morning Tasks
                </p>
              </div>
              <MorningTaskTable
                data={data}
                mrngEditID={mrngEditID}
                setMrngEditID={setMrngEditID}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMorningTask;
