import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
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
}

const HRleaveTable : React.FC = () => {
  const [data, setData] = useState<LeaveData[]>([]);
  // const navigate = useNavigate();

//   console.log(data, "-------");

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
      setData(sortedData);
    });
}, []);


// ...
const handleApprove = (LeaveInfoID: number) => {
  const token = localStorage.getItem("myToken");

  axios
    .put(`https://empbackend.base2brand.com/approveLeaveHR/${LeaveInfoID}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data);
      // Refresh the table data after approval
      fetchData();
    })
    .catch((error) => {
      console.error("Error approving leave data:", error);
    });
};


  const handleDeny = (LeaveInfoID: number) => {
    axios
      .put(`https://empbackend.base2brand.com/denyLeaveHR/${LeaveInfoID}`)
      .then((response) => {
        console.log(response.data);
        // Refresh the table data after denial
        fetchData();
      })
      .catch((error) => {
        console.error("Error denying leave data:", error);
      });
  };

  const fetchData = () => {
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
        setData(sortedData);
      });
  };


  useEffect(() => {
    fetchData();
  }, []);






  const columns = [
    {
      title: "Employee",
      dataIndex: "employeeName",
      key: "employeeName",
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
        <div style={{ width: 200 }}>
          <Button
            type="primary"
            onClick={() => handleApprove(record.LeaveInfoID)}
            style={{ marginRight: 10 }}
          >
            Approve
          </Button>
          <Button type="default" danger onClick={() => handleDeny(record.LeaveInfoID)}>
            Deny
          </Button>
        </div>
      ),
    }

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

export default HRleaveTable;
