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
  const [search, setSearch] = useState<string>("");
  const [employeeData, setEmployeeData] = useState<any>([]);

  const Navigate = useNavigate();
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [state, setState] = useState<boolean>(false);
  const formattedDate = format(currentDate, "yyyy-MM-dd");

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
    setState(true);
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
        console.log("response", response);

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

  // edit methods
  const handleEdit = (id: number) => {
    console.log("id",id)
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
      title: "Status Reason",
      dataIndex: "statusReason",
      key: "statusReason",
      render: (text: string | string[], record: SalesInfoData) => (
        <div>
          {Array.isArray(text) ? (
            text.map((reason: string, index: number) => (
              <div key={index}>{reason}</div>
            ))
          ) : (
            <div>{text}</div>
          )}
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
          e.clientName.toLowerCase().includes(lowercasedInput) ||
          e.communicationMode.toLowerCase().includes(lowercasedInput) ||
          e.communicationReason.toLowerCase().includes(lowercasedInput) ||
          e.handleBy.toLowerCase().includes(lowercasedInput) ||
          e.portalType.toLowerCase().includes(lowercasedInput) ||
          e.profileName.toLowerCase().includes(lowercasedInput) ||
          e.status.toLowerCase().includes(lowercasedInput) ||
          e.statusReason.toLowerCase().includes(lowercasedInput) ||
          e.url.toLowerCase().includes(lowercasedInput) ||
          e.dateData.toLowerCase().includes(lowercasedInput)
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
                      justifyContent: "space-between",
                    }}
                  >
                    <RangePicker onChange={handleDateRangeChange} />
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
