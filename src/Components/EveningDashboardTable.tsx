import React, { useEffect, useState } from "react";
import { Button, DatePicker, Tooltip } from "antd";
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
}

interface TaskEntry {
  EvngTaskID: number;
  actTime: string | null;
  currDate: string;
  employeeID: string;
  estTime: string;
  module: string;
  phaseName: string;
  projectName: string;
  task: string;
  upWorkHrs: string;
}

interface HourEntry {
  hours: number;
  // ... other properties if they exist
}
interface EveningDashboardTableProps {
  data: any;
  totalUpwork: any;
  setTotalUpWork: React.Dispatch<React.SetStateAction<any>>;
  totalEstHrs: any;
  setTotalEstHrs: React.Dispatch<React.SetStateAction<any>>;
  totalUpworkhrs: any;
  setTotalUpworkhrs: React.Dispatch<React.SetStateAction<any>>;
}

const EveningDashboardTable: React.FC<EveningDashboardTableProps> = ({
  data,
  totalUpwork,
  totalEstHrs,
  totalUpworkhrs,
}) => {
  const [date, setDate] = useState<dayjs.Dayjs>(dayjs());
  const [isEvening, setIsEvening] = useState(true);
  const [activeButton, setActiveButton] = useState("");
  const [employeeArr, setEmployeeArr] = useState<Employee[]>([]);
  const navigate = useNavigate();

  const handleButton1Click = () => {
    setActiveButton("button1");
    const route = isEvening ? "/dashboard" : "/EveningDashboard";
    navigate(route);
  };

  const handleButton2Click = () => {
    setActiveButton("button2");
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setDate(date);
    }
  };

  const handleMorningEveningButtonClick = () => {
    setIsEvening(!isEvening);
    const route = isEvening ? "/dashboard" : "/EveningDashboard";
    navigate(route);
  };

  useEffect(() => {
    axios
      .get<Employee[]>(`${process.env.REACT_APP_API_BASE_URL}/employees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        const sortedData = response.data.sort((a, b) =>
          a.firstName.localeCompare(b.firstName)
        );
        setEmployeeArr(sortedData);
      })
      .catch((error) => console.log(error));
  }, []);

  const sumTimes = (times: string[]): string => {
    let totalMinutes = 0;

    times.forEach((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      totalMinutes += hours * 60 + minutes;
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  const getEmployeeTotalupWorkHrsHoursTooltip = () => {
    if (!data || !employeeArr) return "Loading...";

    return Object.entries(data)
      .map(([id, taskEntries]) => {
        const employee = employeeArr.find(
          (emp) => emp.EmployeeID.toString() === id
        );
        const employeeName = employee ? employee.firstName : id;
        const hoursList = (taskEntries as TaskEntry[]).map(
          (entry: any) => entry.upWorkHrs
        );
        const totalHours = sumTimes(hoursList);

        if (totalHours === "0:00") return null; // Filter out the entries with 0 hours

        return `${employeeName}: ${totalHours}`;
      })
      .filter(Boolean) // Remove nulls from the array
      .join("\n");
  };

  const computeTotalUpworkHrs = (): string => {
    const allHours: string[] = [];

    (Object.values(data) as any[][]).forEach((taskEntries) => {
      taskEntries.forEach((entry) => allHours.push(entry.upWorkHrs));
    });

    return sumTimes(allHours);
  };

  const totalUpworkHrsValue = computeTotalUpworkHrs();

  const computeTotalTimeForEmployee = (timeKey: string) => {
    const allTimes: string[] = [];

    Object.values(data).forEach((taskEntries) => {
      (taskEntries as TaskEntry[])
        .filter((entry) => (entry as any)[timeKey]) // Filter out null values
        .forEach((entry) => allTimes.push((entry as any)[timeKey]));
    });

    return sumTimes(allTimes);
  };

  const getTotalEstTimeTooltip = () => {
    return Object.entries(data)
      .map(([id, taskEntries]) => {
        const employee = employeeArr.find((emp) => emp.EmployeeID === id);
        const employeeName = employee ? employee.firstName : id;
        const totalEstTime = sumTimes(
          (taskEntries as any[]).map((entry) => entry.estTime)
        );

        if (totalEstTime === "0:00") return null; // Filter out the entries with 0 hours

        return `${employeeName}: ${totalEstTime}`;
      })
      .filter(Boolean) // Remove nulls from the array
      .join("\n");
  };

  const getTotalActTimeTooltip = () => {
    return Object.entries(data)
      .map(([id, taskEntries]) => {
        const employee = employeeArr.find((emp) => emp.EmployeeID === id);
        const employeeName = employee ? employee.firstName : id;
        const totalActTime = sumTimes(
          (taskEntries as TaskEntry[])
            .filter((entry) => entry.actTime) // Filter out null values
            .map((entry) => entry.actTime!)
        );

        if (totalActTime === "0:00") return null; // Filter out the entries with 0 hours

        return `${employeeName}: ${totalActTime} ` ;

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
        <div>
          <button
            style={{ padding: "8px", borderRadius: "5px 0px 0px 5px" }}
            onClick={handleButton1Click}
            className={activeButton === "button1" ? "red" : ""}
          >
            Morning
          </button>
          <button
            style={{
              backgroundColor: "royalBlue",
              padding: "8px",
              borderRadius: "0px 5px 5px 0px",
            }}
            onClick={handleButton2Click}
            className={activeButton === "button2" ? "blue" : ""}
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
        <Tooltip title={getEmployeeTotalupWorkHrsHoursTooltip()}>
          <span className="nav-hrs-estimate">
            upWork. hrs : {totalUpworkHrsValue}
          </span>
        </Tooltip>

        <Tooltip title={getTotalEstTimeTooltip()}>
          <span className="nav-hrs-estimate">
            Est. hrs: {computeTotalTimeForEmployee("estTime")}
          </span>
        </Tooltip>
        <Tooltip title={getTotalActTimeTooltip()}>
          <span className="nav-hrs-estimate">
            Act. hrs: {computeTotalTimeForEmployee("actTime")}
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

export default EveningDashboardTable;
