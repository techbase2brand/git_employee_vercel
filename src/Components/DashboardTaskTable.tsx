/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";

import { Table, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

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
}
// interface Propsdata {
//   data: Task[];
// }

// const handleEdit = (EmpID: string | number) => {
//   console.log(`Edit employee with id ${EmpID}`);
// };

const DashboardTaskTable: React.FC<Props> = ({ data }) => {
  // const [info, setInfo] = useState<Task[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [propsData, setPropsData] = useState<any>();

  useEffect(() => {
    setPropsData(data);
  }, [data]);

  const handleDelete = (MrngTaskID: number) => {
    // console.log(`Delete task with id ${MrngTaskID}`);

    axios
      .delete(`https://empmgt.base2brand.com/delete/morningDashboard/${MrngTaskID}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setPropsData(propsData.filter((e: any) => e.MrngTaskID !== MrngTaskID));
  };

  console.log(data, "yyyyyyy");

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

    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Task) => (
        <span>
          {/* <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.EmpID)}
            >
              Edit
            </Button> */}
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.MrngTaskID)}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={propsData}
        columns={columns}
        rowClassName={() => "header-row"}
      />
    </>
  );
};

export default DashboardTaskTable;
