/* eslint-disable @typescript-eslint/no-empty-function */
import React, { ReactNode, createContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
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
import HrLeaveAutoFill from "./Components/HrLeaveAutoFill";
import HrLeaveReport from "./Components/HrLeaveReport";
import EmployeeForm from "./Components/EmployeeForm";
import EmployeeList from "./Components/EmployeeList";
import ShiftChangeReport from "./Components/ShiftChangeReport";
import SalecampusForm from "./Components/SalecampusForm";
import SalecampusFormList from "./Components/SalecampusFormList";
import SaleInfoForm from "./Components/SaleInfoForm";
import DocForm from "./Components/DocForm";
import BlogPost from "./Components/BlogPost";
import CampusBlogs from "./Components/CampusBlogs";
import CampusBlogList from "./Components/CampusBlogList";
import InfotechBlog from "./Components/InfotechBlog";
import DocTable from "./Components/DocTable";
import CategoryForm from "./Components/CategoryForm";
import CategoryList from "./Components/CategoryList";
import KnowledgeCenter from "./Components/KnowledgeCenter";
import KnowledgeCenterList from "./Components/KnowledgeCenterList";
import ViewBlogPost from "./Components/ViewBlogPost";
import InfotechTable from "./Components/InfotechTable";
import ViewDocumentation from "./Components/ViewDocumentation";
import SaleInfoFormList from "./Components/SaleInfoFormList";
import DragAssignTable from "./Components/DragAssignTable";
import EveningDashboard from "./Components/EveningDashboard";
import AddProject from "./Components/AddProject";
import AddPhase from "./Components/AddPhase";
import AddModule from "./Components/AddModule";
import EditAddModule from "./Components/EditAddModule";
import EditAddPhase from "./Components/EditAddPhase";
import ViewProject from "./Components/ViewProject";
import ViewPhase from "./Components/ViewPhase";
import ViewModule from "./Components/ViewModule";
import PhaseAssignedTo from "./Components/PhaseAssignedTo";
import ViewPhaseAssign from "./Components/ViewPhaseAssign";
import AboutProject from "./Components/AboutProject";
import LeavePage from "./Components/LeavePage";
import ViewClientSheet from "./Components/ViewClientSheet";
import ShiftChangePage from "./Components/ShiftChangePage";
import ClientSheet from "./Components/ClientSheet";
import AdminSaleCampusFormList from "./Components/AdminSalecampusFormList";
import AdminSaleInfotechFormList from "./Components/AdminSaleInfotechFormList";
import ViewTermCondition from "./Components/ViewTermCondition";
import ViewSalesMaster from "./Components/ViewSalesMaster";
import TermCondition from "./Components/TermCondition";
import DailyNews from "./Components/News/DailyNews";
import SalesMaster from "./Components/SalesMaster";
import AssignTaskPage from "./Components/AssignTaskPage";
import ViewBacklogPage from "./Components/ViewBacklogPage";
import AssignedTasks from "./Components/AssignedTasks";
import ChatMessagePage from "./Components/ChatMessagePage";
import ViewLead from "./Components/ViewLead";
import Navbar from "./Components/Navbar";
import Menu from "./Components/Menu";
import Contactus from "./Components/ContactUsListing";
import RequestListing from "./Components/RequestListing";
import Applyjobs from "./Components/Applyjobs";
import Appcartify from "./Components/Appcartify";
import NewDashboard from "./Components/NewDashboard";
import ViewNewsTable from "./Components/News/ViewNewsTable";

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
const token = localStorage.getItem("myToken");



const NavigationNavbar: React.FC = () => {

  const location = useLocation();
  const token = localStorage.getItem("myToken");

  return (
    <>
      {token && location.pathname !== "/" && <Navbar />}

    </>
  );
};


const NavigationMenu: React.FC = () => {

  const location = useLocation();
  const token = localStorage.getItem("myToken");

  return (
    <>

      {token && location.pathname !== "/" && <Menu />}
    </>
  );
};
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("myToken");

  if (!token) {
    alert("Please log in!");
setTimeout(()=>{
  navigate("/");
},0)


    return null;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [empObj, setEmpObj] = useState<any>();
  const [empInfo, setEmpInfo] = useState();
  const [mrngEditID, setMrngEditID] = useState();
  const [evngEditID, setEvngEditID] = useState();
  const [assignedTaskCount, setAssignedTaskCount] = useState(0);
  const info = JSON.parse(localStorage.getItem("myData") || "{}");

  // const shouldNavbarAndMenuDisplay = token && location.pathname !== "/";

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        }
      });
    }
  }, []);

//  const currentLocation = window.location.origin;
//  console.log("currentLocation",currentLocation);


  return (
    <>
      <Router>
        <GlobalInfo.Provider
          value={{
            empObj: empObj,
            setEmpObj: setEmpObj,
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
          <>
            <div style={{ height: "8%" }}>
            <NavigationNavbar />
            </div>
            <div className="menu-div">
             <NavigationMenu />
              <Routes>
                <Route path="/" element={<Login />} />
                <Route
                  path="/new-dashboard"
                  element={
                    <ProtectedRoute>
                      <NewDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ChatMessagePage"
                  element={
                    <ProtectedRoute>
                      <ChatMessagePage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/EveningDashboard"
                  element={
                    <ProtectedRoute>
                      <EveningDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-project"
                  element={
                    <ProtectedRoute>
                      <AddProject />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/AssignedTasks"
                  element={
                    <ProtectedRoute>
                      <AssignedTasks />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/AdminSaleCampusFormList"
                  element={
                    <ProtectedRoute>
                      <AdminSaleCampusFormList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/AdminSaleInfotechFormList"
                  element={
                    <ProtectedRoute>
                      <AdminSaleInfotechFormList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ViewTermCondition"
                  element={
                    <ProtectedRoute>
                      <ViewTermCondition />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ViewNewsTable"
                  element={
                    <ProtectedRoute>
                      <ViewNewsTable />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ViewSalesMaster"
                  element={
                    <ProtectedRoute>
                      <ViewSalesMaster />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/TermCondition"
                  element={
                    <ProtectedRoute>
                      <TermCondition />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dailyNews"
                  element={
                    <ProtectedRoute>
                      <DailyNews />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/SalesMaster"
                  element={
                    <ProtectedRoute>
                      <SalesMaster />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-phase"
                  element={
                    <ProtectedRoute>
                      <AddPhase />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-module"
                  element={
                    <ProtectedRoute>
                      <AddModule />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/view-project"
                  element={
                    <ProtectedRoute>
                      <ViewProject />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/LeavePage"
                  element={
                    <ProtectedRoute>
                      <LeavePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ViewClientSheet"
                  element={
                    <ProtectedRoute>
                      <ViewClientSheet />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/view-phase"
                  element={
                    <ProtectedRoute>
                      <ViewPhase />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/view-module"
                  element={
                    <ProtectedRoute>
                      <ViewModule />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/EditAddPhase"
                  element={
                    <ProtectedRoute>
                      <EditAddPhase />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/AssignTaskPage"
                  element={
                    <ProtectedRoute>
                      <AssignTaskPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ViewBacklogPage"
                  element={
                    <ProtectedRoute>
                      <ViewBacklogPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/EditAddModule"
                  element={
                    <ProtectedRoute>
                      <EditAddModule />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ShiftChangePage"
                  element={
                    <ProtectedRoute>
                      <ShiftChangePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ClientSheet"
                  element={
                    <ProtectedRoute>
                      <ClientSheet />
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
                  path="/AboutProject"
                  element={
                    <ProtectedRoute>
                      <AboutProject />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/PhaseAssignedTo"
                  element={
                    <ProtectedRoute>
                      <PhaseAssignedTo />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ViewPhaseAssign"
                  element={
                    <ProtectedRoute>
                      <ViewPhaseAssign />
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
                <Route
                  path="/salecampusform"
                  element={
                    <ProtectedRoute>
                      <SalecampusForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/salecampusformlist"
                  element={
                    <ProtectedRoute>
                      <SalecampusFormList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/saleinfoform"
                  element={
                    <ProtectedRoute>
                      <SaleInfoForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/saleInfoFormList"
                  element={
                    <ProtectedRoute>
                      <SaleInfoFormList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dragAssignTable"
                  element={
                    <ProtectedRoute>
                      <DragAssignTable />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/DocForm"
                  element={
                    <ProtectedRoute>
                      <DocForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/BlogPost"
                  element={
                    <ProtectedRoute>
                      <BlogPost />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/CampusBlogs"
                  element={
                    <ProtectedRoute>
                      <CampusBlogs />
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/Contactus"
                  element={
                    <ProtectedRoute>
                      <Contactus />
                    </ProtectedRoute>
                  }
                />
                  <Route
                  path="/RequestQuote"
                  element={
                    <ProtectedRoute>
                      <RequestListing />
                    </ProtectedRoute>
                  }
                />
                  <Route
                  path="/Applyjobs"
                  element={
                    <ProtectedRoute>
                      <Applyjobs />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/InfotechBlog"
                  element={
                    <ProtectedRoute>
                      <InfotechBlog />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/DocTable"
                  element={
                    <ProtectedRoute>
                      <DocTable />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/CategoryForm"
                  element={
                    <ProtectedRoute>
                      <CategoryForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/CategoryList"
                  element={
                    <ProtectedRoute>
                      <CategoryList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/KnowledgeCenter"
                  element={
                    <ProtectedRoute>
                      <KnowledgeCenter />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/KnowledgeCenterList"
                  element={
                    <ProtectedRoute>
                      <KnowledgeCenterList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ViewBlogPost"
                  element={
                    <ProtectedRoute>
                      <ViewBlogPost />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/CampusBlogList"
                  element={
                    <ProtectedRoute>
                      <CampusBlogList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/InfotechTable"
                  element={
                    <ProtectedRoute>
                      <InfotechTable />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ViewDocumentation"
                  element={
                    <ProtectedRoute>
                      <ViewDocumentation />
                    </ProtectedRoute>
                  }
                />
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

                  <Route
                    path="/HrLeaveReport"
                    element={
                      <ProtectedRoute>
                        <HrLeaveReport />
                      </ProtectedRoute>
                    }
                  />
                </>
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

                <Route
                  path="/ShiftChangeReport"
                  element={
                    <ProtectedRoute>
                      <ShiftChangeReport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employee-form"
                  element={
                    <ProtectedRoute>
                      <EmployeeForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employee-list"
                  element={
                    <ProtectedRoute>
                      <EmployeeList />
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/Appcartify"
                  element={
                    <ProtectedRoute>
                      <Appcartify />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </>
        </GlobalInfo.Provider>
      </Router>
    </>
  );
};

export default App;
