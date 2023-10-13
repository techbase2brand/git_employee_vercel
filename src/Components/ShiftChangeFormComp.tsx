import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";



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
  // const [reason, setReason] = useState("");
  const [teamLead, setTeamLead] = useState("");
  // const [adminID, setAdminID] = useState("");
  const [adminInfo, setAdminInfo] = useState<IEmployee[]>([]);
  // const [shiftStartTime, setShiftStartTime] = useState("");
  // const [shiftEndTime, setShiftEndTime] = useState("");
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
      // Find the selected admin using the adminID
      const selectedAdmin = adminInfo.find(
        (admin) => admin.EmployeeID === teamLead
      );

      // Extract the adminName and adminID
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
      // console.log(shiftChangeData,"ffddssddggggg=========");


      axios
        .post("https://empbackend.base2brand.com/createShiftChange", shiftChangeData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("myToken")}`,
          },
        }
      )
        .then((response) => {
          console.log(response.data);
          navigate("/ViewShiftChange");
        })
        .catch((error) => {
          console.error("Error submitting data:", error);
        });
    } else {
      console.log("Condition not met", { applyDate, inTime, outTime });
    }
  };

  useEffect(() => {
    // Get the token from local storage
    const token = localStorage.getItem("myToken");

    axios
    .get<IEmployee[]>("https://empbackend.base2brand.com/employees", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {

      const arr = response?.data.filter((elem)=> elem?.role == "Manager" || elem?.role == "Super Admin")


      setAdminInfo(arr);
      console.log(response.data,"response.data of empployee");

    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });


    // axios
    //   .get<Admin[]>("https://empbackend.base2brand.com/get/admin", {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then((response) => {
    //     setAdminInfo(response.data);
    //     console.log(response.data,"response.data");

    //   })
    //   .catch((error) => {
    //     console.error("Error fetching data:", error);
    //   });
  }, [employeeID]);

  return (
    <>
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
                  <option key={admin.EmployeeID} value={admin.EmployeeID}>
                    {admin.firstName}
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
    </>
  );
};

export default ShiftChangeFormComp;
