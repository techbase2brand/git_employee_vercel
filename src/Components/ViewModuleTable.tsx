import React, { useState, useEffect } from "react";
import { Table, Button, Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Modules {
  modID: number;
  projectName: string;
  phaseName: string;
  modules: string; // Changed from string[] to string
}

interface Props {
  modulejEditObj: Modules | undefined;
  setModulejEditObj: React.Dispatch<React.SetStateAction<Modules | undefined>>;
}

const ViewModuleTable: React.FC<Props> = ({ modulejEditObj, setModulejEditObj }) => {
  const [modulesArr, setModulesArr] = useState<Modules[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<Modules[]>(`${process.env.REACT_APP_API_BASE_URL}/get/modules`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
      }
    })
      .then((response) => {
        const sortedData = response.data.sort((a, b) => Number(b.modID) - Number(a.modID));
        setModulesArr(sortedData);
        setLoading(false);
      });
  }, []);

  const handleEdit = (modID: number) => {
    const filteredObj = modulesArr.filter((obj) => obj.modID === modID);
    navigate("/EditAddModule", { state: { modulejEditObj: filteredObj[0] } });
  };

  const handleDelete = (modID: string) => {
    axios.delete(`${process.env.REACT_APP_API_BASE_URL}/delete/module/${modID}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
      }
    })
      .then(response => {
        setModulesArr(modulesArr.filter((module) => module.modID !== Number(modID)));
      })
      .catch(error => {
        console.log(error);
      });
  };

  const filteredData = modulesArr.filter(module =>
    module.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.phaseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.modules.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Project",
      dataIndex: "projectName",
      key: "projectName",
    },
    {
      title: "Phase",
      dataIndex: "phaseName",
      key: "phaseName",
    },
    {
      title: "Modules",
      dataIndex: "modules",
      key: "modules",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Modules) => (
        <span>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record.modID)} />
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.modID.toString())} />
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
        <div>
          <input
            style={{
              height: '30px', border: '1px solid #d9d9d9',
              borderRadius: '6px'
            }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
        </div>
        {/* <button onClick={() => { setSearchTerm(''); }}>Reset Search</button> */}
      </div>
      <div className="pro-list">
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

export default ViewModuleTable;
