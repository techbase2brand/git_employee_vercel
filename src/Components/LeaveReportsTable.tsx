import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";

interface LeaveData {
  LeaveInfoID: number;
  employeeName: string;
  startDate: Date | string;
  endDate: Date | string;
  leaveType: string;
  leaveReason: string;
  teamLead: string;
  employeeID: string;
  adminID: string;
  approvalOfTeamLead: string;
  approvalOfHR: string;
  leaveCategory: string;
}

interface Employee {
  EmpID: string | number;
  firstName: string;
  role: string;
  dob: string | Date;
  EmployeeID: string;
}

const LeaveReportsTable: React.FC = () => {
  const [allLeave, setAllLeave] = useState<LeaveData[]>([]);
  const [totalLeave, setTotalLeave] = useState<string>("");
  const [uncertainLeaveDuration, setUncertainLeaveDuration] =
    useState<string>("");
  const [regularLeaveDuration, setRegularLeaveDuration] = useState<string>("");
  const [monthlyLeaveData, setMonthlyLeaveData] = useState<{
    [key: string]: {
      total: string;
      uncertain: string;
      regular: string;
    };
  }>({});

  const dataString = localStorage.getItem("myData");
  const employeeInfo = dataString ? JSON.parse(dataString) : [];
  console.log(employeeInfo,"employeeInfoemployeeInfo");


  useEffect(() => {
    const token = localStorage.getItem("myToken");

    axios
      .get<LeaveData[]>(`${process.env.REACT_APP_API_BASE_URL}/get/leaveinfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const sortedData = response.data.sort(
          (a, b) => Number(b.LeaveInfoID) - Number(a.LeaveInfoID)
        );
        console.log(sortedData,"sortedDatasortedData");


        setAllLeave(sortedData);
      });
  }, []);

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const minutesToDaysHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const days = Math.floor(hours / 9);
    const remainingHours = hours % 9;
    return { days, hours: remainingHours, minutes: remainingMinutes };
  };

  const calculateTotalLeave = () => {
    console.log(allLeave);

    const employeeLeaves = allLeave.filter(
      (leave) =>
        leave.employeeID === employeeInfo.EmployeeID &&
        leave.approvalOfTeamLead === "approved" &&
        leave.approvalOfHR === "approved"
    );
    console.log(employeeLeaves,"employeeLeavesemployeeLeaves");


    const monthlyData: {
      [key: string]: {
        total: number;
        uncertain: number;
        regular: number;
      };
    } = {};

    let totalDuration = 0;
    let uncertainDuration = 0;
    let regularDuration = 0;

    employeeLeaves.forEach((leave) => {
      const startDate = dayjs(leave.startDate).startOf("day");
      const endDate = dayjs(leave.endDate).startOf("day");
      const dayGap = endDate.diff(startDate, "day");

      let duration = 0;
      if (/^\d{1,2}:\d{2}$/.test(leave.leaveType)) {
        duration = timeToMinutes(leave.leaveType) * dayGap;
      } else if (leave.leaveType.toLowerCase() === "full day") {
        duration = 9 * 60 * dayGap;
      } else {
        duration = dayGap * 9 * 60;
      }

      totalDuration += duration;

      const monthYear = dayjs(leave.startDate).format("MMM YYYY");
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { total: 0, uncertain: 0, regular: 0 };
      }

      monthlyData[monthYear].total += duration;

      if (leave.leaveCategory === "Uncertain Leave") {
        uncertainDuration += duration;
        monthlyData[monthYear].uncertain += duration;
      } else if (leave.leaveCategory === "Regular Leave") {
        regularDuration += duration;
        monthlyData[monthYear].regular += duration;
      }
    });

    const total = minutesToDaysHours(totalDuration);
    const uncertain = minutesToDaysHours(uncertainDuration);
    const regular = minutesToDaysHours(regularDuration);

    setTotalLeave(
      `${total.days} days, ${total.hours} hours, and ${total.minutes} minutes`
    );
    setUncertainLeaveDuration(
      `${uncertain.days} days, ${uncertain.hours} hours, and ${uncertain.minutes} minutes`
    );
    setRegularLeaveDuration(
      `${regular.days} days, ${regular.hours} hours, and ${regular.minutes} minutes`
    );

    const formattedMonthlyData: {
      [key: string]: {
        total: string;
        uncertain: string;
        regular: string;
      };
    } = {};

    for (const key in monthlyData) {
      try {
        const total = minutesToDaysHours(monthlyData[key].total);
        const uncertain = minutesToDaysHours(monthlyData[key].uncertain);
        const regular = minutesToDaysHours(monthlyData[key].regular);

        formattedMonthlyData[key] = {
          total: `${total.days} days, ${total.hours} hours, and ${total.minutes} minutes`,
          uncertain: `${uncertain.days} days, ${uncertain.hours} hours, and ${uncertain.minutes} minutes`,
          regular: `${regular.days} days, ${regular.hours} hours, and ${regular.minutes} minutes`,
        };
        console.log(formattedMonthlyData,"formattedMonthlyDataformattedMonthlyDataformattedMonthlyData");
        setMonthlyLeaveData(formattedMonthlyData);
      } catch (error) {
        console.error('Error in loop:', error);
      }
    }
  };

  useEffect(() => {
    if (allLeave.length > 0) {
      calculateTotalLeave();
    }
  }, [allLeave]);

  return (
    <>
      <div className="ddd" style={{ display: "flex", alignItems: "center" }}>
      </div>
      <div className="containerStyle">
        <div className="totalLeaveStyle">Total Leave: {totalLeave}</div>
        <div className="uncertainLeaveStyle">Total Uncertain Leave: {uncertainLeaveDuration}</div>
        <div className="regularLeaveStyle">Total Regular Leave: {regularLeaveDuration}</div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>
                Month
              </th>
              <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>
                 Leave
              </th>
              <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>
                Uncertain Leave
              </th>
              <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>
                Regular Leave
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(monthlyLeaveData).map(([key, value]) => (
              <tr key={key}>
                <td style={{ padding: "12px", borderBottom: "1px solid #ccc" , paddingLeft:'4px' }}>
                  {key}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ccc", paddingLeft:'14px' }}>
                  {value.total}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ccc", paddingLeft:'14px' }}>
                  {value.uncertain}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ccc", paddingLeft:'14px' }}>
                  {value.regular}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LeaveReportsTable;
