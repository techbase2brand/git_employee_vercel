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
import { DatePicker ,AutoComplete  } from "antd";
// import './styles.css';


// import dayjs from "dayjs";

interface SalecampusData {
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
  status: string;
  description: string;
  created_at: string;
  updated_at: string;
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
  data: SalecampusData[];
  evngEditID: number;
  setEvngEditID: React.Dispatch<React.SetStateAction<number>>;
}

const SalecampusFormList = () => {
  const [data, setData] = useState<SalecampusData[]>([]);
  const [recordToDelete, setRecordToDelete] = useState<SalecampusData | null>(
    null
  );
  const [filteredData, setFilteredData] = useState<SalecampusData[]>(data);
  const [deleteId, setDeleteId] = useState<number>();
  const [editId, setEditId] = useState<number>();
  const [search, setSearch] = useState<string>("");
  const [dateSearch, setDateSearch] = useState<string | null>(null);
  const [generalSearch, setGeneralSearch] = useState<string>("");

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


  // const autoCompleteOptions = ['not picked', 'not interested'];


  useEffect(() => {
    const token = localStorage.getItem("myToken");
    axios
      .get(
        "https://empbackend.base2brand.com/salecampusdata"
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
    filterData(dateSearch, search);
}, [data]);


  // delete methods
  const handleDelete = (id: number) => {
    setDeleteId(id);
    axios
      .delete(
        `https://empbackend.base2brand.com/delete/${id}`
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
    filterData(dateSearch, search);

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
    Navigate("/SalecampusForm", { state: { record: recordToEdit } });
  };

  const columns = [
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (text: string) => <div style={{ width: 80 }}>{text}</div>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone No.",
      dataIndex: "phone",
      key: "phone",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Parent Phone No.",
      dataIndex: "parentPhone",
      key: "parentPhone",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Course",
      dataIndex: "highestQualification",
      key: "highestQualification",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (text: string) => <div>{text}</div>,
    },

    {
      title: "Total Fees",
      dataIndex: "totalFee",
      key: "totalFee",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      // render: (text: string) => <div>{text}</div>,
      render: (utcDateTime: any) => convertUTCToLocal(utcDateTime),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      // render: (text: string) => <div>{text}</div>,
      render: (utcDateTime: any) => convertUTCToLocal(utcDateTime),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: SalecampusData) => (
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

  // const filterData = (inputValue: string) => {
  //   const lowercasedInput = inputValue.toLowerCase();

  //   if (inputValue) {
  //     const result = data.filter(e =>
  //       // e.gender.toLowerCase() === (lowercasedInput) ||
  //       e.gender.toLowerCase().includes(lowercasedInput) ||
  //       e.email.toLowerCase().includes(lowercasedInput) ||
  //       e.name.toLowerCase().includes(lowercasedInput) ||
  //       String(e.phone).toLowerCase().includes(lowercasedInput) ||
  //       String(e.parentPhone).toLowerCase().includes(lowercasedInput) ||
  //       e.location.toLowerCase().includes(lowercasedInput) ||
  //       e.highestQualification.toLowerCase().includes(lowercasedInput) ||
  //       e.duration.toLowerCase().includes(lowercasedInput) ||
  //       e.totalFee.toLowerCase().includes(lowercasedInput) ||
  //       e.status.toLowerCase().includes(lowercasedInput)
  //     );
  //     setFilteredData(result);
  //   } else {
  //     setFilteredData(data);
  //   }
  // };

  const handleDateChange = (date: any, dateString: string) => {
    setDateSearch(dateString);
    filterData(dateString, generalSearch);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setGeneralSearch(inputValue);
    filterData(dateSearch, inputValue);
  };

  const filterData = (dateValue: string | null, generalValue: string) => {
    const lowercasedGeneralValue = generalValue.toLowerCase();

    let result = data;

    // Filter by date if dateValue exists
    if (dateValue) {
      result = result.filter((e) => {
        return (
          convertUTCToLocal(e.created_at).split(" ")[0] === dateValue ||
          convertUTCToLocal(e.updated_at).split(" ")[0] === dateValue
        );
      });
    }

    // Further filter by general search value
    if (generalValue) {
      result = result.filter((e) => {
        const criteria = [
          e.gender,
          e.email,
          e.name,
          String(e.phone),
          String(e.parentPhone),
          e.location,
          e.highestQualification,
          e.duration,
          e.totalFee,
          e.status,
        ];
        return criteria.some(
          (criterion) =>
            criterion &&
            criterion.toLowerCase().includes(lowercasedGeneralValue)
        );
      });
    }

    setFilteredData(result);
  };

  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const inputValue = e.target.value;
  //   setSearch(inputValue);
  //   filterData(inputValue);
  // };

  //
  function convertUTCToLocal(utcString: string | number | Date) {
    const date = new Date(utcString);
    const offsetIST = 330; // offset in minutes for UTC+5:30
    date.setMinutes(date.getMinutes() + offsetIST);
    return date.toISOString().slice(0, 19).replace("T", " ");
  }

  // Sample usage
  const utcDateTime = "2023-09-21T14:09:55.000Z";
  const localDateTime = convertUTCToLocal(utcDateTime);
  console.log(localDateTime); // Outputs "2023-09-21 19:39:55"

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
                    style={{
                      paddingBottom: "1rem",
                    }}
                  >
                    <p
                      style={{
                        color: "#094781",
                        justifyContent: "flex-start",
                        fontSize: "32px",
                        fontWeight: "bold",
                      }}
                    >
                      Sale Campus List
                    </p>
                  </div>
                  <div
                    className="search"
                    style={{
                      width: "60%",
                      margin: "0 auto",
                      paddingBottom: "2rem",
                    }}
                  >
                    <DatePicker onChange={handleDateChange} />
                    <Input
                      placeholder="Search..."
                      prefix={<SearchOutlined />}
                      onChange={handleSearch}
                      value={generalSearch}
                    />
                  </div>

                  <p style={{ fontWeight: 'bold', marginBottom: '20px' }}>Number of Records: {filteredData.length}</p>

                  <Table
  dataSource={filteredData.slice().reverse()}
  columns={columns}
  rowClassName={(record) => record.status.replace(/\s+/g, '-')}  // Convert spaces to hyphens
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

export default SalecampusFormList;
