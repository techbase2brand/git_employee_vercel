/* eslint-disable no-unsafe-optional-chaining */
import React, { useState, useEffect } from "react";

import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
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

const handleEdit = (EmpID: string | number) => {
  console.log(`Edit employee with id ${EmpID}`);
};

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

  const handleDelete = (MrngTaskID: number) => {
    axios
      .delete(`${process.env.REACT_APP_API_BASE_URL}/delete/morningDashboard/${MrngTaskID}`, {
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
      //   render: (dob: string | Date) => new Date(dob).toLocaleDateString(),
    },
    {
      title: "Est time (hrs)",
      dataIndex: "estTime",
      key: "estTime",
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
              <p style={{ marginLeft: "10vw" }}>
                {filteredUpworkTime?.formattedTime}
              </p>
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
