import React from "react";
import HrLeaveReportTable from "./HrLeaveReportTable";

const HrLeaveReport: React.FC = () => {
  return (
    <div className="emp-main-div">
      <div
        style={{ display: "flex", flexDirection: "column" }}
        className="form-container"
      >
        <p
           className="mrng-tas"
        >
          Leave Reports 
        </p>
        <HrLeaveReportTable />
      </div>
    </div>
  );
};

export default HrLeaveReport;
