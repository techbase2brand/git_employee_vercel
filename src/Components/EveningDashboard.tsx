import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { DatePickerProps } from "antd";
import { DatePicker, Space, Select, Radio, Tabs, RadioChangeEvent ,Input } from "antd";
// import { Select, Space } from 'antd';
import Menu from "./Menu";
import Navbar from "./Navbar";
import EmployeeTable from "./EmployeeTable";
import DashboardEveningTasktable from "./DashboardEveningTasktable";
import EveningDashboardTable from "./EveningDashboardTable";
import axios from "axios";
import { format } from "date-fns";

const { RangePicker } = DatePicker;
const { Search } = Input;

type TabPosition = "morning" | "evening";

interface Employee {
  EmpID: number;
  firstName: string;
  role: string;
  dob: Date;
}

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
}

const EveningDashboard: React.FC = () => {
  const [mode, setMode] = useState<TabPosition>("morning");
  const [data, setData] = useState<any>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [totalUpwork, setTotalUpWork] = useState<any>();
  const [totalEstHrs, setTotalEstHrs] = useState<any>();
  const [totalUpworkhrs, setTotalUpworkhrs] = useState<any>();
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(event.target.value);
  };



  const formattedDate = format(currentDate, "yyyy-MM-dd");

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
  };


  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
  };



  useEffect(() => {
    const apiUrl = "https://empbackend.base2brand.com/get/addTaskEvening";
   axios
      .get<Task[]>(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        let filteredData;

        if (dateRange[0] && dateRange[1]) {
          const startDate = new Date(dateRange[0]!).getTime();  // using the non-null assertion '!'
          const endDate = new Date(dateRange[1]!).getTime();    // using the non-null assertion '!'

          filteredData = response.data.filter((obj) => {
            const taskDate = new Date(obj.currDate).getTime();

            return taskDate >= startDate && taskDate <= endDate;

          });
        console.log("filteData1",filteredData)

        } else {
          filteredData = response.data.filter(
            (obj) => obj.currDate === formattedDate
          );
        }
        console.log("filteData2",filteredData)

        const sortedData = filteredData.sort(
          (a, b) => Number(b.EvngTaskID) - Number(a.EvngTaskID)
        );

        const result = sortedData.reduce((acc: Record<string, any>, obj) => {
          if (!acc[obj.employeeID]) {
            acc[obj.employeeID] = [];
          }
          acc[obj.employeeID].push(obj);
          return acc;
        }, {});

        setData(result);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [dateRange, formattedDate]);

  console.log(data,"dataresultresultresultresultresult");


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query.toLowerCase());
  };



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
            style={{ display: "flex", flexDirection: "column" , paddingTop:"16px" }}
            className="form-container"
          >
            <div
            style={{ display: "flex", flexDirection: "row" ,width:"100%" }}
            >
            <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <RangePicker onChange={handleDateRangeChange} />
        </div>


  <div style={{
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "space-between",
}}> {/* This ensures the dropdown takes up as much space as possible */}
    <select
      id="roleSelect"
      style={{
        width: 300,
        padding: '10px 12px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
        appearance: 'none',
        backgroundColor: '#f7f7f7'
      }}
      value={selectedRole}
      onChange={handleRoleChange}
    >
      <option value="" disabled hidden>Select a role</option>
      <option value="">All Roles</option>
      <option value="Software Developer">Software Developer</option>
      <option value="Digital Marketer">Digital Marketer</option>
      <option value="Graphic Designer">Graphic Designer</option>
      <option value="HR">HR</option>
      <option value="QA">QA</option>
      <option value="Sales Campus">Sales Campus</option>
      <option value="Sales Infotech">Sales Infotech</option>
    </select>
  </div>





        <div style={{
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "space-between",
}}>
  <Search
    placeholder="Search by employee, phase, module, or project"
    onChange={handleSearchChange}
    style={{ width: 300 }}
  />
  {/* <RangePicker onChange={handleDateRangeChange} /> */}
</div>


   </div>

            <div
              style={{
                display: "flex",
                width: "80%",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <EveningDashboardTable
               data={data}
                totalUpwork={totalUpwork}
                setTotalUpWork={setTotalUpWork}
                totalEstHrs={totalEstHrs}
                setTotalEstHrs={setTotalEstHrs}
                totalUpworkhrs={totalUpworkhrs}
                setTotalUpworkhrs={setTotalUpworkhrs}
              />
            </div>
            <div style={{ width: "90%", height: "80%", marginTop: "3%" }}>
              <div style={{}} className="dashboard-handle">
                <DashboardEveningTasktable
                  data={data}
                  totalUpwork={totalUpwork}
                  setTotalUpWork={setTotalUpWork}
                  totalEstHrs={totalEstHrs}
                  setTotalEstHrs={setTotalEstHrs}
                  totalUpworkhrs={totalUpworkhrs}
                  setTotalUpworkhrs={setTotalUpworkhrs}
                  searchQuery={searchQuery}
                  selectedRole={selectedRole}
                  setSelectedRole={setSelectedRole}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EveningDashboard;

