import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import HRshiftChangeTable from "./HRshiftChangeTable";

const HRshiftChangeSection: React.FC = () => {

  return (
    <div className="emp-main-div">
      <div
        style={{ display: "flex", flexDirection: "column" }}
        className="form-container"
      >
        <p
          style={{
            color: "#094781",
            justifyContent: "flex-start",
            fontSize: "32px",
            fontWeight: "bold",
          }}
        >
          Shift Change List Approve
        </p>
        <HRshiftChangeTable
        />
      </div>
    </div>

  );
};

export default HRshiftChangeSection;
