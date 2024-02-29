import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Input, Spin } from "antd";

import TaskTable from "./TaskTable";
import DashboardTable from "./DashboardTable";
import axios from "axios";
import { format } from "date-fns";

const { Search } = Input;

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
  const [data, setData] = useState<any>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [totalEstHrs, setTotalEstHrs] = useState<any>()
  const [setTotalUpWorkHrs, setSetTotalUpWorkHrs] = useState<any>()
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  // const [loading, setLoading] = useState(true);
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(event.target.value);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query.toLowerCase());
  };
  useEffect(() => {
    axios
      .get<Task[]>(`${process.env.REACT_APP_API_BASE_URL}/get/addTaskMorning`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        }
      })
      .then((response) => {
        const res = response.data.filter((obj) => obj.currDate === formattedDate)
        const sortedData = res.sort((a, b) => Number(b.MrngTaskID) - Number(a.MrngTaskID));
        const result = sortedData.reduce((acc: Record<string, any>, obj) => {
          if (!acc[obj.employeeID]) {
            acc[obj.employeeID] = [];
          }
          acc[obj.employeeID].push(obj);
          return acc;
        }, {});
        setData(result);
        // setLoading(false);
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
            >
              <DashboardTable
                data={data}
                totalEstHrs={totalEstHrs} setTotalEstHrs={setTotalEstHrs} setTotalUpWorkHrs={setTotalUpWorkHrs}
                setSetTotalUpWorkHrs={setSetTotalUpWorkHrs} />
            </div>
            <div style={{ width: "90%", height: "80%", marginTop: "3%" }}>
              <div style={{ display: 'flex' }}>
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
                </div>
              </div>
              <div style={{}} className="dashboard-handle">
                {/* {loading ?
                  <Spin size="large" className="spinner-antd"/>
                  : */}
                <TaskTable data={data} totalEstHrs={totalEstHrs} setTotalEstHrs={setTotalEstHrs}
                  setTotalUpWorkHrs={setTotalUpWorkHrs} setSetTotalUpWorkHrs={setSetTotalUpWorkHrs}
                  selectedRole={selectedRole} searchQuery={searchQuery}
                />
                {/* } */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



