import React, { useState, useEffect, useContext, useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Menu from "./Menu";
import Navbar from "./Navbar";
import MorningTaskTable from "./MorningTaskTable";
import axios from "axios";
import { format } from "date-fns";
import { GlobalInfo } from "../App";
import { Spin } from "antd";

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
  const [data, setData] = useState<any>();
  const [currentDate] = useState<Date>(new Date());
  const [editID] = useState<any>();
  const { mrngEditID, setMrngEditID } = useContext(GlobalInfo);
  const [loading, setLoading] = useState(true);

  if (editID) {
    setMrngEditID(editID);
  }
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const myDataString = localStorage.getItem('myData');
  let employeeID = "";
  if (myDataString) {
    const myData = JSON.parse(myDataString);
    employeeID = myData.EmployeeID;
  }

  // useEffect(() => {
  //   axios
  //     .get<Task[]>(`${process.env.REACT_APP_API_BASE_URL}/get/addTaskMorning`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("myToken")}`,
  //       },
  //     })
  //     .then((response) => {
  //       const res = response.data.filter((e) => e?.employeeID == employeeID && e?.currDate == formattedDate);
  //       const sortedData = res.sort(
  //         (a, b) => Number(b.MrngTaskID) - Number(a.MrngTaskID)
  //       );
  //       setData(sortedData);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       setLoading(false);
  //     });
  // }, [formattedDate]);
  useEffect(() => {
    setLoading(true);  // Ensure loading is set to true at the start of data fetching

    const url = new URL(`${process.env.REACT_APP_API_BASE_URL}/get/addTaskMorning/individual`);

    // Append query parameters for employeeID and currDate
    url.searchParams.append("employeeID", employeeID);
    url.searchParams.append("currDate", formattedDate);

    axios.get<Task[]>(url.toString(), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("myToken")}`,
      },
    })
    .then((response) => {
      setData(response.data.sort((a, b) => Number(b.MrngTaskID) - Number(a.MrngTaskID)));
      setLoading(false);
    })
    .catch((error) => {
      console.error(error);
      setLoading(false);
    });
  }, [formattedDate, employeeID]);  // 
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
       
        <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
         
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
              {loading ? (
                <Spin size="large" className="spinner-antd" />
              ) : (
                <MorningTaskTable
                  data={data}
                  mrngEditID={mrngEditID}
                  setMrngEditID={setMrngEditID}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMorningTask;
