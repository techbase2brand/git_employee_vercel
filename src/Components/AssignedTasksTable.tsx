import React, { useState, useEffect, useMemo } from "react";
import { Table } from "antd";
import axios from "axios";
// import { Socket } from "socket.io-client";
import io from "socket.io-client";

interface BacklogTask {
  backlogTaskID: number;
  taskName: string;
  assigneeName: string;
  employeeID: string;
  deadlineStart: string;
  deadlineEnd: string;
  currdate: string;
  UserEmail: string;
  isCompleted: boolean;
}

const AssignedTasksTable: React.FC = () => {
  const [data, setData] = useState<BacklogTask[]>([]);

  const isWithinLastOneMonth = (dateString: any) => {
    const taskDate = new Date(dateString);
    const currentDate = new Date();
    const fiveDaysAgo = new Date(
      currentDate.setDate(currentDate.getDate() - 30)
    );

    return taskDate >= fiveDaysAgo;
  };

  const dataString = localStorage.getItem("myData");
  const employeeInfo = useMemo(
    () => (dataString ? JSON.parse(dataString) : []),
    [dataString]
  );
  console.log(employeeInfo);

  useEffect(() => {
    const socket = io("https://empbackend.base2brand.com");
    socket.on("notification", (data: { data: any[] }) => {
      const sortedData = data?.data?.sort(
        (a, b) => Number(b.backlogTaskID) - Number(a.backlogTaskID)
      );
      const filteredData = sortedData?.filter(
        (task) =>
          isWithinLastOneMonth(task?.currdate) &&
          task?.employeeID === employeeInfo?.EmployeeID
      );
      setData(filteredData);
    });
  }, []);

  const handleCheckboxChange = (isChecked: boolean, backlogTaskID: number) => {
    const updatedData = data.map((task) =>
      task.backlogTaskID === backlogTaskID
        ? { ...task, isCompleted: isChecked }
        : task
    );
    setData(updatedData);

    // Call the API endpoint to update the task completion status
    axios
      .put(
        `https://empbackend.base2brand.com/update/task-completion/${backlogTaskID}`,
        { isCompleted: isChecked },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("myToken")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error("Error updating task completion status:", error);
      });

    localStorage.setItem(`task-${backlogTaskID}`, JSON.stringify(isChecked));
  };

  const getCheckboxState = (backlogTaskID: number) => {
    const item = localStorage.getItem(`task-${backlogTaskID}`);
    if (item !== null) {
      return JSON.parse(item);
    } else {
      return false;
    }
  };

  const columns = [
    {
      title: "Task",
      dataIndex: "taskName",
      key: "taskName",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "AssignedBy",
      dataIndex: "AssignedBy",
      key: "AssignedBy",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Deadline Start",
      dataIndex: "deadlineStart",
      key: "deadlineStart",
      render: (text: string) => <div>{formatDate(text)}</div>,
    },
    {
      title: "Deadline End",
      dataIndex: "deadlineEnd",
      key: "deadlineEnd",
      render: (text: string) => <div>{formatDate(text)}</div>,
    },
    {
      title: "Completed",
      dataIndex: "isCompleted",
      key: "isCompleted",
      render: (isCompleted: boolean, record: BacklogTask) => (
        <input
          type="checkbox"
          checked={getCheckboxState(record.backlogTaskID)}
          onChange={(event) =>
            handleCheckboxChange(event.target.checked, record.backlogTaskID)
          }
        />
      ),
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };
  return (
    <>
      <Table
        style={{ width: "80vw" }}
        dataSource={data}
        columns={columns}
        rowClassName={() => "header-row"}
      />
    </>
  );
};

export default AssignedTasksTable;