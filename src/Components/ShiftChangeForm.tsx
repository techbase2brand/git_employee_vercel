import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import Menu from "./Menu";
import Navbar from "./Navbar";
import ShiftChangeFormComp from "./ShiftChangeFormComp";

const ShiftChangeForm: React.FC = () => {
  return (
    <div className="emp-main-div">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#F7F9FF",
        }}
      >
      
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "90%",
            width: "100%",
          }}
        >
       
          <div style={{ width: "100%" }}>
            <div style={{ width: "92%", marginLeft: "4.4%", marginTop: "5%" }}>
              <ShiftChangeFormComp />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftChangeForm;
