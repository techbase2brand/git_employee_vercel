import React, { useState, useEffect } from "react";
import { Table, Button, Input } from "antd";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface AssignedEmployees {
  PhaseAssigneeID: number;
  projectName: string;
  phaseName: string;
  assignedNames: string[];
}

const data: AssignedEmployees[] = [
  {
    PhaseAssigneeID: 0,
    projectName: "",
    phaseName: "",
    assignedNames: ["", ""],
  },
];

const ViewPhaseassignedTable: React.FC = () => {
  const [assignedArr, setAssignedArr] = useState<AssignedEmployees[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<AssignedEmployees[]>(`${process.env.REACT_APP_API_BASE_URL}/get/PhaseAssignedTo`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        const sortedData = response.data.sort(
          (a, b) => Number(b.PhaseAssigneeID) - Number(a.PhaseAssigneeID)
        );
        console.log(sortedData, "sortedDatasortedData");

        setAssignedArr(sortedData);
      });
  }, []);

  const handleEdit = (PhaseAssigneeID: number) => {
    const filteredObj = assignedArr.filter(
      (obj) => obj?.PhaseAssigneeID === PhaseAssigneeID
    );
    navigate("/EditAssigneePath", {
      state: { assigneeEditObj: filteredObj[0] },
    });
  };

  const filteredData = assignedArr.filter((item) => {
    const namesArray = Array.isArray(item.assignedNames)
      ? item.assignedNames
      : [item.assignedNames];
    const dataToSearch = [
      item.projectName,
      item.phaseName,
      namesArray.join(" "),
    ].join(" ");
    return dataToSearch.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = (PhaseAssigneeID: number) => {
    axios
      .delete(`${process.env.REACT_APP_API_BASE_URL}/delete/phaseAssignee/${PhaseAssigneeID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        setAssignedArr(
          assignedArr.filter(
            (assignee) => assignee.PhaseAssigneeID !== Number(PhaseAssigneeID)
          )
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      title: "Project",
      dataIndex: "projectName",
      key: "projectName",
      render: (text: string) => <div style={{}}>{text}</div>,
    },
    {
      title: "Phase",
      dataIndex: "phaseName",
      key: "phaseName",
      render: (text: string) => <div style={{}}>{text}</div>,
    },
    {
      title: "Assigned Names",
      dataIndex: "assignedNames",
      key: "assignedNames",
      render: (text: string) => <div style={{}}>{text}</div>,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: AssignedEmployees) => (
        <span>
          {/* <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.PhaseAssigneeID)}
          /> */}
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.PhaseAssigneeID)}
          />
        </span>
      ),
    },
  ];
  const paginationSettings = {
    pageSize: 100,
  };
  return (
    <>
      <Input
        placeholder="Search Project, Phase, or Names"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: 400, marginBottom: 16 }}
      />

      <Table
        style={{ width: "80vw" }}
        dataSource={filteredData.length > 0 ? filteredData : data}
        columns={columns}
        rowClassName={() => "header-row"}
        pagination={paginationSettings}
      />
    </>
  );
};

export default ViewPhaseassignedTable;
