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
}) => {
  const [employeeArr, setEmployeeArr] = useState<any>([]);
  const [arrayOfArray, setArrayOfArray] = useState<any>([]);

  const handleDelete = (MrngTaskID: number) => {
    axios
      .delete(`https://empbackend.base2brand.com/delete/morningDashboard/${MrngTaskID}`, {
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
        const sortedData = response.data.sort((a, b) =>
          a.firstName.localeCompare(b.firstName) // sort by firstName
        );

        const employeeArray = sortedData?.map((e) => e.EmployeeID);
        const filteredData = sortedData.filter((emp)=> emp.status === 1  )

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
      title: "UpWork(hrs)",
      dataIndex: "upWorkHrs",
      key: "upWorkHrs",
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

  const tables = employeeArr.map((employee: Employee) => {
    const tasksForEmployee = arrayOfArray.find(
      (taskArray: Task[]) => taskArray[0].employeeID === employee.EmployeeID
    );

    const filteredEstTime = employeeTimes.find(
      (obj) => obj.employeeID === employee.EmployeeID
    );

    const filteredUpworkTime = employeeUpworkTimes.find(
      (obj) => obj.employeeID === employee.EmployeeID
    );

    const renderEmptyText = () => (
      <div style={{ color: 'red' }}>
        No data found for this employee.
      </div>
    );


    return (
      <div key={employee.EmpID}>
        <div style={{ display: "flex", flexDirection: "row"  , marginTop:'30px'}}>
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
