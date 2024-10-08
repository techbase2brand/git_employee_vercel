import React, { useState, useEffect } from "react";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const { RangePicker } = DatePicker;

interface LeaveData {
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
  estTime?: string;
  leaveCategory: string;
}

interface Admin {
  email: string;
  adminID: string;
  adminName: string;
}

interface Employee {
  EmployeeID: string;
  firstName: string;
  lastName: string;
  status: any;
  email: string;
}

const HrLeaveAutoFillComp: React.FC = () => {
  const [approvalOfTeamLead] = useState<string>("approved");
  const [approvalOfHR] = useState<string>("approved");
  const [employeeName, setEmployeeName] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [leaveType, setLeaveType] = useState<string>("");
  const [leaveReason, setLeaveReason] = useState<string>("");
  const [teamLead, setTeamLead] = useState<string>("");
  const [employeeID, setEmployeeID] = useState<string>("");
  const [adminInfo, setAdminInfo] = useState<Admin[]>([]);
  const [estTime, setEstTime] = useState<string>("");
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [leaveCategoryState, setLeaveCategoryState] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Find all admins whose emails exist in the employees list and whose status is 1
  const matchingEmployees = adminInfo.filter((admin) => {
    return employees.some((employee) => employee.email === admin.email && employee.status === 1);
  });


  const navigate = useNavigate();

  const handleLeaveReasonChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const text = e.target.value;
    setLeaveReason(text);
    setCharacterCount(text.length);

    // if (text.length < 100) {
    //   setValidationMessage("Enter at least 100 characters");
    // } else {
    //   setValidationMessage("");
    // }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      const selectedAdmin = adminInfo.find(
        (admin) => admin.adminID === teamLead
      );

      const adminName = selectedAdmin ? selectedAdmin.adminName : "";
      const adminID = selectedAdmin ? selectedAdmin.adminID : "";

      const localLeaveType = estTime ? estTime : "full day";

      const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD HH:mm:ss");
      const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD HH:mm:ss");
      const leaveData: LeaveData = {
        employeeName,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        leaveType: localLeaveType,
        leaveReason,
        teamLead: adminName,
        employeeID,
        adminID: adminID,
        approvalOfTeamLead,
        approvalOfHR,
        leaveCategory: leaveCategoryState,
      };
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/createLeave`, leaveData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("myToken")}`,
          },
        })
        .then((response) => {
          navigate("/HRsection");
        })
        .catch((error) => {
          console.error("Error submitting leave data:", error);
        });
    }
  };

  const handleLeaveTypeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setLeaveType("full day");
    } else {
      setLeaveType("");
    }
  };

  const handleDropdownClick = () => {
    if (leaveType === "full day") {
      setLeaveType("");
    }
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      setLeaveType("hourly basis");
      setEstTime(e.target.value);
    } else {
      setLeaveType("");
      setEstTime("");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("myToken");

    axios
      .get<Admin[]>(`${process.env.REACT_APP_API_BASE_URL}/get/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {

        setAdminInfo(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [employeeID]);

  useEffect(() => {
    axios
      .get<Employee[]>(`${process.env.REACT_APP_API_BASE_URL}/employees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, []);


  useEffect(() => {
    if (employeeID) {
      const selectedEmployee = employees.find((employee) => employee.EmployeeID === employeeID);
      if (selectedEmployee) {
        setEmployeeName(`${selectedEmployee.firstName} ${selectedEmployee.lastName}`);
      }
    }
  }, [employeeID, employees]);


  return (
    <>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2>Leave Form</h2>
        <label className="add-label">
          Employee:
          <select
            className="form-control"
            style={{
              width: "100%",
              display: "block",
            }}
            value={employeeID}
            onChange={(e) => setEmployeeID(e.target.value)}
            required
          >
            <option value="">Select employee</option>
            {employees
              .filter((employee) => employee.status === 1)
              .map((employee) => (
                <option key={employee.EmployeeID} value={employee.EmployeeID}>
                  {employee.firstName} {employee.lastName}
                </option>
              ))}
          </select>
        </label>
        <label className="add-label">
          Leave Duration:
        </label>
        <RangePicker
          value={[
            startDate ? dayjs(startDate) : null,
            endDate ? dayjs(endDate) : null,
          ]}
          onChange={(dates: any) => {
            if (dates) {
              setStartDate(dates[0]?.toDate() || null);
              setEndDate(dates[1]?.toDate() || null);
            } else {
              setStartDate(null);
              setEndDate(null);
            }
          }}
        />
        <div className="form-group" style={{}}>
          <label className="add-label">
            Leave Type:
          </label>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <label className="add-label"></label>
            <select
              style={{
                width: "100%",
                display: "block",
              }}
              name="estTime"
              className="form-control"
              value={estTime}
              onClick={handleDropdownClick}
              onChange={handleDropdownChange}
              disabled={leaveType === "full day"}
              required
            >
              <option value="">Hourly basis</option>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((hour) => [
                <option key={`${hour}:00`} value={`${hour}:00`}>
                  {`${hour} hours`}
                </option>,
                ...[15, 30, 45].map((minute) => (
                  <option key={`${hour}:${minute}`} value={`${hour}:${minute}`}>
                    {`${hour} hours ${minute} mins`}
                  </option>
                ))
              ])}
            </select>


            <p
              style={{
                textAlign: "center",
                marginLeft: "25px",
                marginTop: "10px",
              }}
            >
              OR
            </p>

            <div
              style={{ display: "flex", flexDirection: "row", width: "20%" }}
            >
              <span
                style={{
                  textAlign: "center",
                  marginLeft: "25px",
                  width: "50px",
                }}
              >
                Full Day
              </span>

              <input
                style={{
                  textAlign: "center",
                  marginLeft: "25px",
                  width: "50px",
                }}
                type="checkbox"
                checked={leaveType === "full day"}
                onChange={handleLeaveTypeToggle}
              />
            </div>
          </div>
        </div>
        <div className="form-group" >
          <label className="add-label">Leave Reason:</label>

          <textarea
            style={{
              width: "100%",
              height: "80px",
              resize: "none",
              padding: "5px",
            }}
            value={leaveReason}
            onChange={handleLeaveReasonChange}
            // minLength={100}
            required
          />
          <p>Char. entered: {characterCount}</p>
          {validationMessage && (
            <p style={{ color: "red" }}>{validationMessage}</p>
          )}
        </div>
        <label className="add-label">
          Leave Category:
          <select
            className="form-control"
            style={{
              width: "100%",
              display: "block",
            }}
            value={leaveCategoryState}
            onChange={(e) => setLeaveCategoryState(e.target.value)}
            required
          >
            <option value="">Select leave category</option>
            <option value="Uncertain Leave">Uncertain Leave</option>
            <option value="Regular Leave">Regular Leave</option>
          </select>
        </label>
        <div className="form-group" style={{}}>
          <label className="add-label">
            Admin:
            <select
              className="form-control"
              style={{
                width: "100%",
                display: "block",
              }}
              value={teamLead}
              onChange={(e) => setTeamLead(e.target.value)}
              required
            >
              <option value="">Select admin</option>
              {matchingEmployees.map((admin) => (
                <option key={admin.adminID} value={admin.adminID}>
                  {admin.adminName}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button className="add-button-2" type="submit">
          Apply
        </button>
      </form>
    </>
  );
};

export default HrLeaveAutoFillComp;
