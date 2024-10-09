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
  status:any;
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
  const splitLeaveByMonth = (leave: LeaveData) => {
    const startDate = dayjs(leave.startDate);
    const endDate = dayjs(leave.endDate);
    const months = [];
  
    let currentMonth = startDate.startOf('month');
    while (currentMonth.isBefore(endDate.endOf('month'))) {
      const monthStart = currentMonth.isSame(startDate, 'month') ? startDate : currentMonth;
      const monthEnd = currentMonth.isSame(endDate, 'month') ? endDate : currentMonth.endOf('month');
  
      const fullDays = monthEnd.diff(monthStart, 'day') + 1;
      let durationMinutes = 0;
  
      if (/^\d{1,2}:\d{2}$/.test(leave.leaveType)) {
        // If leaveType is in HH:MM format
        durationMinutes = fullDays * timeToMinutes(leave.leaveType);
      } else if (leave.leaveType.toLowerCase() === 'full day') {
        // For a full day, assume 9 hours (9 * 60 minutes)
        durationMinutes = fullDays * 9 * 60;
      }
  
      months.push({
        month: currentMonth.format("MMM YYYY"),
        durationMinutes,  // Store the total minutes for this leave in the month
      });

      currentMonth = currentMonth.add(1, 'month');
    }
  
    return months;
  };
  const sumTimeParts = (totalMinutes: number) => {
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
  
    const totalDays = Math.floor(totalHours / 9);  // Assuming 9 hours make a day
    const remainingHours = totalHours % 9;
  
    return { days: totalDays, hours: remainingHours, minutes: remainingMinutes };
  };
  
  
  const calculateTotalLeaveForEmployee = (employee: Employee) => {
    const employeeLeaves = allLeave.filter((leave) => {
      const leaveYear = dayjs(leave.startDate).year().toString();
      return leave.employeeID === employee.EmployeeID && 
             (selectedYear === 'all' || leaveYear === selectedYear);
    });
  
    if (employeeLeaves.length === 0 && selectedEmployee !== 'all') return (
      <div key={employee.EmpID} style={{ textAlign: "center", margin: "20px 0", color: "#999", fontSize: "20px", fontWeight: "bold" }}>
        {employee.firstName} has no leave data.
      </div>
    );
  
    if (employeeLeaves.length === 0) return null;
  
    let totalMinutes = 0;
    let uncertainMinutes = 0;
    let regularMinutes = 0;
  
    const monthlyData: {
      [key: string]: {
        total: number;
        uncertain: number;
        regular: number;
      };
    } = {};
  
    employeeLeaves.forEach((leave) => {
      const leaveMonths = splitLeaveByMonth(leave);
  
      leaveMonths.forEach(({ month, durationMinutes }) => {
        totalMinutes += durationMinutes;
  
        if (!monthlyData[month]) {
          monthlyData[month] = { total: 0, uncertain: 0, regular: 0 };
        }
  
        monthlyData[month].total += durationMinutes;
  
        if (leave.leaveCategory === "Uncertain Leave") {
          uncertainMinutes += durationMinutes;
          monthlyData[month].uncertain += durationMinutes;
        } else if (leave.leaveCategory === "Regular Leave") {
          regularMinutes += durationMinutes;
          monthlyData[month].regular += durationMinutes;
        }
      });
    });
  
    // Convert total minutes to days, hours, and minutes
    const totalAllTime = sumTimeParts(totalMinutes);
    const uncertainAllTime = sumTimeParts(uncertainMinutes);
    const regularAllTime = sumTimeParts(regularMinutes);
  
    const hasLeave = totalAllTime.days > 0 || totalAllTime.hours > 0 || totalAllTime.minutes > 0;
    const hasUncertainLeave = uncertainAllTime.days > 0 || uncertainAllTime.hours > 0 || uncertainAllTime.minutes > 0;
    const hasRegularLeave = regularAllTime.days > 0 || regularAllTime.hours > 0 || regularAllTime.minutes > 0;
  
    return (
      <div>
        {loading ? <Spin size="large" className="spinner-antd" /> :
          <div>
            {hasLeave || hasUncertainLeave || hasRegularLeave ? (
              <div key={employee.EmpID}>
                <h2 style={{ margin: '10px', marginBottom: '-20px' }}>{employee.firstName}</h2>
                <div className="containerStyle">
                  <div className="totalLeaveStyle">
                    Total Leave: {`${totalAllTime.days} days, ${totalAllTime.hours} hours, and ${totalAllTime.minutes} minutes`}
                  </div>
                  <div className="uncertainLeaveStyle">
                    Total Uncertain Leave: {`${uncertainAllTime.days} days, ${uncertainAllTime.hours} hours, and ${uncertainAllTime.minutes} minutes`}
                  </div>
                  <div className="regularLeaveStyle">
                    Total Regular Leave: {`${regularAllTime.days} days, ${regularAllTime.hours} hours, and ${regularAllTime.minutes} minutes`}
                  </div>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <table style={{ width: "auto", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>Month</th>
                        <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>Leave</th>
                        <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>Uncertain Leave</th>
                        <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>Regular Leave</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(monthlyData)
                        .filter(([key]) => selectedYear === 'all' || key.includes(selectedYear))
                        .sort(([a], [b]) => +new Date(a) - +new Date(b))
                        .map(([key, value]) => {
                          const total = sumTimeParts(value.total);
                          const uncertain = sumTimeParts(value.uncertain);
                          const regular = sumTimeParts(value.regular);
                          return (
                            <tr key={key}>
                              <td style={{ padding: "12px", borderBottom: "1px solid #ccc", paddingLeft: '4px' }}>{key}</td>
                              <td style={{ padding: "12px", borderBottom: "1px solid #ccc", paddingLeft: '14px' }}>{`${total.days} days, ${total.hours} hours, and ${total.minutes} minutes`}</td>
                              <td style={{ padding: "12px", borderBottom: "1px solid #ccc", paddingLeft: '14px' }}>{`${uncertain.days} days, ${uncertain.hours} hours, and ${uncertain.minutes} minutes`}</td>
                              <td style={{ padding: "12px", borderBottom: "1px solid #ccc", paddingLeft: '14px' }}>{`${regular.days} days, ${regular.hours} hours, and ${regular.minutes} minutes`}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
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
          .filter(emp => emp.status === 1)
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
        <div className="pagination" style={{ display: "flex", gap:'44rem', margin: "10px 0" }}>
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
