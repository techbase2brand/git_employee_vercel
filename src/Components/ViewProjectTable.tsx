import React, { useState, useEffect } from "react";
import { Table, Button, Spin, Divider, Space, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Project {
  ProID: string | number;
  clientName: string;
  projectName: string;
  projectDescription: string;
}

interface Props {
  projEditObj: Project | undefined;
  setProjEditObj: React.Dispatch<React.SetStateAction<Project | undefined>>;
}

const ViewProjectTable: React.FC<Props> = ({ projEditObj, setProjEditObj }) => {
  const [data, setData] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<Project[]>(`${process.env.REACT_APP_API_BASE_URL}/get/projects`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    }).then((response) => {
      const sortedData = response.data.sort(
        (a, b) => Number(b.ProID) - Number(a.ProID)
      );
      setData(sortedData);
      setLoading(false);
    });
  }, []);

  const handleEdit = (ProID: string | number) => {
    const filteredObj = data.find((obj) => obj.ProID === ProID);
    if (filteredObj) {
      navigate("/add-project", { state: { projEditObj: filteredObj } });
    }
  };

  const handleDelete = (projectName: string) => {
    axios.delete(`${process.env.REACT_APP_API_BASE_URL}/project/${projectName}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    }).then((response) => {
      console.log('response');
    }).catch((error) => {
      console.log(error);
    });

    setData(data.filter((project) => project.projectName !== projectName));
  };

  const filteredData = data.filter(project =>
    project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
      render: (text: string, record: Project) => (
        <Tooltip title={record.projectDescription} color="volcano">
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Project",
      dataIndex: "projectName",
      key: "projectName",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Project) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.ProID)}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.projectName)}
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
      <div className="search-section" style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 10 }}>
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search.."
            style={{
              marginLeft: 10,
              border: '1px solid rgb(217, 217, 217)',
              borderRadius: '6px',
              height: '30px'
            }}
          />
        </div>
      </div>
      <div className="pro-list">
        {loading ?
          <Spin size="large" className="spinner-antd" style={{
            position: 'absolute',
            width: '84%'
          }} />
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

export default ViewProjectTable;
