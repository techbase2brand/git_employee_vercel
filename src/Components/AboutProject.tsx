import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { DatePicker, Table, Tooltip } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import Item from "antd/es/list/Item";

const { RangePicker } = DatePicker;


interface Project {
  ProID: string | number;
  clientName: string;
  projectName: string;
  projectDescription: string;
  hiding:string;
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
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);

  const [employees, setEmployees] = useState<any[]>([]);
  const [totalActTime, setTotalActTime] = useState<string>("");
  const [totalEstTime, setTotalEstTime] = useState<string>("");
  const [totalUpworkTime, setTotalUpworkTime] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<number | null>(null);

  const [performer, setPerformer] = useState<string>("");
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [individualActTime, setIndividualActTime] = useState<
    { employee: string; actTime: string; EmployeeID: string }[]
  >([]);
  const [filteredData, setFilteredData] = useState<Task[]>([]);


  const convertTimeToDecimal = (timeString: string | null): number => {
    if (!timeString) return 0; // Handle cases where actTime is null or undefined
    const [hours, minutes] = timeString.split(':').map(Number); // Split the time string and convert to numbers
    if (isNaN(hours) || isNaN(minutes)) return 0; // Handle cases where parsing fails
    return hours + minutes / 60; // Convert to decimal format
  };

  const formatDecimalToTime = (decimalTime: number): string => {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleTotal = (days: number | null = null) => {
    let filteredTaskObject = EveningTasks;

    // Filter by project name
    if (projectName) {
      filteredTaskObject = filteredTaskObject.filter(
        (e) => e.projectName === projectName
      );
    }

    // Filter by selected employee
    if (selectedEmployee?.assignedNames) {
      const filteredID = employees.filter(
        (e) => e.EmployeeID === selectedEmployee.EmployeeID
      );
      filteredTaskObject = filteredTaskObject.filter(
        (e) => e.employeeID === filteredID[0]?.EmployeeID
      );

      setPerformer(selectedEmployee?.assignedNames);
    }

    // Filter by date range
    if (selectedDateRange[0] && selectedDateRange[1]) {
      filteredTaskObject = filteredTaskObject.filter((task) => {
        const taskDate = new Date(task.currDate);
        return (
          (!selectedDateRange[0] || taskDate >= new Date(selectedDateRange[0])) &&
          (!selectedDateRange[1] || taskDate <= new Date(selectedDateRange[1]))
        );
      });
    }

    // Filter by selected days
    if (selectedDays) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - selectedDays);

      filteredTaskObject = filteredTaskObject.filter((task) => {
        const taskDate = new Date(task.currDate);
        return taskDate >= startDate && taskDate <= endDate;
      });
    }

    // Calculate total times for each employee
    const employeeActTime: { [key: string]: number } = {};
    const employeeEstTime: { [key: string]: number } = {};
    const employeeUpWorkTime: { [key: string]: number } = {};

    filteredTaskObject.forEach((task) => {
      const employeeID = task.employeeID;
      if (!employeeActTime[employeeID]) {
        employeeActTime[employeeID] = 0;
        employeeEstTime[employeeID] = 0;
        employeeUpWorkTime[employeeID] = 0;
      }
      const actTimeValue = convertTimeToDecimal(task.actTime);
      const estTimeValue = convertTimeToDecimal(task.estTime);
      const upWorkTimeValue = convertTimeToDecimal(task.upWorkHrs?.toString() || "0:0");

      // Debugging log to trace values
      employeeActTime[employeeID] += actTimeValue;
      employeeEstTime[employeeID] += estTimeValue;
      employeeUpWorkTime[employeeID] += upWorkTimeValue;
    });

    // Format the individual act times
    const formattedIndividualActTime = Object.entries(employeeActTime).map(
      ([employeeID, actTime]) => {
        const employee = employees.find((e) => e.EmployeeID === employeeID);
        const formattedTime = formatDecimalToTime(actTime); // Convert back to HH:MM format
        const formattedEstTime = formatDecimalToTime(employeeEstTime[employeeID]);
        const formattedUpWorkTime = formatDecimalToTime(employeeUpWorkTime[employeeID]);

        return {
          employee: employee?.assignedNames || "",
          actTime: formattedTime,
          estTime: formattedEstTime,
          upWorkTime: formattedUpWorkTime,
          EmployeeID: employeeID,
        };
      }
    );

    setIndividualActTime(formattedIndividualActTime);

    // Update the total act time and filtered data
    calculateTotalActTime(filteredTaskObject);
    if (filteredTaskObject.length === 0) {
      setFilteredData([]); // Empty the table
    } else {
      setFilteredData(filteredTaskObject); // Update the table with filtered data
    }

  };


  const calculateTotalActTime = (tasks: Task[]) => {
    const totalActTime = tasks.reduce((total, task) => {
      const actTimeValue = convertTimeToDecimal(task.actTime);
      return total + actTimeValue;
    }, 0);

    const totalEstTime = tasks.reduce((total, task) => {
      const estTimeValue = convertTimeToDecimal(task.estTime);
      return total + estTimeValue;
    }, 0);

    const totalUpWorkTime = tasks.reduce((total, task) => {
      const upWorkTimeValue = convertTimeToDecimal(task.upWorkHrs?.toString() || "0:0");
      return total + upWorkTimeValue;
    }, 0);

    const formattedTotalActTime = formatDecimalToTime(totalActTime);
    const formattedTotalEstTime = formatDecimalToTime(totalEstTime);
    const formattedTotalUpWorkTime = formatDecimalToTime(totalUpWorkTime);

    setTotalActTime(formattedTotalActTime);
    setTotalEstTime(formattedTotalEstTime);
    setTotalUpworkTime(formattedTotalUpWorkTime);
  };


  const handleData = (EmployeeID: any) => {
    setSelectedEmployeeId(EmployeeID);
    const tableData = EveningTasks.filter(
      (item: any) => item.employeeID === EmployeeID && item.projectName === projectName
    );

    setFilteredData(tableData);

    // Calculate total actTime, estTime, and upWorkTime for the selected employee
    const totalActTime = tableData.reduce((total, task) => {
      const actTimeValue = convertTimeToDecimal(task.actTime);
      return total + actTimeValue;
    }, 0);

    const totalEstTime = tableData.reduce((total, task) => {
      const estTimeValue = convertTimeToDecimal(task.estTime);
      return total + estTimeValue;
    }, 0);

    const totalUpWorkTime = tableData.reduce((total, task) => {
      const upWorkTimeValue = convertTimeToDecimal(task.upWorkHrs?.toString() || "0:0");
      return total + upWorkTimeValue;
    }, 0);

    const formattedTotalActTime = formatDecimalToTime(totalActTime);
    const formattedTotalEstTime = formatDecimalToTime(totalEstTime);
    const formattedTotalUpWorkTime = formatDecimalToTime(totalUpWorkTime);

    // Update state with formatted times
    setTotalActTime(formattedTotalActTime);
    setTotalEstTime(formattedTotalEstTime);
    setTotalUpworkTime(formattedTotalUpWorkTime);
  };


  const columns = [
    {
      title: "Client & Project",
      dataIndex: "clientAndProject",
      key: "clientAndProject",
      render: (text: string, record: Task) => {
        const project = projectsInfo.find(
          (project) => project.projectName === record.projectName
        );
        const clientName = project ? project?.clientName : "";
        const projectName = project ? project?.projectName : "";
        const projectDescription = project ? project.projectDescription : "";

        return (
          <Tooltip title={projectDescription} color="volcano">
            <span>{`${clientName} - ${projectName}`}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Phase",
      dataIndex: "phaseName",
      key: "phaseName",
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
    },
    {
      title: "Task",
      dataIndex: "task",
      key: "task",
    },
    {
      title: "Est",
      dataIndex: "estTime",
      key: "estTime",
    },
    {
      title: "Act",
      dataIndex: "actTime",
      key: "actTime",
    },
    {
      title: "UpWork",
      dataIndex: "upWorkHrs",
      key: "upWorkHrs",
    },
    {
      title: "Date",
      dataIndex: "selectDate",
      key: "selectDate",
    }
  ];
  const projectNames = projectsInfo.filter((e: Project) => {
    return e.hiding === null;
  });
  

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = event.target.selectedIndex - 1;
    const days = event.target.value ? parseInt(event.target.value) : null;

    setActiveButton(selectedIndex);
    setSelectedDays(days);
    setSelectedDateRange([null, null]); // Clear selectedDateRange
  };

  const filteredTasks = EveningTasks.filter(
    (task: Task) => task.projectName === projectName
  );

  useEffect(() => {
    // Fetch employees from the backend API
    axios
      .get<AssignedEmployees[]>(`${process.env.REACT_APP_API_BASE_URL}/get/PhaseAssignedTo`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
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

      });
  }, [projectName]);

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


  useEffect(() => {
    axios
      .get<Project[]>(`${process.env.REACT_APP_API_BASE_URL}/get/projects`, {
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
      .get<Task[]>(`${process.env.REACT_APP_API_BASE_URL}/get/addTaskEvening`, {
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
    <div className="evening-handle">
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

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              height: "90%",
              width: "100%",
            }}
          >

            <div className="form-container">
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
              >
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
                    }}
                  >
                    <label className="add-label"></label>
                    <select
                      style={{ width: "150px", marginTop: "30px" }}
                      className="add-input"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    >
                      <option value="">Select a project</option>
                      {projectNames.map((project: any) => (
                        <option key={project.ProID} value={project.projectName}>
                          {project.projectName} --- {project.clientName}
                        </option>
                      ))}
                    </select>
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
                          setSelectedDays(null); // Clear selectedDays
                        }}
                      />
                    </div>
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
                          setSelectedDays(null);
                          setTotalActTime("");
                          setPerformer("");
                          setProjectName("");
                        }}
                      >
                        clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="time-row-rs"
              >
                {!selectedEmployee?.assignedNames && projectName && (
                  <div className="time-table-rs">
                    {individualActTime.map(({ employee, actTime, EmployeeID }) => (
                      <div
                        className="time-table-data"
                        key={employee}
                        onClick={() => handleData(EmployeeID)}
                        style={{
                          backgroundColor: selectedEmployeeId === EmployeeID ? '#ffeb00' : 'transparent', // Conditionally set background color
                          cursor: 'pointer', // Change cursor to indicate it's clickable
                        }}
                      >
                        <span>{employee}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="all-total-time">
                  <div
                    className="total-time-report"
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
                      Act Time:
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: "600" }}>
                      {totalActTime}
                    </span>
                  </div>
                  <div className="total-time-report">
                    <span
                      style={{
                        marginLeft: "5px",
                        marginRight: "5px",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Est Time:
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: "600" }}>
                      {totalEstTime}
                    </span>
                  </div>
                  <div className="total-time-report">
                    <span
                      style={{
                        marginLeft: "5px",
                        marginRight: "5px",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Upwork Time:
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: "600" }}>
                      {totalUpworkTime}
                    </span>
                  </div>
                </div>
                <div className="evening-dashboard">
                  <Table
                    dataSource={filteredData} // Use the filtered tasks state for the table data
                    columns={columns}
                    rowClassName={() => "header-row"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutProject;
