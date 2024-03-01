import React, { useState, useEffect } from "react";
import { Spin, Table } from "antd";
import axios from "axios";

interface ShiftChangeData {
  ShiftChangeTableID: 0;
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
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get<ShiftChangeData[]>(`${process.env.REACT_APP_API_BASE_URL}/get/changeShiftInfo`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        const sortedData = response.data.sort(
          (a, b) => Number(b.ShiftChangeTableID) - Number(a.ShiftChangeTableID)
        );
        setData(sortedData);
        setLoading(false);
      });
  }, []);

  const fetchData = () => {
    axios
      .get<ShiftChangeData[]>(`${process.env.REACT_APP_API_BASE_URL}/get/changeShiftInfo`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        const sortedData = response.data.sort(
          (a, b) => Number(b.ShiftChangeTableID) - Number(a.ShiftChangeTableID)
        );
        const employeeInfo = JSON.parse(localStorage.getItem("myData") || "{}");
        const employeeID = employeeInfo.EmployeeID;
        const filteredata = sortedData.filter(
          (emp) => emp?.employeeID == employeeID
        );
        setData(filteredata);
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
      title: "Apply Date",
      dataIndex: "applyDate",
      key: "applyDate",
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
    <div className="shift-table">
      {loading ?
        <Spin size="large" className="spinner-antd" />
        :
        <Table
          style={{ width: "80vw" }}
          dataSource={data}
          columns={columns}
          rowClassName={() => "header-row"}
        />
      }
    </div>
  );
};

export default ViewShiftChangeTable;
