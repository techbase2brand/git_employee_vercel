import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "./Menu";
import Navbar from "./Navbar";
import { Table, Button, Input, Modal, DatePicker } from "antd";
import { format } from "date-fns";

import {
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
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
  inviteBid: string;
}
interface Props {
  data: SalesInfoData[];
  evngEditID: number;
  setEvngEditID: React.Dispatch<React.SetStateAction<number>>;
}

const SaleInfoFormList = () => {
  const [data, setData] = useState<SalesInfoData[]>([]);
  const [filteredData, setFilteredData] = useState<SalesInfoData[]>(data);
  const [editId, setEditId] = useState<number>();
  const [selectedPortal, setSelectedPortal] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [employeeData, setEmployeeData] = useState<any>([]);
  const Navigate = useNavigate();
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [state, setState] = useState<boolean>(false);
  const [selectedRegister, setSelectedRegister] = useState<string>("");
  const [statusNames, setStatusNames] = useState<string[]>([]);
  const [gettingData, setGettingData] = useState<SalesInfoData[]>([]);
  const uniqueStatusNames = Array.from(new Set(statusNames));
  const formattedDate = format(currentDate, "yyyy-MM-dd");
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
    setDateRange(dateStrings);
    setState(true);
  };
  // const handleProjectChange = (value: string) => {
  //   setSelectedRegister(value);
  //   filterData(value);
  // };
  const handleProjectChange = (value: string) => {
    setSelectedRegister(value);
    
    if (value === "") {
      setFilteredData(data);
    } else {
      const filteredResult = data.filter((item: SalesInfoData) => {
        return item.status.toLowerCase() === value.toLowerCase();
      });
      setFilteredData(filteredResult);
    }
  };
  
  const paginationSettings = {
    pageSize: 100,
  };

  useEffect(() => {
    const token = localStorage.getItem("myToken");
    axios
      .get(
        "https://empbackend.base2brand.com/salesinfodata"
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
          },
          {}
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
    if (selectedValue === "") {
      setFilteredData(gettingData);
    }
  };

  const filterByPortalType = (portalType: string) => {
    if (portalType === "") {
      setFilteredData(data); // Show all data if no portal is selected
    } else {
      const filteredResult = data.filter((item: SalesInfoData) => {
        return item.portalType.toLowerCase() === portalType.toLowerCase();
      });
      setFilteredData(filteredResult);
    }
  };


  useEffect(() => {
    if (selectedPortal !== "") {
      filterByPortalType(selectedPortal);
    }
  }, [selectedPortal]);

  // edit methods
  const handleEdit = (id: number) => {
    console.log("id", id)
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
   
    // {
    //   title: "Status Reason",
    //   dataIndex: "statusReason",
    //   key: "statusReason",
    //   render: (text: string | string[], record: SalesInfoData) => (
    //     <div>
    //       {Array.isArray(text) ? (
    //         text.map((reason: string, index: number) => (
    //           <div key={index}>{reason}</div>
    //         ))
    //       ) :text.split(",").map((reason: string, index: number) => (
    //         <div key={index}>
    //           {reason.trim()}
    //           {index !== text.split(",").length - 1 && <br />}
    //         </div>
    //       ))}
    //     </div>
    //   ),
    // },
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
      dataIndex: "communicationMode",
      key: "communicationMode",
      render: (text: string) => <div>{text}</div>,
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
          e?.inviteBid?.toLowerCase().includes(lowercasedInput)
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
                      {index !== modalContent.length - 1 && <br/>&&<br/>&&<br/>}
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
