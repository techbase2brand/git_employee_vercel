import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import io from "socket.io-client";
interface LeaveData {
  LeaveInfoID: number;
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

const LeavePageTable: React.FC = () => {
  const [data, setData] = useState<LeaveData[]>([]);
  const navigate = useNavigate();

  const employeeInfo = localStorage.getItem("myData");
  console.log(employeeInfo, "employeeInfoemployeeInfoemployeeInfo");

  const approvedRowStyle = {
    backgroundColor: 'lightgreen',
  };

  useEffect(() => {
    axios
      .get<LeaveData[]>("https://empbackend.base2brand.com/get/leaveinfo", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        const sortedData = response.data.sort(
          (a, b) => Number(b.LeaveInfoID) - Number(a.LeaveInfoID)
        );
        setData(sortedData);
      });
  }, []);

  const handleApprove = (LeaveInfoID: number) => {
    axios
      .put(
        `https://empbackend.base2brand.com/approveLeave/${LeaveInfoID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("myToken")}`,
          },
        }
      )
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
      .put(
        `https://empbackend.base2brand.com/denyLeave/${LeaveInfoID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("myToken")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        // Refresh the table data after denial
        fetchData();
      })
      .catch((error) => {
        console.error("Error denying leave data:", error);
      });
  };
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("leaveinfo", (data: { data: any[] }) => {
      console.log(data, "dataaaaaaddd");

      const sortedData = data?.data?.sort(
        (a, b) => Number(b.LeaveInfoID) - Number(a.LeaveInfoID)
      );

      const employeeInfo = JSON.parse(localStorage.getItem("myData") || "{}");
      console.log(employeeInfo);

      const approverID = employeeInfo.EmployeeID;
      console.log(approverID, "approverIDapproverID");

      // Filter the sortedData based on the adminID
      const filteredData = sortedData.filter(
        (data) => data.adminID === approverID
      );

      setData(filteredData);
    });
  }, []);


  const fetchData = () => {
    axios
      .get<LeaveData[]>("https://empbackend.base2brand.com/get/leaveinfo", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        const sortedData = response.data.sort(
          (a, b) => Number(b.LeaveInfoID) - Number(a.LeaveInfoID)
        );


        // Retrieve the adminID from the localStorage
        const employeeInfo = JSON.parse(localStorage.getItem("myData") || "{}");
        console.log(employeeInfo);

        const approverID = employeeInfo.EmployeeID;
        console.log(approverID,"approverIDapproverID");


        // Filter the sortedData based on the adminID
        const filteredData = sortedData.filter(
          (data) => data.adminID === approverID
        );



        setData(filteredData);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Custom row style function
  // Custom row style function
const getRowClassName = (record: LeaveData) => {
  console.log(record,"recordrecord");

  if (record.approvalOfTeamLead === "approved" && record.approvalOfHR === "approved") {

    return "approved-row"; // This class will be applied to rows with both approvals

  }

  return "";
};


  const columns = [
    {
      title: "Employee",
      dataIndex: "employeeName",
      key: "employeeName",
      render: (text: string) => <div style={{}}>{text}</div>,
    },
    {
      title: "startDate",
      dataIndex: "startDate",
      key: "startDate",
      render: (text: string) => (
        <div style={{}}>{dayjs(text).format("YYYY-MM-DD")}</div>
      ),
    },
    {
      title: "endDate",
      dataIndex: "endDate",
      key: "endDate",
      render: (text: string) => (
        <div style={{}}>{dayjs(text).format("YYYY-MM-DD")}</div>
      ),
    },
    {
      title: "leaveType",
      dataIndex: "leaveType",
      key: "leaveType",
      render: (text: string) => <div style={{}}>{text}</div>,
    },
    {
      title: "leaveReason",
      dataIndex: "leaveReason",
      key: "leaveReason",
      render: (text: string) => <div style={{ maxWidth: "200px" }}>{text}</div>,
    },
    {
      title: "approvalOfTeamLead",
      dataIndex: "approvalOfTeamLead",
      key: "approvalOfTeamLead",
      render: (text: string) => <div style={{}}>{text}</div>,
    },
    {
      title: "approvalOfHR",
      dataIndex: "approvalOfHR",
      key: "approvalOfHR",
      render: (text: string) => <div style={{}}>{text}</div>,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: LeaveData) => (
        <span>
          <Button onClick={() => handleApprove(record.LeaveInfoID)}>
            Approve
          </Button>
          <Button onClick={() => handleDeny(record.LeaveInfoID)}>Deny</Button>
        </span>
      ),
    },
  ];
  const paginationSettings = {
    pageSize: 100,
  };
  return (
    <>
      <Table
        style={{ width: "80vw" }}
        dataSource={data}
        columns={columns}
        rowKey={(record) => record.LeaveInfoID.toString()} // Specify a unique row key
        rowClassName={getRowClassName} // Apply custom row class name
        pagination={paginationSettings}
      />
    </>
  );
};

export default LeavePageTable;
