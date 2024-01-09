import React, { useState, useEffect, useMemo } from "react";
import { Table } from "antd";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  isCompleted: boolean | number;
  clientName: string;
  projectName: string;
  comment: string;
}

const AssignedTasksTable: React.FC = () => {
  const [data, setData] = useState<BacklogTask[]>([]);
  console.log("data",data);
  
  const [disabledFields, setDisabledFields] = useState<Set<number>>(new Set());

  const isWithinLastOneMonth = (dateString: any) => {
    const taskDate = new Date(dateString);
    const currentDate = new Date();
    const fiveDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));

    return taskDate >= fiveDaysAgo;
  };
  useEffect(() => {
    const disabledFieldsString = localStorage.getItem("disabledFields");
    if (disabledFieldsString) {
      const disabledFieldsData = JSON.parse(disabledFieldsString);
      setDisabledFields(new Set(disabledFieldsData));
    }
  }, []);

  const dataString = localStorage.getItem("myData");
  const employeeInfo = useMemo(
    () => (dataString ? JSON.parse(dataString) : []),
    [dataString]
  );
  let localEmpId = "";
  if (dataString) {
      const myData = JSON.parse(dataString);
      localEmpId = myData.EmployeeID;
  }

  useEffect(() => {
    axios
      .get<BacklogTask[]>(`${process.env.REACT_APP_API_BASE_URL}/get/BacklogTasks`
      )
      .then((response) => {
        console.log("response",response)
        const sortedData = response.data.sort(
          (a, b) => Number(b.backlogTaskID) - Number(a.backlogTaskID)
        );
        const filteredData = sortedData?.filter((task) => isWithinLastOneMonth(task?.currdate) && task?.employeeID === localEmpId
        );
        setData(filteredData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        console.log("Error details:", error.response);
      });
  }, []);
  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_API_BASE_URL}`);
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
      task.backlogTaskID === backlogTaskID ? { ...task, isCompleted: isChecked } : task
    );
    setData(updatedData);
    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/update/task-completion/${backlogTaskID}`,
        { isCompleted: isChecked },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("myToken")}`,
          },
        }
      )
      .then((response) => {
        toast.success('status Updated!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((error) => {
        console.error("Error updating task completion status:", error);
        toast.error('Failed!', {
          position: toast.POSITION.TOP_RIGHT,
        });
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
  const handleCommentChange = (comment: string, backlogTaskID: number) => {
    const updatedData = data.map((task) =>
      task.backlogTaskID === backlogTaskID ? { ...task, comment } : task
    );
    setData(updatedData);
  };

  const handleCommentSave = (backlogTaskID: number) => {
    const task = data.find((task) => task.backlogTaskID === backlogTaskID);
    if (!task) {
      console.error("Task not found");
      return;
    }
    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/update/task-comment/${backlogTaskID}`, { comment: task.comment })
      .then((response) => {
        const updatedData = data.map((task) =>
          task.backlogTaskID === backlogTaskID ? { ...task, comment: '' } : task
        );
        setData(updatedData);
        setDisabledFields((prev) => {
          const updatedDisabledFields = new Set(prev.add(backlogTaskID));
          const updatedDisabledFieldsArray = Array.from(updatedDisabledFields);
          localStorage.setItem("disabledFields", JSON.stringify(updatedDisabledFieldsArray));
          return updatedDisabledFields;
        });
        localStorage.setItem(`task-${backlogTaskID}`, JSON.stringify(true));

        // Update checkbox state in UI
        handleCheckboxChange(true, backlogTaskID);
      })
      .catch((error) => {
        console.error("Error updating task comment:", error);
      });
  };

  const columns = [

    {
      title: "Client Name",
      dataIndex: "clientName",
      key: "clientName",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",
      render: (text: string) => <div>{text}</div>,
    },
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
      render: (text: string) => <div >{text}</div>,
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
      title: "Status",
      dataIndex: "isCompleted",
      key: "isCompleted",
      render: (isCompleted: boolean, record: BacklogTask) => (
        <input
          type="checkbox"
          checked={getCheckboxState(record.backlogTaskID)}
          onChange={(event) =>
            handleCheckboxChange(event.target.checked, record.backlogTaskID)
          }
          disabled={!disabledFields.has(record.backlogTaskID)}
        />
      ),
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      render: (text: string, record: BacklogTask) => (
        <div>
          {!disabledFields.has(record.backlogTaskID) && <textarea
            value={text}
            onChange={(e) => handleCommentChange(e.target.value, record.backlogTaskID)}
            disabled={disabledFields.has(record.backlogTaskID)}
          />}
          {!disabledFields.has(record.backlogTaskID) &&
            <button onClick={() => handleCommentSave(record.backlogTaskID)}
              disabled={disabledFields.has(record.backlogTaskID)}>
              Save
            </button>}
          {disabledFields.has(record.backlogTaskID) && <div>{text || "N/A"}</div>}
        </div>
      ),
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
  };
  return (
    <div className="assign-task">
      <Table
        style={{ width: "80vw" }}
        dataSource={data}
        columns={columns}
        rowClassName={() => "header-row"}
      />
    </div>
  );
};

export default AssignedTasksTable;
