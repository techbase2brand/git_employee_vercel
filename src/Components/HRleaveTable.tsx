import React, { useState, useEffect } from "react";
import { Table, Button, Spin } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { DeleteOutlined} from "@ant-design/icons";
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
}

const HRleaveTable: React.FC = () => {
  const [data, setData] = useState<LeaveData[]>([]);
  const [loading, setLoading] = useState(true);
  const handleApprove = (LeaveInfoID: number) => {
    const token = localStorage.getItem("myToken");
    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/approveLeaveHR/${LeaveInfoID}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        fetchData();
      })
      .catch((error) => {
        console.error("Error approving leave data:", error);
      });
  };

  const handleDeny = (LeaveInfoID: number) => {
    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/denyLeaveHR/${LeaveInfoID}`)
      .then((response) => {
        fetchData();
      })
      .catch((error) => {
        console.error("Error denying leave data:", error);
      });
  };

  const fetchData = () => {
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
        setData(sortedData);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (LeaveInfoID: string | number) => {
    axios
      .delete(`${process.env.REACT_APP_API_BASE_URL}/leaveinfo/${LeaveInfoID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        console.log('response');
      })
      .catch((error) => {
        console.log(error);
      });
    setData(data.filter((employee) => employee.LeaveInfoID !== LeaveInfoID));
  };
  const columns = [
    {
      title: "Employee",
      dataIndex: "employeeName",
      key: "employeeName",
      render: (text: string) => <div style={{}}>{text}</div>,
    },
    {
      title: "Team Lead",
      dataIndex: "teamLead",
      key: "teamLead",
      render: (text: string) => <div style={{}}>{text}</div>,
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
    {
      title: "Action",
      render: (text: number, record: LeaveData) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            type="primary"
            onClick={() => handleApprove(record.LeaveInfoID)}
          >
            Approve
          </Button>
          <Button type="default" danger onClick={() => handleDeny(record.LeaveInfoID)} >
            Deny
          </Button>
          <Button
            type="link" danger icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.LeaveInfoID)}
          />
        </div>
      ),
    }

  ];

  return (
    <>
      {loading ?
        <Spin size="large" className="spinner-antd" style={{
          position: 'absolute',
          width: '84%'
        }} />
        :
        <div className="leave-table">
          <Table
            dataSource={data}
            columns={columns}
            rowClassName={(record) =>
              record.approvalOfTeamLead === "approved" && record.approvalOfHR === "approved"
                ? "approved-row"
                : ""
            }
          />
        </div>
      }
    </>
  );

};

export default HRleaveTable;
