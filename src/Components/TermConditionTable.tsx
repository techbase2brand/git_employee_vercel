import React, { useState, useEffect, useMemo } from "react";
import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Task {
  TermID: number;
  term: string;
  currdate: string;
  date: string;
}

interface Props {
  data: Task[];
  mrngEditID: number;
  setMrngEditID: React.Dispatch<React.SetStateAction<number>>;
}

const TermConditionTable: React.FC<Props> = ({ data, setMrngEditID }) => {
  const [propsData, setPropsData] = useState<Task[]>(data || []);
  const [employeeFirstname, setEmployeeFirstname] = useState<string>("");
  const navigate = useNavigate();
  const dataString = localStorage.getItem("myData");


  useEffect(() => {
    setPropsData(data || []);
  }, [data]);

  const handleEdit = (TermID: number) => {
    setMrngEditID(TermID);
    navigate("/TermCondition", { state: { TermID: TermID } });
  };

  const handleDelete = (TermID: number) => {
    axios
      .delete(`http://localhost:5000/delete/addTermCondition/${TermID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then(() => {
        setPropsData(prev => prev.filter(task => task.TermID !== TermID));
      })
      .catch(console.error);
  };
  

  const employeeInfo = useMemo(() => (dataString ? JSON.parse(dataString) : []), [dataString]);

  useEffect(() => {
    setEmployeeFirstname(employeeInfo[0]?.firstName);
  }, [employeeInfo]);

  const columns = [
    {
      title: "TermID",
      dataIndex: "TermID",
      key: "TermID",
    },
    {
      title: "term",
      dataIndex: "term",
      key: "term",
    },
    {
      title: "currdate",
      dataIndex: "currdate",
      key: "currdate",
    },
    {
      title: "date",
      dataIndex: "date",
      key: "date",
    },
   

    {
      title: "Action",
      key: "action",
      render: (_: any, record: Task) => (
        <span>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record.TermID)}>Edit</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.TermID)}>Delete</Button>
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
      />
    </>
  );
};

export default TermConditionTable;
