import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from "dayjs";
import axios from "axios";

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
}

interface ShiftChangeData {
  employeeName: string;
  employeeID: string;
  applyDate: string;
  inTime: string;
  outTime: string;
  reason: string;
  currDate: Date;
  teamLead: string;
  adminID: string;
  approvalOfTeamLead: string;
  approvalOfHR: string;
}

const ShiftChangeFormComp: React.FC<any> = () => {
  const [approvalOfTeamLead] =
    useState<string>("pending");
  const [approvalOfHR] = useState<string>("pending");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [applyDate, setApplyDate] = useState("");
  const [inTime, setInTime] = useState("");
  const [outTime, setOutTime] = useState("");
  const [teamLead, setTeamLead] = useState("");
  const [adminInfo, setAdminInfo] = useState<IEmployee[]>([]);
  const [shiftChangeReason, setShiftChangeReason] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const dataString = localStorage.getItem("myData");
    const employeeInfo = dataString ? JSON.parse(dataString) : [];
    setEmployeeName(employeeInfo?.firstName);
    setEmployeeID(employeeInfo?.EmployeeID);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyDate && inTime && outTime) {
      const selectedAdmin = adminInfo.find(
        (admin) => admin.EmployeeID === teamLead
      );
      let adminName = "";
      let adminID = "";
      if (selectedAdmin) {
        adminName = selectedAdmin ? selectedAdmin.firstName : "";
        adminID = selectedAdmin ? selectedAdmin.EmployeeID : "";
      }

      const formattedApplyDate = dayjs(applyDate).format("YYYY-MM-DD HH:mm:ss");
      const shiftChangeData: ShiftChangeData = {
        employeeName,
        employeeID,
        applyDate: formattedApplyDate,
        inTime,
        outTime,
        reason: shiftChangeReason,
        currDate: new Date(),
        teamLead: adminName,
        adminID,
        approvalOfTeamLead,
        approvalOfHR,
      };

      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/createShiftChange`, shiftChangeData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("myToken")}`,
          },
        }
        )
        .then((response) => {
          navigate("/ViewShiftChange");
          toast.success('successfully submitted!', {
            position: toast.POSITION.TOP_RIGHT,
          });
        })
        .catch((error) => {
          toast.error('Error while inserting.', {
            position: toast.POSITION.TOP_RIGHT,
          });
        });
    } else {
      console.log("Condition not met");
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
        console.error("Error fetching data:");
      });
  }, [employeeID]);

  return (
    <div className="add-div" >
      <p className="add-heading">Shift Change Form</p>
      <form onSubmit={handleSubmit}>
        <label className="add-label" style={{ display: "block", marginBottom: "10px" }}>
          Name<span style={{ color: "red" }}>*</span>
          <input
            type="text"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            required
            className="input-add"
          />
        </label>

        <label className="add-label" style={{ display: "block", marginBottom: "10px" }}>
          Apply Date<span style={{ color: "red" }}>*</span>
          <input
            type="date"
            value={applyDate}
            onChange={(e) => setApplyDate(e.target.value)}
            required
            className="input-add"
          />
        </label>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label className="add-label" >
              In Time<span style={{ color: "red" }}>*</span>
              <input
                type="time"
                value={inTime}
                onChange={(e) => setInTime(e.target.value)}
                required
                className="input-add"
              />
            </label>
            <label className="add-label" >
              Out Time<span style={{ color: "red" }}>*</span>
              <input
                type="time"
                value={outTime}
                onChange={(e) => setOutTime(e.target.value)}
                required
                className="input-add"
              />
            </label>
          </div>
        </div>
        <label className="add-label" >
          Reason for Shift Change<span style={{ color: "red" }}>*</span>
          <textarea
            value={shiftChangeReason}
            onChange={(e) => setShiftChangeReason(e.target.value)}
            required
            className="input-add"
          />
        </label>

        <div className="form-group" >
          <label className="add-label">
            Team Lead:
            <select
              className="input-add"
              value={teamLead}
              onChange={(e) => setTeamLead(e.target.value)}
              required
            >
              <option value="">Select admin</option>
              {adminInfo.map((admin) => (
                <option key={admin.EmployeeID} value={admin.EmployeeID}>
                  {admin.firstName}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            className="add-button"
            type="submit"

          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShiftChangeFormComp;
