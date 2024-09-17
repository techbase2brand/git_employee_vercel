import React, { useState, useEffect, useMemo } from "react";
import { Spin, Table } from "antd";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import io from "socket.io-client";
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
  const filteredData = data.filter(item => item.comment === null || item.comment === "");
  // problem is here 
  const [editableTaskID, setEditableTaskID] = useState<number | null>(null);
  const [disabledFields, setDisabledFields] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const isWithinLastOneMonth = (dateString: any) => {
    const taskDate = new Date(dateString);
    const currentDate = new Date();
    const fiveDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));
    return taskDate >= fiveDaysAgo;
  };
  const handleEditClick = (backlogTaskID: number) => {
    setEditableTaskID(backlogTaskID);
  };
  const dataString = localStorage.getItem("myData");
  const employeeInfo = useMemo(
    () => (dataString ? JSON.parse(dataString) : []),
    [dataString]
  );
  let localEmpId = "";
  if (dataString) {
    const myData = JSON.parse(dataString);
    localEmpId = myData?.EmployeeID;
  }
console.log("localEmpId",localEmpId);

  useEffect(() => {
    axios
      .get<BacklogTask[]>(`${process.env.REACT_APP_API_BASE_URL}/get/BacklogTasks`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("myToken")}`,
          },
        }
      )
      .then((response) => {
        const sortedData = response.data.sort(
          (a, b) => Number(b.backlogTaskID) - Number(a.backlogTaskID)
        );
        const filteredData = sortedData?.filter((task) => task?.employeeID === localEmpId
        );
        setData(filteredData);
        setLoading(false);

      })
      .catch((error) => {
        console.error("Error fetching data:");
        setLoading(false);

      });
  }, []);

  // useEffect(() => {
  //   const socket = io(`${process.env.REACT_APP_API_BASE_URL}`);
  //   socket.on("notification", (data: { data: any[] }) => {
  //     const sortedData = data?.data?.sort(
  //       (a, b) => Number(b.backlogTaskID) - Number(a.backlogTaskID)
  //     );
  //     const filteredData = sortedData?.filter(
  //       (task) =>
  //         isWithinLastOneMonth(task?.currdate) &&
  //         task?.employeeID === employeeInfo?.EmployeeID
  //     );
  //     setData(filteredData);
  //   });
  // }, []);

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
        toast.error('Failed!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };
  const getCheckboxState = (backlogTaskID: number) => {
    const task = data.find((task) => task.backlogTaskID === backlogTaskID);
    return !!task?.isCompleted;
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
      .put(`${process.env.REACT_APP_API_BASE_URL}/update/task-comment/${backlogTaskID}`, { comment: task.comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("myToken")}`,
          },
        }
      )
      .then((response) => {
        const updatedData = data.map((task) =>
          task.backlogTaskID === backlogTaskID ? { ...task, comment: '' } : task
        );

        setData(updatedData);
        setDisabledFields((prev) => {
          const updatedDisabledFields = new Set<number>(prev);
          updatedDisabledFields.add(backlogTaskID);
          const updatedDisabledFieldsArray = Array.from(updatedDisabledFields);
          return updatedDisabledFields;
        });

        handleCheckboxChange(true, backlogTaskID);
      })
      .catch((error) => {
        console.error("Error updating task comment:", error);
      });
  };
  const renderComment = (text: string, record: BacklogTask) => {
    const isEditing = editableTaskID === record.backlogTaskID;

    return (
      <div style={{ width: '140px' }}>
        {filteredData.find((item) => item.isCompleted === 0 && record.isCompleted === 0) && <textarea style={{ width: '-webkit-fill-available' }}
          value={text}
          onChange={(e) => handleCommentChange(e.target.value, record.backlogTaskID)}
        />}
        {isEditing && record.isCompleted === 1 && <textarea style={{ width: '-webkit-fill-available' }}
          value={text}
          onChange={(e) => handleCommentChange(e.target.value, record.backlogTaskID)}
        />}
        {filteredData.find((item) => item.isCompleted === 0 && record.isCompleted === 0) &&
          <button onClick={() => handleCommentSave(record.backlogTaskID)}
          >
            Save
          </button>}
        {isEditing && record.isCompleted === 1 && <button onClick={() => handleCommentSave(record.backlogTaskID)}
        >
          Update
        </button>}
        {!isEditing && !filteredData.find((item) => item.isCompleted === 0 && record.isCompleted === 0) && (
          <button onClick={() => handleEditClick(record.backlogTaskID)} style={{ float: 'right', width: '50px' }}>
            Edit
          </button>
        )}
        {!filteredData.find((item) => item.isCompleted === 0 && record.isCompleted === 0) && <div>{text || "N/A"}</div>}
      </div>
    );
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
      render: (text: string) => <div style={{ width: '140px' }}>{text}</div>,
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
    //  {
    //   title: "Comment",
    //   dataIndex: "comment",
    //   key: "comment",
    //   render: (text: string, record: BacklogTask) => (
    //     <div>
    //       {filteredData.find((item) => item.isCompleted === 0 && record.isCompleted === 0) && <textarea
    //         value={text}
    //         onChange={(e) => handleCommentChange(e.target.value, record.backlogTaskID)}
    //       />}
    //       {filteredData.find((item) => item.isCompleted === 0 && record.isCompleted === 0) &&
    //         <button onClick={() => handleCommentSave(record.backlogTaskID)}
    //         >
    //           Save
    //         </button>}
    //       {!filteredData.find((item) => item.isCompleted === 0 && record.isCompleted === 0) && <div>{text || "N/A"}</div>}
    //     </div>
    //   ),
    // },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      render: renderComment,
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
  };
  return (
    <div className="assign-task" >

      {loading ?
        <Spin size="large" className="spinner-antd" />
        :
        <Table
          dataSource={data}
          columns={columns}
          rowClassName={() => "header-row"}
        />
      }
    </div>
  );
};

export default AssignedTasksTable;
