import React, { useState, useContext } from "react";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { DatePickerProps } from "antd";
import { DatePicker, Space, Select, Radio, Tabs, RadioChangeEvent } from "antd";
// import { Select, Space } from 'antd';
import Menu from "./Menu";
import Navbar from "./Navbar";
// import EmployeeTable from "./EmployeeTable";
import TableNavbar from "./TableNavbar";
import ViewprojectTable from "./ViewProjectTable";
import axios from "axios";
import { GlobalInfo } from "../App";

const ViewProject: React.FC = () => {
  const { projEditObj, setProjEditObj } = useContext(GlobalInfo);

  return (
    <div className="emp-main-div">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          maxHeight: "100vh",
          backgroundColor: "#F7F9FF",
        }}
      >
        <div style={{ height: "8%" }}>
          <Navbar />
        </div>
        <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
          <div className="menu-div">
            <Menu />
          </div>
          <div>
            <div style={{ width: "92%", marginLeft: "4.4%", marginTop: "5%" }}>
              <div
                style={{
                  display: "flex",
                  width: "80%",
                  alignItems: "center",
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
                  Project List
                </p>
              </div>
              <ViewprojectTable
                projEditObj={projEditObj}
                setProjEditObj={setProjEditObj}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProject;
