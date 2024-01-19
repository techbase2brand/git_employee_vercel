import React, { useState, useEffect, useMemo } from "react";
import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Task {
  MrngTaskID: number;
  projectName: string;
  phaseName: string;
  module: string;
  task: string;
  estTime: string;
  upWorkHrs: number;
  selectDate: string;
}

interface Props {
  data: Task[];
  mrngEditID: number;
  setMrngEditID: React.Dispatch<React.SetStateAction<number>>;
}

const MorningTaskTable: React.FC<Props> = ({ data, setMrngEditID }) => {
  const [propsData, setPropsData] = useState<Task[]>(data || []);
  const [employeeFirstname, setEmployeeFirstname] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const dataString = localStorage.getItem("myData");

  const convertTimeToDecimal = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours + (minutes / 60);
  };

  const convertDecimalToTime = (timeInDecimal: number): string => {
    const totalMinutes = timeInDecimal * 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  };

  const totalEstHours = useMemo(() => {
    return propsData.reduce((acc, curr) => acc + convertTimeToDecimal(curr.estTime), 0);
  }, [propsData]);


  const totalUpWorkHours = useMemo(() => {
    return propsData.reduce((acc, curr) => acc + convertTimeToDecimal(String(curr.upWorkHrs)), 0);
  }, [propsData]);

  useEffect(() => {
    setPropsData(data || []);
  }, [data]);

  const handleEdit = (MrngTaskID: number) => {
    setMrngEditID(MrngTaskID);
    navigate("/add-morning-task", { state: { MrngTaskID: MrngTaskID } });
  };

  const handleDelete = (MrngTaskID: number) => {
    axios
      .delete(`${process.env.REACT_APP_API_BASE_URL}/delete/morningDashboard/${MrngTaskID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        setPropsData(prev => prev.filter(task => task.MrngTaskID !== MrngTaskID));
      })
      .catch(console.error);
  };

  const paginationSettings = {
    pageSize: 100,
  };

  const handleMove = (record: Task) => {
    setSubmitting(true)
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/create/addTaskEvening`, record, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        if (response.data === "All fields are required.") {
          alert("All fields are required.");
        } else {
          handleDelete(record.MrngTaskID);
        }
      })
      .catch((error) => {
        toast.error('Not Moved', {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
      setTimeout(() => {
        setSubmitting(false);
      }, 1000);
  };

  const employeeInfo = useMemo(() => (dataString ? JSON.parse(dataString) : []), [dataString]);

  useEffect(() => {
    setEmployeeFirstname(employeeInfo[0]?.firstName);
  }, [employeeInfo]);

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
      title: "Date",
      dataIndex: "selectDate",
      key: "selectDate",
    },

    {
      title: "Action",
      key: "action",
      render: (_: any, record: Task) => (
        <span>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record.MrngTaskID)}>Edit</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.MrngTaskID)}>Delete</Button>
          <Button onClick={() => handleMove(record)} disabled={submitting === true}>Move</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <p>{employeeFirstname}</p>
      <Table
        dataSource={propsData}
        columns={columns}
        rowClassName={() => "header-row"}
        pagination={paginationSettings}
        footer={() => (
          <div>
            <strong>Total Estimated Hours:</strong> {convertDecimalToTime(totalEstHours)} Hrs
            <br />
            <strong>Total UpWork Hours:</strong> {convertDecimalToTime(totalUpWorkHours)}  Hrs
          </div>
        )}
      />
    </>
  );
};

export default MorningTaskTable;
