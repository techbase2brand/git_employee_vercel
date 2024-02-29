import React, { useState, useContext } from "react";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Menu from "./Menu";
import Navbar from "./Navbar";
import EmployeeTable from "./EmployeeTable";
import { GlobalInfo } from "../App";

const EmployeeList: React.FC = () => {
  const { empObj, setEmpObj } = useContext(GlobalInfo);


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
    
        <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
      
          <div
            style={{ display: "flex", flexDirection: "column" }}
            className="form-container"
          >
            <div
              style={{
                display: "flex",
                width: "80%",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <p
                style={{
                  color: "#094781",
                  justifyContent: "flex-start",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
              >
                Employees
              </p>
            </div>
            <div style={{ width: "90%", height: "80%", marginTop: "3%" }}>
              <div className="employee-list">
                <EmployeeTable empObj={empObj} setEmpObj={setEmpObj} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
