import React, { useState, useEffect } from "react";

import { Table, Button , DatePicker  } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";


const { RangePicker } = DatePicker;

interface Task {
  EvngTaskID: number;
  projectName: string;
  phaseName: string;
  module: string;
  task: string;
  estTime: string;
  upWorkHrs: number | string;
  employeeID: string;
  actTime: string;
}

interface Props {
  data: Task[][];
  totalUpwork: any;
  setTotalUpWork: React.Dispatch<React.SetStateAction<any>>;
  totalEstHrs: any;
  setTotalEstHrs: React.Dispatch<React.SetStateAction<any>>;
  totalUpworkhrs: any;
  setTotalUpworkhrs: React.Dispatch<React.SetStateAction<any>>;
  searchQuery: any;
  setSelectedRole: React.Dispatch<React.SetStateAction<any>>;
  selectedRole:any;
}

interface EmployeeTime {
  employeeID: string;
  formattedTime: string;
}

interface Employee {
  EmpID: string | number;
  firstName: string;
  lastName: string;
  role: string;
  dob: string | Date;
  EmployeeID: string;
}

const handleEdit = (EmpID: string | number) => {
  console.log(`Edit employee with id ${EmpID}`);
};

const DashboardEveningTasktable: React.FC<Props> = ({
  data,
  totalUpwork,
  setTotalUpWork,
  totalEstHrs,
  setTotalEstHrs,
  totalUpworkhrs,
  setTotalUpworkhrs,
  searchQuery,
  setSelectedRole,
  selectedRole

}) => {
  const [employeeArr, setEmployeeArr] = useState<any>([]);
  const [filteredEmployee, setFilteredEmployee] = useState<any>([]);
  const [dateRange, setDateRange] = useState<any>([null, null]); // Start and end date

console.log(selectedRole,"selectedRole");

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
  };

  const handleDelete = (EvngTaskID: number) => {
    // console.log(`Delete task with id ${MrngTaskID}`);

    axios
      .delete(`https://empbackend.base2brand.com/delete/eveningDashboard/${EvngTaskID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get<Employee[]>("https://empbackend.base2brand.com/employees", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        // Here's where we sort the employees by their first name
        const sortedData = response.data.sort(
          (a, b) => a.firstName.localeCompare(b.firstName) // sort by firstName
        );

        setEmployeeArr(sortedData);
      })
      .catch((error) => console.log(error));
  }, []);

  const arrayOfArray = Object.values(data);

  const columns = [
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",
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
      title: "Est time (hrs)",
      dataIndex: "estTime",
      key: "estTime",
    },
    {
      title: "Act time (hrs)",
      dataIndex: "actTime",
      key: "actTime",
    },
    {
      title: "UpWork(hrs)",
      dataIndex: "upWorkHrs",
      key: "upWorkHrs",
    },
  ];

  const totalMinutes = arrayOfArray.reduce((acc, curr) => {
    curr.forEach((obj) => {
      if (obj?.actTime) {
        const [hours, minutes] = obj.actTime.split(":").map(Number);
        const timeInMinutes = hours * 60 + minutes;
        acc += timeInMinutes;
      }
    });
    return acc;
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;

  setTotalUpWork(formattedTime);

  const totalEstTime = arrayOfArray.reduce((acc, curr) => {
    curr.forEach((obj) => {
      if (obj?.estTime) {
        const [hours, minutes] = obj.estTime.split(":").map(Number);
        const timeInMinutes = hours * 60 + minutes;
        acc += timeInMinutes;
      }
    });
    return acc;
  }, 0);

  const hoursEst = Math.floor(totalEstTime / 60);
  const minutesEst = totalEstTime % 60;
  const formattedTimeEst = `${hoursEst}:${minutesEst
    .toString()
    .padStart(2, "0")}`;

  setTotalEstHrs(formattedTimeEst);

  const totalMinutesUpworkhrs = arrayOfArray.reduce((acc, curr) => {
    curr.forEach((obj) => {
      if (obj?.actTime) {
        let hours, minutes;

        if (typeof obj.upWorkHrs === "number") {
          hours = obj.upWorkHrs;
          minutes = 0;
        } else {
          [hours, minutes] = obj.upWorkHrs.split(":").map(Number);
        }

        const timeInMinutes = hours * 60 + minutes;
        acc += timeInMinutes;
      }
    });
    return acc;
  }, 0);



  const hoursUpworkhrs = Math.floor(totalMinutesUpworkhrs / 60);
  const minutesUpworkhrs = totalMinutesUpworkhrs % 60;
  const formattedTimeUpworkhrs = `${hoursUpworkhrs}:${minutesUpworkhrs
    .toString()
    .padStart(2, "0")}`;

  setTotalUpworkhrs(formattedTimeUpworkhrs);

  console.log(formattedTimeUpworkhrs, "formattedTimeUpworkhrs");

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

  const upWorkByEmployee = arrayOfArray.reduce((acc: any, curr: any) => {

    curr.forEach((obj: any) => {
      if (obj?.upWorkHrs) {
        let hours, minutes;

        if (typeof obj.upWorkHrs === "number") {
          hours = obj.upWorkHrs;
          minutes = 0;
        } else {
          [hours, minutes] = obj.upWorkHrs.split(":").map(Number);
        }
        const timeInMinutes = hours * 60 + minutes;
        console.log(
          `Processed hours: ${hours}, minutes: ${minutes}, timeInMinutes: ${timeInMinutes}`
        );
        acc += timeInMinutes;
      }
    });
    return acc;
  }, 0);


  const employeeUpworkTimes: EmployeeTime[] = [];

  for (const employeeID in upWorkByEmployee) {
    const totalMinutes = upWorkByEmployee[employeeID];
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;
    employeeUpworkTimes.push({ employeeID, formattedTime });
  }

  const actTimeByEmployee = arrayOfArray.reduce((acc: any, curr: any) => {
    curr.forEach((obj: any) => {
      if (obj?.actTime) {
        const [hours, minutes] = obj.actTime.split(":").map(Number);
        const timeInMinutes = hours * 60 + minutes;
        if (!acc[obj.employeeID]) {
          acc[obj.employeeID] = 0;
        }
        acc[obj.employeeID] += timeInMinutes;
      }
    });
    return acc;
  }, {});

  const employeeactTimes: EmployeeTime[] = [];
  for (const employeeID in actTimeByEmployee) {
    const totalMinutes = actTimeByEmployee[employeeID];
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;
    employeeactTimes.push({ employeeID, formattedTime });
  }
  const tables = employeeArr
  .filter((emp: Employee) => {

    // if (emp.role == selectedRole  )  {
    //   console.log(selectedRole,"selectedRole");
    //   console.log(emp,"emp.role.toLowerCase()");

    //   return true;
    // }
    if (!searchQuery) return true; // Show all if there's no search query
    // console.log(emp,"emp.role.toLowerCase()");


    // Check if the employee's name matches the searchQuery
    if (emp.firstName.toLowerCase().includes(searchQuery)  || emp.lastName.toLowerCase().includes(searchQuery))  {
      return true;
    }

    // Find tasks for this employee
    const tasksForEmployee = arrayOfArray.find(
      (e) => e[0]?.employeeID === emp.EmployeeID
    );

    // If there are tasks for this employee, check if any task matches the searchQuery
    if (tasksForEmployee) {
      return tasksForEmployee.some(task =>
        task.phaseName.toLowerCase().includes(searchQuery) ||
        task.projectName.toLowerCase().includes(searchQuery) ||
        task.module.toLowerCase().includes(searchQuery)
      );
    }

    return false;
  })
  .map((emp: Employee) => {
    const tasksForEmployee = arrayOfArray.find(
      (e) => e[0]?.employeeID === emp.EmployeeID
    );

    const filteredEstTime = employeeTimes.find(
      (obj) => obj.employeeID === emp.EmployeeID
    );
    const filteredUpworkTime = employeeUpworkTimes.find(
      (obj) => obj.employeeID === emp.EmployeeID
    );
    const filteredactTime = employeeactTimes.find(
      (obj) => obj.employeeID === emp.EmployeeID
    );

    const renderEmptyText = () => (
      <div style={{ color: 'red' }}>
        No data found for this employee.
      </div>
    );
      return (

        <div key={emp.EmpID}>
        <div style={{ display: "flex", flexDirection: "row"  , marginTop:'30px'}}>
          <p>{emp.firstName} {emp.lastName}</p>
          <div
            style={{
              marginLeft: "71%",
              display: "flex",
              flexDirection: "row",
              float: "right",
            }}
          >
            <p style={{ marginRight: "2vw" }}>{filteredEstTime?.formattedTime}</p>
            <p style={{ marginLeft: "5vw" }}>{filteredactTime?.formattedTime}</p>
            <p style={{ marginLeft: "5vw" }}>{filteredUpworkTime?.formattedTime}</p>
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
    })
    .filter(Boolean); // filter out any nulls

  return <>{tables}</>;
};
export default DashboardEveningTasktable;
