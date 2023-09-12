import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
  DashboardOutlined,
  TableOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";

const AppMenu = () => {
  const info  = JSON.parse(localStorage.getItem("myData") || '{}');

  return (
    <Menu mode="inline">

      {info.role !== "HR" && (
        <>
         <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
         <Link to="/dashboard">Dashboard</Link>
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
       <Menu.Item key="LeaveReports" icon={<TableOutlined />}>
         <Link to="/LeaveReports">Leave Report</Link>
       </Menu.Item>
       <Menu.Item key="ShiftChangeReport" icon={<TableOutlined />}>
         <Link to="/ShiftChangeReport">Shift Change Report</Link>
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
       <Menu.Item key="saleinfoform" icon={<TableOutlined />}>
         <Link to="/saleinfoform">Sale Info Form</Link>
       </Menu.Item>
       <Menu.Item key="saleinfoformlist" icon={<TableOutlined />}>
         <Link to="/saleinfoformlist">Sale Info List</Link>
       </Menu.Item>
       </>
      )}

      {info?.role == "HR" && (
        <>
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
        <Link to="/dashboard">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="employee-form" icon={<DashboardOutlined />}>
        <Link to="/employee-form">Add Employee</Link>
      </Menu.Item>
      <Menu.Item key="employee-list" icon={<DashboardOutlined />}>
        <Link to="/employee-list">Employees List</Link>
      </Menu.Item>

          <Menu.Item key="HRsection" icon={<TableOutlined />}>
            <Link to="/HRsection">HR leave section</Link>
          </Menu.Item>
          <Menu.Item key="HRshiftChangeSection" icon={<TableOutlined />}>
            <Link to="/HRshiftChangeSection">HRshiftChangeSection </Link>
          </Menu.Item>
          <Menu.Item key="HrLeaveAutoFill" icon={<TableOutlined />}>
            <Link to="/HrLeaveAutoFill">HrLeaveAutoFill </Link>
          </Menu.Item>
          <Menu.Item key="HrLeaveReport" icon={<TableOutlined />}>
            <Link to="/HrLeaveReport">HrLeaveReport </Link>
          </Menu.Item>
        </>
      )}

    </Menu>
  );
};

export default AppMenu;
