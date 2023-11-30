import React, { useState, useEffect } from "react";
import { Table, DatePicker } from "antd";
import { RangeValue } from "rc-picker/lib/interface";
import dayjs from "dayjs";
import axios, { AxiosError } from "axios";

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
}

const { RangePicker } = DatePicker;

const ViewBacklogTable: React.FC = () => {
  const [data, setData] = useState<BacklogTask[]>([]);
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);




  const onDateRangeChange = (values: RangeValue<dayjs.Dayjs>, formatString: [string, string]) => {
    if (values === null || values[0] === null || values[1] === null) {
      setDateRange(null);
    } else {
      setDateRange([values[0].toDate(), values[1].toDate()]);
    }
  };


  const storedData = JSON.parse(localStorage.getItem("myData") || "");
  console.log(storedData);

  const adminID = storedData ? storedData.EmployeeID : ""; // Access the adminID from storedData
  const UserEmail = storedData ? storedData.email : "";
  console.log(UserEmail,"UserEmail");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<BacklogTask[]>("https://empbackend.base2brand.com/get/BacklogTasks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("myToken")}`,
          },
        });


        const sortedData = response.data.sort((a, b) => b.backlogTaskID - a.backlogTaskID);
        console.log("Sorted data:", sortedData);

        const filteredData = sortedData.filter((e) => e.UserEmail === UserEmail);

        console.log("Filtered data:", filteredData);

        const today = new Date();
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(today.getDate() - 10); // Here, change -2 to -10
      const finalFilteredData = filteredData.filter((e) => {
        const taskDate = new Date(e.currdate);
        const isDateInRange =
          taskDate >= tenDaysAgo && // Here, change threeDaysAgo to tenDaysAgo
          (dateRange === null ||
            (taskDate >= (dateRange[0] || tenDaysAgo) && // Here, change threeDaysAgo to tenDaysAgo
              taskDate <= (dateRange[1] || today)));

          // Check if the task is assigned by the admin based on email ID
          const isAssignedByAdmin = e.UserEmail === UserEmail;

          console.log("Task Date:", taskDate, "Is Date in Range:", isDateInRange, "Is Assigned by Admin:", isAssignedByAdmin);

          return isDateInRange && isAssignedByAdmin;
        });


        console.log("Final filtered data:", finalFilteredData);

        setData(finalFilteredData);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        console.log("Error details:", (error as AxiosError)?.response);
      }
    };

    fetchData();
  }, [adminID, dateRange]);


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
      title: "Assigned To:",
      dataIndex: "assigneeName",
      key: "assigneeName",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Task",
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
  ];

  return (
    <>
      <div style={{ marginBottom: "16px" }}>
        <RangePicker onChange={onDateRangeChange} format="YYYY-MM-DD" allowClear />
      </div>
      <div className="backlog-table">
      <Table
        style={{ width: "80vw" }}
        dataSource={data}
        columns={columns}
        rowClassName={() => "header-row"}
      />
      </div>
    </>
  );
};

export default ViewBacklogTable;
