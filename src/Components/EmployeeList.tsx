import React, { useState, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import EmployeeTable from "./EmployeeTable";
import { GlobalInfo } from "../App";

const EmployeeList: React.FC = () => {
  const { empObj, setEmpObj } = useContext(GlobalInfo);


  return (
    <div className="emp-main-div">
      <div
        style={{ display: "flex", flexDirection: "column" }}
        className="form-container"
      >
        <p
          className="mrng-tas"
        >
          Employees
        </p>

        <EmployeeTable empObj={empObj} setEmpObj={setEmpObj} />

      </div>
    </div>
  );
};

export default EmployeeList;
