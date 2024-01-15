import React, { useState, useEffect } from "react";
import { Table, DatePicker, Select, Spin } from "antd";
import { RangeValue } from "rc-picker/lib/interface";
import dayjs from "dayjs";
import axios, { AxiosError } from "axios";
const { Option } = Select;
interface BacklogTask {
  backlogTaskID: number;
  taskName: string;
  assigneeName: string;
  employeeID: string;
  deadlineStart: string;
  deadlineEnd: string;
  currdate: string;
  UserEmail: string;
  isCompleted: number;
  AssignedBy: string;
  clientName: string;
  projectName: string;
  comment: string;
}
interface Employee {
  EmpID: string | number;
  firstName: string;
  role: string;
  dob: string | Date;
  EmployeeID: string;
}
const { RangePicker } = DatePicker;

const ViewBacklogTable: React.FC = () => {
  const [data, setData] = useState<BacklogTask[]>([]);
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [originalData, setOriginalData] = useState<BacklogTask[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedOption, setSelectedOption] = useState('');
  const myDataString = localStorage.getItem('myData');
  const [loading, setLoading] = useState(true);

  let employeeName = "";
  if (myDataString) {
    const myData = JSON.parse(myDataString);
    employeeName = `${myData.jobPosition}`;
  }

  useEffect(() => {
    let filteredData = originalData;

    if (selectedAssignee) {
      filteredData = originalData.filter((item) => item.assigneeName === selectedAssignee);
    }

    setData(filteredData);
    setLoading(false);
  }, [selectedAssignee, originalData])

  const handleAssigneeChange = (value: string) => {
    setSelectedAssignee(value);
  };

  const onDateRangeChange = (values: RangeValue<dayjs.Dayjs>, formatString: [string, string]) => {
    if (values === null || values[0] === null || values[1] === null) {
      setDateRange(null);
    } else {
      setDateRange([values[0].toDate(), values[1].toDate()]);
    }
  };
  const handleGoButtonClick = () => {
    const filteredResult = originalData.filter((item) => {
      const dateMatch =
        selectedOption && item.currdate ?
          new Date(item.currdate) >= new Date(new Date().getTime() - parseInt(selectedOption) * 24 * 60 * 60 * 1000) :
          true;

      const assigneeMatch =
        selectedAssignee ?
          item.assigneeName.toLowerCase().includes(selectedAssignee.toLowerCase()) :
          true;

      return dateMatch && assigneeMatch;
    });

    setData(filteredResult);
  };


  useEffect(() => {
    axios
      .get<Employee[]>(`${process.env.REACT_APP_API_BASE_URL}/employees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        const sortedData = response?.data.sort(
          (a, b) => Number(b.EmpID) - Number(a.EmpID)
        );

        setEmployees(sortedData);
      })
      .catch((error) => console.log(error));
  }, []);

  const storedData = JSON.parse(localStorage.getItem("myData") || "");
  const adminID = storedData ? storedData.EmployeeID : "";
  const UserEmail = storedData ? storedData.email : "";

  const paginationSettings = {
    pageSize: 100,
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    let filteredData = originalData;

    if (selectedValue === "7") {
      const lastWeekDate = new Date();
      lastWeekDate.setDate(lastWeekDate.getDate() - 7);
      filteredData = originalData.filter((item) => new Date(item.currdate) >= lastWeekDate);
    } else if (selectedValue === "30") {
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      filteredData = originalData.filter((item) => new Date(item.currdate) >= lastMonthDate);
    } else if (selectedValue === "90") {
      const lastThreeMonthsDate = new Date();
      lastThreeMonthsDate.setMonth(lastThreeMonthsDate.getMonth() - 3);
      filteredData = originalData.filter((item) => new Date(item.currdate) >= lastThreeMonthsDate);
    } else if (selectedValue === "180") {
      const lastSixMonthsDate = new Date();
      lastSixMonthsDate.setMonth(lastSixMonthsDate.getMonth() - 6);
      filteredData = originalData.filter((item) => new Date(item.currdate) >= lastSixMonthsDate);
    } else if (selectedValue === "365") {
      const lastYearDate = new Date();
      lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);
      filteredData = originalData.filter((item) => new Date(item.currdate) >= lastYearDate);
    } else {
      filteredData = originalData;
    }
    setSelectedOption(selectedValue)
    setData(filteredData);
  };
  const filteringData = employees.filter((item: any) => item.status === 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<BacklogTask[]>(`${process.env.REACT_APP_API_BASE_URL}/get/BacklogTasks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("myToken")}`,
          },
        });
        setOriginalData(response.data)
        const sortedData = response.data.sort((a, b) => b.backlogTaskID - a.backlogTaskID);
        const filteredData = sortedData?.filter((e) => {
          e.UserEmail === UserEmail;
          const assigneeMatch = e.assigneeName.toLowerCase().includes(searchTerm.toLowerCase());
          const assignedByMatch = e.taskName.toLowerCase().includes(searchTerm.toLowerCase());
          const clientNameMatch = e.clientName && e.clientName.toLowerCase().includes(searchTerm.toLowerCase())
          const projectNameMatch = e.projectName && e.projectName.toLowerCase().includes(searchTerm.toLowerCase())
          return assigneeMatch || assignedByMatch || clientNameMatch || projectNameMatch;
        });

        setData(filteredData);
        const today = new Date();
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(today.getDate() - 10);
        if (
          employeeName === "Managing Director") {
          const filteredData = sortedData?.filter((e) => {
            e.UserEmail === UserEmail;
            const assigneeMatch = e.assigneeName.toLowerCase().includes(searchTerm.toLowerCase());
            const assignedByMatch = e.taskName.toLowerCase().includes(searchTerm.toLowerCase());
            const clientNameMatch = e.clientName && e.clientName.toLowerCase().includes(searchTerm.toLowerCase())
            const projectNameMatch = e.projectName && e.projectName.toLowerCase().includes(searchTerm.toLowerCase())
            return assigneeMatch || assignedByMatch || clientNameMatch || projectNameMatch;

          });
          setData(filteredData);
        } else {
          const finalFilteredData = filteredData?.filter((e) => {
            const taskDate = new Date(e.currdate);
            const isDateInRange =
              taskDate >= tenDaysAgo &&
              (dateRange === null ||
                (taskDate >= (dateRange[0] || tenDaysAgo) &&
                  taskDate <= (dateRange[1] || today)));

            const isAssignedByAdmin = e.UserEmail === UserEmail;

            return isDateInRange && isAssignedByAdmin;
          });
          setData(finalFilteredData);
        }

      } catch (error: any) {
        console.error(error);
      }
    };
    fetchData();
  }, [adminID, dateRange, searchTerm]);


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const isDeadlineEndTodayOrBefore = (dateString: string) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(dateString);
    dateToCheck.setHours(0, 0, 0, 0);

    return dateToCheck <= currentDate;
  };

  const columns = [
    {
      title: "Assigned By",
      dataIndex: "AssignedBy",
      key: "AssignedBy",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Assigned To",
      dataIndex: "assigneeName",
      key: "assigneeName",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Client Names",
      dataIndex: "clientName",
      key: "clientName",
      render: (text: string) => <div>{text || "N/A"}</div>,
    },
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",
      render: (text: string) => <div>{text || "N/A"}</div>,
    },
    {
      title: "Task Name",
      dataIndex: "taskName",
      key: "taskName",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Assigned Date",
      dataIndex: "currdate",
      key: "currdate",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Deadline Start",
      dataIndex: "deadlineStart",
      key: "deadlineStart",
      render: (text: string, record: BacklogTask) => {
        const formattedDate = formatDate(text);
        const shouldApplyRedColor = isDeadlineEndTodayOrBefore(record.deadlineEnd) && record.isCompleted === 0;
        const shouldApplyBlueColor = record.isCompleted === 1;
        return (
          <div
            style={{
              color: shouldApplyBlueColor ? "blue" : shouldApplyRedColor ? "red" : "green",
            }}
          >
            {formattedDate}
          </div>
        );
      },
    },
    {
      title: "Deadline End",
      dataIndex: "deadlineEnd",
      key: "deadlineEnd",
      render: (text: string, record: BacklogTask) => {
        const formattedDate = formatDate(text);
        const shouldApplyRedColor = isDeadlineEndTodayOrBefore(text) && record.isCompleted === 0;
        const shouldApplyBlueColor = record.isCompleted === 1;
        return (
          <div
            style={{
              color: shouldApplyBlueColor ? "blue" : shouldApplyRedColor ? "red" : "green",
            }}
          >
            {formattedDate}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "isCompleted",
      key: "status",
      render: (isCompleted: number) => (
        isCompleted ? (
          <span style={{ color: "green" }}>&#10003;</span>
        ) : (
          <span style={{ color: "red" }}>&#10005;</span>
        )
      ),
    },
    {
      title: "comment",
      dataIndex: "comment",
      key: "comment",
      render: (text: string) => <div>{text || "N/A"}</div>,
    },
  ];

  return (
    <>
      <div style={{ marginBottom: "16px" }}>
        <RangePicker onChange={onDateRangeChange} format="YYYY-MM-DD" allowClear />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          style={{
            marginLeft: 10, border: '1px solid #d9d9d9',
            borderRadius: '6px', height: '30px'
          }}
        />
        {
          employeeName === "Managing Director" &&

          <div>
            <Select
              style={{
                marginLeft: 10,
                borderRadius: '6px', height: '42px', width: '10%'
              }}
              placeholder="Select Assignee"
              value={selectedAssignee}
              onChange={handleAssigneeChange}
              showSearch
              filterOption={(input, option) =>
                option && option.children
                  ? option.children.toString().toLowerCase().includes(input.toLowerCase())
                  : false
              }
            >
              <Option value="">All</Option>
              {filteringData.map((assignee, i) => (
                <Option key={i} value={assignee.firstName}>
                  {assignee.firstName}
                </Option>
              ))}
            </Select>
            <select
              style={{
                marginLeft: 10
              }}
              className="adjust-inputs"
              value={selectedOption}
              onChange={handleSelectChange}
            >
              <option value="">Select date range</option>
              <option value="7">Last 1 week</option>
              <option value="30">Last 1 month</option>
              <option value="90">Last 3 months</option>
              <option value="180">Last 6 months</option>
              <option value="365">Last 1 year</option>
            </select>
            <button
              className="go-button"
              style={{ marginLeft: 10 }}
              onClick={handleGoButtonClick}
            >
              Go
            </button>
          </div>
        }
      </div>
      <div className="backlog-table" >
        {loading ?
         <Spin size="large" className="spinner-antd"/>
         :
        <Table
          style={{ width: "80vw" }}
          dataSource={data}
          columns={columns}
          rowClassName={() => "header-row"}
          pagination={paginationSettings}
        />
}
      </div>
    </>
  );
};

export default ViewBacklogTable;
