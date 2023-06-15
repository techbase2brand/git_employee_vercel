import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import Menu from "./Menu";
import Navbar from "./Navbar";
import DashboardTable from "./DashboardTable";
const Dashboard: React.FC = () => {
return (
    <div className="emp-main-div">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          maxHeight: "100vh",
          backgroundColor: "#F7F9FF",
        }}
      >
        <div style={{ height: "8%" }}>
          <Navbar />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "90%",
            width: "100%",
          }}
        >
          <div className="menu-div">
            <Menu />
          </div>
          <div style={{ width: "100%" }}>
            <div style={{ width: "92%", marginLeft: "4.4%", marginTop: "5%" }}>
              <DashboardTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
