import React, { useState, useContext, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Button, DatePickerProps } from "antd";
import { DatePicker, Space, Select, Radio, Tabs, RadioChangeEvent } from "antd";
import Menu from "./Menu";
import Navbar from "./Navbar";
import TableNavbar from "./TableNavbar";
import ViewprojectTable from "./ViewProjectTable";
import axios from "axios";
import { GlobalInfo } from "../App";
// import moment from "moment";
import dayjs from "dayjs";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSync } from "@fortawesome/free-solid-svg-icons";

const { RangePicker } = DatePicker;

// import { DatePicker } from "antd";

interface Project {
  ProID: string | number;
  clientName: string;
  projectName: string;
  projectDescription: string;
}

interface Task {
  EvngTaskID: number;
  projectName: string;
  phaseName: string;
  module: string;
  task: string;
  actTime: string;
  estTime: string;
  upWorkHrs: number;
  employeeID: string;
  currDate: string;
}

interface Employee {
  EmpID: string | number;
  firstName: string;
  role: string;
  dob: string | Date;
  EmployeeID: string;
}

interface AssignedEmployees {
  PhaseAssigneeID: number;
  projectName: string;
  phaseName: string;
  assignedNames: string[];
  EmployeeID: string[];
}

interface AssignedEmployee {
  assignedNames: string[];
  EmployeeID: string[];
}


const AboutProject: React.FC = () => {
  const [projectsInfo, setProjectsInfo] = useState<Project[]>([]);
  const [EveningTasks, setEveningTasks] = useState<Task[]>([]);
  const [projectName, setProjectName] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<any>({
    assignedNames: "",
    EmployeeID: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);

  const [employees, setEmployees] = useState<any[]>([]);
  const [totalActTime, setTotalActTime] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  const [performer, setPerformer] = useState<string>("");
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [individualActTime, setIndividualActTime] = useState<
    { employee: string; actTime: string }[]
  >([]);

  const { projEditObj, setProjEditObj } = useContext(GlobalInfo);

  const handleTotal = (days: number | null = null) => {
    let filteredTaskObject = EveningTasks;

    if (projectName) {
      filteredTaskObject = filteredTaskObject.filter(
        (e) => e.projectName === projectName
      );
    }

    if (selectedEmployee?.assignedNames) {
      const filteredID = employees.filter(
        (e) => e.EmployeeID === selectedEmployee.EmployeeID
      );
      filteredTaskObject = filteredTaskObject.filter(
        (e) => e.employeeID === filteredID[0]?.EmployeeID
      );

      setPerformer(selectedEmployee?.assignedNames);
    }

    if (!selectedEmployee?.assignedNames) {
      // Calculate individual actTime for each employee
      let filteredTaskObject = EveningTasks;

      if (projectName) {
        filteredTaskObject = filteredTaskObject.filter(
          (e) => e.projectName === projectName
        );
      }

      if (selectedDateRange) {
        filteredTaskObject = filteredTaskObject.filter((task) => {
          const taskDate = new Date(task.currDate);
          return (
            (!selectedDateRange[0] || taskDate >= selectedDateRange[0]) &&
            (!selectedDateRange[1] || taskDate <= selectedDateRange[1])
          );
        });
      }

      if (selectedDays) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - selectedDays);

        filteredTaskObject = filteredTaskObject.filter((task) => {
          const taskDate = new Date(task.currDate);
          return taskDate >= startDate && taskDate <= endDate;
        });
      }

      const employeeActTime: { [key: string]: number } = {};
      filteredTaskObject.forEach((task) => {
        const employeeID = task.employeeID;
        if (!employeeActTime[employeeID]) {
          employeeActTime[employeeID] = 0;
        }
        const actTimeValue = parseFloat(task.actTime); // Convert actTime to number
        if (!isNaN(actTimeValue)) {
          // Ensure it's a valid number
          employeeActTime[employeeID] += actTimeValue;
        } else {
          console.warn(
            `Invalid actTime value detected for task: ${task.EvngTaskID}`
          );
        }
      });

      const formattedIndividualActTime = Object.entries(employeeActTime).map(
        ([employeeID, actTime]) => {
          const employee = employees.find((e) => e.EmployeeID === employeeID);
          const hours = Math.floor(actTime);
          const minutes = Math.round((actTime - hours) * 60);
          return {
            employee: employee?.assignedNames || "",
            actTime: `${hours}:${minutes.toString().padStart(2, "0")}`,
          };
        }
      );
      setIndividualActTime(formattedIndividualActTime);
    }

    if (selectedDateRange) {
      filteredTaskObject = filteredTaskObject.filter((task) => {
        const taskDate = new Date(task.currDate);
        return (
          (!selectedDateRange[0] || taskDate >= selectedDateRange[0]) &&
          (!selectedDateRange[1] || taskDate <= selectedDateRange[1])
        );
      });
    }

    if (days) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      filteredTaskObject = filteredTaskObject.filter((task) => {
        const taskDate = new Date(task.currDate);
        return taskDate >= startDate && taskDate <= endDate;
      });
    }

    const calculateTotalActTime = (tasks: Task[]) => {
      const total = tasks.reduce((total, task) => {
        // Check if actTime is null or undefined
        if (!task.actTime) {
          console.error("actTime is null or undefined for task:", task);
          return total; // Return the current total without adding
        }

        // Ensure task.actTime is a valid number before adding
        const actTimeValue = parseFloat(task.actTime);

        // Check and log if NaN
        if (isNaN(actTimeValue)) {
          console.error("NaN detected for task:", task);
          return total; // Return the current total if NaN is detected
        }

        return total + actTimeValue;
      }, 0);

      const hours = Math.floor(total);
      const minutes = Math.round((total - hours) * 60);

      console.log(`${hours} hours, ${minutes} minutes`);

      // Update the totalActTime state
      setTotalActTime(`${hours}:${minutes.toString().padStart(2, "0")}`);
    };

    // Call calculateTotalActTime function with filteredTaskObject array
    calculateTotalActTime(filteredTaskObject);

    console.log(filteredTaskObject, "ggggg----");
  };

  const projectNames = projectsInfo.filter((e: Project) => {
    return e.projectName;
  });

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = event.target.selectedIndex - 1;
    const days = event.target.value ? parseInt(event.target.value) : null;

    setActiveButton(selectedIndex);
    setSelectedDays(days);
    setSelectedDateRange([null, null]); // Clear selectedDateRange
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const filteredTasks = EveningTasks.filter(
    (task: Task) => task.projectName === projectName
  );

  useEffect(() => {
    // Fetch employees from the backend API
    axios
      .get<AssignedEmployees[]>("http://localhost:5000/get/PhaseAssignedTo", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        const sortedData = response.data.sort(
          (a, b) => Number(b.PhaseAssigneeID) - Number(a.PhaseAssigneeID)
        );

        const arr = sortedData
          .filter((e) => e.projectName === projectName)
          .map((e) => ({
            assignedNames: e.assignedNames,
            EmployeeID: e.EmployeeID,
          }));

        const unique_arr = sortedData
          .filter((e) => e.projectName === projectName)
          .reduce(
            (accumulator: AssignedEmployee[], current: AssignedEmployees) => {
              if (
                !accumulator.find(
                  (item) => item.assignedNames === current.assignedNames
                )
              ) {
                accumulator.push({
                  assignedNames: current.assignedNames,
                  EmployeeID: current.EmployeeID,
                });
              }
              return accumulator;
            },
            []
          );

        setEmployees(unique_arr);

        // setEmployees(unique_arr);

        //   setEmployees(arr);
      });
  }, [projectName]);

  //   console.log(employees,"gggppp====");

  const tasksByDate: { [key: string]: Task[] } = filteredTasks.reduce(
    (acc: { [key: string]: Task[] }, task: Task) => {
      const date = task.currDate;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(task);
      return acc;
    },
    {}
  );

  const dates = Object.keys(tasksByDate);

  const getMonthName = (month: number): string => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return monthNames[month - 1];
  };

  const tasksByMonth: { [key: string]: number } = filteredTasks.reduce(
    (acc: { [key: string]: number }, task: Task) => {
      const [year, month] = task.currDate.split("-").slice(0, 2);
      const key = `${year}-${month}`;
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += Number(task.actTime);
      return acc;
    },
    {}
  );


  const months = Object.keys(tasksByMonth);

  useEffect(() => {
    axios
      .get<Project[]>("http://localhost:5000/get/projects", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        setProjectsInfo(response.data);
      });
  }, []);

  useEffect(() => {
    axios
      .get<Task[]>("http://localhost:5000/get/addTaskEvening", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        const arr = response?.data;

        // sort the data array in reverse order based on EvngTaskID
        const sortedData = arr.sort(
          (a: Task, b: Task) => Number(b.EvngTaskID) - Number(a.EvngTaskID)
        );
        setEveningTasks(sortedData);
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
          maxHeight: "100vh",
          backgroundColor: "#F7F9FF",
        }}
      >
        <div style={{ height: "8%" }}>
          <Navbar />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "90%",
            width: "100%",
          }}
        >
          <div className="menu-div">
            <Menu />
          </div>
          <div style={{ width: "100%" }}>
            <div style={{ width: "92%", marginLeft: "4.4%", marginTop: "5%" }}>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p
                  style={{
                    color: "#094781",
                    justifyContent: "flex-start",
                    fontSize: "32px",
                    fontWeight: "bold",
                    width: "100%",
                  }}
                >
                  Projects Report
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
                // className="proj-person"
              >
                {/* <div
                  style={{
                    marginTop: "40px",
                    height: "2vh",
                    marginLeft: "5px",
                  }}
                >
                  <h4>Filters</h4>
                </div> */}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <div
                    style={{
                      marginTop: "2px",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      marginInline: "15px",
                    }}
                  >
                    <label className="add-label"></label>
                    <select
                      style={{ width: "150px", marginTop: "30px" }}
                      className="add-input"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      // placeholder="Select a project"
                    >
                      <option value="">Select a project</option>
                      {projectNames.map((project: any) => (
                        <option key={project.ProID} value={project.projectName}>
                          {project.projectName}
                        </option>
                      ))}
                    </select>
                    {/* <button>daily</button> */}
                  </div>
                  <div
                    style={{
                      marginTop: "14px",
                      display: "flex",
                      flexDirection: "row",
                      marginInline: "15px",
                      justifyContent: "space-around",
                    }}
                  >
                    <label className="add-label"></label>
                    <select
                      style={{
                        width: "150px",
                        marginRight: "15px",
                        marginTop: "20px",
                      }}
                      className="add-input"
                      value={selectedEmployee?.EmployeeID || ""}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        if (selectedValue) {
                          const foundEmployee = employees.find(
                            (emp) => emp.EmployeeID === selectedValue
                          );
                          setSelectedEmployee(foundEmployee);
                        } else {
                          setSelectedEmployee(null);
                          // setPerformer("");
                        }
                      }}
                    >
                      <option value="" disabled>
                        Select Employee
                      </option>
                      {employees.map((e, index) => (
                        <option key={index} value={e.EmployeeID}>
                          {e.assignedNames}
                        </option>
                      ))}
                    </select>

                    <div style={{ marginTop: "10px" }}>
                      <label className="add-label"></label>
                      <RangePicker
                        style={{ width: "150px", marginRight: "15px" }}
                        className="add-input"
                        value={[
                          selectedDateRange[0]
                            ? dayjs(selectedDateRange[0])
                            : null,
                          selectedDateRange[1]
                            ? dayjs(selectedDateRange[1])
                            : null,
                        ]}
                        onChange={(dates, dateStrings) => {
                          setSelectedDateRange([
                            dates?.[0]?.toDate() || null,
                            dates?.[1]?.toDate() || null,
                          ]);
                          setSelectedButton(null); // Clear selectedButton
                          setSelectedDays(null); // Clear selectedDays
                        }}
                      />
                    </div>

                    {/* <div
                    style={{
                      marginTop: "16px ",
                      marginBottom: "16px",
                      marginLeft: "90%",
                    }}
                  >
                    OR
                  </div> */}

                    <div>
                      <select
                        value={activeButton === null ? "" : `${selectedDays}`}
                        onChange={handleSelectChange}
                        style={{
                          width: "150px",
                          marginRight: "15px",
                          marginTop: "20px",
                          padding: "16px",
                          borderRadius: "10px",
                          backgroundColor:
                            activeButton !== null ? "white" : "initial",
                          color: activeButton !== null ? "blue" : "initial",
                        }}
                      >
                        <option value="">Select date range</option>
                        <option value="7">Last 1 week</option>
                        <option value="30">Last 1 month</option>
                        <option value="90">Last 3 months</option>

                        <option value="180">Last 6 months</option>
                        <option value="365">Last 1 year</option>
                      </select>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        height: "70px",
                        marginLeft: "15px",
                      }}
                    >
                      <button
                        style={{
                          marginTop: "30px",
                          backgroundColor: "#094781",
                          color: "white",
                          padding: "10px",
                          width: "55px",
                          borderRadius: "7px",
                        }}
                        onClick={() => handleTotal(selectedDays)}
                      >
                        Go
                      </button>
                      <button
                        style={{
                          marginTop: "30px",
                          marginLeft: "15px",
                          backgroundColor: "#094781",
                          color: "white",
                          padding: "10px",
                          width: "55px",
                          borderRadius: "7px",
                        }}
                        onClick={() => {
                          setIndividualActTime([]);
                          setSelectedEmployee(null);
                          setSelectedDateRange([null, null]);
                          setSelectedButton(null);
                          setSelectedDays(null);
                          setTotalActTime("");
                          setPerformer("");
                          setProjectName("");
                        }}
                      >
                        clear
                        {/* <SyncIcon style={{ fontSize: "1.5rem" }} /> */}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  // alignItems: "center",
                  height: "100px",
                  marginLeft: "15px",
                  marginTop: "70px",
                }}
              >
                {!selectedEmployee?.assignedNames && projectName && (
                  // && !selectedDateRange && !selectedDays &&

                  <div style={{ display: "flex", flexDirection: "row" }}>
                    {individualActTime.map(({ employee, actTime }) => (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-around",
                          alignItems: "center",
                          margin: "20px 0",
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          width: "17vw",
                          marginTop: "10px",
                        }}
                        key={employee}
                      >
                        {employee}: {actTime}
                      </div>
                    ))}
                  </div>
                )}

                {totalActTime && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      margin: "20px 0",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      width: "17vw",
                      marginTop: "10px",
                    }}
                  >
                    {performer && (
                      <p
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          margin: "0",
                        }}
                      >
                        {performer}
                      </p>
                    )}

                    <span
                      style={{
                        marginLeft: "5px",
                        marginRight: "5px",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Total Time:
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: "600" }}>
                      {totalActTime}
                    </span>
                  </div>
                )}
              </div>

              {/* <ViewprojectTable
        projEditObj={projEditObj}
        setProjEditObj={setProjEditObj}
      /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutProject;
