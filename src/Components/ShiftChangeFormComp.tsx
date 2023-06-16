import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";

import dayjs from "dayjs";
import axios from "axios";

interface Admin {
  email: string;
  adminID: string;
  adminName: string;
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

const ShiftChangeFormComp: React.FC<any> = ({ navigation, classes }) => {
  const [approvalOfTeamLead] =
    useState<string>("pending");
  const [approvalOfHR] = useState<string>("pending");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [applyDate, setApplyDate] = useState("");
  const [inTime, setInTime] = useState("");
  const [outTime, setOutTime] = useState("");
  // const [reason, setReason] = useState("");
  const [teamLead, setTeamLead] = useState("");
  // const [adminID, setAdminID] = useState("");
  const [adminInfo, setAdminInfo] = useState<Admin[]>([]);
  // const [shiftStartTime, setShiftStartTime] = useState("");
  // const [shiftEndTime, setShiftEndTime] = useState("");
  const [shiftChangeReason, setShiftChangeReason] = useState("");

  useEffect(() => {
    const dataString = localStorage.getItem("myData");
    const employeeInfo = dataString ? JSON.parse(dataString) : [];
    setEmployeeName(employeeInfo[0].firstName);
    setEmployeeID(employeeInfo[0].EmployeeID);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyDate && inTime && outTime) {
      // Find the selected admin using the adminID
      const selectedAdmin = adminInfo.find(
        (admin) => admin.adminID === teamLead
      );

      // Extract the adminName and adminID
      let adminName = "";
      let adminID = "";
      if (selectedAdmin) {
        adminName = selectedAdmin.adminName;
        adminID = selectedAdmin.adminID;
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
        .post("http://localhost:5000/createShiftChange", shiftChangeData)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error submitting data:", error);
        });
    } else {
      console.log("Condition not met", { applyDate, inTime, outTime });
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <div className="add-div">
        <p className="add-heading">Shift Change Form</p>
        <form onSubmit={handleSubmit}>
          <label className="add-label" style={{ display: "block", marginBottom: "10px" }}>
            Name<span style={{ color: "red" }}>*</span>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              required
              style={{ width: "100%", padding: "5px", marginBottom: "15px" }}
            />
          </label>

          <label className="add-label" style={{ display: "block", marginBottom: "10px" }}>
            Apply Date<span style={{ color: "red" }}>*</span>
            <input
              type="date"
              value={applyDate}
              onChange={(e) => setApplyDate(e.target.value)}
              required
              style={{ width: "100%", padding: "5px", marginBottom: "15px" }}
            />
          </label>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "95%",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label className="add-label" style={{ marginBottom: "10px" }}>
                In Time<span style={{ color: "red" }}>*</span>
                <input
                  type="time"
                  value={inTime}
                  onChange={(e) => setInTime(e.target.value)}
                  required
                  style={{ width: "100%", padding: "5px", marginBottom: "15px" }}
                />
              </label>
              <label className="add-label" style={{ marginBottom: "10px" }}>
                Out Time<span style={{ color: "red" }}>*</span>
                <input
                  type="time"
                  value={outTime}
                  onChange={(e) => setOutTime(e.target.value)}
                  required
                  style={{ width: "100%", padding: "5px", marginBottom: "15px" }}
                />
              </label>
            </div>
          </div>
          <label className="add-label" style={{ display: "block", marginBottom: "10px" }}>
            Reason for Shift Change<span style={{ color: "red" }}>*</span>
            <textarea
              value={shiftChangeReason}
              onChange={(e) => setShiftChangeReason(e.target.value)}
              required
              style={{ width: "100%", padding: "5px", marginBottom: "15px" }}
            />
          </label>

          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label className="add-label">
              Team Lead:
              <select
                className="form-control"
                style={{
                  width: "100%",
                  display: "block",
                  padding: "5px",
                  marginBottom: "15px",
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              className="submit-btn"
              type="submit"
              style={{
                backgroundColor: "#4CAF50",
                border: "none",
                color: "white",
                textAlign: "center",
                textDecoration: "none",
                display: "inline-block",
                fontSize: "16px",
                padding: "10px 24px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShiftChangeFormComp;
