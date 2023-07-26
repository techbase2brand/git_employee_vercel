/* eslint-disable @typescript-eslint/no-empty-function */
import React, { ReactNode, createContext, useState , useEffect} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./App.css";

import Login from "./Components/Login";
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
import HrLeaveAutoFill from "./Components/HrLeaveAutoFill"

export const GlobalInfo = createContext<any>({});

export const AssignedTaskCountContext = createContext<{
  assignedTaskCount: number;
  setAssignedTaskCount: React.Dispatch<React.SetStateAction<number>>;
}>({
  assignedTaskCount: 0,
  setAssignedTaskCount: () => {},
});

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("myToken");
  if (!token) {
    alert("Please log in!");
    setTimeout(() => {
      navigate("/");
    }, 0);
    return null;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [empInfo, setEmpInfo] = useState();
  const [mrngEditID, setMrngEditID] = useState();
  const [evngEditID, setEvngEditID] = useState();
  const [assignedTaskCount, setAssignedTaskCount] = useState(0);

  const info  = JSON.parse(localStorage.getItem("myData") || '{}');

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        }
      });
    }
  }, []);

  return (
    <Router>
      <GlobalInfo.Provider
        value={{
          empInfo: empInfo,
          setEmpInfo: setEmpInfo,
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
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/table-navbar"
            element={
              <ProtectedRoute>
                <TableNavbar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-morning-task"
            element={
              <ProtectedRoute>
                <AddMorningTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-evening-task"
            element={
              <ProtectedRoute>
                <AddEveningTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-morning-task"
            element={
              <ProtectedRoute>
                <ViewMorningTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-evening-task"
            element={
              <ProtectedRoute>
                <ViewEveningTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/LeaveForm"
            element={
              <ProtectedRoute>
                <LeaveForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ViewLeavePage"
            element={
              <ProtectedRoute>
                <ViewLeavePage />
              </ProtectedRoute>
            }
          />
          {info?.role === 'HR' &&
            <>
              <Route
                path="/HRsection"
                element={
                  <ProtectedRoute>
                    <HRsection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/HRshiftChangeSection"
                element={
                  <ProtectedRoute>
                    <HRshiftChangeSection />
                  </ProtectedRoute>
                }
              />
               <Route
                path="/HrLeaveAutoFill"
                element={
                  <ProtectedRoute>
                    <HrLeaveAutoFill />
                  </ProtectedRoute>
                }
              />
            </>
          }
          <Route
            path="/LeaveReports"
            element={
              <ProtectedRoute>
                <LeaveReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ShiftChangeForm"
            element={
              <ProtectedRoute>
                <ShiftChangeForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ViewShiftChange"
            element={
              <ProtectedRoute>
                <ViewShiftChange />
              </ProtectedRoute>
            }
          />
        </Routes>
      </GlobalInfo.Provider>
    </Router>
  );
};

export default App;
