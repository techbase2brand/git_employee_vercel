import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { DatePickerProps } from "antd";
import { DatePicker, Space, Select, Radio, Tabs, RadioChangeEvent } from "antd";
// import { Select, Space } from 'antd';
import Menu from "./Menu";
import Navbar from "./Navbar";
import EmployeeTable from "./EmployeeTable";
import TaskTable from "./TaskTable";
import DashboardTable from "./DashboardTable";
import axios from "axios";
import { format } from "date-fns";


// type TabPosition = "morning" | "evening";

interface Employee {
  EmpID: number;
  firstName: string;
  role: string;
  dob: Date;
}

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


const Dashboard: React.FC = () => {
  // const [mode, setMode] = useState<TabPosition>("morning");
  const [data, setData] = useState<any>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [ totalEstHrs, setTotalEstHrs] = useState<any>()
  const [ setTotalUpWorkHrs, setSetTotalUpWorkHrs] = useState<any>()


  const formattedDate = format(currentDate, "yyyy-MM-dd");

  useEffect(() => {



    axios
      .get<Task[]>("https://empbackend.base2brand.com/get/addTaskMorning",{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        }
      })
      .then((response) => {
     const res = response.data.filter((obj)=> obj.currDate === formattedDate )
        // (response.data);
        const sortedData = res.sort((a, b) => Number(b.MrngTaskID) - Number(a.MrngTaskID));
     const result = sortedData.reduce((acc: Record<string, any>, obj) => {
       if (!acc[obj.employeeID]) {
            acc[obj.employeeID] = [];
          }
          acc[obj.employeeID].push(obj);
          return acc;
        }, {});


        setData(result);
        // sort the data array in reverse order based on ProID
        // const sortedData = response.data.sort((a, b) => Number(b.MrngTaskID) - Number(a.MrngTaskID));
        // setData(sortedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);





  return (
    <div className="emp-main-div">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          // maxHeight:'90%'
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
            >
              <DashboardTable
              data={data}
              totalEstHrs={totalEstHrs} setTotalEstHrs={setTotalEstHrs}  setTotalUpWorkHrs={setTotalUpWorkHrs}
               setSetTotalUpWorkHrs={setSetTotalUpWorkHrs}/>
            </div>
            <div style={{ width: "90%", height: "80%", marginTop: "3%" }}>
              <div style={{}}>
                <TaskTable data={data} totalEstHrs={totalEstHrs} setTotalEstHrs={setTotalEstHrs}
                setTotalUpWorkHrs={setTotalUpWorkHrs}  setSetTotalUpWorkHrs={setSetTotalUpWorkHrs}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



