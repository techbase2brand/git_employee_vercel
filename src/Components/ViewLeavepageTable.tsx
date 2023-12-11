import React, { useState, useEffect } from "react";
import { Table} from "antd";
// import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

interface LeaveData {
  LeaveInfoID: 0;
  employeeName: string;
  startDate: Date | string;
  endDate: Date | string;
  leaveType: string;
  leaveReason: string;
  teamLead: string;
  employeeID: string;
  adminID: string;
  approvalOfTeamLead: string;
  approvalOfHR: string;
  leaveCategory : string;
}

const ViewLeavepageTable: React.FC = () => {
  const [data, setData] = useState<LeaveData[]>([]);
  const dataString = localStorage.getItem("myData");
  const employeeInfo = dataString ? JSON.parse(dataString) : [];
  console.log(employeeInfo,"employeeInfoemployeeInfo");

useEffect(() => {
  const token = localStorage.getItem("myToken");

  axios
    .get<LeaveData[]>("https://empbackend.base2brand.com/get/leaveinfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const sortedData = response.data.sort(
        (a, b) => Number(b.LeaveInfoID) - Number(a.LeaveInfoID)
      );

      const filteredData = sortedData.filter((item)=> item?.employeeID === employeeInfo?.EmployeeID)

      setData(filteredData);
    });
}, []);

  // const fetchData = () => {
  //   const token = localStorage.getItem("myToken");

  //   axios
  //     .get<LeaveData[]>("https://empbackend.base2brand.com/get/leaveinfo", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((response) => {
  //       const sortedData = response.data.sort(
  //         (a, b) => Number(b.LeaveInfoID) - Number(a.LeaveInfoID)
  //       );
  //       setData(sortedData);
  //     });
  // };


  // useEffect(() => {
  //   fetchData();
  // }, []);


  const columns = [
    {
      title: "Team Lead",
      dataIndex: "teamLead",
      key: "teamLead",
      render: (text: string) => <div style={{ width: 80 }}>{text}</div>,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text: string) => <div style={{ width: 100 }}>{dayjs(text).format("YYYY-MM-DD")}</div>,
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text: string) => <div style={{ width: 100 }}>{dayjs(text).format("YYYY-MM-DD")}</div>,
    },
    {
      title: "leaveCategory",
      dataIndex: "leaveCategory",
      key: "leaveCategory",
      render: (text: string) => <div style={{ width: 100 }}>{text}</div>,
    },
    {
      title: "Leave Type",
      dataIndex: "leaveType",
      key: "leaveType",
      render: (text: string) => <div style={{ width: 50 }}>{text}</div>,
    },
    {
      title: "Leave Reason",
      dataIndex: "leaveReason",
      key: "leaveReason",
      render: (text: string) => <div style={{ width: 250 }}>{text}</div>,
    },
    {
      title: "Status (TL)",
      dataIndex: "approvalOfTeamLead",
      key: "approvalOfTeamLead",
      render: (text: string) => <div style={{ width: 80 }}>{text}</div>,
    },
    {
      title: "Status (HR)",
      dataIndex: "approvalOfHR",
      key: "approvalOfHR",
      render: (text: string) => <div style={{ width: 80 }}>{text}</div>,
    },
  ];


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

export default ViewLeavepageTable;
