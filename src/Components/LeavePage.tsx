import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import Menu from "./Menu";
import Navbar from "./Navbar";
import LeavePageTable from "./LeavePageTable";

const LeavePage: React.FC = () => {

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
      
        <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
        
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
                  Leaves Page
                </p>
              </div>
              <LeavePageTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeavePage;
