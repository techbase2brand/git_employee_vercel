import React from "react";
import "react-datepicker/dist/react-datepicker.css";
// import type { DatePickerProps } from "antd";
// import { DatePicker, Space, Select, Radio, Tabs, RadioChangeEvent } from "antd";
import Menu from "./Menu";
import Navbar from "./Navbar";
// import TableNavbar from "./TableNavbar";
import HRleaveTable from "./HRleaveTable";
// import axios from "axios";
// import { GlobalInfo } from "../App";
const HRsection: React.FC = () => {
  //   const handleChange = (value: string) => {
  //   console.log(`selected ${value}`);
  // };

  console.log("gggggggggg----");


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
        <div style={{ display: "flex", flexDirection: "row", height: "90%" , width:'8%'}}>
          <div className="menu-div">
            <Menu />
          </div>
          <div>
            <div style={{ width: "92%", marginTop: "5%" }}>
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
                  Leave Page
                </p>
              </div>

              <HRleaveTable

              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRsection;
