import React, { useState, useEffect } from "react";
import { Table } from "antd";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

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
      .get<ShiftChangeData[]>("http://localhost:5000/get/changeShiftInfo")
      .then((response) => {
        // sort the data array in reverse order based on ProID
        const sortedData = response.data.sort(
          (a, b) => Number(b.ShiftChangeTableID) - Number(a.ShiftChangeTableID)
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
      .get<ShiftChangeData[]>("http://localhost:5000/get/changeShiftInfo")
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
      render: (text: string) => <div style={{ width: 100 }}>{dayjs(text).format("YYYY-MM-DD")}</div>,
    },
    {
      title: "Out time ",
      dataIndex: "outTime",
      key: "outTime",
      render: (text: string) => <div style={{ width: 100 }}>{dayjs(text).format("YYYY-MM-DD")}</div>,
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
