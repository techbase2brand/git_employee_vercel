import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Badge, Button, Menu, Modal } from "antd";
import {
  DashboardOutlined,
  TableOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { io } from "socket.io-client";
import axios from "axios";
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

interface Task {
  TermID: number;
  term: string;
  currdate: string;
  date: string;
}
const AppMenu = () => {
  const info = JSON.parse(localStorage.getItem("myData") || "{}");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notif, setNotif] = useState();
  const [termsAndConditions, setTermsAndConditions] = useState<any[]>([]);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const storedData = localStorage.getItem("myData");
  const myData = storedData ? JSON.parse(storedData) : null;
  const jsonData = JSON.stringify(notif)
  const Navigate = useNavigate();
  const handleLeaveFormClick = (e: any) => {
    e.preventDefault();
    setShowTermsModal(true)
  };

  const onOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  useEffect(() => {
    axios
      .get<Task[]>(`${process.env.REACT_APP_API_BASE_URL}/get/addTermCondition`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {

        setTermsAndConditions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleAcceptTerms = () => {
    setShowTermsModal(false);
    Navigate("/LeaveForm")
  };


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

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/get/notification`,)
      .then((response) => {
        console.log("response");
        setNotif(response.data)
      })
      .catch((error) => {
        console.error('Error while marking notification as visited:', error);
      });
  }, [])

  const getVisitedNotificationObjects = () => {
    const visitedNotifications = jsonData;
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

  // const SaleInfoNotifications = typedNotifications.filter(notification =>
  //   notification.type === 'sale' &&
  //   !getVisitedNotificationObjects().some((obj: { notificationId: number; employeeID: string; }) =>
  //     obj.notificationId === notification.id &&
  //     obj.employeeID === notification.employeeID)
  // ).length;

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
  const desiredIndex = 0;
  return (
    <Menu mode="inline" openKeys={openKeys}
      onOpenChange={onOpenChange}>
      <Modal
        title="Terms and Conditions"
        centered
        width={1200}
        visible={showTermsModal}
        footer={[
          <Button key="back" onClick={() => setShowTermsModal(false)}>
            Decline
          </Button>,
          <Button key="submit" type="primary" onClick={handleAcceptTerms}>
            Accept
          </Button>
        ]}
      >
        {termsAndConditions
          .filter((item, index) => index === desiredIndex)
          .map((item) => (
            <div key={item.TermID}>
              <div dangerouslySetInnerHTML={{ __html: item.term }} />
              <p>{item.date}</p>
            </div>
          ))}
      </Modal>
      {info.jobPosition == "Project Manager" && (
        <>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.SubMenu key="dailytask" icon={<TableOutlined rev={undefined} />} title="Daily Task">
            <Menu.Item key="ClientSheet" icon={<TableOutlined />}>
              <Link to="/ClientSheet">Assign TL Task</Link>
            </Menu.Item>
            <Menu.Item key="ViewClientSheet" icon={<TableOutlined />}>
              <Link to="/ViewClientSheet">View TL Task</Link>
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
          </Menu.SubMenu>
          <Menu.SubMenu key="Reports" icon={<TableOutlined rev={undefined} />} title="Reports">
            <Menu.Item
              key="AboutProject"
              icon={<TableOutlined rev={undefined} />}
            >
              <Link to="/AboutProject">Projects Report</Link>
            </Menu.Item>
            <Menu.Item key="LeaveForm" icon={<ScheduleOutlined />}>
              <Link to="/LeaveForm" onClick={handleLeaveFormClick}>LeaveForm</Link>
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
          </Menu.SubMenu>
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

      {info.jobPosition == "Managing Director" && (
        <>
          <Menu.Item
            key="dashboard"
            icon={<DashboardOutlined rev={undefined} />}
          >
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.SubMenu key="dailytask" icon={<TableOutlined rev={undefined} />} title="Daily Task">
            <Menu.Item key="ClientSheet" icon={<TableOutlined />}>
              <Link to="/ClientSheet">Assign TL Task</Link>
            </Menu.Item>
            <Menu.Item key="ViewClientSheet" icon={<TableOutlined />}>
              <Link to="/ViewClientSheet">View TL Task</Link>
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
          </Menu.SubMenu>
          <Menu.SubMenu key="hr" icon={<TableOutlined rev={undefined} />} title="HR">
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
            <Menu.Item key="HrLeaveReport" icon={<TableOutlined />}>
              <Link to="/HrLeaveReport">HrLeaveReport </Link>
            </Menu.Item>
            <Menu.Item key="TermCondition" icon={<TableOutlined />}>
              <Link to="/TermCondition">TermCondition</Link>
            </Menu.Item>
            <Menu.Item key="ViewTermCondition" icon={<TableOutlined />}>
              <Link to="/ViewTermCondition">ViewTermCondition</Link>
            </Menu.Item>
            <Menu.Item key="LeavePage" icon={<TableOutlined rev={undefined} />}>
              <Link to="/LeavePage">LeavePage for approval <Badge count={countLeaveNotifications}>
              </Badge></Link>
            </Menu.Item>
            <Menu.Item key="HRshiftChangeSection" icon={<TableOutlined />}>
              <Link to="/HRshiftChangeSection">ShiftChange for approval</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="manageReport" icon={<TableOutlined rev={undefined} />} title="Manage Report">
            <Menu.Item key="SalesMaster" icon={<TableOutlined />}>
              <Link to="/SalesMaster">SalesForm</Link>
            </Menu.Item>
            <Menu.Item key="ViewSalesMaster" icon={<TableOutlined />}>
              <Link to="/ViewSalesMaster">ViewSalesData</Link>
            </Menu.Item>
          </Menu.SubMenu>
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
            <Menu.Item key="AdminSaleCampusFormList" icon={<TableOutlined />}>
              <Link to="/AdminSaleCampusFormList">AdminSaleCampusFormList</Link>
            </Menu.Item>
            <Menu.Item key="AdminSaleInfotechFormList" icon={<TableOutlined />}>
              <Link to="/AdminSaleInfotechFormList">AdminSaleInfotechFormList</Link>
            </Menu.Item>
            <Menu.Item
              key="AboutProject"
              icon={<TableOutlined rev={undefined} />}
            >
              <Link to="/AboutProject">Projects Report</Link>
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
          {/* <Menu.Item key="dragAssignTable" icon={<TableOutlined />}>
            <Link to="/dragAssignTable">DragAssignTable</Link>
          </Menu.Item> */}
          <Menu.SubMenu key="infotech" icon={<TableOutlined rev={undefined} />} title="Infotech Website">
            <Menu.Item key="InfotechBlog" icon={<TableOutlined />}>
              <Link to="/InfotechBlog">InfotechBlog</Link>
            </Menu.Item>
            <Menu.Item key="InfotechTable" icon={<TableOutlined />}>
              <Link to="/InfotechTable">InfotechTable</Link>
            </Menu.Item>
            <Menu.Item key="BlogPost" icon={<TableOutlined />}>
              <Link to="/BlogPost">BlogPost</Link>
            </Menu.Item>
            <Menu.Item key="ViewBlogPost" icon={<TableOutlined />}>
              <Link to="/ViewBlogPost">ViewBlogPost</Link>
            </Menu.Item>
            <Menu.Item key="CategoryForm" icon={<TableOutlined />}>
              <Link to="/CategoryForm">CategoryForm</Link>
            </Menu.Item>
            <Menu.Item key="CategoryList" icon={<TableOutlined />}>
              <Link to="/CategoryList">CategoryList</Link>
            </Menu.Item>
            <Menu.Item key="KnowledgeCenter" icon={<TableOutlined />}>
              <Link to="/KnowledgeCenter">KnowledgeCenter</Link>
            </Menu.Item>
            <Menu.Item key="KnowledgeCenterList" icon={<TableOutlined />}>
              <Link to="/KnowledgeCenterList">KnowledgeCenterList</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="CampusBlogs" icon={<TableOutlined rev={undefined} />} title="Campus Website">
            <Menu.Item key="CampusBlogs" icon={<TableOutlined />}>
              <Link to="/CampusBlogs">CampusBlogs</Link>
            </Menu.Item>
            <Menu.Item key="CampusBlogList" icon={<TableOutlined />}>
              <Link to="/CampusBlogList">CampusBlogList</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="Contactus" icon={<TableOutlined />}>
          <Link to="/Contactus">Contact Us</Link>
          </Menu.Item>
          <Menu.Item key="RequestQuote" icon={<TableOutlined />}>
          <Link to="/RequestQuote">Request Quote</Link>
          </Menu.Item>
          <Menu.Item key="ApplyJobs" icon={<TableOutlined />}>
          <Link to="/ApplyJobs">Apply Jobs</Link>
          </Menu.Item>
          {/* <Menu.Item key="salecampusformlist" icon={<TableOutlined />}>
         <Link to="/salecampusformlist">Sale Campus List</Link>
       </Menu.Item> */}
        </>
      )}

      {info.jobPosition == "BDE Campus" && (
        <>
          <Menu.SubMenu key="dailytask" icon={<TableOutlined rev={undefined} />} title="Daily Task">
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
          </Menu.SubMenu>
          <Menu.Item key="LeaveForm" icon={<ScheduleOutlined />}>
            <Link to="/LeaveForm" onClick={handleLeaveFormClick}>LeaveForm</Link>
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

      {info.jobPosition == "BDE" && (
        <>
          <Menu.SubMenu key="dailytask" icon={<TableOutlined rev={undefined} />} title="Daily Task">
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
          </Menu.SubMenu>
          <Menu.Item key="LeaveForm" icon={<ScheduleOutlined />}>
            <Link to="/LeaveForm" onClick={handleLeaveFormClick}>LeaveForm</Link>
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

      {info.jobPosition == "Employee" && (
        <>
          {info.EmployeeID === "B2B00012" &&
            <Menu.Item
              key="dashboard"
              icon={<DashboardOutlined rev={undefined} />}
            >
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
          }
          <Menu.SubMenu key="dailytask" icon={<TableOutlined rev={undefined} />} title="Daily Task">
            {myData.EmployeeID === "B2B00033" &&
              <>
                <Menu.Item key="ClientSheet" icon={<TableOutlined />}>
                  <Link to="/ClientSheet">Assign TL Task</Link>
                </Menu.Item>
                <Menu.Item key="ViewClientSheet" icon={<TableOutlined />}>
                  <Link to="/ViewClientSheet">View TL Task</Link>
                </Menu.Item>
              </>
            }
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
          </Menu.SubMenu>
          <Menu.Item key="LeaveForm" icon={<ScheduleOutlined />}>
            <Link to="/LeaveForm" onClick={handleLeaveFormClick}>LeaveForm</Link>
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
          <Menu.SubMenu key="Blogs" icon={<TableOutlined rev={undefined} />} title="Blogs">
            <Menu.Item key="BlogPost" icon={<TableOutlined />}>
              <Link to="/BlogPost">BlogPost</Link>
            </Menu.Item>
            <Menu.Item key="ViewBlogPost" icon={<TableOutlined />}>
              <Link to="/ViewBlogPost">ViewBlogPost</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="InfotechBlogs" icon={<TableOutlined rev={undefined} />} title="Infotech-Blogs">
            <Menu.Item key="InfotechBlog" icon={<TableOutlined />}>
              <Link to="/InfotechBlog">InfotechBlog</Link>
            </Menu.Item>
            <Menu.Item key="InfotechTable" icon={<TableOutlined />}>
              <Link to="/InfotechTable">InfotechTable</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="CampusBlogs" icon={<TableOutlined rev={undefined} />} title="Campus-Blogs">
            <Menu.Item key="CampusBlogs" icon={<TableOutlined />}>
              <Link to="/CampusBlogs">CampusBlogs</Link>
            </Menu.Item>
            <Menu.Item key="CampusBlogList" icon={<TableOutlined />}>
              <Link to="/CampusBlogList">CampusBlogList</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="Category" icon={<TableOutlined rev={undefined} />} title="Category-Added">
            <Menu.Item key="CategoryForm" icon={<TableOutlined />}>
              <Link to="/CategoryForm">CategoryForm</Link>
            </Menu.Item>
            <Menu.Item key="CategoryList" icon={<TableOutlined />}>
              <Link to="/CategoryList">CategoryList</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="Knowledge" icon={<TableOutlined rev={undefined} />} title="Knowledge-Center">
            <Menu.Item key="KnowledgeCenter" icon={<TableOutlined />}>
              <Link to="/KnowledgeCenter">KnowledgeCenter</Link>
            </Menu.Item>
            <Menu.Item key="KnowledgeCenterList" icon={<TableOutlined />}>
              <Link to="/KnowledgeCenterList">KnowledgeCenterList</Link>
            </Menu.Item>
          </Menu.SubMenu>
        </>
      )}

      {info.jobPosition == "Team Lead" && (
        <>
          <Menu.SubMenu key="dailytask" icon={<TableOutlined rev={undefined} />} title="Daily Task">
            <Menu.Item key="ClientSheet" icon={<TableOutlined />}>
              <Link to="/ClientSheet">Assign TL Task</Link>
            </Menu.Item>
            <Menu.Item key="ViewClientSheet" icon={<TableOutlined />}>
              <Link to="/ViewClientSheet">View TL Task</Link>
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
          </Menu.SubMenu>
          <Menu.Item key="LeaveForm" icon={<ScheduleOutlined />}>
            <Link to="/LeaveForm" onClick={handleLeaveFormClick}>LeaveForm</Link>
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

      {info.jobPosition == "QA" && (
        <>
          <Menu.SubMenu key="dailytask" icon={<TableOutlined rev={undefined} />} title="Daily Task">
            <Menu.Item key="ClientSheet" icon={<TableOutlined />}>
              <Link to="/ClientSheet">Assign TL Task</Link>
            </Menu.Item>
            <Menu.Item key="ViewClientSheet" icon={<TableOutlined />}>
              <Link to="/ViewClientSheet">View TL Task</Link>
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
          </Menu.SubMenu>
          <Menu.Item key="LeaveForm" icon={<ScheduleOutlined />}>
            <Link to="/LeaveForm" onClick={handleLeaveFormClick}>LeaveForm</Link>
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

      {info?.jobPosition == "HR" && (
        <>
          <Menu.SubMenu key="dailytask" icon={<TableOutlined rev={undefined} />} title="Daily Task">
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
          </Menu.SubMenu>
          <Menu.Item key="employee-form" icon={<DashboardOutlined />}>
            <Link to="/employee-form">Add Employee</Link>
          </Menu.Item>
          <Menu.Item key="employee-list" icon={<DashboardOutlined />}>
            <Link to="/employee-list">Employees List</Link>
          </Menu.Item>
          <Menu.Item key="LeaveForm" icon={<ScheduleOutlined />}>
            <Link to="/LeaveForm" onClick={handleLeaveFormClick}>LeaveForm</Link>
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

      {info.jobPosition == "Sales-Dashboard" && (
        <>
          <Menu.Item
            key="dashboard"
            icon={<DashboardOutlined rev={undefined} />}
          >
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.SubMenu key="dailytask" icon={<TableOutlined rev={undefined} />} title="Daily Task">
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
          </Menu.SubMenu>
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
            <Link to="/LeaveForm" onClick={handleLeaveFormClick}>LeaveForm</Link>
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
          <Menu.SubMenu key="Blogs" icon={<TableOutlined rev={undefined} />} title="Blogs">
            <Menu.Item key="BlogPost" icon={<TableOutlined />}>
              <Link to="/BlogPost">BlogPost</Link>
            </Menu.Item>
            <Menu.Item key="ViewBlogPost" icon={<TableOutlined />}>
              <Link to="/ViewBlogPost">ViewBlogPost</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="InfotechBlogs" icon={<TableOutlined rev={undefined} />} title="Infotech-Blogs">
            <Menu.Item key="InfotechBlog" icon={<TableOutlined />}>
              <Link to="/InfotechBlog">InfotechBlog</Link>
            </Menu.Item>
            <Menu.Item key="InfotechTable" icon={<TableOutlined />}>
              <Link to="/InfotechTable">InfotechTable</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="CampusBlogs" icon={<TableOutlined rev={undefined} />} title="Campus-Blogs">
            <Menu.Item key="CampusBlogs" icon={<TableOutlined />}>
              <Link to="/CampusBlogs">CampusBlogs</Link>
            </Menu.Item>
            <Menu.Item key="CampusBlogList" icon={<TableOutlined />}>
              <Link to="/CampusBlogList">CampusBlogList</Link>
            </Menu.Item>
          </Menu.SubMenu>
        </>
      )}
    </Menu>
  );
};

export default AppMenu;
