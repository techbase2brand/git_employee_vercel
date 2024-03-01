import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import ViewPhaseassignedTable from "./ViewPhaseassignedTable";

const ViewPhaseAssign: React.FC = () => {

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
            >
              <p
                className="mrng-tas"
              >
                Phase Assigned
              </p>
              <ViewPhaseassignedTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPhaseAssign;
