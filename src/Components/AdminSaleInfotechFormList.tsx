import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "./Menu";
import Navbar from "./Navbar";
import { Table, Button, Input, Modal, DatePicker } from "antd";
import { format } from "date-fns";

import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router";
interface Employee {
  EmpID: string | number;
  firstName: string;
  lastName: string
  role: string;
  dob: string | Date;
  EmployeeID: string;
  status: number;
}
// import dayjs from "dayjs";

// interface SalesInfoData {
//   id: number;
//   gender: string;
//   name: string;
//   email: string;
//   phone: string;
//   parentPhone: string;
//   location: string;
//   course: string;
//   duration: string;
//   totalFee: string;
//   highestQualification: string;
// }
const { RangePicker } = DatePicker;

interface SalesInfoData {
  id: number;
  portalType: string;
  profileName: string;
  url: string;
  clientName: string;
  handleBy: string;
  status: string;
  statusReason: string;
  communicationMode: string;
  communicationReason: string;
  updated_at: string;
  dateData: string;
  EmployeeID: string;
  created_at: string;
  RegisterBy: string;
}
interface Props {
  data: SalesInfoData[];
  evngEditID: number;
  setEvngEditID: React.Dispatch<React.SetStateAction<number>>;
}

const AdminSaleInfotechFormList = () => {
  const [data, setData] = useState<SalesInfoData[]>([]);
  const [recordToDelete, setRecordToDelete] = useState<SalesInfoData | null>(
    null
  );
  const [filteredData, setFilteredData] = useState<SalesInfoData[]>(data);
  const [deleteId, setDeleteId] = useState<number>();
  const [editId, setEditId] = useState<number>();
  const [search, setSearch] = useState<string>("");
  const [employeeData, setEmployeeData] = useState<any>([]);
  const Navigate = useNavigate();
  const location = useLocation();
  const passedRecord = location.state?.record;
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const [state, setState] = useState<boolean>(false);
  const [registerNames, setRegisterNames] = useState<string[]>([]);
  const [statusNames, setStatusNames] = useState<string[]>([]);
  const [selectedRegister, setSelectedRegister] = useState<string>("");
  const uniqueStatusNames = Array.from(new Set(statusNames));
  // Modal for delete confirmation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setRecordToDelete(null);
  };

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
    setState(true);
  };
  const handleProjectChange = (value: string) => {
    setSelectedRegister(value);
    filterData(value);

  };

  useEffect(() => {
    const token = localStorage.getItem("myToken");
    axios
      .get(
        "https://empbackend.base2brand.com/salesinfodata"
        // , {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      )
      .then((response) => {
        setStatusNames(response.data.map((item: { status: string }) => item.status));
        const resData = response.data;
        console.log("resData", resData);
        setData(resData);
        setFilteredData(resData);
        let filteData = response.data;

        if (dateRange[0] && dateRange[1]) {
          const startDate = new Date(dateRange[0]!).getTime();
          const endDate = new Date(dateRange[1]!).getTime();

          filteData = response.data.filter((obj: SalesInfoData) => {
            const taskDate = new Date(obj.dateData).getTime();
            return taskDate >= startDate && taskDate <= endDate;
          });
        }
        const sortedData = filteData.sort(
          (a: SalesInfoData, b: SalesInfoData) => Number(b.created_at) - Number(a.created_at)
        );

        const result: Record<string, SalesInfoData[]> = sortedData.reduce(
          (acc: Record<string, SalesInfoData[]>, obj: SalesInfoData) => {
            if (!acc[obj.EmployeeID]) {
              acc[obj.EmployeeID] = [];
            }
            acc[obj.EmployeeID].push(obj);
            return acc;
          },
          {}
        );

        setEmployeeData(result);
      });
  }, [dateRange, formattedDate]);

  useEffect(() => {
    axios
      .get<Employee[]>("https://empbackend.base2brand.com/employees", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        const salesInfotechEmployees = response.data.filter(
          (employee) => employee.role === 'Sales Infotech'
        );
        const salesInfotechNames = salesInfotechEmployees.map(
          (employee) => employee.firstName
        );
        setRegisterNames(salesInfotechNames)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
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
        `https://empbackend.base2brand.com/deletesalesinfo/${id}`
        // {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        //   },
        // }
      )
      .then((response) => {
        console.log("res@", response.data);
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
  // ... (existing code)

  const columns = [
    {
      title: "Date",
      dataIndex: "dateData",
      key: "dateData",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Client name",
      dataIndex: "clientName",
      key: "clientName",
      render: (text: string) => <div>{text}</div>,
    },
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
      title: "Register By",
      dataIndex: "RegisterBy",
      key: "RegisterBy",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Status reason",
      dataIndex: "statusReason",
      key: "statusReason",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Additional",
      dataIndex: "communicationReason",
      key: "communicationReason",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Comm. mode",
      dataIndex: "communicationMode",
      key: "communicationMode",
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
          e.clientName.toLowerCase().includes(lowercasedInput) ||
          e.status.toLowerCase().includes(lowercasedInput) ||
          e.communicationMode.toLowerCase().includes(lowercasedInput) ||
          e.communicationReason.toLowerCase().includes(lowercasedInput) ||
          e.handleBy.toLowerCase().includes(lowercasedInput) ||
          e.portalType.toLowerCase().includes(lowercasedInput) ||
          e.profileName.toLowerCase().includes(lowercasedInput) ||
          e.statusReason.toLowerCase().includes(lowercasedInput) ||
          e.url.toLowerCase().includes(lowercasedInput) ||
          e.dateData.toLowerCase().includes(lowercasedInput) ||
          e.RegisterBy.toLowerCase().includes(lowercasedInput)
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
  const getStatusRowClassName = (record: SalesInfoData) => {
    if (record.status === "Discussion") {
      return "yellow-row";
    } else if (record.status === "Hired") {
      return "green-row";
    } else if (record.status === "Closed") {
      return "red-row";
    } else if (record.status === "Pending") {
      return "pending-row";
    } else {
      return "";
    }
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

                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      gap: '7px',
                    }}
                  >
                    <div><RangePicker onChange={handleDateRangeChange} /></div>

                    <div>
                      <select
                        // onChange={handleChange}
                        className="adjust-inputs"
                        id="project"
                        value={selectedRegister}
                        onChange={(e) => handleProjectChange(e.target.value)}
                      >
                        <option value="">Select a RegisterBy</option>
                        {registerNames.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        // onChange={handleChange}
                        className="adjust-inputs"
                        id="project"
                        value={selectedRegister}
                        onChange={(e) => handleProjectChange(e.target.value)}
                      >
                        <option value="">Select a Status</option>
                        {uniqueStatusNames.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {state === false &&
                    <Table
                      dataSource={filteredData.slice().reverse()}
                      // dataSource={(Object.values(employeeData) as SalesInfoData[][]).flat().reverse()}
                      columns={columns}
                      // rowClassName={() => "header-row"}
                      rowClassName={getStatusRowClassName}
                    />}
                  {state === true &&
                    <Table
                      dataSource={(Object.values(employeeData) as SalesInfoData[][]).flat().reverse()}
                      columns={columns}
                      rowClassName={getStatusRowClassName}
                    />}

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

export default AdminSaleInfotechFormList;
