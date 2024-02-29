import React from "react";
import Menu from "./Menu";
import Navbar from "./Navbar";
import ShiftChangeReportTable from "./ShiftChangeReportTable";

const ShiftChangeReport: React.FC = () => {
  return (
    <>
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
            }}
          >
           
            <div style={{ width: "92%", marginTop: "5%", marginLeft: "25px", marginRight: "25px" }}>
              <div
                style={{
                  display: "flex",
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
                  Shift Change Report
                </p>
              </div>

              <ShiftChangeReportTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShiftChangeReport;
