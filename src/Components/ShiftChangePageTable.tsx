import React, { useState, useEffect } from "react";
import { Table, Button, Spin } from "antd";
import axios from "axios";
import { Input } from "antd";
const { Search } = Input;
interface ShiftChangeData {
  ShiftChangeTableID: number,
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

const ShiftChangePageTable: React.FC = () => {
  const [data, setData] = useState<ShiftChangeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const updatedAllLeave = data.map((item) => {
    const startDateString = item.currDate.toString();
    const updatedStartDate = startDateString.split('T')[0];
    return {
      ...item,
      startDate: updatedStartDate,
    };
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = (ShiftChangeTableID: number) => {
    const token = localStorage.getItem("myToken");


    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/approveShiftChangeTL/${ShiftChangeTableID}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        fetchData();
      })
      .catch((error) => {
        console.error("Error approving shift change data:");
      });
  };

  const handleDeny = (ShiftChangeTableID: number) => {
    const token = localStorage.getItem("myToken");
    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/denyShiftChangeTL/${ShiftChangeTableID}`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        fetchData();
      })
      .catch((error) => {
        console.error("Error denying shift change data:");
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

        const employeeInfo = JSON.parse(localStorage.getItem("myData") || "{}");
        const approverID = employeeInfo.EmployeeID;
        const filteredata = sortedData.filter((emp) => emp?.adminID == approverID)
        setData(filteredata);
        setLoading(false);
      });
  };

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
      render: (text: string) => <div style={{ width: 100 }}>{text}</div>,
    },
    {
      title: "Apply Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text: string) => <div style={{ width: 100 }}>{text}</div>,
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
        <div style={{ width: 200 }}>
          <Button
            type="primary"
            onClick={() => handleApprove(record.ShiftChangeTableID)}
            style={{ marginRight: 10 }}
          >
            Approve
          </Button>
          <Button type="default" danger onClick={() => handleDeny(record.ShiftChangeTableID)}>
            Deny
          </Button>
        </div>
      ),
    }
  ];
  const paginationSettings = {
    pageSize: 100,
  };
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };
  const filteredData = updatedAllLeave.filter((item) =>
    item.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
    <div  className="shifting-change">
    <Search
        placeholder="Search by employee name"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)} // Track search input
        style={{ width: 300, marginBottom: 20 }}
      />
      {loading ?
        <Spin size="large" className="spinner-antd" style={{
          position: 'absolute',
          width: '84%'
        }}/>
        :
        <Table
          dataSource={filteredData}
          columns={columns}
          rowClassName={() => "header-row"}
          pagination={paginationSettings}

        />
      }
      </div>
    </>
  );
};

export default ShiftChangePageTable;
