import React, { useState, useEffect } from "react";
import { Spin, Table } from "antd";
import axios from "axios";
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
  leaveCategory: string;
}

const ViewLeavepageTable: React.FC = () => {
  const [data, setData] = useState<LeaveData[]>([]);
  console.log("data", data);
  const [loading, setLoading] = useState(true);
  const dataString = localStorage.getItem("myData");
  const employeeInfo = dataString ? JSON.parse(dataString) : [];

  const uncertain = data.filter((item) => item.leaveCategory === "Uncertain Leave")
  const UncertainLeave = uncertain.length;
  const Regular = data.filter((item) => item.leaveCategory === "Regular Leave")
  const RegularLeave = Regular.length;

  useEffect(() => {
    const token = localStorage.getItem("myToken");
    axios
      .get<LeaveData[]>(`${process.env.REACT_APP_API_BASE_URL}/get/leaveinfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const sortedData = response.data.sort(
          (a, b) => Number(b.LeaveInfoID) - Number(a.LeaveInfoID)
        );
        const filteredData = sortedData.filter((item) => item?.employeeID === employeeInfo?.EmployeeID)
        setData(filteredData);
        setLoading(false);
      });
  }, []);

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
    <div className="total-lengthPortal">
                  <div>Uncertain Leave:<span className="portal">{UncertainLeave}</span></div>
                  <div>Regular Leave:<span className="portal">{RegularLeave}</span></div>
                 =
                  <div>Total:<span className="portal">{UncertainLeave + RegularLeave}</span></div>
                </div>
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
    </>
  );
};

export default ViewLeavepageTable;
