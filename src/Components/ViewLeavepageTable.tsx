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
  // const [] = useState<LeaveData[]>([]);
// const navigate = useNavigate();
  useEffect(() => {
    axios
      .get<LeaveData[]>("http://localhost:5000/get/leaveinfo")
      .then((response) => {
        // sort the data array in reverse order based on ProID
        const sortedData = response.data.sort(
          (a, b) => Number(b.LeaveInfoID) - Number(a.LeaveInfoID)
        );
        setData(sortedData);
      });
  }, []);

// const handleApprove = (LeaveInfoID: number) => {
//     axios
//       .put(`http://localhost:5000/approveLeave/${LeaveInfoID}`)
//       .then((response) => {
//         console.log(response.data);
//         // Refresh the table data after approval
//         fetchData();
//       })
//       .catch((error) => {
//         console.error("Error approving leave data:", error);
//       });
//   };

  // const handleDeny = (LeaveInfoID: number) => {
  //   axios
  //     .put(`http://localhost:5000/denyLeave/${LeaveInfoID}`)
  //     .then((response) => {
  //       console.log(response.data);
  //       // Refresh the table data after denial
  //       fetchData();
  //     })
  //     .catch((error) => {
  //       console.error("Error denying leave data:", error);
  //     });
  // };

  const fetchData = () => {
    axios
      .get<LeaveData[]>("http://localhost:5000/get/leaveinfo")
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
