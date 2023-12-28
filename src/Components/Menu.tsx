import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Menu } from "antd";
import {
  DashboardOutlined,
  TableOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { io } from "socket.io-client";
interface BacklogTask {
  backlogTaskID: number;
  taskName: string;
  assigneeName: string;
  assigneeEmployeeID: string;
  deadlineStart: string;
  deadlineEnd: string;
  currdate: string;
  UserEmail: string;
  AssignedBy: string;
  isCompleted: boolean;
  employeeID: string;
}
interface LeaveData {
  LeaveInfoID: number;
  employeeName: string;
  startDate: Date | string;
  endDate: Date | string;
  leaveType: string;
  leaveReason: string;
  teamLead: string;
  employeeID: string;
  adminID: string;
  approvalOfTeamLead: string;
  approvalOfHR: string;
}
interface ShiftChangeData {
  ShiftChangeTableID: 0,
  employeeName: string;
  employeeID: string;
  applyDate: string;
  inTime: string;
  outTime: string;
  reason: string;
  currDate: Date;
  teamLead: string;
  adminID: string;
  approvalOfTeamLead: string;
  approvalOfHR: string;
}
interface FormData {
  id?: number;
  portalType: string;
  profileName: string;
  url: string;
  clientName: string;
  handleBy: string;
  status: string;
  statusReason: string[];
  communicationMode: string;
  communicationReason: string;
  othermode: string;
  commModeSkype: string;
  commModePhone: string;
  commModeWhatsapp: string;
  commModeEmail: string;
  commModePortal: string;
  dateData: string;
  EmployeeID: string;
  RegisterBy: string;
  commModeOther: string;
  inviteBid: string;
}
interface BaseNotification {
  id: number;
  type: "task" | "leave" | "shiftChange" | "done" | "sale" | "approving" | "deny" | "aprovedShift" | "deniedShift";
}
interface Notification {
  id: number;
  employeeID: string;
}
interface CustomNotification extends Notification {
  type: "leave" | "task" | "shiftChange" | "done" | "sale" | "approving" | "deny" | "aprovedShift" | "deniedShift";
}
interface TaskNotification extends BacklogTask, BaseNotification { }

const AppMenu = () => {
  const info = JSON.parse(localStorage.getItem("myData") || "{}");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const storedData = localStorage.getItem("myData");
  const myData = storedData ? JSON.parse(storedData) : null;

  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_API_BASE_URL}`);
    socket.on("notification", (taskData) => {
      const taskNotifications = taskData?.data
        ?.filter((item: TaskNotification) => item.employeeID === myData.EmployeeID)
        .map((item: TaskNotification) => ({
          ...item,
          type: "task",
          id: item.backlogTaskID,
        }))
        .sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
      setNotifications((prevNotifications) => {
        const newNotifications = taskNotifications?.filter(
          (newItem: { id: number }) =>
            !prevNotifications.some(
              (existingItem) => existingItem.id === newItem.id
            )
    ) || [];
        return [...newNotifications, ...prevNotifications];
      });
    });

    socket.on("leaveinfo", (leaveData) => {
      const leaveNotifications = leaveData?.data
        ?.filter((item: LeaveData) => item.adminID === myData.EmployeeID)
        .map((item: LeaveData) => ({
          ...item,
          type: "leave",
          id: item.LeaveInfoID,
        }))
        .sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
      setNotifications((prevNotifications) => {
        const newNotifications = leaveNotifications?.filter(
          (newItem: { id: number }) =>
            !prevNotifications.some(
              (existingItem) => existingItem.id === newItem.id
            )
        ) || [];

        return [...newNotifications, ...prevNotifications];
      });
    });

    socket.on("shift", (shiftData) => {
      const leaveNotifications = shiftData?.data
        ?.filter((item: ShiftChangeData) => item.adminID === myData.EmployeeID)
        .map((item: ShiftChangeData) => ({
          ...item,
          type: "shiftChange",
          id: item.ShiftChangeTableID,
        }))
        .sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
      setNotifications((prevNotifications) => {
        const newNotifications = leaveNotifications?.filter(
          (newItem: { id: number }) =>
            !prevNotifications.some(
              (existingItem) => existingItem.id === newItem.id
            )
        ) || [];

        return [...newNotifications, ...prevNotifications];
      });
    });
    socket.on("checked", (data) => {
      const taskNotificationsByEmail = data?.data
        ?.filter((item: BacklogTask) => item.UserEmail === myData.email)
        .map((item: BacklogTask) => ({
          ...item,
          type: "done",
          id: item.backlogTaskID,
        }))
        .sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
      setNotifications((prevNotifications) => {
        const newNotifications = taskNotificationsByEmail?.filter(
          (newItem: { id: number }) =>
            !prevNotifications.some(
              (existingItem) => existingItem.id === newItem.id
            )
        ) || [];
        return [...newNotifications, ...prevNotifications];
      });
    });
    socket.on("saleInfoForm", (data) => {
      const SaleNotifications = data?.data
        ?.filter((item: FormData) => myData.EmployeeID === "B2B00100")
        .map((item: FormData) => ({
          ...item,
          type: "sale",
          id: item.id,
        }))
        .sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
      setNotifications((prevNotifications) => {
        const newNotifications = SaleNotifications?.filter(
          (newItem: { id: number }) =>
            !prevNotifications.some(
              (existingItem) => existingItem.id === newItem.id
            )
        ) || [];

        return [...newNotifications, ...prevNotifications];
      });
    });
    socket.on("approvedLeave", (data) => {
      const leaveNotifications = data?.data
        ?.filter((item: LeaveData) => item.employeeID === myData?.EmployeeID)
        .map((item: LeaveData) => ({
          ...item,
          type: "approving",
          id: item.LeaveInfoID,
        }))
        .sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
      setNotifications((prevNotifications) => {
        const newNotifications = leaveNotifications?.filter(
          (newItem: { id: number }) =>
            !prevNotifications.some(
              (existingItem) => existingItem?.id === newItem?.id
            )
        ) || [];
        return [...newNotifications, ...prevNotifications];
      });
    });

    socket.on("deniedLeave", (data) => {
      const leaveNotifications = data?.data
        ?.filter((item: LeaveData) => item.employeeID === myData?.EmployeeID)
        .map((item: LeaveData) => ({
          ...item,
          type: "deny",
          id: item.LeaveInfoID,
        }))
        .sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
      setNotifications((prevNotifications) => {
        const newNotifications = leaveNotifications?.filter(
          (newItem: { id: number }) =>
            !prevNotifications.some(
              (existingItem) => existingItem?.id === newItem?.id
            )
        ) || [];
        return [...newNotifications, ...prevNotifications];
      });
    });

    socket.on("aprovedShiftLeave", (data) => {
      const leaveNotifications = data?.data
        ?.filter((item: ShiftChangeData) => item.employeeID === myData?.EmployeeID)
        .map((item: ShiftChangeData) => ({
          ...item,
          type: "aprovedShift",
          id: item.ShiftChangeTableID,
        }))
        .sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
      setNotifications((prevNotifications) => {
        const newNotifications = leaveNotifications?.filter(
          (newItem: { id: number }) =>
            !prevNotifications.some(
              (existingItem) => existingItem?.id === newItem?.id
            )
        ) || [];
        return [...newNotifications, ...prevNotifications];
      });
    });

    socket.on("deniedShiftLeave", (data) => {
      const leaveNotifications = data?.data
        ?.filter((item: ShiftChangeData) => item.employeeID === myData?.EmployeeID)
        .map((item: ShiftChangeData) => ({
          ...item,
          type: "deniedShift",
          id: item.ShiftChangeTableID,
        }))
        .sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
      setNotifications((prevNotifications) => {
        const newNotifications = leaveNotifications?.filter(
          (newItem: { id: number }) =>
            !prevNotifications.some(
              (existingItem) => existingItem?.id === newItem?.id
            )
        ) || [];
        return [...newNotifications, ...prevNotifications];
      });
    });
    return () => {
      socket.disconnect();
    }; 
  }, []);


  const getVisitedNotificationObjects = () => {
    const visitedNotifications = localStorage.getItem("visitedNotificationObjects");
    return visitedNotifications ? JSON.parse(visitedNotifications) : [];
  };

  const typedNotifications = notifications as CustomNotification[];
  
  const countLeaveNotifications = typedNotifications.filter(notification =>
    notification.type === 'leave' &&
    !getVisitedNotificationObjects().some((obj: { notificationId: number; employeeID: string; }) =>
      obj.notificationId === notification.id &&
      obj.employeeID === notification.employeeID)
  ).length;

  const countTaskNotifications = typedNotifications.filter(notification =>
    notification.type === 'task' &&
    !getVisitedNotificationObjects().some((obj: { notificationId: number; employeeID: string; }) =>
      obj.notificationId === notification.id &&
      obj.employeeID === notification.employeeID)
  ).length;
 
  const countShiftNotifications = typedNotifications.filter(notification =>
    notification.type === 'shiftChange' &&
    !getVisitedNotificationObjects().some((obj: { notificationId: number; employeeID: string; }) =>
      obj.notificationId === notification.id &&
      obj.employeeID === notification.employeeID)
  ).length;

  const CommentNotifications = typedNotifications.filter(notification =>
    notification.type === 'done' &&
    !getVisitedNotificationObjects().some((obj: { notificationId: number; employeeID: string; }) =>
      obj.notificationId === notification.id &&
      obj.employeeID === notification.employeeID)
  ).length;

  const SaleInfoNotifications = typedNotifications.filter(notification =>
    notification.type === 'sale' &&
    !getVisitedNotificationObjects().some((obj: { notificationId: number; employeeID: string; }) =>
      obj.notificationId === notification.id &&
      obj.employeeID === notification.employeeID)
  ).length;

  const LeaveApprovedNotifications = typedNotifications.filter(notification =>
    notification.type === 'approving' &&
    !getVisitedNotificationObjects().some((obj: { notificationId: number; employeeID: string; }) =>
      obj.notificationId === notification.id &&
      obj.employeeID === notification.employeeID)
  ).length;
  
  const LeaveDeniedNotifications = typedNotifications.filter(notification =>
    notification.type === 'deny' &&
    !getVisitedNotificationObjects().some((obj: { notificationId: number; employeeID: string; }) =>
      obj.notificationId === notification.id &&
      obj.employeeID === notification.employeeID)
  ).length;

  const AprovedShiftNotifications = typedNotifications.filter(notification =>
    notification.type === 'aprovedShift' &&
    !getVisitedNotificationObjects().some((obj: { notificationId: number; employeeID: string; }) =>
      obj.notificationId === notification.id &&
      obj.employeeID === notification.employeeID)
  ).length;

  const DeniedShiftNotifications = typedNotifications.filter(notification =>
    notification.type === 'deniedShift' &&
    !getVisitedNotificationObjects().some((obj: { notificationId: number; employeeID: string; }) =>
      obj.notificationId === notification.id &&
      obj.employeeID === notification.employeeID)
  ).length;
  
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
            <Link to="/AssignedTasks">AssignedTasks <Badge count={countTaskNotifications}>
            </Badge></Link>
          </Menu.Item>
          <Menu.Item
            key="ViewBacklogPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/ViewBacklogPage">View Backlog Page <Badge count={CommentNotifications}>
            </Badge></Link>
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
            <Link to="/ViewLeavePage">ViewLeavePage <Badge count={LeaveApprovedNotifications + LeaveDeniedNotifications}>
              </Badge></Link>
          </Menu.Item>
          <Menu.Item key="ShiftChangeForm" icon={<TableOutlined />}>
            <Link to="/ShiftChangeForm">Shift change form</Link>
          </Menu.Item>
          <Menu.Item key="ViewShiftChange" icon={<TableOutlined />}>
            <Link to="/ViewShiftChange">View Shift change <Badge count={AprovedShiftNotifications + DeniedShiftNotifications}>
              </Badge></Link>
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
            <Link to="/LeavePage">LeavePage for approval <Badge count={countLeaveNotifications}>
              </Badge></Link>
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
            <Link to="/ViewBacklogPage">View Backlog Page <Badge count={CommentNotifications}>
            </Badge></Link>
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
            <Link to="/AssignedTasks">AssignedTasks <Badge count={countTaskNotifications}>
            </Badge></Link>
          </Menu.Item>
          <Menu.Item
            key="ViewBacklogPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/ViewBacklogPage">View Backlog Page <Badge count={CommentNotifications}>
            </Badge></Link>
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
              <Link to="/LeavePage">LeavePage for approval <Badge count={countLeaveNotifications}>
              </Badge></Link>
            </Menu.Item>
            <Menu.Item
              key="ShiftChangePage"
              icon={<TableOutlined rev={undefined} />}
            >
              <Link to="/ShiftChangePage">ShiftChangePage <Badge count={countShiftNotifications}>
              </Badge></Link>
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
              <Link to="/AdminSaleInfotechFormList">AdminSaleInfotechFormList <Badge count={SaleInfoNotifications}>
              </Badge></Link>
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
          <Menu.SubMenu key="manageDocument" icon={<TableOutlined rev={undefined} />} title="Documentation">
            <Menu.Item key="DocForm" icon={<TableOutlined />}>
              <Link to="/DocForm">DocumentForm</Link>
            </Menu.Item>
            <Menu.Item key="DocTable" icon={<TableOutlined />}>
              <Link to="/DocTable">DocumentListing</Link>
            </Menu.Item>
            <Menu.Item key="ViewDocumentation" icon={<TableOutlined />}>
              <Link to="/ViewDocumentation">ViewDocumentation</Link>
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
            <Link to="/AssignedTasks">AssignedTasks <Badge count={countTaskNotifications}>
            </Badge></Link>
          </Menu.Item>
          <Menu.Item
            key="ViewBacklogPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/ViewBacklogPage">View Backlog Page <Badge count={CommentNotifications}>
            </Badge></Link>
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
            <Link to="/ViewLeavePage">ViewLeavePage <Badge count={LeaveApprovedNotifications + LeaveDeniedNotifications}>
              </Badge></Link>
          </Menu.Item>
          <Menu.Item key="ShiftChangeForm" icon={<TableOutlined />}>
            <Link to="/ShiftChangeForm">Shift change form</Link>
          </Menu.Item>
          <Menu.Item key="ViewShiftChange" icon={<TableOutlined />}>
            <Link to="/ViewShiftChange">View Shift change <Badge count={AprovedShiftNotifications + DeniedShiftNotifications}>
              </Badge></Link>
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
            <Link to="/AssignedTasks">AssignedTasks <Badge count={countTaskNotifications}>
            </Badge></Link>
          </Menu.Item>
          <Menu.Item
            key="ViewBacklogPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/ViewBacklogPage">View Backlog Page <Badge count={CommentNotifications}>
            </Badge></Link>
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
            <Link to="/ViewLeavePage">ViewLeavePage <Badge count={LeaveApprovedNotifications + LeaveDeniedNotifications}>
              </Badge></Link>
          </Menu.Item>
          <Menu.Item key="ShiftChangeForm" icon={<TableOutlined />}>
            <Link to="/ShiftChangeForm">Shift change form</Link>
          </Menu.Item>
          <Menu.Item key="ViewShiftChange" icon={<TableOutlined />}>
            <Link to="/ViewShiftChange">View Shift change <Badge count={AprovedShiftNotifications + DeniedShiftNotifications}>
              </Badge></Link>
          </Menu.Item>

          <Menu.Item key="SaleInfoForm" icon={<TableOutlined />}>
            <Link to="/SaleInfoForm">Sale Infotech Form</Link>
          </Menu.Item>

          <Menu.Item key="saleinfoformlist" icon={<TableOutlined />}>
            <Link to="/saleinfoformlist">Sale Infotech List</Link>
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
            <Link to="/AssignedTasks">AssignedTasks <Badge count={countTaskNotifications}>
            </Badge></Link>
          </Menu.Item>
          <Menu.Item
            key="ViewBacklogPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/ViewBacklogPage">View Backlog Page <Badge count={CommentNotifications}>
            </Badge></Link>
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
            <Link to="/ViewLeavePage">ViewLeavePage <Badge count={LeaveApprovedNotifications + LeaveDeniedNotifications}>
              </Badge></Link>
          </Menu.Item>
          <Menu.Item key="ShiftChangeForm" icon={<TableOutlined />}>
            <Link to="/ShiftChangeForm">Shift change form</Link>
          </Menu.Item>
          <Menu.Item key="ViewShiftChange" icon={<TableOutlined />}>
            <Link to="/ViewShiftChange">View Shift change <Badge count={AprovedShiftNotifications + DeniedShiftNotifications}>
              </Badge></Link>
          </Menu.Item>
          <Menu.SubMenu key="manageDocument" icon={<TableOutlined rev={undefined} />} title="Documentation">
            <Menu.Item key="DocForm" icon={<TableOutlined />}>
              <Link to="/DocForm">DocumentForm</Link>
            </Menu.Item>
            <Menu.Item key="DocTable" icon={<TableOutlined />}>
              <Link to="/DocTable">DocumentListing</Link>
            </Menu.Item>
            <Menu.Item key="ViewDocumentation" icon={<TableOutlined />}>
              <Link to="/ViewDocumentation">ViewDocumentation</Link>
            </Menu.Item>
          </Menu.SubMenu>
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
            <Link to="/AssignedTasks">AssignedTasks <Badge count={countTaskNotifications}>
            </Badge></Link>
          </Menu.Item>
          <Menu.Item
            key="ViewBacklogPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/ViewBacklogPage">View Backlog Page <Badge count={CommentNotifications}>
            </Badge></Link>
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
            <Link to="/ViewLeavePage">ViewLeavePage <Badge count={LeaveApprovedNotifications + LeaveDeniedNotifications}>
              </Badge></Link>
          </Menu.Item>
          <Menu.Item key="ShiftChangeForm" icon={<TableOutlined />}>
            <Link to="/ShiftChangeForm">Shift change form</Link>
          </Menu.Item>
          <Menu.Item key="ViewShiftChange" icon={<TableOutlined />}>
            <Link to="/ViewShiftChange">View Shift change <Badge count={AprovedShiftNotifications + DeniedShiftNotifications}>
              </Badge></Link>
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
            <Link to="/AssignedTasks">AssignedTasks <Badge count={countTaskNotifications}>
            </Badge></Link>
          </Menu.Item>
          <Menu.Item
            key="ViewBacklogPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/ViewBacklogPage">View Backlog Page <Badge count={CommentNotifications}>
            </Badge></Link>
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
            <Link to="/ViewLeavePage">ViewLeavePage <Badge count={LeaveApprovedNotifications + LeaveDeniedNotifications}>
              </Badge></Link>
          </Menu.Item>
          <Menu.Item key="ShiftChangeForm" icon={<TableOutlined />}>
            <Link to="/ShiftChangeForm">Shift change form</Link>
          </Menu.Item>
          <Menu.Item key="ViewShiftChange" icon={<TableOutlined />}>
            <Link to="/ViewShiftChange">View Shift change <Badge count={AprovedShiftNotifications + DeniedShiftNotifications}>
              </Badge></Link>
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
            <Link to="/AssignedTasks">AssignedTasks <Badge count={countTaskNotifications}>
            </Badge></Link>
          </Menu.Item>
          <Menu.Item
            key="ViewBacklogPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/ViewBacklogPage">View Backlog Page <Badge count={CommentNotifications}>
            </Badge></Link>
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
            <Link to="/ViewLeavePage">ViewLeavePage <Badge count={LeaveApprovedNotifications + LeaveDeniedNotifications}>
              </Badge></Link>
          </Menu.Item>
          <Menu.Item key="ShiftChangeForm" icon={<TableOutlined />}>
            <Link to="/ShiftChangeForm">Shift change form</Link>
          </Menu.Item>
          <Menu.Item key="ViewShiftChange" icon={<TableOutlined />}>
            <Link to="/ViewShiftChange">View Shift change <Badge count={AprovedShiftNotifications + DeniedShiftNotifications}>
              </Badge></Link>
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
            <Link to="/AssignedTasks">AssignedTasks <Badge count={countTaskNotifications}>
            </Badge></Link>
          </Menu.Item>
          <Menu.Item
            key="ViewBacklogPage"
            icon={<TableOutlined rev={undefined} />}
          >
            <Link to="/ViewBacklogPage">View Backlog Page <Badge count={CommentNotifications}>
            </Badge></Link>
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
          <Menu.Item key="LeaveForm" icon={<ScheduleOutlined />}>
            <Link to="/LeaveForm">LeaveForm</Link>
          </Menu.Item>
          <Menu.Item key="ViewLeavePage" icon={<TableOutlined />}>
            <Link to="/ViewLeavePage">ViewLeavePage <Badge count={LeaveApprovedNotifications + LeaveDeniedNotifications}>
              </Badge></Link>
          </Menu.Item>
          <Menu.Item key="ShiftChangeForm" icon={<TableOutlined />}>
            <Link to="/ShiftChangeForm">Shift change form</Link>
          </Menu.Item>
          <Menu.Item key="ViewShiftChange" icon={<TableOutlined />}>
            <Link to="/ViewShiftChange">View Shift change <Badge count={AprovedShiftNotifications + DeniedShiftNotifications}>
              </Badge></Link>
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
