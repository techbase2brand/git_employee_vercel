import React, { createContext,  useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./Components/Login";
// import AppMenu from "./Components/Menu";

import Dashboard from "./Components/Dashboard";

import TableNavbar from "./Components/TableNavbar";
import AddMorningTask from "./Components/AddMorningTask";
import AddEveningTask from "./Components/AddEveningTask";
import ViewMorningTask from "./Components/ViewMorningTask";
import ViewEveningTask from "./Components/ViewEveningTask";
import LeaveForm from "./Components/LeaveForm";
import ViewLeavePage from "./Components/ViewLeavePage";
import HRsection from "./Components/HRsection";
import LeaveReports from "./Components/LeaveReports";
import ShiftChangeForm from "./Components/ShiftChangeForm";
import ViewShiftChange from "./Components/ViewShiftChange";
import HRshiftChangeSection from "./Components/HRshiftChangeSection";

// import MorningTaskTable from "./Components/MorningTaskTable";

export const GlobalInfo = createContext<any>({});

export const AssignedTaskCountContext = createContext<{
  assignedTaskCount: number;
  setAssignedTaskCount: React.Dispatch<React.SetStateAction<number>>;
}>({
  assignedTaskCount: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setAssignedTaskCount: () => {},
});
const App: React.FC = () => {
  const [empInfo, setEmpInfo] = useState();
  // const [updatedempID, setupdatedEmpID] = useState("");
  const [mrngEditID, setMrngEditID] = useState();
  const [evngEditID, setEvngEditID] = useState();
  const [assignedTaskCount, setAssignedTaskCount] = useState(0);


  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const getEmpInfo = (item: any) => {
  };

  return (
    <Router>
      {/* <AppMenu /> */}
      <GlobalInfo.Provider
        value={{
          empInfo: empInfo,
          setEmpInfo: setEmpInfo,
          getEmpInfo: getEmpInfo,
          mrngEditID: mrngEditID,
          setMrngEditID: setMrngEditID,
          evngEditID: evngEditID,
          setEvngEditID: setEvngEditID,
          assignedTaskCount: assignedTaskCount,
          setAssignedTaskCount: setAssignedTaskCount,
        }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/table-navbar" element={<TableNavbar />} />
          <Route path="/add-morning-task" element={<AddMorningTask />} />
          <Route path="/add-evening-task" element={<AddEveningTask />} />
          <Route path="/view-morning-task" element={<ViewMorningTask />} />
          <Route path="/view-evening-task" element={<ViewEveningTask />} />
          <Route path="/LeaveForm" element={<LeaveForm />} />
          <Route path="/ViewLeavePage" element={<ViewLeavePage />} />
          <Route path="/HRsection" element={<HRsection />} />
          <Route path="/HRsection" element={<HRsection />} />
          <Route
            path="/HRshiftChangeSection"
            element={<HRshiftChangeSection />}
          />
          <Route path="/LeaveReports" element={<LeaveReports />} />
          <Route path="/ShiftChangeForm" element={<ShiftChangeForm />} />
          <Route path="/ViewShiftChange" element={<ViewShiftChange />} />
          {/* <Route path="/MorningTaskTable" element={<MorningTaskTable />} /> */}
        </Routes>
      </GlobalInfo.Provider>
    </Router>
  );
};

export default App;
