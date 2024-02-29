/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Menu from "./Menu";
import Navbar from "./Navbar";
import ViewShiftChangeTable from "./ViewShiftChangeTable";
import { format } from "date-fns";
import { GlobalInfo } from "../App";

const ViewShiftChange: React.FC = () => {
  const [currentDate] = useState<Date>(new Date());
  const [editID] = useState<unknown>()
  const { setMrngEditID, } = useContext(GlobalInfo);

  if (editID) {
    setMrngEditID(editID)
  }

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
       
        <div style={{ width: "92%", display: "flex", flexDirection: "row", height: "90%" }}>
          
          <div
            style={{ display: "flex", flexDirection: "column" }}
            className="form-container"
          >
            <div
              style={{
                display: "flex",
                width: "80%",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
            </div>
            <div style={{ width: "90%", height: "80%", marginTop: "3%" }}>
              <div
                style={{
                  display: "flex",
                  width: "80%",
                  alignItems: "center",
                  justifyContent: "flex-start",
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
              <ViewShiftChangeTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewShiftChange;
