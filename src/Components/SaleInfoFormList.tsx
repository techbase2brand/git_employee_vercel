import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "./Menu";
import Navbar from "./Navbar";
import { Table, Button, Input, Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router";
// import dayjs from "dayjs";

interface SalesInfoData {
  id: number;
  gender: string;
  name: string;
  email: string;
  phone: string;
  parentPhone: string;
  location: string;
  course: string;
  duration: string;
  totalFee: string;
  highestQualification: string;
}

//
// interface Task {
//   EvngTaskID: number;
//   projectName: string;
//   phaseName: string;
//   module: string;
//   task: string;
//   estTime: string;
//   actTime: string;
//   upWorkHrs: number;
// }

interface Props {
  data: SalesInfoData[];
  evngEditID: number;
  setEvngEditID: React.Dispatch<React.SetStateAction<number>>;
}

const SaleInfoFormList = () => {
  const [data, setData] = useState<SalesInfoData[]>([]);
  const [recordToDelete, setRecordToDelete] = useState<SalesInfoData | null>(
    null
  );
  const [filteredData, setFilteredData] = useState<SalesInfoData[]>(data);
  const [deleteId, setDeleteId] = useState<number>();
  const [editId, setEditId] = useState<number>();
  const [search, setSearch] = useState<string>("");
  const Navigate = useNavigate();
  const location = useLocation();
  const passedRecord = location.state?.record;

  // Modal for delete confirmation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setRecordToDelete(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("myToken");
    axios
      .get(
        "http://localhost:8000/salesinfodata"
        //   , {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
      )
      .then((response) => {
        const resData = response.data;
        console.log("resData", resData);
        setData(resData);
        setFilteredData(resData);
      });
  }, []);

  useEffect(() => {
    filterData(search);
  }, [data]);

  // delete methods
  const handleDelete = (id: number) => {
    setDeleteId(id);
    axios
      .delete(
        `http://localhost:8000/deletesalesinfo/${id}`
        // {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        //   },
        // }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    // Update the main data state
    const updatedData = data.filter((e: any) => e.id !== id);
    setData(updatedData);
    // Check if the data is currently filtered
    filterData(search);
    // close consfirmation modal
    setIsModalOpen(false);
    // Null values of delete id
    setRecordToDelete(null);
  };

  // edit methods
    const handleEdit = (id: number) => {
      console.log(`update form with id ${id}`);
      setEditId(id);
      const recordToEdit = data.find((e: any) => e.id === id);
      Navigate("/saleinfoform", { state: { record: recordToEdit } });
    };
//   const handleEdit = (id: number) => {
//     console.log(`update form with id ${id}`);
//     const recordToEdit = data.find((e: any) => e.id === id);
//     if (recordToEdit) {
//       Navigate("/edit-saleinfoform", { state: { record: recordToEdit } });
//     } else {
//       console.error(`No record found with id ${id}`);
//     }
//   };

  const columns = [
    {
      title: "Portal type",
      dataIndex: "portalType",
      key: "portalType",
      render: (text: string) => <div style={{ width: 80 }}>{text}</div>,
    },
    {
      title: "Profile name",
      dataIndex: "profileName",
      key: "profileName",
    },
    {
      title: "Url",
      dataIndex: "url",
      key: "url",
    },
    {
      title: "Client name",
      dataIndex: "clientName",
      key: "clientName",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Handle by",
      dataIndex: "handleBy",
      key: "handleBy",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Status reason",
      dataIndex: "statusReason",
      key: "statusReason",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Communication mode",
      dataIndex: "communicationMode",
      key: "communicationMode",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Communication reason",
      dataIndex: "communicationReason",
      key: "communicationReason",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: SalesInfoData) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setRecordToDelete(record);
              showModal();
            }}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  const filterData = (inputValue: string) => {
    const lowercasedInput = inputValue.toLowerCase();

    if (inputValue) {
      const result = data.filter(
        (e) =>
          e.gender.toLowerCase() === lowercasedInput ||
          e.email.toLowerCase().includes(lowercasedInput) ||
          e.name.toLowerCase().includes(lowercasedInput) ||
          String(e.phone).toLowerCase().includes(lowercasedInput) ||
          String(e.parentPhone).toLowerCase().includes(lowercasedInput) ||
          e.location.toLowerCase().includes(lowercasedInput) ||
          e.highestQualification.toLowerCase().includes(lowercasedInput) ||
          e.duration.toLowerCase().includes(lowercasedInput) ||
          e.totalFee.toLowerCase().includes(lowercasedInput)
      );
      setFilteredData(result);
    } else {
      setFilteredData(data);
    }
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearch(inputValue);
    filterData(inputValue);
  };

  return (
    <>
      <div className="emp-main-div">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ height: "8%" }}>
            <Navbar />
          </div>
          <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
            <div className="menu-div">
              <Menu />
            </div>
            <section className="SalecampusForm-section-os">
              <div className="form-container">
                <div className="SalecampusFormList-default-os">
                  <div
                    className="search"
                    style={{
                      width: "60%",
                      margin: "0 auto",
                      paddingBottom: "2rem",
                    }}
                  >
                    <Input
                      placeholder="Search..."
                      prefix={<SearchOutlined className="search-icon" />}
                      onChange={handleSearch}
                    />
                  </div>
                  <Table
                    // dataSource={filteredData}
                    dataSource={filteredData.slice().reverse()}
                    columns={columns}
                    rowClassName={() => "header-row"}
                  />

                  <Modal
                    title="Confirmation"
                    open={isModalOpen}
                    onOk={() => {
                      if (recordToDelete) {
                        handleDelete(recordToDelete.id);
                      }
                    }}
                    onCancel={handleCancel}
                  >
                    <p>Are you sure, you want to delete</p>
                  </Modal>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default SaleInfoFormList;
