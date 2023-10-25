import React, { useState, useEffect } from "react";
import { Menu, Dropdown, Button, DatePicker, Tooltip } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { RangePicker } = DatePicker;

interface Employee {
  EmpID: number;
  firstName: string;
  role: string;
  dob: string | Date;
  EmployeeID: string;
  status : number;
}

interface MorningDashboardTableProps {
  data: any;
  totalEstHrs: any;
  setTotalEstHrs: React.Dispatch<React.SetStateAction<any>>;
  setTotalUpWorkHrs: any;
  setSetTotalUpWorkHrs: React.Dispatch<React.SetStateAction<any>>;
}

interface TaskEntry {
  MrngTaskID: number;

  currDate: string;
  employeeID: string;
  estTime: string;
  module: string;
  phaseName: string;
  projectName: string;
  task: string;
  upWorkHrs: string;
}

const DashboardTable: React.FC<MorningDashboardTableProps> = ({
  data,
  totalEstHrs,
  setTotalEstHrs,
  setTotalUpWorkHrs,
  setSetTotalUpWorkHrs,
}) => {
  const [manager, setManager] = useState("");
  const [teamLead, setTeamLead] = useState("");
  const [date, setDate] = useState<dayjs.Dayjs>(dayjs());
  const [isEvening, setIsEvening] = useState(false);
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("button1");
  const [employeeArr, setEmployeeArr] = useState<Employee[]>([]);

  useEffect(() => {
    axios
      .get<Employee[]>("https://empbackend.base2brand.com/employees", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        const sortedData = response.data.sort((a, b) =>
          a.firstName.localeCompare(b.firstName)
        );

        const filteredData = sortedData.filter((emp)=> emp.status === 1  )
        console.log(filteredData);

        setEmployeeArr(filteredData);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleButton1Click = () => {
    setActiveButton("button1");
  };

  const handleButton2Click = () => {
    setActiveButton("button2");
    setIsEvening(!isEvening);
    const route = isEvening ? "/dashboard" : "/EveningDashboard";
    navigate(route);
  };

  console.log(data, "morning data");

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setDate(date);
    }
  };



  function sumTimes(allTimes: string[]): string {
    let totalMinutes = 0;

    allTimes.forEach((timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      totalMinutes += hours * 60 + minutes;
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  }

  const getTotalTimeForEmployee = (timeKey: string): string => {
    const allTimes: string[] = [];

    Object.values(data).forEach((taskEntries) => {
      (taskEntries as any[])
        .filter((entry) => entry[timeKey])
        .forEach((entry) => allTimes.push(entry[timeKey]!));
    });

    return sumTimes(allTimes);
  };

  const getTotalEstTimeTooltip = () => {
    return Object.entries(data)
      .map(([id, taskEntries]) => {
        const employee = employeeArr.find((emp) => emp.EmployeeID === id);
        const employeeName = employee ? employee.firstName : id;
        const totalEstTime = sumTimes(
          (taskEntries as any[]).map((entry: any) => entry.estTime)
        );

        // Filter out the entries with 0 hours
        if (totalEstTime === "0:00") return null;

        return `${employeeName}: ${totalEstTime}`;
      })
      .filter(Boolean) // Remove nulls from the array
      .join("\n");
  };

  const getTotalUpWorkTimeTooltip = () => {
    return Object.entries(data)
      .map(([id, taskEntries]) => {
        const employee = employeeArr.find((emp) => emp.EmployeeID === id);
        const employeeName = employee ? employee.firstName : id;
        const totalUpWorkTime = sumTimes(
          (taskEntries as any[]).map((entry) => entry.upWorkHrs)
        );

        // Filter out the entries with 0 hours
        if (totalUpWorkTime === "0:00") return null;

        return `${employeeName}: ${totalUpWorkTime}`;
      })
      .filter(Boolean) // Remove nulls from the array
      .join("\n");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "85vw",
        marginTop: "3%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <button
            style={{
              backgroundColor: "royalBlue",
              padding: "8px",
              borderRadius: "5px 0px 0px 5px",
            }}
            onClick={handleButton1Click}
            className={activeButton === "button1" ? "redButton" : ""}
          >
            Morning
          </button>
          <button
            style={{ padding: "8px", borderRadius: "0px 5px 5px 0px" }}
            onClick={handleButton2Click}
            className={activeButton === "button2" ? "redButton" : ""}
          >
            Evening
          </button>
        </div>
        <DatePicker
          value={date}
          className="nav-date"
          style={{
            background: "#FFFFFF",
            border: "1px solid #BEBEBE",
            borderRadius: "99px",
            width: "120px",
          }}
          onChange={handleDateChange}
        />

        <Tooltip title={getTotalEstTimeTooltip()}>
          <span className="nav-hrs-estimate">
            {" "}
            Est. Time : {getTotalTimeForEmployee("estTime")}{" "}
          </span>
        </Tooltip>

        <Tooltip title={getTotalUpWorkTimeTooltip()}>
          <span className="nav-hrs-estimate">
            {" "}
            Upwork. Time : {getTotalTimeForEmployee("upWorkHrs")}{" "}
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

export default DashboardTable;

