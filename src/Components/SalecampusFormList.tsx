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
import { DatePicker, AutoComplete } from "antd";
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
  EmployeeID: string;
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


const info = JSON.parse(localStorage.getItem("myData") || "{}");
console.log(info?.EmployeeID);


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
  const [dateRangeSearch, setDateRangeSearch] = useState<[string | null, string | null]>([null, null]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [statusNames, setStatusNames] = useState<string[]>([]);
  const uniqueStatusNames = Array.from(new Set(statusNames));
  const [selectedDays, setSelectedDays] = useState<string>("");
  const [filteredByDateRange, setFilteredByDateRange] = useState<SalecampusData[]>([]);
  const [state, setState] = useState<boolean>(false);

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

  const handleProjectStatus = (value: string) => {
    setSelectedStatus(value);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedDays(selectedValue);
  }

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

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/salecampusdata`
        // Uncomment below if your server requires the token for authentication
        //   , {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
      )
      .then((response) => {
        setStatusNames(response.data.map((item: { status: string }) => item.status));

        const resData = response.data;

        // Filter data based on EmployeeID
        const filteredByEmployeeID = resData.filter((entry: { EmployeeID: any; }) => entry.EmployeeID === info?.EmployeeID);

        console.log("Filtered Data", filteredByEmployeeID);

        setData(filteredByEmployeeID);
        setFilteredData(filteredByEmployeeID); // Assuming you also want to set this to another state
      });
  }, []);

  useEffect(() => {
    filterData(dateSearch, dateSearch, search);
  }, [data]);


  // delete methods
  const handleDelete = (id: number) => {
    setDeleteId(id);
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
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // Update the main data state
    const updatedData = data.filter((e: any) => e.id !== id);
    setData(updatedData);
    // Check if the data is currently filtered
    // Check if the data is currently filtered
    filterData(dateSearch, dateSearch, search);
    // Corrected this line

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
      // const matchDate =
      //   selectedDays && item.dateData ?
      //     new Date(item.dateData) >= new Date(new Date().getTime() - parseInt(selectedDays) * 24 * 60 * 60 * 1000) :
      //     true;
      const itemDate = new Date(item.created_at);
      const itemDateTimestamp = itemDate.getTime();
      const matchDate = (!startDate || itemDateTimestamp >= startDate.getTime()) &&
        (!endDate || itemDateTimestamp <= endDate.getTime());
        const dateRangeMatch =
        dateRangeSearch[0] && dateRangeSearch[1]
          ? itemDate >= new Date(dateRangeSearch[0]) && itemDate <= new Date(dateRangeSearch[1])
          : true;
      return statusMatch  && matchDate && dateRangeMatch;
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

    // Filter by date range if both startDate and endDate exist
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

                  <p style={{ fontWeight: "bold", marginBottom: "20px" }}>
                    Number of Records: {filteredData.length}
                  </p>
                  <div className="saleCampus-form">
                    <Table
                      dataSource={filteredData.slice().reverse()}
                      columns={columns}
                      rowClassName={(record) =>
                        record.status.replace(/\s+/g, "-")
                      } // Convert spaces to hyphens
                    />
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

export default SalecampusFormList;
