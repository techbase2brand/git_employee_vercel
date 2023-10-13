/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect, useContext } from "react";
import { DatePicker } from "antd";
import Menu from "./Menu";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { GlobalInfo } from "../App";
import dayjs, { Dayjs } from "dayjs";

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

const validateName = (name: string) => {
  const regex = /^[A-Z][a-z]*$/;
  return regex.test(name);
};

const validateEmail = (email: string) => {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(email);
};

const validatePhoneNumber = (phoneNumber: string) => {
  // Updated regex to allow any starting digit and a total length of at least 10 digits
  const regex = /^\d{10,}$/;
  return regex.test(phoneNumber);
};


const validateEmployeeID = (employeeID: string) => {
  const regex = /^[a-zA-Z0-9]{8}$/;
  return regex.test(employeeID);
};

const validatePassword = (password: string) => {
  // At least one lowercase letter, one uppercase letter, one numeric digit, one special character and at least 6 characters long
  const regex =
    // eslint-disable-next-line no-useless-escape
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/;
  return regex.test(password);
};

const EmployeeForm: React.FC = () => {
  const { empObj, setEmpObj } = useContext(GlobalInfo);
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<IEmployee>({
    EmpID: 0,
    firstName: "",
    lastName: "",
    jobPosition: "",
    email: "",
    phone: "",
    permanentaddress: "",
    currentAddress: "",
    dob: new Date(),
    role: "",
    parentPhone: "",
    EmployeeID: "",
    password: "",
    confirmPassword: "",
    doj: new Date(),
    bloodGroup: "",
    highestQualification: "",
  });

  const [data, setData] = useState<any>();

  const location = useLocation();


  const handleDOBChange = (date: Dayjs | null, dateString: string) => {
    if (date) {
      setEmployee({ ...employee, dob: date.toDate() });
    }
  };

  const handleDOJChange = (date: Dayjs | null, dateString: string) => {
    if (date) {
      setEmployee({ ...employee, doj: date.toDate() });
    }
  };

  useEffect(() => {
    if (location?.state?.empEditObj) {
      const empEditObj = location.state.empEditObj;
      const dob = dayjs(empEditObj.dob);
      const doj = dayjs(empEditObj.doj);

      setEmployee({ ...empEditObj, dob, doj });
    }
  }, []);

  const onChange = (date: Dayjs | null, dateString: string) => {
    console.log(date, dateString);
  };

  const handleDateChange = (date: Dayjs | null, dateString: string) => {
    if (date) {
      setEmployee({ ...employee, doj: date.toDate() });
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    let modifiedValue = value;
    if (name === "firstName" || name === "lastName") {
      modifiedValue =
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }

    setEmployee({ ...employee, [name]: modifiedValue });
  };

  <div  className="form-control">
  <select
    name="jobPosition"
    value={employee.jobPosition}
    onChange={handleInputChange}
    required
    style={{ outline: "none", border: "none" }}
  >
    <option value="" disabled>Job position </option>
    {/* <option value="Manager">Manager</option> */}
    <option value="Super Admin">Super Admin</option>
    <option value="Project Manager">Project Manager</option>
    <option value="Team Lead">Team Lead</option>
    <option value="Tech Engineer">Tech Engineer</option>
    <option value="BDE">BDE</option>
    <option value="BDE Campus">BDE Campus</option>
    <option value="QA">QA</option>
    <option value="HR">HR</option>
  </select>
</div>
  useEffect(() => {
    axios
      .get<IEmployee[]>("https://empbackend.base2brand.com/employees",{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        }
      })
      .then((response) => setData(response.data))
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log("p===========");

    event.preventDefault();

    if (!validateName(employee.firstName)) {
      alert(
        "First Name should start with a capital letter followed by lowercase letters"
      );
      return;
    }

    if (!validateName(employee.lastName)) {
      alert(
        "Last Name should start with a capital letter followed by lowercase letters"
      );
      return;
    }

    if (!validateEmail(employee.email)) {
      alert("Invalid email format");
      return;
    }

    if (!validatePhoneNumber(employee.phone)) {
      alert(
        "Invalid phone number format. It should be an Indian 10-digit phone number starting with 6-9"
      );
      return;
    }

    if (!validatePhoneNumber(employee.parentPhone)) {
      alert(
        "Invalid parent phone number format. It should be an Indian 10-digit phone number starting with 6-9"
      );
      return;
    }

    if (!validateEmployeeID(employee.EmployeeID)) {
      alert("Employee ID should be alphanumeric and 8 characters long");
      return;
    }

    if (!validatePassword(employee.password)) {
      alert(
        "Password should be at least 6 characters long, with at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"
      );
      return;
    }

    if (employee.password !== employee.confirmPassword) {
      alert("Passwords do not match");
      return;
    }



    if (location?.state?.empEditObj) {
      const data = {
        firstName: employee.firstName,
        lastName: employee.lastName,
        jobPosition: employee.jobPosition,
        email: employee.email,
        phone: employee.phone,
        permanentaddress: employee.permanentaddress,
        currentAddress: employee.currentAddress,
        dob: employee.dob,
        role: employee.role,
        doj: employee.doj,
        bloodGroup: employee.bloodGroup,
        highestQualification: employee.highestQualification,
        parentPhone: employee.parentPhone,
        EmployeeID: employee.EmployeeID,
      };



      axios
      .put(
        `https://empbackend.base2brand.com/employeeUpdate/${location?.state?.empEditObj?.EmpID}`,
        data
      ,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        }
      })
      .then((response) => {


        navigate("/employee-list");
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data);
        } else {
          console.log(error);
        }
      });

      return;
    } else {
      const data = {
        firstName: employee.firstName,
        lastName: employee.lastName,
        jobPosition: employee.jobPosition,
        email: employee.email,
        phone: employee.phone,
        permanentaddress: employee.permanentaddress,
        currentAddress: employee.currentAddress,
        dob: employee.dob,
        role: employee.role,
        doj: employee.doj,
        bloodGroup: employee.bloodGroup,
        highestQualification: employee.highestQualification,
        parentPhone: employee.parentPhone,
        EmployeeID: employee.EmployeeID,
        password: employee.password,
        confirmPassword: employee.confirmPassword,
      };

      console.log(localStorage.getItem('myToken'),'myToken');


      axios
         .post("https://empbackend.base2brand.com/create", data ,{

    headers: {
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    }
  })
  .then((response) => {
    navigate("/employee-list");
  })
  .catch((error) => {
    console.log("Error during request:", error);  // Add this line
    if (error.response && error.response.status === 400) {
      alert(error.response.data);
    } else {
      console.log(error);
    }
  });

    }
  };

  return (
    <div className="emp-main-div">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{ height: "8%" }}>
          <Navbar />
        </div>
        <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
          <div className="menu-div">
            <Menu />
          </div>
          <div className="form-container">
            <div className="form-div">
              <h2
                style={{
                  color: "#094781",
                }}
              >
                {" "}
                {location?.state?.empEditObj ? "Update new Employee" : "Add new Employee" }

              </h2>
              <form onSubmit={handleSubmit}>
                <div className="emp-div-flex">
                  <div className="form-group">
                    <label className="emp-label">First Name:</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      value={employee.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="emp-label">Last Name:</label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-control"
                      value={employee.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="emp-div-flex">
                  <div className="form-group">
                    <label className="emp-label">Job Position:</label>

                      <div  className="form-control">
                        <select
                          name="jobPosition"
                          value={employee.jobPosition}
                          onChange={handleInputChange}
                          required
                          style={{ outline: "none", border: "none" }}
                        >
                          <option value="" disabled>Job position </option>
                          {/* <option value="Manager">Manager</option> */}
                          <option value="Super Admin">Super Admin</option>
                          <option value="Project Manager">Project Manager</option>
                          <option value="Team Lead">Team Lead</option>
                          <option value="Tech Engineer">Tech Engineer</option>
                          <option value="BDE">BDE</option>
                          <option value="BDE Campus">BDE Campus</option>
                          <option value="QA">QA</option>
                          <option value="HR">HR</option>
                        </select>
                      </div>
                  </div>
                  <div className="form-group">
                    <label className="emp-label">Highest Qualification:</label>
                    <div className="form-control">
                      <select
                        name="highestQualification"
                        value={employee.highestQualification}
                        onChange={handleInputChange}
                        required
                        style={{ outline: "none", border: "none" }}
                      >
                        <option value="" disabled>Highest Qualification</option>
                        <option value="High School">High School</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Bachelor's Degree">
                          Bachelor's Degree
                        </option>
                        <option value="Master's Degree">Master's Degree</option>
                        <option value="Doctorate">Doctorate</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="emp-div-flex">
                  <div className="form-group">
                    <label className="emp-label">Email Address:</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={employee.email}
                      onChange={handleInputChange}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="form-group">
                    <label className="emp-label">Phone:</label>
                    <input
                      type="number"
                      name="phone"
                      className="form-control"
                      value={employee.phone}
                      onChange={handleInputChange}
                      required
                      min={0}
                    />
                  </div>
                </div>
                <div className="emp-div-flex">
                  <div className="form-group">
                    <label className="emp-label">Permanent Address:</label>
                    <input
                      name="permanentaddress"
                      className="form-control"
                      value={employee.permanentaddress}
                      onChange={handleInputChange}
                      required
                    ></input>
                  </div>
                  <div className="form-group">
                    <label className="emp-label">Current Address:</label>
                    <input
                      name="currentAddress"
                      className="form-control"
                      value={employee.currentAddress}
                      onChange={handleInputChange}
                      required
                    ></input>
                  </div>
                </div>
                <div className="emp-div-flex">
                <div style={{ marginTop: "8px" }}>
                  <label className="emp-label">Date of Birth:</label>
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1.69622px solid #D8D6D6",
                      borderRadius: "4.24055px",
                      width: "14.5vw",
                    }}
                  >
                    <DatePicker
                      className="form-control"
                      style={{ outline: "none", border: "none" }}
                      value={dayjs(employee.dob)}
                      onChange={handleDOBChange}
                    />
                  </div>
                </div>
                  <div className="form-group">
                    <label className="emp-label">Role:</label>
                    <div className="form-control">
                      <select
                        name="role"
                        value={employee.role}
                        onChange={handleInputChange}
                        required
                        style={{ outline: "none", border: "none" }}
                      >
                        <option value="" disabled> Role</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="Content Writer">Content Writer</option>
                        <option value="Graphic Designer">Graphic Designer</option>
                        <option value="SEO">SEO</option>
                        <option value="HR">HR</option>
                        <option value="QA">QA</option>
                        <option value="Sales">Sales</option>
                        <option value="Sales Infotech">Sales Infotech</option>
                      </select>
                    </div>
                  </div>
                </div>



                <div className="emp-div-flex">
                  <div style={{ marginTop: "8px" }}>
                    <label className="emp-label">Date of Joining:</label>
                    <div
                      style={{
                        backgroundColor: "#FFFFFF",
                        border: "1.69622px solid #D8D6D6",
                        borderRadius: "4.24055px",
                        width: "14.5vw",
                      }}
                    >
                      <DatePicker
                        className="form-control"
                        style={{ outline: "none", border: "none" }}
                        value={dayjs(employee.doj)}
                        onChange={handleDOJChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="emp-label">Blood Group:</label>
                    <div className="form-control">
                      <select
                        name="bloodGroup"
                        value={employee.bloodGroup}
                        onChange={handleInputChange}
                        required
                        style={{ outline: "none", border: "none" }}
                      >
                        <option value="">Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="emp-div-flex">
                  <div className="form-group">
                    <label className="emp-label">Parent's Phone Number:</label>
                    <input
                      type="tel"
                      name="parentPhone"
                      className="form-control"
                      value={employee.parentPhone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="emp-label">Employee ID:</label>
                    <input
                      type="text"
                      name="EmployeeID"
                      className="form-control"
                      value={employee.EmployeeID}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                {Object.keys(location?.state?.empEditObj || {}).length ===
                  0 && (
                  <div className="emp-div-flex">
                    <div className="form-group">
                      <label className="emp-label">Password:</label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={employee.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="emp-label">Confirm Password:</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control"
                        value={employee.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                )}

                <button
                  style={{
                    width: "45%",
                    height: "100%",
                    borderRadius: "5px",
                    backgroundColor: "#094781",
                    paddingRight: "10%",
                    paddingLeft: "10%",
                    color: "white",
                    textAlign: "center",
                    marginTop: "4%",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "bold",
                      width: "3vw",
                      marginLeft: "12px",
                    }}
                  >
                    {location?.state?.empEditObj ? "Update employee" : "Add employee"}
                  </p>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
