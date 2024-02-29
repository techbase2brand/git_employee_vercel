import React, { useState, useEffect, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Menu from "./Menu";
import Navbar from "./Navbar";
import EveningTaskTable from "./EveningTaskTable";
import axios from "axios";
import { format } from "date-fns";
import { GlobalInfo } from "../App";
import { Spin } from "antd";

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
  actTime: string;
  selectDate: string;
}
const ViewEveningTask: React.FC = () => {
  const [data, setData] = useState<Task[]>([]);
  const [currentDate] = useState<Date>(new Date());
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const { evngEditID, setEvngEditID } = useContext(GlobalInfo);
  const [loading, setLoading] = useState(true);

  const myDataString = localStorage.getItem('myData');
  let employeeID = "";
  if (myDataString) {
    const myData = JSON.parse(myDataString);
    employeeID = myData.EmployeeID;
  }

  // useEffect(() => {
  //   axios
  //     .get<Task[]>(`${process.env.REACT_APP_API_BASE_URL}/get/addTaskEvening`, {

  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("myToken")}`,
  //       },
  //     })
  //     .then((response) => {
  //       const arr = response?.data?.filter(
  //         (e) => e?.employeeID === employeeID && e?.currDate === formattedDate
  //       ) || [];
  //       const sortedData = arr.sort(
  //         (a, b) => Number(b.EvngTaskID) - Number(a.EvngTaskID)
  //       );
  //       setData(sortedData);
  //       setLoading(false);

  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       setLoading(false);
  //     });
  // }, [employeeID, formattedDate]);

  useEffect(() => {
    axios
      .get<Task[]>(`${process.env.REACT_APP_API_BASE_URL}/get/addTaskEvening/individual`, {
        params: {
          employeeID: employeeID,
          currDate: formattedDate,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [employeeID, formattedDate]);

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
                  Evening Status
                </p>
              </div>
              {loading ?
                <Spin size="large" className="spinner-antd" />
                :
                <EveningTaskTable
                  data={data}
                  evngEditID={evngEditID}
                  setEvngEditID={setEvngEditID}
                />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEveningTask;
