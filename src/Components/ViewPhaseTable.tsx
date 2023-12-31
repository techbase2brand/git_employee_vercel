import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Phases {
  phaseID: number;
  projectName: string;
  phases: string | string[];  // Modified this line to accept both string and array of strings
}



const ViewPhaseTable: React.FC = () => {
  const [phaseArr, setphaseArr] = useState<Phases[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<Phases[]>(`${process.env.REACT_APP_API_BASE_URL}/get/phases`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    })
      .then((response) => {
        const sortedData = response.data.sort((a, b) => Number(b.phaseID) - Number(a.phaseID));
        setphaseArr(sortedData);
      });
  }, []);

  const handleEdit = (phaseID: string | number) => {
    const filteredObj = phaseArr.find(obj => obj.phaseID === phaseID);
    if (filteredObj) {
      navigate("/EditAddPhase", { state: { phaseEditObj: filteredObj } });
    } else {
      console.error("Phase not found for editing");
      // Handle case where phaseID doesn't match any existing phase
    }
  };
  

  

  const handleDelete = (phaseID: string) => {
    axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/delete-phase/${phaseID}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    setphaseArr(phaseArr.filter((phase) => phase.phaseID.toString() !== phaseID));
  };

  const filteredData = phaseArr.filter(phase =>
    phase.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(phase.phases) ? phase.phases.some(phaseItem => phaseItem.toLowerCase().includes(searchTerm.toLowerCase())) : phase.phases.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = [
    {
      title: "projectName",
      dataIndex: "projectName",
      key: "projectName",
    },
    {
      title: "phases",
      dataIndex: "phases",
      key: "phases",
      render: (phases: string | string[]) => {
        if (Array.isArray(phases)) {
          return <div>{phases.join(", ")}</div>;
        } else if (typeof phases === 'string') {
          return <div>{phases}</div>;
        } else {
          console.error("phases is not a recognized type: ", phases);
          return <div>Error</div>;
        }
      }
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Phases) => (
        <span>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record.phaseID)} />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.phaseID.toString())}
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
        <div>
          <input
          style={{height:'30px',border: '1px solid #d9d9d9',
          borderRadius: '6px'}}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Project or Phase"

          />
        </div>
        {/* <button onClick={() => { setSearchTerm(''); }}>Reset Search</button> */}
      </div>
      <div className="view-phase">
        <Table
          style={{ width: '80vw' }}
          dataSource={filteredData}
          columns={columns}
          rowClassName={() => "header-row"}
          pagination={paginationSettings}
        />
      </div>
    </>
  );
};

export default ViewPhaseTable;
