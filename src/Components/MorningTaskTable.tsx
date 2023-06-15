import React, { useState, useEffect } from "react";

import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Task {
  MrngTaskID: number;
  projectName: string;
  phaseName: string;
  module: string;
  task: string;
  estTime: string;
  upWorkHrs: number;
}

interface Props {
  data: Task[];
  mrngEditID: number;
  setMrngEditID: React.Dispatch<React.SetStateAction<number>>;
}
const MorningTaskTable: React.FC<Props> = ({
  data,
  mrngEditID,
  setMrngEditID,
}) => {
  const [info, setInfo] = useState<Task[]>([]);
  const [propsData, setPropsData] = useState<any>();
  const [employeeFirstname, setEmployeeFirstname] = useState<string>("");
  const [employeeLastname, setEmployeeLastname] = useState<string>("");

  const navigate = useNavigate();
  const dataString = localStorage.getItem("myData");

  useEffect(() => {
    setPropsData(data);
  }, [data]);

  const handleEdit = (MrngTaskID: number) => {
    console.log(`Edit employee with id ${MrngTaskID}`);

    setMrngEditID(MrngTaskID);
    navigate("/add-morning-task");
  };
  const handleDelete = (MrngTaskID: number) => {
    axios
      .delete(`http://localhost:5000/delete/morningDashboard/${MrngTaskID}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setPropsData(propsData.filter((e: any) => e.MrngTaskID !== MrngTaskID));
  };

  const handleMove = (record: any) => {
    axios
      .post("http://localhost:5000/create/addTaskEvening", record)
      .then((response) => {
        if (response.data === "All fields are required.") {
          alert("All fields are required.");
        } else {
          handleDelete(record.MrngTaskID);
        }
      })
      .catch((error) => {});
  };

  // const dataString = localStorage.getItem("myData");

  // Parse the JSON string back into an array
  const employeeInfo = dataString ? JSON.parse(dataString) : [];

  useEffect(() => {
    setEmployeeFirstname(employeeInfo[0].firstName);
    setEmployeeLastname(employeeInfo[0].lastName);

  }, [employeeInfo[0].firstName]);

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
      title: "UpWork(hrs)",
      dataIndex: "upWorkHrs",
      key: "upWorkHrs",
    },

    {
      title: "Action",
      key: "action",
      render: (_: any, record: Task) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.MrngTaskID)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.MrngTaskID)}
          >
            Delete
          </Button>
          <Button onClick={() => handleMove(record)}>move</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <p>{employeeFirstname} </p>
      <Table
        dataSource={propsData}
        columns={columns}
        rowClassName={() => "header-row"}
      />
    </>
  );
};

export default MorningTaskTable;
