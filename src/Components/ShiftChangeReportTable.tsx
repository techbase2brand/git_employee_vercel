import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import axios from "axios";
import moment from "moment";

interface ShiftChangeData {
  ShiftChangeTableID: number;
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
  const [data, setData] = useState<{ [key: string]: ShiftChangeData[] }>({});

  const fetchData = async () => {
    const response = await axios.get<ShiftChangeData[]>("http://localhost:5000/get/changeShiftInfo", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("myToken")}`,
      },
    });

    const groupedData: { [key: string]: ShiftChangeData[] } = {};
    response.data.forEach((item) => {
      const monthYear = moment(item.applyDate).format("MMMM YYYY");
      if (!groupedData[monthYear]) {
        groupedData[monthYear] = [];
      }
      groupedData[monthYear].push(item);
    });

    setData(groupedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteShiftChange = (id: number) => {
    axios
      .delete(`http://localhost:5000/delete/changeShiftInfo/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        console.error(`There was an error deleting the shift change: ${error}`);
      });
  };

  const columns = [
    /* Your other column configurations here */
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
        render: (text: string) => <div style={{ width: 100 }}>{moment(text).format("YYYY-MM-DD")}</div>,
      },
      {
        title: "In time",
        dataIndex: "inTime",
        key: "inTime",
        render: (text: string) => <div style={{ width: 100 }}>{text}</div>,
      },
      {
        title: "Out time",
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
    // {
    //   title: "Delete",
    //   key: "delete",
    //   render: (_: any, record: ShiftChangeData) => (
    //     <Button onClick={() => deleteShiftChange(record.ShiftChangeTableID)}>Delete</Button>
    //   ),
    // },
  ];

  return (
    <div style={{ width: "80vw" }}>
      {Object.keys(data).sort().reverse().map((monthYear) => (
        <div key={monthYear}>
          <h2>{monthYear}</h2>
          <Table dataSource={data[monthYear]} columns={columns} rowKey="ShiftChangeTableID" />
        </div>
      ))}
    </div>
  );
};

export default ViewShiftChangeTable;
