import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "./Menu";
import Navbar from "./Navbar";
import { Table, Button, Input } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router";
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
  const [filteredData, setFilteredData] = useState<SalecampusData[]>(data);
  const [deleteId, setDeleteId] = useState<number>();
  const [editId, setEditId] = useState<number>();
  const [search, setSearch] = useState<string>("");
  const Navigate = useNavigate();

  const location = useLocation();
  const passedRecord = location.state?.record;

  useEffect(() => {
    const token = localStorage.getItem("myToken");
    axios
      .get(
        "http://localhost:8000/salecampusdata"
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

  // useEffect(() => {
  //   filterData(search);
  // }, [data]);

  // delete methods
  const handleDelete = (id: number) => {
    setDeleteId(id);
    axios
      .delete(
        `http://localhost:8000/delete/${id}`
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
    // filterData(search);
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
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  // handle search
const handleSearch = () => {
  console.log("handle search")
}


  // const filterData = (inputValue: string) => {
  //   if (inputValue) {
  //     const result = data.filter(
  //       (e) =>
  //         e.name.includes(inputValue) || String(e.phone).includes(inputValue)
  //     );
  //     setFilteredData(result);
  //   } else {
  //     setFilteredData(data);
  //   }
  // };
  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const inputValue = e.target.value;
  //   setSearch(inputValue);
  //   filterData(inputValue);
  // };

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
                      // eslint-disable-next-line react/react-in-jsx-scope
                      prefix={<SearchOutlined className="search-icon" />}
                      onChange={handleSearch}
                    />
                  </div>
                  <Table
                    // dataSource={filteredData}
                    dataSource={data}
                    columns={columns}
                    rowClassName={() => "header-row"}
                  />
                  {/* <table>
                    <tr>
                      <th>Gender</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone No.</th>
                      <th>Parent Phone No.</th>
                      <th>Location</th>
                      <th>Course</th>
                      <th>Duration</th>
                      <th>Total Fees</th>
                    </tr>
                    {data.length > 0 &&
                      data.map((val, index) => {
                        return (
                          <tr key={index}>
                            <td>{val.gender}</td>
                            <td>{val.name}</td>
                            <td>{val.email}</td>
                            <td>{val.phone}</td>
                            <td>{val.parentPhone}</td>
                            <td>{val.location}</td>
                            <td>{val.duration}</td>
                            <td>{val.totalFee}</td>
                            <td>{val.highestQualification}</td>
                          </tr>
                        );
                      })}
                  </table> */}
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
