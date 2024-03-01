import React, { useState, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ViewLeavepageTable from "./ViewLeavepageTable";
import { GlobalInfo } from "../App";
const ViewLeavePage: React.FC = () => {
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
          Leave Page
        </p>
        <ViewLeavepageTable />
      </div>
    </div>
  );
};

export default ViewLeavePage;
