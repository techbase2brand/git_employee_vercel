import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import HRleaveTable from "./HRleaveTable";
const HRsection: React.FC = () => {


  return (
    <div className="emp-main-div">
      <div
        style={{
          display: "flex", flexDirection: "column", width: 'auto'
        }}
        className="form-container"
      >
        <div>
          <p
            className="mrng-tas"
          >
            Leave Page Approval
          </p>
        </div>
        <HRleaveTable
        />
      </div>
    </div>

  );
};

export default HRsection;
