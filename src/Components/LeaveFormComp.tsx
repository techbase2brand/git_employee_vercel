import React, { useState, useEffect } from "react";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const { RangePicker } = DatePicker;
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

interface IEmployee {
  firstName: string;
  lastName: string;
  jobPosition: string;
  email: string;
  phone: string;
  permanentaddress: string;
  currentAddress: string;
  dob: Date;
  role: string;
  parentPhone: string;
  EmployeeID: string;
  password: string;
  confirmPassword: string;
  EmpID: number;
  doj: Date;
  bloodGroup: string;
  highestQualification: string;
  status: any;
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
  const [employeeID, setEmployeeID] = useState<string>("");
  const [adminInfo, setAdminInfo] = useState<IEmployee[]>([]);
  const [estTime, setEstTime] = useState<string>("");
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

    // if (text.length < 100) {
    //   // setValidationMessage("Enter at least 100 characters");
    // } else {
    //   setValidationMessage("");
    // }
  };

  useEffect(() => {
    const dataString = localStorage.getItem("myData");
    const employeeInfo = dataString ? JSON.parse(dataString) : [];
    setEmployeeName(employeeInfo?.firstName);
    setEmployeeID(employeeInfo?.EmployeeID);
  }, []);

  useEffect(() => {
    if (startDate) {
      const leaveCategory = getLeaveCategory(startDate);
      setLeaveCategoryState(leaveCategory);
    }
  }, [startDate]); // Only run this effect when startDate changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      const selectedAdmin = adminInfo.find(
        (admin) => admin.EmployeeID === teamLead
      );
      const adminName = selectedAdmin ? selectedAdmin.firstName : "";
      const adminID = selectedAdmin ? selectedAdmin.EmployeeID : "";
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
          navigate("/ViewLeavePage");
          toast.success('successfull!', {
            position: toast.POSITION.TOP_RIGHT,
          });
        })
        .catch((error) => {
          console.error("Error submitting leave data:", error);
          toast.error('failed.', {
            position: toast.POSITION.TOP_RIGHT,
          });
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
      .get<IEmployee[]>(`${process.env.REACT_APP_API_BASE_URL}/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {

        const arr = response?.data.filter((elem) => elem?.jobPosition == "Project Manager" || elem?.jobPosition == "Managing Director")
        setAdminInfo(arr);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [employeeID]);


  return (
    <>
      <h2>Leave Form</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
        }}
      >
        <label className="add-label">
          Leave Duration:
        </label>
        <RangePicker
          value={[
            startDate ? dayjs(startDate) : null,
            endDate ? dayjs(endDate) : null,
          ]}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
              className="form-leave"
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
        <div className="form-group">
          <label className="add-label">Leave Reason:</label>

          <textarea
            style={{
              width: "100%",
              height: "80px",
              marginTop: "5px",
              marginBottom: "10px",
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

        <div className="form-group" style={{}}>
          <label className="add-label">
            Admin:
          </label>

          <select
            className="form-leave"
            value={teamLead}
            onChange={(e) => setTeamLead(e.target.value)}
            required
          >
            <option value="">Select admin</option>
            {adminInfo
              .filter(admin => admin.status === 1)
              .map((admin) => (
                <option key={admin.EmployeeID} value={admin.EmployeeID}>
                  {admin.firstName}
                </option>
              ))}
          </select>
        </div>

        <button className="add-button-2" type="submit">
          Apply
        </button>
      </form>
    </>
  );
};

export default LeaveFormComp;
