import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { Spin } from "antd";

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

const HrLeaveReportTable: React.FC = () => {
  const [allLeave, setAllLeave] = useState<LeaveData[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [years, setyears] = useState(true);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const employeesPerPage = 100;

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const handleChange = (e: any) => {
    setSelectedYear(e)
    setyears(false)
  }
  const minutesToDaysHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const days = Math.floor(hours / 9);
    const remainingHours = hours % 9;
    return { days, hours: remainingHours, minutes: remainingMinutes };
  };

  const updatedAllLeave = allLeave.map((leave) => {
    const startDateString = leave.startDate.toString();
    const updatedStartDate = startDateString.split('-')[0];
    return {
      ...leave,
      startDate: updatedStartDate,
    };
  });

  const uniqueTimeParts = new Set(updatedAllLeave.map((leave) => leave.startDate));
  const uniqueTimeArray = Array.from(uniqueTimeParts);
  uniqueTimeArray.sort((a, b) => {
    return parseInt(b, 10) - parseInt(a, 10);
  });

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
        setAllLeave(sortedData);
        setLoading(false);
      });
    axios
      .get<Employee[]>(`${process.env.REACT_APP_API_BASE_URL}/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAllEmployees(response.data);
      });
  }, []);

  const calculateTotalLeaveForEmployee = (employee: Employee) => {
    const employeeLeaves = allLeave.filter(
      (leave) => leave.employeeID === employee.EmployeeID
    );
    if (employeeLeaves.length === 0 && selectedEmployee !== 'all') return (
      <div key={employee.EmpID} style={{ textAlign: "center", margin: "20px 0", color: "#999", fontSize: "20px", fontWeight: "bold" }}>
        {employee.firstName} has no leave data.
      </div>
    );
    if (employeeLeaves.length === 0) return null;

    let totalDuration = 0;
    let uncertainDuration = 0;
    let regularDuration = 0;

    const monthlyData: {
      [key: string]: {
        total: number;
        uncertain: number;
        regular: number;
      };
    } = {};

    employeeLeaves.forEach((leave) => {
      const startDate = dayjs(leave.startDate).startOf("day");
      const endDate = dayjs(leave.endDate).startOf("day");
      // const dayGap = endDate.diff(startDate, "day");
      const dayGap = endDate.diff(startDate, "day") + 1;

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

    // const total = minutesToDaysHours(totalDuration);
    // const uncertain = minutesToDaysHours(uncertainDuration);
    // const regular = minutesToDaysHours(regularDuration);

    // const totalLeave = `${total.days} days, ${total.hours} hours, and ${total.minutes} minutes`;
    // const uncertainLeaveDuration = `${uncertain.days} days, ${uncertain.hours} hours, and ${uncertain.minutes} minutes`;
    // const regularLeaveDuration = `${regular.days} days, ${regular.hours} hours, and ${regular.minutes} minutes`;

    const totalAll = Object.entries(monthlyData)
      .filter(([key]) => (
        (!years && (selectedYear === 'all' || key.includes(selectedYear))) ||
        (years && key.includes(uniqueTimeArray[0]))
      ))
      .reduce(
        (acc, [, value]) => {
          acc.total += value.total;
          acc.uncertain += value.uncertain;
          acc.regular += value.regular;
          return acc;
        },
        { total: 0, uncertain: 0, regular: 0 }
      );

    const totalAllDaysHours = minutesToDaysHours(totalAll.total);
    const totalAllUncertainDaysHours = minutesToDaysHours(totalAll.uncertain);
    const totalAllRegularDaysHours = minutesToDaysHours(totalAll.regular);

    const Leave = totalAllDaysHours.days === 0 && totalAllDaysHours.hours === 0 && totalAllDaysHours.minutes === 0
    const Uncertain = totalAllUncertainDaysHours.days === 0 && totalAllUncertainDaysHours.hours === 0 && totalAllUncertainDaysHours.minutes === 0;
    const Regular = totalAllRegularDaysHours.days === 0 && totalAllRegularDaysHours.hours === 0 && totalAllRegularDaysHours.minutes === 0;

    return (
      <div>
        {loading ?
          <Spin size="large" className="spinner-antd" />
          :
          <div>
            {Leave === false || Uncertain === false || Regular === false ?
              <div key={employee.EmpID}>
                <h2 style={{ margin: '10px', marginBottom: '-20px' }}>{employee.firstName}</h2>
                <div className="containerStyle">
                  <div className="totalLeaveStyle">Total Leave: {`${totalAllDaysHours.days} days, ${totalAllDaysHours.hours} hours, and ${totalAllDaysHours.minutes} minutes`}</div>
                  <div className="uncertainLeaveStyle">Total Uncertain Leave: {`${totalAllUncertainDaysHours.days} days, ${totalAllUncertainDaysHours.hours} hours, and ${totalAllUncertainDaysHours.minutes} minutes`}</div>
                  <div className="regularLeaveStyle">Total Regular Leave: {`${totalAllRegularDaysHours.days} days, ${totalAllRegularDaysHours.hours} hours, and ${totalAllRegularDaysHours.minutes} minutes`}</div>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>Month</th>
                        <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>Leave</th>
                        <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>Uncertain Leave</th>
                        <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>Regular Leave</th>
                      </tr>
                    </thead>
                    <tbody>
                      {years === false ? Object.entries(monthlyData)
                        .filter(([key]) => selectedYear === 'all' || key.includes(selectedYear))
                        .sort(([a], [b]) => +new Date(a) - +new Date(b))
                        .map(([key, value]) => {
                          const total = minutesToDaysHours(value.total);
                          const uncertain = minutesToDaysHours(value.uncertain);
                          const regular = minutesToDaysHours(value.regular);
                          return (
                            <tr key={key}>
                              <td style={{ padding: "12px", borderBottom: "1px solid #ccc", paddingLeft: '4px' }}>{key}</td>
                              <td style={{ padding: "12px", borderBottom: "1px solid #ccc", paddingLeft: '14px' }}>{`${total.days} days, ${total.hours} hours, and ${total.minutes} minutes`}</td>
                              <td style={{ padding: "12px", borderBottom: "1px solid #ccc", paddingLeft: '14px' }}>{`${uncertain.days} days, ${uncertain.hours} hours, and ${uncertain.minutes} minutes`}</td>
                              <td style={{ padding: "12px", borderBottom: "1px solid #ccc", paddingLeft: '14px' }}>{`${regular.days} days, ${regular.hours} hours, and ${regular.minutes} minutes`}</td>
                            </tr>
                          );
                        })
                        :
                        Object.entries(monthlyData)
                          .filter(([key]) => key.includes(uniqueTimeArray[0]))
                          .sort(([a], [b]) => +new Date(a) - +new Date(b))
                          .map(([key, value]) => {
                            const total = minutesToDaysHours(value.total);
                            const uncertain = minutesToDaysHours(value.uncertain);
                            const regular = minutesToDaysHours(value.regular);
                            return (
                              <tr key={key}>
                                <td style={{ padding: "12px", borderBottom: "1px solid #ccc", paddingLeft: '4px' }}>{key}</td>
                                <td style={{ padding: "12px", borderBottom: "1px solid #ccc", paddingLeft: '14px' }}>{`${total.days} days, ${total.hours} hours, and ${total.minutes} minutes`}</td>
                                <td style={{ padding: "12px", borderBottom: "1px solid #ccc", paddingLeft: '14px' }}>{`${uncertain.days} days, ${uncertain.hours} hours, and ${uncertain.minutes} minutes`}</td>
                                <td style={{ padding: "12px", borderBottom: "1px solid #ccc", paddingLeft: '14px' }}>{`${regular.days} days, ${regular.hours} hours, and ${regular.minutes} minutes`}</td>
                              </tr>
                            );
                          })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
              : null
            }
          </div>
        }
      </div>
    );
  };

  // return (
  //   <div className="allEmployeesLeaveData">
  //     <div style={{ display: "flex", justifyContent: "flex-end", margin: "10px 0" }}>
  //       <select
  //         value={selectedEmployee === 'all' ? 'all' : selectedEmployee.EmpID}
  //         onChange={(e) => {
  //           const selectedId = e.target.value;
  //           if (selectedId === 'all') {
  //             setSelectedEmployee('all');
  //           } else {
  //             const selectedEmp = allEmployees.find(emp => emp.EmpID.toString() === selectedId);
  //             if (selectedEmp) setSelectedEmployee(selectedEmp);
  //           }
  //         }}
  //         style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", outline: "none" }}
  //       >
  //         <option value='all'>All Employees</option>
  //         {allEmployees.map(emp => (
  //           <option key={emp.EmpID} value={emp.EmpID}>{emp.firstName}</option>
  //         ))}
  //       </select>
  //     </div>
  //     {(selectedEmployee === 'all' ? allEmployees : [selectedEmployee])
  //       .slice(currentPage * employeesPerPage, (currentPage + 1) * employeesPerPage)
  //       .map((employee) => calculateTotalLeaveForEmployee(employee))}
  //     {selectedEmployee === 'all' &&
  //       <div className="pagination" style={{ display: "flex", justifyContent: "flex-end", margin: "10px 0" }}>
  //         {[...Array(Math.ceil(((selectedEmployee === 'all' ? allEmployees : [selectedEmployee]).length) / employeesPerPage))].map((_, idx) => (
  //           <button
  //             className="paginationButton"
  //             style={{
  //               margin: "5px",
  //               padding: "10px",
  //               backgroundColor: idx === currentPage ? "#00a2ed" : "#fff",
  //               color: idx === currentPage ? "#fff" : "#000",
  //               border: "2px solid #00a2ed",
  //               borderRadius: "5px"
  //             }}
  //             onClick={() => setCurrentPage(idx)}
  //             key={idx}
  //           >
  //             {idx + 1}
  //           </button>
  //         ))}
  //       </div>
  //     }
  //   </div>
  // );


  return (
    <div className="allEmployeesLeaveData">
      <div style={{ display: 'flex', gap: '27px' }}>
        {/* <select
          value={selectedYear}
          // onChange={(e) => {
          //   const year = e.target.value;
          //   setSelectedYear(year);
          // }}
          onChange={(e) => handleChange(e.target.value)}

          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", outline: "none" }}
        >
          <option value='all'>Select Year</option>
          {uniqueTimeArray.map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select> */}
        <select
          value={years ? uniqueTimeArray[0] : selectedYear}
          onChange={(e) => handleChange(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", outline: "none" }}
        >
          <option value='all'>Select Year</option>
          {uniqueTimeArray.map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <select
          value={selectedEmployee === 'all' ? 'all' : selectedEmployee.EmpID}
          onChange={(e) => {
            const selectedId = e.target.value;
            if (selectedId === 'all') {
              setSelectedEmployee('all');
              setCurrentPage(0);
            } else {
              const selectedEmp = allEmployees.find(emp => emp.EmpID.toString() === selectedId);
              if (selectedEmp) setSelectedEmployee(selectedEmp);
            }
          }}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", outline: "none" }}
        >
          <option value='all'>All Employees</option>
          {allEmployees
            .sort((a, b) => a.firstName.localeCompare(b.firstName)) // Sort by firstName
            .map(emp => (
              <option key={emp.EmpID} value={emp.EmpID}>{emp.firstName}</option>
            ))}
        </select>
      </div>
      {selectedEmployee === 'all'
        ? allEmployees
          .filter(emp => allLeave.some(leave => leave.employeeID === emp.EmployeeID)) // Filter out employees with no leave
          .slice(currentPage * employeesPerPage, (currentPage + 1) * employeesPerPage)
          .map((employee) => calculateTotalLeaveForEmployee(employee))
        : calculateTotalLeaveForEmployee(selectedEmployee)
      }
      {selectedEmployee === 'all' &&
        <div className="pagination" style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(prevPage => prevPage - 1)}
            style={{
              padding: "10px",
              border: "2px solid #00a2ed",
              borderRadius: "5px",
              backgroundColor: currentPage === 0 ? "#ccc" : "#00a2ed",
              color: currentPage === 0 ? "#000" : "#fff"
            }}
          >
            Previous
          </button>
          <button
            disabled={currentPage === Math.ceil(allEmployees.filter(emp => allLeave.some(leave => leave.employeeID === emp.EmployeeID)).length / employeesPerPage) - 1} // Calculate total pages based on filtered employees
            onClick={() => setCurrentPage(prevPage => prevPage + 1)}
            style={{
              padding: "10px",
              border: "2px solid #00a2ed",
              borderRadius: "5px",
              backgroundColor: currentPage === Math.ceil(allEmployees.filter(emp => allLeave.some(leave => leave.employeeID === emp.EmployeeID)).length / employeesPerPage) - 1 ? "#ccc" : "#00a2ed",
              color: currentPage === Math.ceil(allEmployees.filter(emp => allLeave.some(leave => leave.employeeID === emp.EmployeeID)).length / employeesPerPage) - 1 ? "#000" : "#fff"
            }}
          >
            Next
          </button>
        </div>
      }
    </div>
  );
};

export default HrLeaveReportTable;
