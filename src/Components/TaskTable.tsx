/* eslint-disable no-unsafe-optional-chaining */
import React, { useState, useEffect } from "react";

import { Checkbox, Table, Tooltip } from "antd";
import axios from "axios";

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
  approvedBy: string;
}

interface EmployeeTime {
  employeeID: string;
  formattedTime: string;
}

interface Props {
  data: Task[][];
  totalEstHrs: any;
  setTotalEstHrs: React.Dispatch<React.SetStateAction<any>>;
  setTotalUpWorkHrs: any;
  setSetTotalUpWorkHrs: React.Dispatch<React.SetStateAction<any>>;
  selectedRole: any;
  searchQuery: any;

}

interface Employee {
  EmpID: string | number;
  firstName: string;
  lastName: string;
  role: string;
  dob: string | Date;
  EmployeeID: string;
  status: number;
}
interface Project {
  ProID: string | number;
  clientName: string;
  projectName: string;
  projectDescription: string;
}

const TaskTable: React.FC<Props> = ({
  data,
  totalEstHrs,
  setTotalEstHrs,
  setTotalUpWorkHrs,
  setSetTotalUpWorkHrs,
  selectedRole,
  searchQuery,

}) => {
  const [employeeArr, setEmployeeArr] = useState<any>([]);
  const [arrayOfArray, setArrayOfArray] = useState<any>([]);
  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({});
  const [projectsInfo, setProjectsInfo] = useState<Project[]>([]);
  const myDataString = localStorage.getItem('myData');
  let employeeName = "";
  let jobPosition = "";
  if (myDataString) {
    const myData = JSON.parse(myDataString);
    employeeName = myData.firstName;
    jobPosition = myData.jobPosition;
  }

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
  // const handleDelete = (MrngTaskID: number) => {
  //   axios
  //     .delete(`${process.env.REACT_APP_API_BASE_URL}/delete/morningDashboard/${MrngTaskID}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
  //       },
  //     })
  //     .then((response) => {
  //       console.log("res");
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  useEffect(() => {
    axios
      .get<Employee[]>(`${process.env.REACT_APP_API_BASE_URL}/employees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        // Here's where we sort the employees by their first name
        const sortedData = response.data.sort((a, b) =>
          a.firstName.localeCompare(b.firstName) // sort by firstName
        );

        const employeeArray = sortedData?.map((e) => e.EmployeeID);
        const filteredData = sortedData.filter((emp) => emp.status === 1)

        setEmployeeArr(filteredData); // Set the sorted employees
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const arrays = Object.values(data);
    setArrayOfArray(arrays);
  }, [data]);

  const handleApproval = (MrngTaskID: number) => {
    const updatedData = arrayOfArray.map((task: any) =>
      task.map((item: any) =>
        item.MrngTaskID === MrngTaskID
          ? { ...item, approvedBy: employeeName }
          : item
      )
    );
    setTotalEstHrs(updatedData)
    setCheckedTasks((prevCheckedTasks) => ({
      ...prevCheckedTasks,
      [MrngTaskID]: true,
    }));
    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/update/approvedByMrng/${MrngTaskID}`,
        {
          approvedBy: employeeName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      .then((response) => {
        setCheckedTasks((prevCheckedTasks) => ({
          ...prevCheckedTasks,
          [MrngTaskID]: true,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    // {
    //   title: "Client & Project",
    //   dataIndex: "clientAndProject",
    //   key: "clientAndProject",
    //   render: (text: string, record: Task) => {
    //     const project = projectsInfo.find(
    //       (project) => project.projectName === record.projectName
    //     );
    //     const clientName = project ? project.clientName : "";
    //     const projectName = project ? project.projectName : "";
    //     return `${clientName} - ${projectName}`;
    //   },
    // },
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
      //   render: (dob: string | Date) => new Date(dob).toLocaleDateString(),
    },
    {
      title: "Est",
      dataIndex: "estTime",
      key: "estTime",
    },
    {
      title: "TL Approved",
      dataIndex: "approvedBy",
      key: "approvedBy",
      render: (text: string, record: Task) => {
        return (
          <>
            {(jobPosition === "Project Manager" || jobPosition === "Team Lead" || jobPosition === "Sales-Dashboard" || employeeName === "Vikash") &&
              <Checkbox
                checked={!!text || checkedTasks[record.MrngTaskID]}
                onChange={() => handleApproval(record.MrngTaskID)}
              />}
            {
              jobPosition === "Managing Director" &&
              <div>{text}</div>
            }
          </>
        )
      },
    },
    {
      title: "Date",
      dataIndex: "currDate",
      key: "currDate",
    },
  ];

  const totalMinutes = arrayOfArray.reduce((acc: any, curr: any) => {
    curr.forEach((obj: any) => {
      if (obj?.estTime) {
        const [hours, minutes] = obj.estTime.split(":").map(Number);
        const timeInMinutes = hours * 60 + minutes;
        acc += timeInMinutes;
      }
    });
    return acc;
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;

  setTotalEstHrs(formattedTime);

  // per object estTime

  const estTimeByEmployee = arrayOfArray.reduce((acc: any, curr: any) => {
    curr.forEach((obj: any) => {
      if (obj?.estTime) {
        const [hours, minutes] = obj.estTime.split(":").map(Number);
        const timeInMinutes = hours * 60 + minutes;
        if (!acc[obj.employeeID]) {
          acc[obj.employeeID] = 0;
        }
        acc[obj.employeeID] += timeInMinutes;
      }
    });
    return acc;
  }, {});

  const employeeTimes: EmployeeTime[] = [];

  for (const employeeID in estTimeByEmployee) {
    const totalMinutes = estTimeByEmployee[employeeID];
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;
    employeeTimes.push({ employeeID, formattedTime });
  }

  // per object upworkTime

  const upWorkByEmployee = arrayOfArray.reduce((acc: any, curr: any) => {
    curr.forEach((obj: any) => {
      if (obj?.upWorkHrs) {
        const [hours, minutes] = obj.upWorkHrs.split(":").map(Number);
        const timeInMinutes = hours * 60 + minutes;
        if (!acc[obj.employeeID]) {
          acc[obj.employeeID] = 0;
        }
        acc[obj.employeeID] += timeInMinutes;
      }
    });
    return acc;
  }, {});

  const employeeUpworkTimes: EmployeeTime[] = [];

  for (const employeeID in upWorkByEmployee) {
    const totalMinutes = upWorkByEmployee[employeeID];
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;
    employeeUpworkTimes.push({ employeeID, formattedTime });
  }

  let filteredEmployees;
  if (selectedRole) {
    filteredEmployees = employeeArr.filter((emp: Employee) => emp.role === selectedRole);
  } else {
    filteredEmployees = employeeArr;
  }
  // per object upworkTime end

  const totalMinutesUpwork = arrayOfArray.reduce((acc: any, curr: any) => {
    curr.forEach((obj: any) => {
      if (obj?.upWorkHrs) {
        const [hours, minutes] = obj?.upWorkHrs.split(":").map(Number);
        const timeInMinutes = hours * 60 + minutes;
        acc += timeInMinutes;
      }
    });
    return acc;
  }, 0);

  const hoursUpwork = Math.floor(totalMinutesUpwork / 60);
  const minutessUpwork = totalMinutesUpwork % 60;
  const formattedTimesUpwork = `${hoursUpwork}:${minutessUpwork
    .toString()
    .padStart(2, "0")}`;

  setSetTotalUpWorkHrs(formattedTimesUpwork);

  const tables = filteredEmployees
    .filter((emp: Employee) => {

      // if (emp.role == selectedRole  )  {
      //   console.log(selectedRole,"selectedRole");
      //   console.log(emp,"emp.role.toLowerCase()");

      //   return true;
      // }
      if (!searchQuery) return true; // Show all if there's no search query
      // console.log(emp,"emp.role.toLowerCase()");


      // Check if the employee's name matches the searchQuery
      if (emp.firstName.toLowerCase().includes(searchQuery) || emp.lastName.toLowerCase().includes(searchQuery)) {
        return true;
      }

      // Find tasks for this employee
      // const tasksForEmployee = arrayOfArray.find(
      //   (e) => e[0]?.employeeID === emp.EmployeeID
      // );

      // // If there are tasks for this employee, check if any task matches the searchQuery
      // if (tasksForEmployee) {
      //   return tasksForEmployee.some(task =>
      //     task.phaseName.toLowerCase().includes(searchQuery) ||
      //     task.projectName.toLowerCase().includes(searchQuery) ||
      //     task.module.toLowerCase().includes(searchQuery)
      //   );
      // }

      return false;
    }).map((employee: Employee) => {
      const tasksForEmployee = arrayOfArray.find(
        (taskArray: Task[]) => taskArray[0].employeeID === employee.EmployeeID
      );

      const filteredEstTime = employeeTimes.find(
        (obj) => obj.employeeID === employee.EmployeeID
      );

      const filteredUpworkTime = employeeUpworkTimes.find(
        (obj) => obj.employeeID === employee.EmployeeID
      );
      const filteredactTime = employeeUpworkTimes.find(
        (obj) => obj.employeeID === employee.EmployeeID
      );

      const renderEmptyText = () => (
        <div style={{ color: 'red' }}>
          No data found for this employee.
        </div>
      );


      return (
        <div key={employee.EmpID}>
          <div style={{ display: "flex", flexDirection: "row", marginTop: '30px' }}>
            <p>{employee.firstName} {employee.lastName}</p>
            <div
              style={{
                marginLeft: "51%",
                display: "flex",
                flexDirection: "row",
                float: "right",
              }}
            >
              <p>{filteredEstTime?.formattedTime}</p>
              <p style={{ marginLeft: "5vw" }}>{filteredactTime?.formattedTime}</p>
            </div>
          </div>
          <Table
            dataSource={tasksForEmployee || []}
            columns={columns}
            rowClassName={() => "header-row"}
            locale={{
              emptyText: renderEmptyText
            }}
          />

        </div>
      );
    });




  // ... [rest of the code]

  return <>{tables}</>;
};

export default TaskTable;
