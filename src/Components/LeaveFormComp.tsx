// LeaveForm.tsx

import React, { useState, useEffect } from "react";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import axios from "axios";
// import { Radio } from "antd";
import { useNavigate } from "react-router-dom";
const { RangePicker } = DatePicker;
// interface TeamLead {
//   id: number;
//   name: string;
// }
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

const LeaveFormComp: React.FC = () => {
  const [approvalOfTeamLead] =
    useState<string>("pending");
  const [approvalOfHR] = useState<string>("pending");
  const [employeeName, setEmployeeName] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [leaveType, setLeaveType] = useState<string>("");
  const [leaveReason, setLeaveReason] = useState<string>("");
  const [teamLead, setTeamLead] = useState<string>("");
  // const [message, setMessage] = useState<string>("");
  const [employeeID, setEmployeeID] = useState<string>("");
  const [adminInfo, setAdminInfo] = useState<Admin[]>([]);
  const [estTime, setEstTime] = useState<string>("");
  // const [isHourlyBasis, setIsHourlyBasis] = useState(false);
  // const [isDropdownDisabled, setIsDropdownDisabled] = useState(false);
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [leaveCategoryState, setLeaveCategoryState] = useState<string>("");

  const navigate = useNavigate();

  const getLeaveCategory = (startDate: Date): string => {
    const today = new Date();
    const diffInDays = Math.ceil(
      (startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays >= 3) {
      return "Regular Leave";
    } else {
      return "Uncertain Leave";
    }
  };


  const handleLeaveReasonChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const text = e.target.value;
    setLeaveReason(text);
    setCharacterCount(text.length);

    if (text.length < 100) {
      setValidationMessage("Enter at least 100 characters");
    } else {
      setValidationMessage("");
    }
  };

  useEffect(() => {
    const dataString = localStorage.getItem("myData");
    const employeeInfo = dataString ? JSON.parse(dataString) : [];
    setEmployeeName(employeeInfo[0]?.firstName);
    setEmployeeID(employeeInfo[0]?.EmployeeID);
  }, []);

  // Add this useEffect hook
  useEffect(() => {
    if (startDate) {
      const leaveCategory = getLeaveCategory(startDate);
      setLeaveCategoryState(leaveCategory);
    }
  }, [startDate]); // Only run this effect when startDate changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      // Find the selected admin using the adminID
      const selectedAdmin = adminInfo.find(
        (admin) => admin.adminID === teamLead
      );

      // Extract the adminName and adminID
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
        .post("http://localhost:5000/createLeave", leaveData)
        .then((response) => {
          console.log(response.data);
          // setMessage("Leave data submitted");
          navigate("/ViewLeavePage");
        })
        .catch((error) => {
          console.error("Error submitting leave data:", error);
          // setMessage("Error submitting leave data");
        });
    } else {
      // setMessage("Please fill in all required fields.");
    }
  };

  // const handleEstTimeChange = (value: string) => {
  //   setEstTime(value);
  // };

  // const handleLeaveTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

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
    axios
      .get<Admin[]>("http://localhost:5000/get/admin")
      .then((response) => {

        setAdminInfo(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [employeeID]);

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Leave Form</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          maxWidth: "80%",
          margin: "0 auto",
          width: "60%",
        }}
      >
        <label className="add-label">
          Leave Duration:
          <RangePicker
            style={{
              display: "block",
              width: "100%",
              // marginTop: "5px",
              // marginBottom: "10px",
            }}
            value={[
              startDate ? dayjs(startDate) : null,
              endDate ? dayjs(endDate) : null,
            ]}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(dates : any) => {
              if (dates) {
                setStartDate(dates[0]?.toDate() || null);
                setEndDate(dates[1]?.toDate() || null);
              } else {
                setStartDate(null);
                setEndDate(null);
              }
            }}
          />
        </label>
        <div className="form-group" style={{}}>
          <label className="add-label">
            Leave Type: {leaveCategoryState ? leaveCategoryState : null}
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
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((hour) =>
                [15, 30, 45].map((minute) => (
                  <option key={`${hour}:${minute}`} value={`${hour}:${minute}`}>
                    {`${hour} hours ${minute} mins`}
                  </option>
                ))
              )}
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
        <div className="form-group" style={{ width: "45%" }}>
          <label className="add-label">Leave Reason:</label>

          <textarea
            style={{
              width: "100%",
              height: "80px",
              marginTop: "5px",
              marginBottom: "10px",
              resize: "none",
              padding: "5px",
            }}
            value={leaveReason}
            onChange={handleLeaveReasonChange}
            minLength={100}
            required
          />
          <p>Char. entered: {characterCount}</p>
          {validationMessage && (
            <p style={{ color: "red" }}>{validationMessage}</p>
          )}
        </div>

        <div className="form-group" style={{}}>
          <label className="add-label">
            Admin:
            <select
              className="form-control"
              style={{
                width: "100%",
                display: "block",
                // marginTop: "5px",
              }}
              value={teamLead}
              onChange={(e) => setTeamLead(e.target.value)}
              required
            >
              <option value="">Select admin</option>
              {adminInfo.map((admin) => (
                <option key={admin.adminID} value={admin.adminID}>
                  {admin.adminName}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button className="add-button" type="submit">
          Apply
        </button>
      </form>
    </>
  );
};

export default LeaveFormComp;
