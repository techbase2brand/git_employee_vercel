import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";

import {
  DashboardOutlined,
  TableOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";

const AppMenu = () => {
  const info = JSON.parse(localStorage.getItem("myData") || "{}");
  
  return (
    <Menu mode="inline">
      {info.jobPosition == "Project Manager" && (
        <>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item
            key="AssignTaskPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/AssignTaskPage">Assign Task </Link>
          </Menu.Item>
          <Menu.Item key="AssignedTasks" icon={<ScheduleOutlined />}>
            <Link to="/AssignedTasks">AssignedTasks</Link>
          </Menu.Item>
          <Menu.Item
            key="ViewBacklogPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/ViewBacklogPage">View Backlog Page</Link>
          </Menu.Item>
          <Menu.Item key="add-morning-task" icon={<ScheduleOutlined />}>
            <Link to="/add-morning-task">Add Morning Task</Link>
          </Menu.Item>
          <Menu.Item key="ViewMorningTask" icon={<TableOutlined />}>
            <Link to="/view-morning-task">ViewMorningTask</Link>
          </Menu.Item>
          <Menu.Item key="add-evening-task" icon={<ScheduleOutlined />}>
            <Link to="/add-evening-task">Add Evening Task</Link>
          </Menu.Item>
          <Menu.Item key="ViewEveningTask" icon={<TableOutlined />}>
            <Link to="/view-evening-task">ViewEveningTask</Link>
          </Menu.Item>
          <Menu.Item
            key="AboutProject"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/AboutProject">Projects Report</Link>
          </Menu.Item>
          <Menu.Item key="LeaveForm" icon={<ScheduleOutlined />}>
            <Link to="/LeaveForm">LeaveForm</Link>
          </Menu.Item>
          <Menu.Item key="ViewLeavePage" icon={<TableOutlined />}>
            <Link to="/ViewLeavePage">ViewLeavePage</Link>
          </Menu.Item>
          <Menu.Item key="ShiftChangeForm" icon={<TableOutlined />}>
            <Link to="/ShiftChangeForm">Shift change form</Link>
          </Menu.Item>
          <Menu.Item key="ViewShiftChange" icon={<TableOutlined />}>
            <Link to="/ViewShiftChange">View Shift change </Link>
          </Menu.Item>
          <Menu.SubMenu key="manageProject" icon={<TableOutlined rev={undefined} />} title="Manage Projects">
            <Menu.Item key="add-project" icon={<TableOutlined rev={undefined} />}>
              <Link to="/add-project">Add Project</Link>
            </Menu.Item>
            <Menu.Item key="add-phase" icon={<TableOutlined rev={undefined} />}>
              <Link to="/add-phase">Add Phase</Link>
            </Menu.Item>
            <Menu.Item key="add-module" icon={<TableOutlined rev={undefined} />}>
              <Link to="/add-module">Add Module</Link>
            </Menu.Item>
            <Menu.Item
              key="view-project"
              icon={<TableOutlined rev={undefined} />}
            >
              <Link to="/view-project">View Project</Link>
            </Menu.Item>
            <Menu.Item key="view-phase" icon={<TableOutlined rev={undefined} />}>
              <Link to="/view-phase">View Phase</Link>
            </Menu.Item>
            <Menu.Item key="view-module" icon={<TableOutlined rev={undefined} />}>
              <Link to="/view-module">View Module</Link>
            </Menu.Item>
            <Menu.Item
              key="add-PhaseAssignedTo"
              icon={<TableOutlined rev={undefined} />}
            >
              <Link to="/PhaseAssignedTo">Assign Phase</Link>
            </Menu.Item>
            <Menu.Item
              key="ViewPhaseAssign"
              icon={<TableOutlined rev={undefined} />}
            >
              <Link to="/ViewPhaseAssign">View Phase AssignedTo</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="LeavePage" icon={<TableOutlined rev={undefined} />}>
            <Link to="/LeavePage">LeavePage for approval </Link>
          </Menu.Item>
          <Menu.Item
            key="ShiftChangePage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/ShiftChangePage">ShiftChangePage for approval </Link>
          </Menu.Item>
          <Menu.Item
            key="AssignTaskPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/AssignTaskPage">Assign Task </Link>
          </Menu.Item>
          <Menu.Item
            key="ViewBacklogPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/ViewBacklogPage">View Backlog Page</Link>
          </Menu.Item>
        </>
      )}

      {info.jobPosition == "Managing Director" && (
        <>
          <Menu.Item
            key="dashboard"
            icon={<DashboardOutlined rev={undefined} />}
          >
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>

          <Menu.Item
            key="employee-form"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/employee-form">Employee Form</Link>
          </Menu.Item>
          <Menu.Item
            key="employee-list"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/employee-list">Employee List</Link>
          </Menu.Item>
          <Menu.Item
            key="AssignTaskPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/AssignTaskPage">Assign Task </Link>
          </Menu.Item>
          <Menu.Item key="AssignedTasks" icon={<ScheduleOutlined />}>
            <Link to="/AssignedTasks">AssignedTasks</Link>
          </Menu.Item>
          <Menu.Item
            key="ViewBacklogPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/ViewBacklogPage">View Backlog Page</Link>
          </Menu.Item>
          <Menu.SubMenu key="manageProject" icon={<TableOutlined rev={undefined} />} title="Manage Projects">
            <Menu.Item key="add-project" icon={<TableOutlined rev={undefined} />}>
              <Link to="/add-project">Add Project</Link>
            </Menu.Item>
            <Menu.Item key="add-phase" icon={<TableOutlined rev={undefined} />}>
              <Link to="/add-phase">Add Phase</Link>
            </Menu.Item>
            <Menu.Item key="add-module" icon={<TableOutlined rev={undefined} />}>
              <Link to="/add-module">Add Module</Link>
            </Menu.Item>
            <Menu.Item
              key="add-PhaseAssignedTo"
              icon={<TableOutlined rev={undefined} />}
            >
              <Link to="/PhaseAssignedTo">Assign Phase</Link>
            </Menu.Item>
            <Menu.Item
              key="view-project"
              icon={<TableOutlined rev={undefined} />}
            >
              <Link to="/view-project">View Project</Link>
            </Menu.Item>
            <Menu.Item key="view-phase" icon={<TableOutlined rev={undefined} />}>
              <Link to="/view-phase">View Phase</Link>
            </Menu.Item>
            <Menu.Item key="view-module" icon={<TableOutlined rev={undefined} />}>
              <Link to="/view-module">View Module</Link>
            </Menu.Item>
            <Menu.Item
              key="ViewPhaseAssign"
              icon={<TableOutlined rev={undefined} />}
            >
              <Link to="/ViewPhaseAssign">View Phase AssignedTo</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="projectReport" icon={<TableOutlined rev={undefined} />} title="Reports">
            <Menu.Item
              key="AboutProject"
              icon={<TableOutlined rev={undefined} />}
            >
              <Link to="/AboutProject">Projects Report</Link>
            </Menu.Item>
            <Menu.Item key="HrLeaveReport" icon={<TableOutlined />}>
              <Link to="/HrLeaveReport">HrLeaveReport </Link>
            </Menu.Item>
            <Menu.Item key="LeavePage" icon={<TableOutlined rev={undefined} />}>
              <Link to="/LeavePage">LeavePage for approval</Link>
            </Menu.Item>
            <Menu.Item
              key="ShiftChangePage"
              icon={<TableOutlined rev={undefined} />}
            >
              <Link to="/ShiftChangePage">ShiftChangePage</Link>
            </Menu.Item>
            {/* <Menu.Item key="salecampusformlist" icon={<TableOutlined />}>
         <Link to="/salecampusformlist">Sale Campus List</Link>
       </Menu.Item> */}

            <Menu.Item key="HRshiftChangeSection" icon={<TableOutlined />}>
              <Link to="/HRshiftChangeSection">ShiftChange for approval</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="admin" icon={<TableOutlined rev={undefined} />} title="Admin">
            <Menu.Item key="AdminSaleCampusFormList" icon={<TableOutlined />}>
              <Link to="/AdminSaleCampusFormList">AdminSaleCampusFormList</Link>
            </Menu.Item>
            <Menu.Item key="AdminSaleInfotechFormList" icon={<TableOutlined />}>
              <Link to="/AdminSaleInfotechFormList">AdminSaleInfotechFormList</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="terms" icon={<TableOutlined rev={undefined} />} title="Terms">
            <Menu.Item key="TermCondition" icon={<TableOutlined />}>
              <Link to="/TermCondition">TermCondition</Link>
            </Menu.Item>
            <Menu.Item key="ViewTermCondition" icon={<TableOutlined />}>
              <Link to="/ViewTermCondition">ViewTermCondition</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="masterProject" icon={<TableOutlined rev={undefined} />} title="Masters">

            <Menu.Item key="SalesMaster" icon={<TableOutlined />}>
              <Link to="/SalesMaster">SalesForm</Link>
            </Menu.Item>
            <Menu.Item key="ViewSalesMaster" icon={<TableOutlined />}>
              <Link to="/ViewSalesMaster">ViewSalesData</Link>
            </Menu.Item>
          </Menu.SubMenu>
        </>
      )}

      {info.jobPosition == "BDE Campus" && (
        <>
          <Menu.Item
            key="AssignTaskPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/AssignTaskPage">Assign Task </Link>
          </Menu.Item>
          <Menu.Item key="AssignedTasks" icon={<ScheduleOutlined />}>
            <Link to="/AssignedTasks">AssignedTasks</Link>
          </Menu.Item>
          <Menu.Item
            key="ViewBacklogPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/ViewBacklogPage">View Backlog Page</Link>
          </Menu.Item>
          <Menu.Item key="add-morning-task" icon={<ScheduleOutlined />}>
            <Link to="/add-morning-task">Add Morning Task</Link>
          </Menu.Item>
          <Menu.Item key="ViewMorningTask" icon={<TableOutlined />}>
            <Link to="/view-morning-task">ViewMorningTask</Link>
          </Menu.Item>
          <Menu.Item key="add-evening-task" icon={<ScheduleOutlined />}>
            <Link to="/add-evening-task">Add Evening Task</Link>
          </Menu.Item>
          <Menu.Item key="ViewEveningTask" icon={<TableOutlined />}>
            <Link to="/view-evening-task">ViewEveningTask</Link>
          </Menu.Item>
          <Menu.Item key="LeaveForm" icon={<ScheduleOutlined />}>
            <Link to="/LeaveForm">LeaveForm</Link>
          </Menu.Item>
          <Menu.Item key="ViewLeavePage" icon={<TableOutlined />}>
            <Link to="/ViewLeavePage">ViewLeavePage</Link>
          </Menu.Item>
          <Menu.Item key="ShiftChangeForm" icon={<TableOutlined />}>
            <Link to="/ShiftChangeForm">Shift change form</Link>
          </Menu.Item>
          <Menu.Item key="ViewShiftChange" icon={<TableOutlined />}>
            <Link to="/ViewShiftChange">View Shift change </Link>
          </Menu.Item>
          <Menu.Item key="salecampusform" icon={<TableOutlined />}>
            <Link to="/salecampusform">Sale Campus Form</Link>
          </Menu.Item>

          <Menu.Item key="salecampusformlist" icon={<TableOutlined />}>
            <Link to="/salecampusformlist">Sale Campus List</Link>
          </Menu.Item>
        </>
      )}

      {info.jobPosition == "BDE" && (
        <>
          <Menu.Item
            key="AssignTaskPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/AssignTaskPage">Assign Task </Link>
          </Menu.Item>
          <Menu.Item key="AssignedTasks" icon={<ScheduleOutlined />}>
            <Link to="/AssignedTasks">AssignedTasks</Link>
          </Menu.Item>
          <Menu.Item
            key="ViewBacklogPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/ViewBacklogPage">View Backlog Page</Link>
          </Menu.Item>
          <Menu.Item key="add-morning-task" icon={<ScheduleOutlined />}>
            <Link to="/add-morning-task">Add Morning Task</Link>
          </Menu.Item>
          <Menu.Item key="ViewMorningTask" icon={<TableOutlined />}>
            <Link to="/view-morning-task">ViewMorningTask</Link>
          </Menu.Item>
          <Menu.Item key="add-evening-task" icon={<ScheduleOutlined />}>
            <Link to="/add-evening-task">Add Evening Task</Link>
          </Menu.Item>
          <Menu.Item key="ViewEveningTask" icon={<TableOutlined />}>
            <Link to="/view-evening-task">ViewEveningTask</Link>
          </Menu.Item>
          <Menu.Item key="LeaveForm" icon={<ScheduleOutlined />}>
            <Link to="/LeaveForm">LeaveForm</Link>
          </Menu.Item>
          <Menu.Item key="ViewLeavePage" icon={<TableOutlined />}>
            <Link to="/ViewLeavePage">ViewLeavePage</Link>
          </Menu.Item>
          <Menu.Item key="ShiftChangeForm" icon={<TableOutlined />}>
            <Link to="/ShiftChangeForm">Shift change form</Link>
          </Menu.Item>
          <Menu.Item key="ViewShiftChange" icon={<TableOutlined />}>
            <Link to="/ViewShiftChange">View Shift change </Link>
          </Menu.Item>

          <Menu.Item key="SaleInfoForm" icon={<TableOutlined />}>
            <Link to="/SaleInfoForm">Sale Infotech Form</Link>
          </Menu.Item>

          <Menu.Item key="saleinfoformlist" icon={<TableOutlined />}>
            <Link to="/saleinfoformlist">Sale Infotech List</Link>
          </Menu.Item>
          <Menu.Item key="DocForm" icon={<TableOutlined />}>
            <Link to="/DocForm">DocForm</Link>
          </Menu.Item>
          <Menu.Item key="DocTable" icon={<TableOutlined />}>
            <Link to="/DocTable">DocTable</Link>
          </Menu.Item>
        </>
      )}

      {info.jobPosition == "Employee" && (
        <>
          <Menu.Item
            key="AssignTaskPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/AssignTaskPage">Assign Task </Link>
          </Menu.Item>
          <Menu.Item key="AssignedTasks" icon={<ScheduleOutlined />}>
            <Link to="/AssignedTasks">AssignedTasks</Link>
          </Menu.Item>
          <Menu.Item
            key="ViewBacklogPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/ViewBacklogPage">View Backlog Page</Link>
          </Menu.Item>
          <Menu.Item key="add-morning-task" icon={<ScheduleOutlined />}>
            <Link to="/add-morning-task">Add Morning Task</Link>
          </Menu.Item>
          <Menu.Item key="ViewMorningTask" icon={<TableOutlined />}>
            <Link to="/view-morning-task">ViewMorningTask</Link>
          </Menu.Item>
          <Menu.Item key="add-evening-task" icon={<ScheduleOutlined />}>
            <Link to="/add-evening-task">Add Evening Task</Link>
          </Menu.Item>
          <Menu.Item key="ViewEveningTask" icon={<TableOutlined />}>
            <Link to="/view-evening-task">ViewEveningTask</Link>
          </Menu.Item>
          <Menu.Item key="LeaveForm" icon={<ScheduleOutlined />}>
            <Link to="/LeaveForm">LeaveForm</Link>
          </Menu.Item>
          <Menu.Item key="ViewLeavePage" icon={<TableOutlined />}>
            <Link to="/ViewLeavePage">ViewLeavePage</Link>
          </Menu.Item>
          <Menu.Item key="ShiftChangeForm" icon={<TableOutlined />}>
            <Link to="/ShiftChangeForm">Shift change form</Link>
          </Menu.Item>
          <Menu.Item key="ViewShiftChange" icon={<TableOutlined />}>
            <Link to="/ViewShiftChange">View Shift change </Link>
          </Menu.Item>
        </>
      )}

      {info.jobPosition == "Team Lead" && (
        <>
          <Menu.Item
            key="AssignTaskPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/AssignTaskPage">Assign Task </Link>
          </Menu.Item>
          <Menu.Item key="AssignedTasks" icon={<ScheduleOutlined />}>
            <Link to="/AssignedTasks">AssignedTasks</Link>
          </Menu.Item>
          <Menu.Item
            key="ViewBacklogPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/ViewBacklogPage">View Backlog Page</Link>
          </Menu.Item>
          <Menu.Item key="add-morning-task" icon={<ScheduleOutlined />}>
            <Link to="/add-morning-task">Add Morning Task</Link>
          </Menu.Item>
          <Menu.Item key="ViewMorningTask" icon={<TableOutlined />}>
            <Link to="/view-morning-task">ViewMorningTask</Link>
          </Menu.Item>
          <Menu.Item key="add-evening-task" icon={<ScheduleOutlined />}>
            <Link to="/add-evening-task">Add Evening Task</Link>
          </Menu.Item>
          <Menu.Item key="ViewEveningTask" icon={<TableOutlined />}>
            <Link to="/view-evening-task">ViewEveningTask</Link>
          </Menu.Item>
          <Menu.Item key="LeaveForm" icon={<ScheduleOutlined />}>
            <Link to="/LeaveForm">LeaveForm</Link>
          </Menu.Item>
          <Menu.Item key="ViewLeavePage" icon={<TableOutlined />}>
            <Link to="/ViewLeavePage">ViewLeavePage</Link>
          </Menu.Item>
          <Menu.Item key="ShiftChangeForm" icon={<TableOutlined />}>
            <Link to="/ShiftChangeForm">Shift change form</Link>
          </Menu.Item>
          <Menu.Item key="ViewShiftChange" icon={<TableOutlined />}>
            <Link to="/ViewShiftChange">View Shift change </Link>
          </Menu.Item>
          <Menu.Item key="SaleInfoForm" icon={<TableOutlined />}>
            <Link to="/SaleInfoForm">Sale Infotech Form</Link>
          </Menu.Item>

          <Menu.Item key="saleinfoformlist" icon={<TableOutlined />}>
            <Link to="/saleinfoformlist">Sale Infotech List</Link>
          </Menu.Item>
        </>
      )}

      {info.jobPosition == "QA" && (
        <>
          <Menu.Item
            key="AssignTaskPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/AssignTaskPage">Assign Task </Link>
          </Menu.Item>
          <Menu.Item key="AssignedTasks" icon={<ScheduleOutlined />}>
            <Link to="/AssignedTasks">AssignedTasks</Link>
          </Menu.Item>
          <Menu.Item
            key="ViewBacklogPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/ViewBacklogPage">View Backlog Page</Link>
          </Menu.Item>
          <Menu.Item key="add-morning-task" icon={<ScheduleOutlined />}>
            <Link to="/add-morning-task">Add Morning Task</Link>
          </Menu.Item>
          <Menu.Item key="ViewMorningTask" icon={<TableOutlined />}>
            <Link to="/view-morning-task">ViewMorningTask</Link>
          </Menu.Item>
          <Menu.Item key="add-evening-task" icon={<ScheduleOutlined />}>
            <Link to="/add-evening-task">Add Evening Task</Link>
          </Menu.Item>
          <Menu.Item key="ViewEveningTask" icon={<TableOutlined />}>
            <Link to="/view-evening-task">ViewEveningTask</Link>
          </Menu.Item>
          <Menu.Item key="LeaveForm" icon={<ScheduleOutlined />}>
            <Link to="/LeaveForm">LeaveForm</Link>
          </Menu.Item>
          <Menu.Item key="ViewLeavePage" icon={<TableOutlined />}>
            <Link to="/ViewLeavePage">ViewLeavePage</Link>
          </Menu.Item>
          <Menu.Item key="ShiftChangeForm" icon={<TableOutlined />}>
            <Link to="/ShiftChangeForm">Shift change form</Link>
          </Menu.Item>
          <Menu.Item key="ViewShiftChange" icon={<TableOutlined />}>
            <Link to="/ViewShiftChange">View Shift change </Link>
          </Menu.Item>
        </>
      )}

      {info?.jobPosition == "HR" && (
        <>
          <Menu.Item
            key="AssignTaskPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/AssignTaskPage">Assign Task </Link>
          </Menu.Item>
          <Menu.Item key="AssignedTasks" icon={<ScheduleOutlined />}>
            <Link to="/AssignedTasks">AssignedTasks</Link>
          </Menu.Item>
          <Menu.Item
            key="ViewBacklogPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/ViewBacklogPage">View Backlog Page</Link>
          </Menu.Item>
          <Menu.Item key="employee-form" icon={<DashboardOutlined />}>
            <Link to="/employee-form">Add Employee</Link>
          </Menu.Item>
          <Menu.Item key="employee-list" icon={<DashboardOutlined />}>
            <Link to="/employee-list">Employees List</Link>
          </Menu.Item>
          <Menu.Item key="add-morning-task" icon={<ScheduleOutlined />}>
            <Link to="/add-morning-task">Add Morning Task</Link>
          </Menu.Item>
          <Menu.Item key="ViewMorningTask" icon={<TableOutlined />}>
            <Link to="/view-morning-task">ViewMorningTask</Link>
          </Menu.Item>
          <Menu.Item key="add-evening-task" icon={<ScheduleOutlined />}>
            <Link to="/add-evening-task">Add Evening Task</Link>
          </Menu.Item>
          <Menu.Item key="ViewEveningTask" icon={<TableOutlined />}>
            <Link to="/view-evening-task">ViewEveningTask</Link>
          </Menu.Item>
          <Menu.Item key="LeaveForm" icon={<ScheduleOutlined />}>
            <Link to="/LeaveForm">LeaveForm</Link>
          </Menu.Item>
          <Menu.Item key="ViewLeavePage" icon={<TableOutlined />}>
            <Link to="/ViewLeavePage">ViewLeavePage</Link>
          </Menu.Item>
          <Menu.Item key="ShiftChangeForm" icon={<TableOutlined />}>
            <Link to="/ShiftChangeForm">Shift change form</Link>
          </Menu.Item>
          <Menu.Item key="ViewShiftChange" icon={<TableOutlined />}>
            <Link to="/ViewShiftChange">View Shift change </Link>
          </Menu.Item>
          <Menu.Item key="HRsection" icon={<TableOutlined />}>
            <Link to="/HRsection">Leave for approval </Link>
          </Menu.Item>
          <Menu.Item key="HRshiftChangeSection" icon={<TableOutlined />}>
            <Link to="/HRshiftChangeSection">ShiftChange for approval</Link>
          </Menu.Item>
          <Menu.Item key="HrLeaveAutoFill" icon={<TableOutlined />}>
            <Link to="/HrLeaveAutoFill">HrLeaveAutoFill </Link>
          </Menu.Item>
          <Menu.Item key="HrLeaveReport" icon={<TableOutlined />}>
            <Link to="/HrLeaveReport">HrLeaveReport </Link>
          </Menu.Item>
        </>
      )}

{info.jobPosition == "Sales-Dashboard" && (
        <>
         <Menu.Item
            key="dashboard"
            icon={<DashboardOutlined rev={undefined} />}
          >
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          
          <Menu.Item
            key="AssignTaskPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/AssignTaskPage">Assign Task </Link>
          </Menu.Item>
          <Menu.Item key="AssignedTasks" icon={<ScheduleOutlined />}>
            <Link to="/AssignedTasks">AssignedTasks</Link>
          </Menu.Item>
          <Menu.Item
            key="ViewBacklogPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/ViewBacklogPage">View Backlog Page</Link>
          </Menu.Item>
          <Menu.Item key="add-morning-task" icon={<ScheduleOutlined />}>
            <Link to="/add-morning-task">Add Morning Task</Link>
          </Menu.Item>
          <Menu.Item key="ViewMorningTask" icon={<TableOutlined />}>
            <Link to="/view-morning-task">ViewMorningTask</Link>
          </Menu.Item>
          <Menu.Item key="add-evening-task" icon={<ScheduleOutlined />}>
            <Link to="/add-evening-task">Add Evening Task</Link>
          </Menu.Item>
          <Menu.Item key="ViewEveningTask" icon={<TableOutlined />}>
            <Link to="/view-evening-task">ViewEveningTask</Link>
          </Menu.Item>
          <Menu.Item key="LeaveForm" icon={<ScheduleOutlined />}>
            <Link to="/LeaveForm">LeaveForm</Link>
          </Menu.Item>
          <Menu.Item key="ViewLeavePage" icon={<TableOutlined />}>
            <Link to="/ViewLeavePage">ViewLeavePage</Link>
          </Menu.Item>
          <Menu.Item key="ShiftChangeForm" icon={<TableOutlined />}>
            <Link to="/ShiftChangeForm">Shift change form</Link>
          </Menu.Item>
          <Menu.Item key="ViewShiftChange" icon={<TableOutlined />}>
            <Link to="/ViewShiftChange">View Shift change </Link>
          </Menu.Item>

          <Menu.Item key="SaleInfoForm" icon={<TableOutlined />}>
            <Link to="/SaleInfoForm">Sale Infotech Form</Link>
          </Menu.Item>

          <Menu.Item key="saleinfoformlist" icon={<TableOutlined />}>
            <Link to="/saleinfoformlist">Sale Infotech List</Link>
          </Menu.Item>

        </>
      )}
    </Menu>
  );
};

export default AppMenu;
