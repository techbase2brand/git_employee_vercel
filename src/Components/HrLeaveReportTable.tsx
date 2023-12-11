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

const HrLeaveReportTable: React.FC = () => {
  const [allLeave, setAllLeave] = useState<LeaveData[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const employeesPerPage = 5; // Modify this to change how many employees are shown per page

console.log("recent--");


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

  useEffect(() => {
    const token = localStorage.getItem("myToken");

    axios
      .get<LeaveData[]>("http://localhost:5000/get/leaveinfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const sortedData = response.data.sort(
          (a, b) => Number(b.LeaveInfoID) - Number(a.LeaveInfoID)
        );
        setAllLeave(sortedData);
      });

    axios
      .get<Employee[]>("http://localhost:5000/employees", {
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
   // if there are no leaves, don't display the table

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

    const total = minutesToDaysHours(totalDuration);
    const uncertain = minutesToDaysHours(uncertainDuration);
    const regular = minutesToDaysHours(regularDuration);

    const totalLeave = `${total.days} days, ${total.hours} hours, and ${total.minutes} minutes`;
    const uncertainLeaveDuration = `${uncertain.days} days, ${uncertain.hours} hours, and ${uncertain.minutes} minutes`;
    const regularLeaveDuration = `${regular.days} days, ${regular.hours} hours, and ${regular.minutes} minutes`;

    return (
      <div key={employee.EmpID}>
        <h2 style={{margin:'10px',marginBottom:'-20px' }}>{employee.firstName}</h2>
        <div className="containerStyle">
          <div className="totalLeaveStyle">Total Leave: {totalLeave}</div>
          <div className="uncertainLeaveStyle">Total Uncertain Leave: {uncertainLeaveDuration}</div>
          <div className="regularLeaveStyle">Total Regular Leave: {regularLeaveDuration}</div>
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
              {Object.entries(monthlyData).map(([key, value]) => {
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
              })}
            </tbody>
          </table>
        </div>
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
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "10px 0" }}>
        <select
          value={selectedEmployee === 'all' ? 'all' : selectedEmployee.EmpID}
          onChange={(e) => {
            const selectedId = e.target.value;
            if (selectedId === 'all') {
              setSelectedEmployee('all');
              setCurrentPage(0); // Reset the current page whenever the selected employee changes
            } else {
              const selectedEmp = allEmployees.find(emp => emp.EmpID.toString() === selectedId);
              if (selectedEmp) setSelectedEmployee(selectedEmp);
            }
          }}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", outline: "none" }}
        >
          <option value='all'>All Employees</option>
          {allEmployees.map(emp => (
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
