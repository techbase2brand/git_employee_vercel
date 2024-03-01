/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ViewShiftChangeTable from "./ViewShiftChangeTable";
import { GlobalInfo } from "../App";

const ViewShiftChange: React.FC = () => {
  const [editID] = useState<unknown>()
  const { setMrngEditID, } = useContext(GlobalInfo);

  if (editID) {
    setMrngEditID(editID)
  }

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
          Shift Change List
        </p>
        <ViewShiftChangeTable />
      </div>
    </div>

  );
};

export default ViewShiftChange;
