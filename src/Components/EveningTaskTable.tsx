/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Task {
  EvngTaskID: number;
  projectName: string;
  phaseName: string;
  module: string;
  task: string;
  estTime: string;
  actTime: string;
  upWorkHrs: string;
}

interface Props {
  data: Task[];
  evngEditID: number;
  setEvngEditID: React.Dispatch<React.SetStateAction<number>>;
}

const EveningTaskTable: React.FC<Props> = ({ data, setEvngEditID }) => {
  const [propsData, setPropsData] = useState<Task[]>([]);
  const [employeeFirstname, setEmployeeFirstname] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    setPropsData(data);
  }, [data]);

  const convertTimeToDecimal = (time: string) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(":").map(Number);
    return hours + (minutes / 60);
  };

  const convertDecimalToTime = (timeInDecimal: number) => {
    const hours = Math.floor(timeInDecimal);
    const minutes = Math.round((timeInDecimal - hours) * 60);
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  };

  const totalEstTime = propsData.reduce((acc, curr) => acc + convertTimeToDecimal(curr.estTime), 0);
  const totalActTime = propsData.reduce((acc, curr) => acc + convertTimeToDecimal(curr.actTime), 0);
  const totalUpWorkHrs = propsData.reduce((acc, curr) => acc + convertTimeToDecimal(curr.upWorkHrs), 0);

  const handleEdit = (EvngTaskID: number) => {
    setEvngEditID(EvngTaskID);
    navigate("/add-evening-task", { state: { EvngTaskID: EvngTaskID } });
  };

  const handleDelete = (EvngTaskID: number) => {
    axios
      .delete(`https://empbackend.base2brand.com/delete/eveningDashboard/${EvngTaskID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setPropsData(prev => prev.filter(task => task.EvngTaskID !== EvngTaskID));
      })
      .catch(console.error);
  };

  const dataString = localStorage.getItem("myData");
  const employeeInfo = dataString ? JSON.parse(dataString) : [];
  
  useEffect(() => {
    setEmployeeFirstname(employeeInfo[0]?.firstName);
  }, [employeeInfo[0]?.firstName]);




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
      title: "Act time (hrs)",
      dataIndex: "actTime",
      key: "actTime",
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
            onClick={() => handleEdit(record.EvngTaskID)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.EvngTaskID)}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <>
    <p>{employeeFirstname}</p>
      <div className="totals" style={{ marginBottom: '20px' }}>
        <p><strong>Estimated Time Total: </strong> {convertDecimalToTime(totalEstTime)} hrs</p>
        <p><strong>Actual Time Total: </strong> {convertDecimalToTime(totalActTime)} hrs</p>
        <p><strong>UpWork Total: </strong> {convertDecimalToTime(totalUpWorkHrs)} hrs</p>
      </div>
      <Table dataSource={propsData} columns={columns} rowClassName={() => "header-row"} />
    
  </>
  )
};

export default EveningTaskTable;
