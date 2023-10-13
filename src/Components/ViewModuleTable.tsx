import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
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
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<Modules[]>("https://empbackend.base2brand.com/get/modules", {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    })
    .then((response) => {
      const sortedData = response.data.sort((a, b) => Number(b.modID) - Number(a.modID));
      setModulesArr(sortedData);
    });
  }, []);

  const handleEdit = (modID: number) => {
    const filteredObj = modulesArr.filter((obj) => obj.modID === modID);
    setModulejEditObj(filteredObj[0]);
    navigate("/EditAddModule", { state: { modulejEditObj: filteredObj[0] } });
  };

  const handleDelete = (modID: string) => {
    axios.delete(`https://empbackend.base2brand.com/delete/module/${modID}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
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

  return (
    <>
      <div className="search-section" style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 10 }}>
          <label>Search by Project, Phase or Module:</label>
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
        </div>
        {/* <button onClick={() => { setSearchTerm(''); }}>Reset Search</button> */}
      </div>
      <Table
        style={{ width: '80vw' }}
        dataSource={filteredData}
        columns={columns}
        rowClassName={() => "header-row"}
      />
    </>
  );
};

export default ViewModuleTable;
