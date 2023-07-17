import React, { useState, useEffect } from "react";
import { Table } from "antd";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

interface ShiftChangeData {
    ShiftChangeTableID : 0,
    employeeName: string;
    employeeID: string;
    applyDate: string;
    inTime: string;
    outTime: string;
    reason: string;
    currDate: Date;
    teamLead: string;
    adminID: string;
    approvalOfTeamLead: string;
    approvalOfHR: string;
  }

const ViewShiftChangeTable: React.FC = () => {
  const [data, setData] = useState<ShiftChangeData[]>([]);
  // const [] = useState<ShiftChangeData[]>([]);
  // const navigate = useNavigate();
  useEffect(() => {
    axios
      .get<ShiftChangeData[]>("https://empmgt.base2brand.com/get/changeShiftInfo",  {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      }
    )
      .then((response) => {
        // sort the data array in reverse order based on ProID
        const sortedData = response.data.sort(
          (a, b) => Number(b.ShiftChangeTableID) - Number(a.ShiftChangeTableID)
        );
        setData(sortedData);
      });
  }, []);



  const fetchData = () => {
    axios
      .get<ShiftChangeData[]>("https://empmgt.base2brand.com/get/changeShiftInfo",  {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      }
    )
      .then((response) => {

        const sortedData = response.data.sort(
          (a, b) => Number(b.ShiftChangeTableID) - Number(a.ShiftChangeTableID)
        );
        setData(sortedData);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);




  const columns = [
    {
      title: "Team Lead",
      dataIndex: "teamLead",
      key: "teamLead",
      render: (text: string) => <div style={{ width: 80 }}>{text}</div>,
    },
    {
      title: "In time",
      dataIndex: "inTime",
      key: "inTime",
      render: (text: string) => <div style={{ width: 100 }}>{text}</div>,
    },
    {
      title: "Out time ",
      dataIndex: "outTime",
      key: "outTime",
      render: (text: string) => <div style={{ width: 100 }}>{text}</div>,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
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

export default ViewShiftChangeTable;
