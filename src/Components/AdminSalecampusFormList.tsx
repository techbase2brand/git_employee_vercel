import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "./Menu";
import Navbar from "./Navbar";
import { Table, Button, Input, Modal, Spin } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router";
import { DatePicker } from "antd";

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
  EmployeeID: string;
}


interface Employee {
  EmpID: string | number;
  firstName: string;
  role: string;
  dob: string | Date;
  EmployeeID: string;
}

const AdminSaleCampusFormList = () => {
  const [data, setData] = useState<SalecampusData[]>([]);
  const [recordToDelete, setRecordToDelete] = useState<SalecampusData | null>(
    null
  );
  const [filteredData, setFilteredData] = useState<SalecampusData[]>(data);
  const [search] = useState<string>("");
  const [dateSearch] = useState<string | null>(null);
  const [generalSearch, setGeneralSearch] = useState<string>("");
  const [dateRangeSearch, setDateRangeSearch] = useState<[string | null, string | null]>([null, null]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedRegister, setSelectedRegister] = useState<string>("");
  const [state, setState] = useState<boolean>(false);
  const [registerNames, setRegisterNames] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string>("");
  const [statusNames, setStatusNames] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const uniqueStatusNames = Array.from(new Set(statusNames));
  const [loading, setLoading] = useState(true);
  const Navigate = useNavigate();
  const location = useLocation();

  // Modal for delete confirmation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setRecordToDelete(null);
  };

  const NotInterested = filteredData.filter(item => item.status === 'not interested');
  const NotInterestedLength = NotInterested.length

  const NotPicked = filteredData.filter(item => item.status === 'not picked');
  const NotPickedLength = NotPicked.length

  const Interested = filteredData.filter(item => item.status === 'interested');
  const InterestedLength = Interested.length

  const Hopefully = filteredData.filter(item => item.status === 'hopefully');
  const HopefullyLength = Hopefully.length

  const Enrolled = filteredData.filter(item => item.status === 'enrolled');
  const EnrolledLength = Enrolled.length

  const totalLength = filteredData.length;


  const handleProjectStatus = (value: string) => {
    setSelectedStatus(value);
  };
  const handleProjectChange = (value: string) => {
    setSelectedRegister(value);
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedDays(selectedValue);
  }

  useEffect(() => {
    // const token = localStorage.getItem("myToken");
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/salecampusdata`
        //   , {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
      )
      .then((response) => {
        setStatusNames(response.data.map((item: { status: string }) => item.status));
        const resData = response.data;
        setData(resData);
        setFilteredData(resData);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    filterData(dateSearch, dateSearch, search);
  }, [data]);

  const paginationSettings = {
    pageSize: 100,
  };

  useEffect(() => {
    axios
      .get<Employee[]>(`${process.env.REACT_APP_API_BASE_URL}/employees`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        }
      })
      .then((response) => {
        const salesInfotechEmployees = response.data.filter(
          (employee) => employee.role === 'Sales Campus'
        );
        const salesInfotechNames = salesInfotechEmployees.map(
          (employee) => employee.firstName
        );
        setRegisterNames(salesInfotechNames)
        setEmployees(response.data);
      })
      .catch((error) => console.log(error));
  }, []);


  const getEmployeeName = (employeeId: string | number) => {
    const employee = employees.find(emp => emp.EmployeeID === employeeId);
    return employee ? employee.firstName : '-';
  }



  const handleDelete = (id: number) => {
    axios
      .delete(
        `${process.env.REACT_APP_API_BASE_URL}/delete/${id}`
        // {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        //   },
        // }
      )
      .then((response) => {
        console.log("res")
      })
      .catch((error) => {
        console.log(error);
      });

    // Update the main data state
    const updatedData = data.filter((e: any) => e.id !== id);
    setData(updatedData);
    filterData(dateSearch, dateSearch, search);
    setIsModalOpen(false);
    setRecordToDelete(null);
  };

  // edit methods
  const handleEdit = (id: number) => {
    const recordToEdit = data.find((e: any) => e.id === id);
    Navigate("/SalecampusForm", { state: { record: recordToEdit } });
  };

  const handleGoButtonClick = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    switch (selectedDays) {
      case "7":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case "30":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "90":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 3);
        break;
      case "180":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 6);
        break;
      case "365":
        startDate = new Date(today);
        startDate.setFullYear(currentYear - 1);
        break;
      default:
        break;
    }
    endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);
    const filteredResult = data.filter((item) => {
      const statusMatch =
        selectedStatus ?
          item.status.toLowerCase() === selectedStatus.toLowerCase() :
          true;
      const employeeName = getEmployeeName(item.EmployeeID).toLowerCase();
      const registerMatch = selectedRegister ?
        employeeName.includes(selectedRegister.toLowerCase()) :
        true;
      const itemDate = new Date(item.created_at);

      const itemDateTimestamp = itemDate.getTime();
      const matchDate = (!startDate || itemDateTimestamp >= startDate.getTime()) &&
        (!endDate || itemDateTimestamp <= endDate.getTime());

      const dateRangeMatch =
        dateRangeSearch[0] && dateRangeSearch[1]
          ? (
            (item.created_at && new Date(item.created_at) >= new Date(dateRangeSearch[0]) && new Date(item.created_at) <= new Date(dateRangeSearch[1])) ||
            (item.updated_at && new Date(item.updated_at) >= new Date(dateRangeSearch[0]) && new Date(item.updated_at) <= new Date(dateRangeSearch[1]))
          )
          : true;
      return statusMatch && registerMatch && matchDate && dateRangeMatch;
    });
    if (!startDate && !endDate && (dateRangeSearch[0] || dateRangeSearch[1])) {
      setState(false);
    } else {
      setState(true);
    }
    setFilteredData(filteredResult);
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Called By",
      key: "EmployeeName",
      render: (_: any, record: SalecampusData) => (
        <div>{getEmployeeName(record.EmployeeID)}</div>
      )
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) => {
        const date = new Date(text);
        const formattedDate = date.toISOString().split('T')[0];
        return <div>{formattedDate}</div>;
      },
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text: string) => {
        const date = new Date(text);
        const formattedDate = date.toISOString().split('T')[0];
        return <div>{formattedDate}</div>;
      },
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

  const { RangePicker } = DatePicker;

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates) {
      const [startDate, endDate] = dateStrings;
      setDateRangeSearch([startDate, endDate]);
      // filterData(startDate, endDate, generalSearch);
    } else {
      setDateRangeSearch([null, null]);
      filterData(null, null, generalSearch);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setGeneralSearch(inputValue);
    if (dateRangeSearch[0] && dateRangeSearch[1]) {
      filterData(dateRangeSearch[0], dateRangeSearch[1], inputValue);
    } else {
      filterData(null, null, inputValue);
    }
  };

  const filterData = (
    startDate: string | null,
    endDate: string | null,
    generalValue: string
  ) => {
    const lowercasedGeneralValue = generalValue.toLowerCase();
    let result = data;

    if (startDate && endDate) {
      result = result.filter((e) => {
        const createdDate = convertUTCToLocal(e.created_at).split(" ")[0];
        const updatedDate = convertUTCToLocal(e.updated_at).split(" ")[0];
        return (
          (createdDate >= startDate && createdDate <= endDate) ||
          (updatedDate >= startDate && updatedDate <= endDate)
        );
      });
    }
    if (generalValue) {
      result = result.filter((e) => {
        const employeeName = getEmployeeName(e.EmployeeID);  // Fetch the employee's name
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
          employeeName  // Add the employee's name to the criteria
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

  function convertUTCToLocal(utcString: string | number | Date) {
    const date = new Date(utcString);
    const offsetIST = 330; // offset in minutes for UTC+5:30
    date.setMinutes(date.getMinutes() + offsetIST);
    return date.toISOString().slice(0, 19).replace("T", " ");
  }

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

                <div className="AdminSaleCampusFormList-default-os">
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
                    <div className="total-lengthPortal" style={{ marginLeft: '0' }}>
                      <div>Not Interested:<span className="portal">{NotInterestedLength}</span></div>
                      <div>Not Picked:<span className="portal">{NotPickedLength}</span></div>
                      <div>Interested:<span className="portal">{InterestedLength}</span></div>
                      <div>Hopefully:<span className="portal">{HopefullyLength}</span></div>
                      <div>Enrolled:<span className="portal">{EnrolledLength}</span></div> =
                      <div>Total:<span className="portal">{totalLength}</span></div>
                    </div>
                  </div>
                  <div
                    className="search"
                    style={{
                      width: "60%",
                      paddingBottom: "2rem",
                      display: 'flex',
                      gap: '16px'
                    }}
                  >
                    <RangePicker onChange={handleDateRangeChange} />

                    <Input
                      style={{ width: "auto" }}
                      placeholder="Search..."
                      prefix={<SearchOutlined />}
                      onChange={handleSearch}
                      value={generalSearch}
                    />
                    <div>
                      <select
                        className="adjust-inputs"
                        id="project"
                        value={selectedStatus}
                        onChange={(e) => handleProjectStatus(e.target.value)}
                      >
                        <option value="">Select a Status</option>
                        {uniqueStatusNames.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        className="adjust-inputs"
                        id="project"
                        value={selectedRegister}
                        onChange={(e) => handleProjectChange(e.target.value)}
                      >
                        <option value="">Select a CalledBy</option>
                        {registerNames.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        className="adjust-inputs"
                        value={selectedDays === "" ? "" : `${selectedDays}`}
                        onChange={handleSelectChange}
                      >
                        <option value="">Select date range</option>
                        <option value="7">Last 1 week</option>
                        <option value="30">Last 1 month</option>
                        <option value="90">Last 3 months</option>
                        <option value="180">Last 6 months</option>
                        <option value="365">Last 1 year</option>
                      </select>
                    </div>
                    <div>
                      <button className="go-button" onClick={handleGoButtonClick}>Go</button>
                    </div>
                  </div>
                  <div className="saleCampus-form">
                    {loading ?
                      <Spin size="large" className="spinner-antd" />
                      :
                      <Table
                        dataSource={filteredData.slice().reverse()}
                        columns={columns}
                        rowClassName={(record) =>
                          record.status.replace(/\s+/g, "-")
                        }
                        pagination={paginationSettings}
                      />
                    }
                  </div>
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

export default AdminSaleCampusFormList;
