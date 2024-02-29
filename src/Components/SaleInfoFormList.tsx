import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "./Menu";
import Navbar from "./Navbar";
import { Table, Button, Input, Modal, DatePicker, Select } from "antd";
import { format } from "date-fns";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
const { RangePicker } = DatePicker;

interface Employee {
  EmpID: string | number;
  firstName: string;
  lastName: string
  role: string;
  dob: string | Date;
  EmployeeID: string;
  status: number;
}

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
  inviteBid: string;
  commModeEmail: string;
  commModeOther: string;
  commModePhone: string;
  commModePortal: string;
  commModeWhatsapp: string;
  commModeSkype: string;
  othermode: string;
  sendTo: string;
  enterCmnt: string;
}

const SaleInfoFormList = () => {
  const [data, setData] = useState<SalesInfoData[]>([]);
  const [filteredData, setFilteredData] = useState<SalesInfoData[]>(data);
  const [selectedPortal, setSelectedPortal] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [employeeData, setEmployeeData] = useState<any>([]);
  const Navigate = useNavigate();
  const [dateRange] = useState<[string | null, string | null]>([null, null]);
  const [currentDate] = useState<Date>(new Date());
  const [state, setState] = useState<boolean>(false);
  const [statusNames, setStatusNames] = useState<string[]>([]);
  const [gettingData, setGettingData] = useState<SalesInfoData[]>([]);
  const uniqueStatusNames = Array.from(new Set(statusNames));
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const [employeeFirstNames, setEmployeeFirstNames] = useState<string[]>([]);
  const myDataString = localStorage.getItem('myData');
  let empIdMatch = "";
  if (myDataString) {
    const myData = JSON.parse(myDataString);
    empIdMatch = myData.EmployeeID;
  }
  const matchedData = filteredData.filter(item => item.EmployeeID === empIdMatch);
  const totalLength = matchedData.length;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<string[]>([]);
  const [filteredByDateRange, setFilteredByDateRange] = useState<SalesInfoData[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<string>("");
  const [selectedSendToValues, setSelectedSendToValues] = useState<Record<number, string>>({});
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

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    const [startDate, endDate] = dateStrings;
    if ((!startDate || startDate.trim() === '') && (!endDate || endDate.trim() === '')) {
      setFilteredByDateRange([]);
    } else {
      const filteredData = gettingData.filter((item) => {
        const taskDate = new Date(item.dateData).getTime();
        const startDateTime = startDate ? new Date(startDate).getTime() : 0;
        const endDateTime = endDate ? new Date(endDate).getTime() : Infinity;

        return taskDate >= startDateTime && taskDate <= endDateTime;
      });
      setFilteredByDateRange(filteredData);
    }
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedDays(selectedValue);
  };

  const handleProjectStatus = (value: string) => {
    setSelectedStatus(value);
  };

  const paginationSettings = {
    pageSize: 100,
  };

  useEffect(() => {
    axios
      .get<Employee[]>(`${process.env.REACT_APP_API_BASE_URL}/employees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        const employeeNames = response?.data.map((employee) => employee.firstName);

        setEmployeeFirstNames(employeeNames);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

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
    const filteredResult = gettingData.filter((item) => {
      const statusMatch =
        selectedStatus ?
          item.status.toLowerCase() === selectedStatus.toLowerCase() :
          true;
      const portalMatch =
        selectedPortal ?
          item.portalType.toLowerCase() === selectedPortal.toLowerCase() :
          true;
      const dateRangeMatch = filteredByDateRange.length > 0
        ? filteredByDateRange.includes(item)
        : true;
      const itemDate = new Date(item.dateData);
      const itemDateTimestamp = itemDate.getTime();
      const matchDate = (!startDate || itemDateTimestamp >= startDate.getTime()) &&
        (!endDate || itemDateTimestamp <= endDate.getTime());
      return statusMatch && matchDate && portalMatch && dateRangeMatch;
    });
    if (dateRange[0] === null && dateRange[1] === null) {
      setState(false);
    } else {
      setState(true);
    }
    setFilteredData(filteredResult);
  };

  useEffect(() => {
    // const token = localStorage.getItem("myToken");
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/salesinfodata`
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

        // Sort and structure the filtered data
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
          }
        );
        setEmployeeData(result);
      });
  }, [dateRange, formattedDate]);

  useEffect(() => {
    filterData(search);
  }, [data]);

  const handlePortalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedPortal(selectedValue);
  };

  // edit methods
  const handleEdit = (id: number) => {
    const recordToEdit = data.find((e: any) => e.id === id);
    Navigate("/saleinfoform", { state: { record: recordToEdit } });
  };

  const generateCommModeContent = (record: any) => {
    const {
      commModeSkype,
      commModePhone,
      commModeWhatsapp,
      commModeEmail,
      commModePortal,
      commModeOther,
    } = record;

    const modes = [
      `Skype: ${commModeSkype}`,
      `Phone: ${commModePhone}`,
      `Whatsapp: ${commModeWhatsapp}`,
      `Email: ${commModeEmail}`,
      `Portal: ${commModePortal}`,
      `Other: ${commModeOther}`,
    ];
    return modes.join(', ');
  };
  const handleSend = (recordId: number) => {
    const recordToUpdate = filteredData.find((item) => item.id === recordId);
    const updatedRecord = { ...recordToUpdate, sendTo: selectedSendToValues[recordId] || "" };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/updateSendTo/${recordId}`,
        updatedRecord,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("myToken")}`,
          },
        }
      )
      .then((response) => {
        toast.success('send successfully!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((error) => {
        console.error("Error updating SendTo field:", error);
        toast.error('sending failed.', {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
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
      title: "Other Portal Name",
      dataIndex: "othermode",
      key: "othermode",
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
      title: "Send To",
      dataIndex: "sendTo",
      key: "sendTo",
      render: (text: string, record: SalesInfoData) => {
        console.log("record", record);

        return (
          <Select
            showSearch
            placeholder="Select assigned Name"
            optionFilterProp="children"
            filterOption={(input, option) =>
              typeof option?.children === "string" &&
              (option?.children as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            style={{
              width: '100%', height: 'fit-content'
            }}
            value={selectedSendToValues[record.id] || record.sendTo}
            onChange={(value) => setSelectedSendToValues((prev) => ({ ...prev, [record.id]: value }))}
          >
            {employeeFirstNames
              .filter(name => ["Arshpreet", "Manpreet", "Yugal", "Sahil", "Sandeep", "Zaid", "Sameer"].includes(name))
              .map((name, index) => (
                <Select.Option key={index} value={name}>
                  {name}
                </Select.Option>
              ))}
          </Select>
        )
      },
    },
    {
      title: "Comment",
      dataIndex: "enterCmnt",
      key: "enterCmnt",
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
          {selectedSendToValues[record.id] &&
            <Button
              style={{ border: '1px solid black' }}
              onClick={() => handleSend(record.id)}
            >
              Send
            </Button>
          }
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
          e?.communicationMode?.toLowerCase().includes(lowercasedInput) ||
          e?.communicationReason?.toLowerCase().includes(lowercasedInput) ||
          e?.handleBy?.toLowerCase().includes(lowercasedInput) ||
          e?.portalType?.toLowerCase().includes(lowercasedInput) ||
          e?.profileName?.toLowerCase().includes(lowercasedInput) ||
          e?.status?.toLowerCase().includes(lowercasedInput) ||
          e?.statusReason?.toLowerCase().includes(lowercasedInput) ||
          e?.url?.toLowerCase().includes(lowercasedInput) ||
          e?.dateData?.toLowerCase().includes(lowercasedInput) ||
          e?.inviteBid?.toLowerCase().includes(lowercasedInput) ||
          e?.othermode?.toLowerCase().includes(lowercasedInput)
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
        
          <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
          
            <section className="SalecampusForm-section-os">
              <div className="form-container">
                <div className="total-size">Total:{totalLength}</div>
                <div className="SalecampusFormList-default-os">
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      gap: '7px',
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
                  <div className="saleInfo-form">
                    {state === false &&
                      <Table
                        dataSource={matchedData.slice().reverse()}
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
                      {index !== modalContent.length - 1 && <br /> && <br /> && <br />}
                    </div>
                  ))}
                </Modal>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default SaleInfoFormList;
