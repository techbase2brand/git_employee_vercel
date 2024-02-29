import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import Menu from "./Menu";
import Navbar from "./Navbar";
import ShiftChangePageTable from "./ShiftChangePageTable";

const ShiftChangePage: React.FC = () => {

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
        
        <div style={{ display: "flex", flexDirection: "row", height: "90%", width: '8%' }}>
          
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
                  Shift Change List
                </p>
              </div>
              <ShiftChangePageTable
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftChangePage;
