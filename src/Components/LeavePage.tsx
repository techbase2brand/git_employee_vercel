import React from "react";
import "react-datepicker/dist/react-datepicker.css";
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
      }}
    >

      <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
        <div
          style={{ display: "flex", flexDirection: "column" }}
          className="form-container"
        >
          <p
            className="mrng-tas"
          >
                  Leaves Page
                </p>
              <LeavePageTable />
            </div>
            </div>
          </div>
        </div>
  );
};

export default LeavePage;
