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
  inviteBid: string;
  commModeEmail: string;
  commModeOther: string;
  commModePhone: string;
  commModePortal: string;
  commModeWhatsapp: string;
  commModeSkype: string;
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
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const [state, setState] = useState<boolean>(false);
  const [registerNames, setRegisterNames] = useState<string[]>([]);
  const [statusNames, setStatusNames] = useState<string[]>([]);
  const [selectedPortal, setSelectedPortal] = useState<string>("");
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);
  const [selectedDays, setSelectedDays] = useState<string>("");
  const [selectedRegister, setSelectedRegister] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [gettingData, setGettingData] = useState<SalesInfoData[]>([]);
  const sortedDataa = [...filteredData].sort((a, b) => a.id - b.id);
  const totalLength = filteredData.length;
  const uniqueStatusNames = Array.from(new Set(statusNames));
  const [filteredByDateRange, setFilteredByDateRange] = useState<SalesInfoData[]>([]);
  // Modal for delete confirmation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<string[]>([]);


  const showModal = (text: string | string[]) => {
    const reasons = Array.isArray(text) ? text : text.split(',');
    setModalContent(reasons);
    setModalVisible(true);
  };
  const showModalUrl = (text: string | string[]) => {
    const url = Array.isArray(text) ? text : text.split(',');
    setModalContent(url);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent([]);
  };
  const showModalDel = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setRecordToDelete(null);
  };

  // const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
  //   setDateRange(dateStrings);
  //   setState(true);
  // };
  // const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
  //   const [startDate, endDate] = dateStrings;
  //   if ((!startDate || startDate.trim() === '') && (!endDate || endDate.trim() === '')) {
  //     setState(false);
  //   } else {
  //     setDateRange(dateStrings);
  //   }
  // };
  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    const [startDate, endDate] = dateStrings;
    if ((!startDate || startDate.trim() === '') && (!endDate || endDate.trim() === '')) {
      setFilteredByDateRange([]); // Reset to empty array if date range is not selected
    } else {
      const filteredData = gettingData.filter((item) => {
        const taskDate = new Date(item.dateData).getTime();
        const startDateTime = startDate ? new Date(startDate).getTime() : 0;
        const endDateTime = endDate ? new Date(endDate).getTime() : Infinity;
  
        return taskDate >= startDateTime && taskDate <= endDateTime;
      });
  
      setFilteredByDateRange(filteredData); // Update filtered data based on the date range
    }
  };

  const handleProjectChange = (value: string) => {
    setSelectedRegister(value);
  };

  const handleProjectStatus = (value: string) => {
    setSelectedStatus(value);
  };

  const handlePortalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedPortal(selectedValue);
  };
  const paginationSettings = {
    pageSize: 100,
  };
  const upworkData = filteredData.filter(item => item.portalType === 'upwork');
  const upworkLength = upworkData.length

  const linkedinData = filteredData.filter(item => item.portalType === 'linkedin');
  const linkedinLength = linkedinData.length

  const PPHData = filteredData.filter(item => item.portalType === 'PPH');
  const PPHLength = PPHData.length

  const FreelancerData = filteredData.filter(item => item.portalType === 'freelancer');
  const FreelancerLength = FreelancerData.length

  const WebsiteData = filteredData.filter(item => item.portalType === 'website');
  const WebsiteLength = WebsiteData.length

  const OtherData = filteredData.filter(item => item.portalType === 'other');
  const OtherLength = OtherData.length

  const hiredStatu = filteredData.filter(item => item.status === "Hired");
  const totalHiredLength = hiredStatu.length;

  const closedStatus = filteredData.filter(item => item.status === "Closed");
  const totalClosedLength = closedStatus?.length;

  const sortedData = data.sort((a, b) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
  const createdDates = sortedData.map(item => item.created_at);

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
        setData(resData);
        setFilteredData(resData);
        setGettingData(resData);
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
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedDays(selectedValue);
  };
  // const filterByDateRange = (range: string) => {
  //   const currentDate = new Date();
  //   const startDate = new Date(currentDate);
  //   startDate.setDate(currentDate.getDate() - parseInt(range));
  //   const filteredData = data.filter((item: any) => {
  //     const itemDate = new Date(item.created_at);
  //     return itemDate >= startDate && itemDate <= currentDate;
  //   });
  //   setData(filteredData);
  // };

  // useEffect(() => {
  //   if (selectedDays !== "") {
  //     filterByDateRange(selectedDays);
  //   }
  // }, [selectedDays]);

  const filterByPortalType = (portalType: string) => {
    if (portalType === "") {
      setFilteredData(data);
    }
  };


  useEffect(() => {
    if (selectedPortal !== "") {
      filterByPortalType(selectedPortal);
    }
  }, [selectedPortal]);


  // edit methods
  const handleEdit = (id: number) => {
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
  const generateCommModeContent = (record:any) => {
    const {
      commModeSkype,
      commModePhone,
      commModeWhatsapp,
      commModeEmail,
      commModePortal,
      commModeOther,
      
      
    } = record;
  
    const modes = [
      `Email: ${commModeSkype}`,
      `Other: ${commModePhone}`,
      `Phone: ${commModeWhatsapp}`,
      `Portal: ${commModeEmail}`,
      `Whatsapp: ${commModePortal}`,
      `Skype: ${commModeOther}`,
    ];
  
    return modes.join(', '); // Join modes into a single string
  };
  
  const columns = [
    {
      title: "Lead Date",
      dataIndex: "dateData",
      key: "dateData",
      render: (text: string) => <div>{text}</div>,
      sorter: (a: SalesInfoData, b: SalesInfoData) => {
        const dateA = new Date(a.dateData).getTime();
        const dateB = new Date(b.dateData).getTime();
        return dateA - dateB;
      },
    },
    {
      title: "Data Entry Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) => {
        const date = new Date(text);
        const formattedDate = date.toISOString().split('T')[0];
        return <div>{formattedDate}</div>;
      },
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
      title: "Bid-By/Invite",
      dataIndex: "inviteBid",
      key: "inviteBid",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Register By",
      dataIndex: "RegisterBy",
      key: "RegisterBy",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Status Reason",
      dataIndex: "statusReason",
      key: "statusReason",
      render: (text: string | string[], record: SalesInfoData) => (
        <div>
          <button onClick={() => showModal(text)} style={{ color: 'blue' }}>View Reasons</button>
        </div>
      ),
    },
    {
      title: "Url",
      dataIndex: "url",
      key: "url",
      render: (text: string | string[], record: SalesInfoData) => (
        <div>
          <button onClick={() => showModalUrl(text)} style={{ color: 'blue' }}>View Url</button>
        </div>
      ),
    },
    {
      title: "Comm. mode",
      dataIndex: "commModePortal",
      key: "commModePortal",
      render: (text: string, record: SalesInfoData) => (
        <div>
      <Button onClick={() => showModal(generateCommModeContent(record))}>
        View Comm. Modes
      </Button>
    </div>
      ),
    },
    {
      title: "Additional",
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
              showModalDel();
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
          e?.clientName?.toLowerCase().includes(lowercasedInput) ||
          e?.status?.toLowerCase().includes(lowercasedInput) ||
          e?.communicationMode?.toLowerCase().includes(lowercasedInput) ||
          e?.communicationReason?.toLowerCase().includes(lowercasedInput) ||
          e?.handleBy?.toLowerCase().includes(lowercasedInput) ||
          e?.portalType?.toLowerCase().includes(lowercasedInput) ||
          e?.profileName?.toLowerCase().includes(lowercasedInput) ||
          e?.statusReason?.toLowerCase().includes(lowercasedInput) ||
          e?.url?.toLowerCase().includes(lowercasedInput) ||
          e?.dateData?.toLowerCase().includes(lowercasedInput) ||
          e?.RegisterBy?.toLowerCase().includes(lowercasedInput) ||
          e?.inviteBid?.toLowerCase().includes(lowercasedInput)
      );
      setFilteredData(result);
    } else {
      setFilteredData(data);
    }
    if (selectedPortal !== "") {
      const result = filteredData.filter((e) => e.portalType === selectedPortal);
      setFilteredData(result);
    }
  };
  const handleGoButtonClick = () => {
    const filteredResult = gettingData.filter((item) => {
      const statusMatch =
        selectedStatus ?
          item.status.toLowerCase() === selectedStatus.toLowerCase() :
          true;
      const portalMatch =
        selectedPortal ?
          item.portalType.toLowerCase() === selectedPortal.toLowerCase() :
          true;
      const registerMatch =
        selectedRegister ?
          item.RegisterBy.toLowerCase().includes(selectedRegister.toLowerCase()) :
          true;
          const dateRangeMatch = filteredByDateRange.length > 0
      ? filteredByDateRange.includes(item)
      : true;
      // const matchDate =
      //   selectedDays && item.dateData ?
      //     new Date(item.dateData) >= new Date(new Date().getTime() - parseInt(selectedDays) * 24 * 60 * 60 * 1000) :
      //     true;
      const today = new Date().getTime();
      const selectedDaysInMilliseconds = parseInt(selectedDays) * 24 * 60 * 60 * 1000;
      const fromDate = selectedDays ? today - selectedDaysInMilliseconds : 0;
      const matchDate = !selectedDays || new Date(item?.created_at).getTime() >= fromDate;
      return statusMatch && registerMatch && matchDate && portalMatch && dateRangeMatch;
    });
    if (dateRange[0] === null && dateRange[1] === null) {
      setState(false);
    } else {
      setState(true);
    }
    setFilteredData(filteredResult);
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
    } else if (record.status === "May Work Again") {
      return "work-row";
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
                <div className="total-lengthPortal">
                  <div>upwork:<span className="portal">{upworkLength}</span></div>
                  <div>Linkdin:<span className="portal">{linkedinLength}</span></div>
                  <div>PPH:<span className="portal">{PPHLength}</span></div>
                  <div>Freelancer:<span className="portal">{FreelancerLength}</span></div>
                  <div>Website:<span className="portal">{WebsiteLength}</span></div>
                  <div>other:<span className="portal">{OtherLength}</span></div> =
                  <div>Total:<span className="portal">{totalLength}</span></div>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '39px',
                  marginLeft: '55px'
                }}>
                  <div>Hired:<span className="portal">{totalHiredLength}</span></div>
                  <div>Closed:<span className="portal">{totalClosedLength}</span></div>
                </div>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    gap: '7px',
                    margin: '10px 0 0 48px'
                  }}
                >
                  <div
                    className="search"
                    style={{
                      width: "fit-content",
                    }}
                  >
                    <Input
                      placeholder="Search..."
                      prefix={<SearchOutlined className="search-icon" />}
                      onChange={handleSearch}
                    />
                  </div>
                  <div><RangePicker onChange={handleDateRangeChange} /></div>
                  <div>
                    <select
                      // onChange={handleChange}
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
                    <select
                      value={selectedPortal === "" ? "" : `${selectedPortal}`}
                      onChange={handlePortalChange}
                      className="adjust-inputs"
                    >
                      <option value="">Select portal</option>
                      <option value="Upwork">Upwork</option>
                      <option value="PPH">PPH</option>
                      <option value="Freelancer">Freelancer</option>
                      <option value="Linkedin">Linkedin</option>
                      <option value="Website">Website</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <button className="go-button" onClick={handleGoButtonClick}>Go</button>
                  </div>
                </div>
                <div className="SalecampusFormList-default-os">
                  <div className="infotech-form">
                    {state === false &&
                      <Table
                        dataSource={sortedDataa.slice().reverse()}
                        // dataSource={(Object.values(employeeData) as SalesInfoData[][]).flat().reverse()}
                        columns={columns}
                        // rowClassName={() => "header-row"}
                        rowClassName={getStatusRowClassName}
                        pagination={paginationSettings}
                      />}
                    {state === true &&
                      <Table
                        dataSource={(Object.values(employeeData) as SalesInfoData[][]).flat().reverse()}
                        columns={columns}
                        rowClassName={getStatusRowClassName}
                        pagination={paginationSettings}
                      />}
                  </div>
                  <Modal
                    title="View Data :"
                    visible={modalVisible}
                    onCancel={closeModal}
                    footer={null}
                  >
                    {modalContent.map((reason: string, index: number) => (
                      <div key={index}>
                        {reason.trim()}
                        {index !== modalContent.length - 1 && <br />}
                      </div>
                    ))}
                  </Modal>
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
