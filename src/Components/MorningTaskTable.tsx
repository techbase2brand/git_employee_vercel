import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Modal, Input } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Task {
  MrngTaskID: number;
  projectName: string;
  phaseName: string;
  module: string;
  task: string;
  estTime: string;
  upWorkHrs: number;
  selectDate: string;
}

interface Props {
  data: Task[];
  mrngEditID: number;
  setMrngEditID: React.Dispatch<React.SetStateAction<number>>;
}

const MorningTaskTable: React.FC<Props> = ({ data, setMrngEditID }) => {
  const [propsData, setPropsData] = useState<Task[]>(data || []);
  const [employeeFirstname, setEmployeeFirstname] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [move, setMove] = useState(false);
  
  const [modalInputValue, setModalInputValue] = useState("");
  const [modalRecord, setModalRecord] = useState<Task | null>(null);
  const navigate = useNavigate();
  const dataString = localStorage.getItem("myData");

  const convertTimeToDecimal = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours + (minutes / 60);
  };

  const convertDecimalToTime = (timeInDecimal: number): string => {
    const totalMinutes = timeInDecimal * 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  };
  const handleModalOk = () => {
    if (!modalRecord) {
      console.error("No record selected");
      return;
    }
    if (!modalInputValue) {
      console.error("Please select a valid act time");
      return;
    }
    if (move === true) {
      return;
    }
    setSubmitting(true);
    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/update/morningDashboard/${modalRecord.MrngTaskID}`, {
        actTime: modalInputValue,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          axios
            .post(`${process.env.REACT_APP_API_BASE_URL}/create/addTaskEvening`, { ...modalRecord, actTime: modalInputValue, }, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("myToken")}`,
              },
            })
            .then((response) => {
              if (response.data.success) {
                handleDelete(modalRecord.MrngTaskID);
              } else {
                handleDelete(modalRecord.MrngTaskID);
              }
            })
            .catch((error) => {
              toast.error('Not Moved', {
                position: toast.POSITION.TOP_RIGHT,
              });
            })
            .finally(() => {
              setSubmitting(false);
              setMove(true);
            });
        } else {
          setSubmitting(false);
        }
      })
      .catch((error) => {
        console.error("Error updating actTime", error);
        setSubmitting(false);
      })
      .finally(() => {
        setModalVisible(false);
        // setModalInputValue("");
        setModalRecord(null);
        setMove(true);
      });
  };




  const totalEstHours = useMemo(() => {
    return propsData.reduce((acc, curr) => acc + convertTimeToDecimal(curr.estTime), 0);
  }, [propsData]);


  const totalUpWorkHours = useMemo(() => {
    return propsData.reduce((acc, curr) => acc + convertTimeToDecimal(String(curr.upWorkHrs)), 0);
  }, [propsData]);

  useEffect(() => {
    setPropsData(data || []);
  }, [data]);

  const handleEdit = (MrngTaskID: number) => {
    setMrngEditID(MrngTaskID);
    navigate("/add-morning-task", { state: { MrngTaskID: MrngTaskID } });
  };

  const handleDelete = (MrngTaskID: number) => {
    axios
      .delete(`${process.env.REACT_APP_API_BASE_URL}/delete/morningDashboard/${MrngTaskID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        setPropsData(prev => prev.filter(task => task.MrngTaskID !== MrngTaskID));
      })
      .catch(console.error);
  };

  const paginationSettings = {
    pageSize: 100,
  };

  const handleMove = (record: Task) => {
    setSubmitting(true);
    setModalVisible(true);
    setModalRecord(record);
  };


  // const handleMove = (record: Task) => {
  //   setSubmitting(true)
  //   axios
  //     .post(`${process.env.REACT_APP_API_BASE_URL}/create/addTaskEvening`, record, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("myToken")}`,
  //       },
  //     })
  //     .then((response) => {
  //       if (response.data === "All fields are required.") {
  //         alert("All fields are required.");
  //       } else {
  //         handleDelete(record.MrngTaskID);
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error('Not Moved', {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //     });
  //   setTimeout(() => {
  //     setSubmitting(false);
  //   }, 1000);
  // };

  const employeeInfo = useMemo(() => (dataString ? JSON.parse(dataString) : []), [dataString]);

  useEffect(() => {
    setEmployeeFirstname(employeeInfo[0]?.firstName);
  }, [employeeInfo]);

  const columns = [
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",
    },
    {
      title: "Phase",
      dataIndex: "phaseName",
      key: "phaseName",
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
    },
    {
      title: "Task",
      dataIndex: "task",
      key: "task",
    },
    {
      title: "Est time (hrs)",
      dataIndex: "estTime",
      key: "estTime",
    },
    {
      title: "UpWork(hrs)",
      dataIndex: "upWorkHrs",
      key: "upWorkHrs",
    },
    {
      title: "Date",
      dataIndex: "selectDate",
      key: "selectDate",
    },

    {
      title: "Action",
      key: "action",
      render: (_: any, record: Task) => (
        <span style={{ display: 'flex' }}>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record.MrngTaskID)}></Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.MrngTaskID)}></Button>
          <Button onClick={() => handleMove(record)} disabled={submitting === true}>Move</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <p>{employeeFirstname}</p>
      <div className="mrng-table">
        <Table
          dataSource={propsData}
          columns={columns}
          rowClassName={() => "header-row"}
          pagination={paginationSettings}
          footer={() => (
            <div>
              <strong>Total Estimated Hours:</strong> {convertDecimalToTime(totalEstHours)} Hrs
              <br />
              <strong>Total UpWork Hours:</strong> {convertDecimalToTime(totalUpWorkHours)}  Hrs
            </div>
          )}
        />
      </div>
      <Modal
        title="Move Task"
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          setSubmitting(false);
        }}
      >
        <p>Please enter a Act time:</p>
        <select
          name="actTime"
          className="form-control"
          value={modalInputValue}
          onChange={(e) => setModalInputValue(e.target.value)}
          required
        >
          <option value="">--Select Time--</option>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((hour) =>
            [0, 10, 20, 30, 40, 50].map((minute) => (
              <option
                key={`${hour}:${minute}`}
                value={`${hour}:${minute}`}
              >
                {`${hour} hours ${minute} mins`}
              </option>
            ))
          )}
        </select>
      </Modal>
    </>
  );
};

export default MorningTaskTable;
