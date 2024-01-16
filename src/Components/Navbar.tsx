/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect, useContext, useCallback } from "react";
import {
  Input,
  Layout,
  Avatar,
  Badge,
  Popover,
  List,
  Button,
  // notification,
} from "antd";
import {
  SearchOutlined, BellOutlined, UserOutlined, MessageOutlined,
  PhoneOutlined, CloseOutlined, PoweroffOutlined
} from "@ant-design/icons";
import { AssignedTaskCountContext } from "../App";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const { Header } = Layout;
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
// interface FormData {
//   id?: number;
//   portalType: string;
//   profileName: string;
//   url: string;
//   clientName: string;
//   handleBy: string;
//   status: string;
//   statusReason: string[];
//   communicationMode: string;
//   communicationReason: string;
//   othermode: string;
//   commModeSkype: string;
//   commModePhone: string;
//   commModeWhatsapp: string;
//   commModeEmail: string;
//   commModePortal: string;
//   dateData: string;
//   EmployeeID: string;
//   RegisterBy: string;
//   commModeOther: string;
//   inviteBid: string;
// }

interface BaseNotification {
  id: number; // Common identifier for all notificationss
  type: "task" | "leave" | "done" | "approving" | "deny" | "shiftChange" | "aprovedShift" | "deniedShift" | "sale";
}

// Extending the specific notification types to include common properties
interface TaskNotification extends BacklogTask, BaseNotification { }
interface LeaveNotification extends LeaveData, BaseNotification { }
interface shiftNotification extends ShiftChangeData, BaseNotification { }

type Notification = TaskNotification | LeaveNotification | shiftNotification;

const Navbar: React.FunctionComponent = () => {

  const [newTaskAssignedWhileHidden, setNewTaskAssignedWhileHidden] = useState(false);
  const [notif, setNotif] = useState();
  const [state, setState] = useState(false);
  const [notificationss, setNotificationss] = useState<BacklogTask[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { assignedTaskCount, setAssignedTaskCount } = useContext(
    AssignedTaskCountContext
  );

  const jsonData = JSON.stringify(notif)
  const storedData = localStorage.getItem("myData");
  const myData = storedData ? JSON.parse(storedData) : null;

  const myDataString = localStorage.getItem('myData');
  let rolled = "";
  if (myDataString) {
    const myData = JSON.parse(myDataString);
    rolled = myData.email;
  }

  const myDataStatus = jsonData;
  if (myDataStatus) {
    try {
      const notificationObjects = JSON.parse(myDataStatus) as { notificationId: number; employeeID: string }[];
      const notificationIds = notificationObjects.map(obj => obj.notificationId);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }

  const navigate = useNavigate();
  const updateNotificationCount = () => {
    // setNotificationCount(notificationss.length);
  };

  // Call updateNotificationCount() whenever you update the notificationss state
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      return;
    }
    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const showDesktopNotification = (
    title: string,
    onClick?: () => void,
    options?: Omit<NotificationOptions, "onclick">
  ) => {
    if (Notification.permission === "granted") {
      const notification = new Notification("Test Title", {
        body: "Test Body",
        icon: "path/to/your/icon.png",
      });


      if (onClick) {
        notification.onclick = onClick;
      }
    } else {
      console.log("Notification permission is not granted.");
    }
  };

  // const handleTaskAssigned = useCallback(
  //   (assigneeEmployeeID: string) => {
  //     if (myData && myData[0] && myData[0].EmployeeID === assigneeEmployeeID) {
  //       setAssignedTaskCount((prevCount) => prevCount + 1);

  //       // Fetch all tasks.
  //       axios.get<BacklogTask[]>(`${process.env.REACT_APP_API_BASE_URL}/get/BacklogTasks`)
  //         .then(response => {
  //           // Filter the tasks assigned to the current user.
  //           const newTasks = response.data.filter(task => task.assigneeEmployeeID === assigneeEmployeeID);
  //      console.log(newTasks,"newTasks ");
  //      console.log(response.data[0].assigneeEmployeeID,"response.data[0].assigneeEmployeeID");
  //      console.log(assigneeEmployeeID,"assigneeEmployeeID");
  //      console.log(notificationss);



  //           // Add the new tasks to notificationss.
  //           setNotificationss((prevNotifications) => [...prevNotifications, ...newTasks]);
  //         })
  //         .catch(error => {
  //           console.error('Error fetching tasks:', error);
  //         });
  //     }
  //   },
  //   [assignedTaskCount, myData]
  // );


  const handleTaskAssigned = useCallback(
    (assigneeEmployeeID: unknown) => {

      if (myData && myData?.EmployeeID === assigneeEmployeeID) {
        setAssignedTaskCount((prevCount) => prevCount + 1);
      }
    },
    [assignedTaskCount]
  );


  const handleVisibilityChange = () => {
    if (document.hidden && newTaskAssignedWhileHidden) {
      showDesktopNotification(
        "New task assigned!",
        () => {
          navigate("/dashboard"); // Replace "/your-page-path" with the actual path
        },
        {
          body: "Click to open the dashboard.",
          icon: "path/to/your/icon.png",
        }
      );
      setNewTaskAssignedWhileHidden(false);
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [newTaskAssignedWhileHidden]);

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
    socket.on("checked", (data) => {
      const taskNotificationsByEmail = data?.data
        ?.filter((item: TaskNotification) => item?.UserEmail === myData?.email)
        .map((item: TaskNotification) => ({
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

    socket.on("approvedLeave", (data) => {
      const leaveNotifications = data?.data
        ?.filter((item: LeaveNotification) => item.employeeID === myData?.EmployeeID)
        .map((item: LeaveNotification) => ({
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
        ?.filter((item: LeaveNotification) => item.employeeID === myData?.EmployeeID)
        .map((item: LeaveNotification) => ({
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

    socket.on("shift", (shiftData) => {
      const leaveNotifications = shiftData?.data
        ?.filter((item: shiftNotification) => item.adminID === myData.EmployeeID)
        .map((item: shiftNotification) => ({
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

    socket.on("aprovedShiftLeave", (data) => {
      const leaveNotifications = data?.data
        ?.filter((item: shiftNotification) => item.employeeID === myData?.EmployeeID)
        .map((item: shiftNotification) => ({
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
        ?.filter((item: shiftNotification) => item.employeeID === myData?.EmployeeID)
        .map((item: shiftNotification) => ({
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

    // socket.on("saleInfoForm", (data) => {
    //   console.log("data?.data",data?.data);
    //   const SaleNotifications = data?.data
    //     ?.filter((item: FormData) => myData.EmployeeID === "B2B00100")
    //     .map((item: FormData) => ({
    //       ...item,
    //       type: "sale",
    //       id: item.id,
    //     }))
    //     .sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
    //   setNotifications((prevNotifications) => {
    //     const newNotifications = SaleNotifications?.filter(
    //       (newItem: { id: number }) =>
    //         !prevNotifications.some(
    //           (existingItem) => existingItem.id === newItem.id
    //         )
    //     ) || [];

    //     return [...newNotifications, ...prevNotifications];
    //   });
    // });

    socket.on('notification', (data) => {
      const visitedNotificationIds = getVisitedNotificationIds();

      const filteredData = data?.data?.filter(
        (item: { backlogTaskID: any; employeeID: any; }) => !visitedNotificationIds.includes(item.backlogTaskID) && item.employeeID === myData.EmployeeID

      );
      const sortedData = filteredData.sort(
        (a: { backlogTaskID: any; }, b: { backlogTaskID: any; }) => Number(b.backlogTaskID) - Number(a.backlogTaskID)
      );

      setNotificationss(sortedData);
      updateNotificationCount(); // Update the notification count
    })

    socket.on("taskAssigned", handleTaskAssigned);

    return () => {
      socket.off("taskAssigned", handleTaskAssigned);
      socket.disconnect();
    };
  }, [handleTaskAssigned, myData.EmployeeID]);

  const getVisitedNotificationObjects = () => {
    const visitedNotifications = jsonData;
    return visitedNotifications ? JSON.parse(visitedNotifications) : [];
  };


  // const markNotificationAsVisited = (notification: Notification) => {
  //   const visitedNotificationObjects = getVisitedNotificationObjects();
  //   const notificationObject = {
  //     notificationId: notification.id,
  //     employeeID: notification.employeeID,
  //   };
  //   if (!visitedNotificationObjects.some((obj: { notificationId: number; employeeID: string; }) =>
  //     obj.notificationId === notificationObject.notificationId &&
  //     obj.employeeID === notificationObject.employeeID)) {
  //     visitedNotificationObjects.push(notificationObject);
  //     localStorage.setItem(
  //       "visitedNotificationObjects",
  //       JSON.stringify(visitedNotificationObjects)
  //     );
  //   }
  // };
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/get/notification`,)
      .then((response) => {
        setNotif(response.data)
      })
      .catch((error) => {
        console.error('Error while marking notification as visited:', error);
      });
  }, [])
  const markNotificationAsVisited = (notification: Notification) => {
    const notificationObject = {
      notificationId: notification.id,
      employeeID: notification.employeeID,
    };

    axios.post(`${process.env.REACT_APP_API_BASE_URL}/user/notification`, { notificationObject })
      .then((response) => {
        setState(true)
      })
      .catch((error) => {
        console.error('Error while marking notification as visited:', error);
      });
  };

  const getVisitedNotificationIds = () => {
    const visitedNotifications = localStorage.getItem("visitedNotificationIds");
    return visitedNotifications ? JSON.parse(visitedNotifications) : [];
  };
  // const markNotificationAsVisited = (notificationId: number) => {
  //   const visitedNotificationIds = getVisitedNotificationIds();
  //   visitedNotificationIds.push(notificationId);
  //   localStorage.setItem(
  //     "visitedNotificationIds",
  //     JSON.stringify(visitedNotificationIds)
  //   );
  // };
  // useEffect(() => {
  //     axios
  //       .get<BacklogTask[]>(`${process.env.REACT_APP_API_BASE_URL}/get/BacklogTasks`,{
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("myToken")}`,
  //         },

  //       })
  //       .then((response) => {
  //         const visitedNotificationIds = getVisitedNotificationIds();
  //         const filteredData = response?.data?.filter(
  //           (item) => !visitedNotificationIds.includes(item.backlogTaskID) && item.employeeID === myData.EmployeeID

  //         );
  //         const sortedData = filteredData.sort(
  //           (a, b) => Number(b.backlogTaskID) - Number(a.backlogTaskID)
  //         );

  //         setNotificationss(sortedData);
  //         updateNotificationCount(); // Update the notification count
  //       })
  //       .catch((error) => {
  //         console.log(localStorage.getItem("myToken"),"mmmyyyy tokennnn");

  //         // console.error("Error fetching data:", error);
  //         // console.log("Error details:", error.response);
  //       });
  //   }, []);

  const listStyle = {
    padding: "10px",
    backgroundColor: "#f5f5f5",
    borderRadius: "5px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    width: "20vw",
    maxHeight: "36em",
    overflow: "auto",
  };

  const listItemStyle = {
    padding: "10px",
    backgroundColor: "#ffffff",
    borderRadius: "5px",
    marginBottom: "10px",
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    width: "18vw",
  };

  const getShortTaskDescription = (taskName: string) => {
    const words = taskName.split(' ');
    const maxWords = 5;
    const truncatedWords = words.slice(0, maxWords);
    return truncatedWords.join(' ');
  };
  const isTaskNotification = (
    notification: Notification
  ): notification is TaskNotification => {
    return notification.type === "task";
  };
  const notificationList = (
    <List
      itemLayout="horizontal"
      dataSource={notifications.filter(notification =>
        !getVisitedNotificationObjects().some((obj: { notificationId: number; employeeID: string; }) =>
          obj?.notificationId === notification?.id &&
          obj?.employeeID === notification?.employeeID))}
      renderItem={(item) => {
        let title;
        let isLeaveNotification = false;

        // if (isTaskNotification(item)) {
        //   console.log("item", item)
        //   title = `A new task assigned by ${item.AssignedBy}: ${getShortTaskDescription(item.taskName)}`;
        // } else {
        //   { item?.type === "done" ? title = `Comment Updated` : title = `Leave request from ${item.employeeName}` }
        //   {item?.type==='approving' ? title = `approved` :""}
        //   isLeaveNotification = true;
        // }
        if (isTaskNotification(item)) {
          title = `A new task assigned by ${item.AssignedBy}: project Name ${getShortTaskDescription(item.taskName)}`;
        } else {
          if (item?.type === "done") {
            if ('assigneeName' in item && 'comment' in item && 'clientName' in item) {
              title = `Comment Updated by ${item.assigneeName} : ${item.comment} clientName ${item.clientName}`;
            }
          }
          else if (item?.type === "sale") {
            if ('RegisterBy' in item && 'clientName' in item) {
              title = `SaleInfotech filled by ${item.RegisterBy} : ${item.clientName}`;
            }
          }
          else if (item?.type === 'approving') {
            title = `Leave request approved by ${item.teamLead}`;
          } else if (item?.type === 'deny') {
            title = `Leave request Denied by ${item.teamLead}`;
          } else if (item?.type === 'shiftChange') {
            if ('employeeName' in item && 'reason' in item) {
              title = `Shift Changed  by ${item.employeeName}: ${item.reason}`;
            }
          } else if (item?.type === 'aprovedShift') {
            title = `Approved Shift by ${item.teamLead}`;
          } else if (item?.type === 'deniedShift') {
            title = `Denied Shift by ${item.teamLead}`;
          } else {
            if (`employeeName` in item && `leaveReason` in item) {
              title = `Leave request from ${item.employeeName}: ${item.leaveReason}`;
            }
          }
          isLeaveNotification = true;
        }


        const handleItemClick = () => {
          markNotificationAsVisited(item);
          setNotifications((prevNotifications) =>
            prevNotifications.filter(
              (notification) => notification.id !== item.id
            )
          );
          if (item?.type === "leave") {
            navigate("/LeavePage");
          } else {
            { item?.type === "done" ? navigate("/ViewBacklogPage") : navigate("/AssignedTasks") }
            { item?.type === 'approving' && navigate("/ViewLeavePage") }
            { item?.type === 'deny' && navigate("/ViewLeavePage") }
            { item?.type === 'shiftChange' && navigate("/ShiftChangePage") }
            { item?.type === 'aprovedShift' && navigate("/ViewShiftChange") }
            { item?.type === 'deniedShift' && navigate("/ViewShiftChange") }
            { item?.type === 'sale' && navigate("/AdminSaleInfotechFormList") }
          }
        };

        return (
          <List.Item
            key={item.id}
            onClick={handleItemClick}
            style={listItemStyle}
          >
            <List.Item.Meta title={title} />
            <CloseOutlined
              onClick={(e) => {
                e.stopPropagation();
                markNotificationAsVisited(item);
                setNotifications((prevNotifications) =>
                  prevNotifications.filter(
                    (notification) => notification.id !== item.id
                  )
                );
              }}
            />
          </List.Item>
        );
      }}
      style={listStyle}
    />

  );
  const unvisitedNotificationCount = notifications.filter(notification =>
    !getVisitedNotificationObjects().some((obj: { notificationId: number; employeeID: string; }) =>
      obj.notificationId === notification.id &&
      obj.employeeID === notification.employeeID)).length;

  const badgeContent = unvisitedNotificationCount > 9 ? '9+' : unvisitedNotificationCount;

  const logout = () => {
    if (window.confirm('Do you really want to logout?')) {
      localStorage.removeItem("myToken");
      navigate("/");
    }
  };
  useEffect(() => {
    const hideMenuButton = document.getElementById("hideMenuButton");
    const menuDivs = document.querySelectorAll(".menu-div");

    if (hideMenuButton) {
      hideMenuButton.addEventListener("click", function () {
        menuDivs.forEach(function (menuDiv) {
          menuDiv.classList.toggle("hidden");
        });
      });
    }
  }, []); // Empty dependency array ensures this runs once after component mount
  const handleBack = () => {
    if (rolled === "rakeshbase2brand@gmail.com") {
      navigate("/dashboard")
    }
  }
  return (
    <div>
      <Header
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
        }}
        className="navbar"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "40%",
          }}
        >
          <div className="logo" onClick={handleBack}>
            <img src="./b2b.png" alt="Company Logo" />
          </div>
          <button id="hideMenuButton" style={{
            width: '35px',
            height: '34px',
            margin: '26px',
            marginRight: '41%'
          }}>☰</button>

          <div className="search">
            <Input
              placeholder="Search..."
              // eslint-disable-next-line react/react-in-jsx-scope
              prefix={<SearchOutlined className="search-icon" />}
            />
          </div>
        </div>
        {/* <div
          style={{
            marginLeft: "15px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            minWidth: "4%",
          }}
        >
          <Badge count="5" style={{ lineHeight: '24px', minWidth: '26px', minHeight: '26px', marginRight: '-8px', top: '-2px', borderRadius: '1pc' }}>
            {" "} */}
            {/* unreadChatCount is the number of unread chat messages */}
            {/* <Popover
              style={{ width: "20vw" }}
              content="" // chatList can be a component showing recent chats or messages
              placement="bottomRight"
            > */}
              {/* <MessageOutlined
                className="chat-icon"
                onClick={() => {
                  navigate("/chatMessagePage");
                }}
              /> */}
            {/* </Popover> */}
          {/* </Badge> */}

          {/* Call Icon with Notification Badge */}
          {/* <Badge count="3" style={{ lineHeight: '24px', minWidth: '26px', minHeight: '26px', marginRight: '-8px', top: '-2px', borderRadius: '1pc' }}> */}
            {" "}
            {/* Replace "3" with the number of missed calls */}
            {/* <Popover
              style={{ width: "20vw" }}
              content="" // Replace with your callList component
              placement="bottomRight"
            > */}
              {/* <PhoneOutlined className="call-icon" />
            </Popover>
          </Badge>
        </div> */}

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "60%",
            float: "right",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
          className="right-menu"
        >
          <div
            style={{
              width: "25%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Badge count={badgeContent} style={{ lineHeight: '24px', minWidth: '26px', minHeight: '26px', top: '-2px', marginRight: '33px', borderRadius: '1pc' }}>
              <Popover
                style={{ width: "20vw" }}
                content={notificationList}
                placement="bottomRight"
              >
                <BellOutlined className="notification-icon" style={{ marginLeft: '-55px' }} />
              </Popover>
            </Badge>

            <Avatar className="avatar" icon={<UserOutlined />} />
            <span className="username">{myData?.firstName} {myData?.lastName}</span>
            <Button
              className="logout-button"
              type="primary"
              danger
              icon={<PoweroffOutlined />}
              onClick={logout}
            >
            </Button>
          </div>
        </div>
      </Header>
    </div>
  );
};
export default Navbar;
