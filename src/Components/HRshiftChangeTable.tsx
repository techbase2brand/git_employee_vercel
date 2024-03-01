import React, { useState, useEffect } from "react";
import { Table, Button, Spin } from "antd";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";
interface ShiftChangeData {
  ShiftChangeTableID: 0,
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

const HRshiftChangeTable: React.FC = () => {
  const [data, setData] = useState<ShiftChangeData[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get<ShiftChangeData[]>(`${process.env.REACT_APP_API_BASE_URL}/get/changeShiftInfo`, {
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
        setLoading(false);
      });
  }, []);

  const handleApprove = (ShiftChangeTableID: number) => {
    const token = localStorage.getItem("myToken");

    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/approveShiftChangeHR/${ShiftChangeTableID}`, {
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
  const handleDeny = (ShiftChangeTableID: number) => {
    const token = localStorage.getItem("myToken");

    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/denyShiftChangeHR/${ShiftChangeTableID}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        fetchData();
      })
      .catch((error) => {
        console.error("Error denying leave data:", error);
      });
  };

  const fetchData = () => {
    axios
      .get<ShiftChangeData[]>(`${process.env.REACT_APP_API_BASE_URL}/get/changeShiftInfo`, {
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

  const handleDelete = (ShiftChangeTableID: string | number) => {
    axios
      .delete(`${process.env.REACT_APP_API_BASE_URL}/leaveinfo/${ShiftChangeTableID}`, {
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
    setData(data.filter((employee) => employee.ShiftChangeTableID !== ShiftChangeTableID));
  };

  const columns = [
    {
      title: "Team Lead",
      dataIndex: "teamLead",
      key: "teamLead",
      render: (text: string) => <div style={{ width: 80 }}>{text}</div>,
    },
    {
      title: "Employee",
      dataIndex: "employeeName",
      key: "employeeName",
      render: (text: string) => <div style={{ width: 80 }}>{text}</div>,
    },
    {
      title: "Apply Date",
      dataIndex: "applyDate",
      key: "applyDate",
      render: (text: string) => {
        const formattedDate = new Date(text).toLocaleDateString();
        return <div style={{ width: 80 }}>{formattedDate}</div>;
      },
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
    {
      title: "Action",
      render: (text: number, record: ShiftChangeData) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            type="primary"
            onClick={() => handleApprove(record.ShiftChangeTableID)}
          >
            Approve
          </Button>
          <Button type="default" danger onClick={() => handleDeny(record.ShiftChangeTableID)}>
            Deny
          </Button>
          <Button
            type="link"
            danger icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.ShiftChangeTableID)}
          />
        </div>
      ),
    }
  ];
  const paginationSettings = {
    pageSize: 100,
  };

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
            style={{ width: "80vw" }}
            dataSource={data}
            columns={columns}
            rowClassName={() => "header-row"}
            pagination={paginationSettings}
          />
        </div>
      }
    </>
  );
};

export default HRshiftChangeTable;
