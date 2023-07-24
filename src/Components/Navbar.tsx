import React, { useState, useEffect, useContext, useCallback } from "react";
import { Input, Layout, Avatar, Badge, Popover, List } from "antd";
import { SearchOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { AssignedTaskCountContext } from "../App";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";
import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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



const showDummyDesktopNotification = (title: string, onClick?: () => void) => {
  console.log("Showing dummy desktop notification:", title);

  // Perform any other actions needed for a dummy notification
  // For example, you can show a custom popup or toast message.

  if (onClick) {
    onClick();
  }
};

const Navbar: React.FunctionComponent = () => {
  const [notifications, setNotifications] = useState<BacklogTask[]>([]);
  const [newTaskAssignedWhileHidden, setNewTaskAssignedWhileHidden] =
    useState(false);

  const { assignedTaskCount, setAssignedTaskCount } = useContext(
    AssignedTaskCountContext
  );

  const storedData = localStorage.getItem("myData");
  const myData = storedData ? JSON.parse(storedData) : null;

  const navigate = useNavigate();

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notifications.");
      return;
    }

    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
    const socket = io("https://empbackend.base2brand.com");

    // Event listener for new task assigned through socket
    socket.on("taskAssigned", (task: BacklogTask) => {
      if (myData && myData.EmpID === task.assigneeEmployeeID) {
        setAssignedTaskCount((prevCount) => prevCount + 1);
        setNewTaskAssignedWhileHidden(true);

        // Update the notifications state with the new task
        setNotifications((prevNotifications) => [...prevNotifications, task]);

        // Show desktop notification for the new task using react-toastify
        toast.success(
          <div>
            <div>{`New task assigned by ${task.AssignedBy}`}</div>
            <div>{task.taskName}</div>
          </div>,
          {
            onClick: () => {
              navigate("/dashboard");
            },
            autoClose: 5000, // Close the notification after 5 seconds
            position: "top-right", // Notification position
          }
        );

        // Call handleTaskAssigned to perform additional actions
        handleTaskAssigned(task.assigneeEmployeeID);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [myData, setAssignedTaskCount, navigate]);

  const handleTaskAssigned = useCallback(
    (assigneeEmployeeID: string) => {
      if (myData && myData[0] && myData[0].EmpID === assigneeEmployeeID) {
        // Increment the assigned task count
        setAssignedTaskCount((prevCount) => prevCount + 1);

        // Fetch all tasks from the server
        axios
          .get<BacklogTask[]>(
            "https://empbackend.base2brand.com/get/BacklogTasks",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("myToken")}`,
              },
            }
          )
          .then((response) => {
            // Filter the tasks assigned to the current user
            const newTasks = response.data.filter(
              (task) => task.assigneeEmployeeID === assigneeEmployeeID
            );

            // Add the new tasks to the notifications state
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              ...newTasks,
            ]);

            // Show a desktop notification for each new task using react-toastify
            newTasks.forEach((task) => {
              const notificationOptions: ToastOptions = {
                // Customize the options as needed
                onClick: () => {
                  navigate("/dashboard");
                },
                autoClose: 5000,
                position: "top-right",
                // Other options if required
              };

              toast.success(
                <div>
                  <div>{`New task assigned by ${task.AssignedBy}`}</div>
                  <div>{task.taskName}</div>
                </div>,
                notificationOptions
              );
            });
          })
          .catch((error) => {
            console.error("Error fetching tasks:", error);
          });
      }
    },
    [assignedTaskCount, myData, setAssignedTaskCount, navigate]
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
          // icon: "path/to/your/icon.png",
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

  // const showDesktopNotification = (
  //   title: string,
  //   onClick?: () => void,
  //   options?: NotificationOptions // Use the NotificationOptions type
  // ) => {
  //   if (Notification.permission === "granted") {
  //     const notification = new Notification(title, options);

  //     if (onClick) {
  //       notification.onclick = onClick;
  //     }
  //   } else {
  //     console.log("Notification permission is not granted.");
  //   }
  // };


  const showDesktopNotification = (
    title: string,
    onClick?: () => void,
    options?: NotificationOptions // Use the NotificationOptions type
  ) => {
    // Show the dummy desktop notification
    showDummyDesktopNotification(title, onClick);
  };

  const getVisitedNotificationIds = () => {
    const visitedNotifications = localStorage.getItem("visitedNotificationIds");
    return visitedNotifications ? JSON.parse(visitedNotifications) : [];
  };

  const markNotificationAsVisited = (notificationId: number) => {
    const visitedNotificationIds = getVisitedNotificationIds();
    visitedNotificationIds.push(notificationId);
    localStorage.setItem(
      "visitedNotificationIds",
      JSON.stringify(visitedNotificationIds)
    );
  };

  const notificationList = (
    <List
      itemLayout="horizontal"
      dataSource={notifications}
      renderItem={(item) => (
        <List.Item
          key={item.backlogTaskID}
          onClick={() => {
            navigate("/dashboard");
            markNotificationAsVisited(item.backlogTaskID);
            setNotifications((prevNotifications) =>
              prevNotifications.filter(
                (notification) =>
                  notification.backlogTaskID !== item.backlogTaskID
              )
            );
          }}
        >
          <List.Item.Meta
            title={`A new task assigned by ${item?.AssignedBy}: ${getShortTaskDescription(
              item.taskName
            )}`}
          />
          <CloseOutlined
            onClick={(e) => {
              e.stopPropagation();
              markNotificationAsVisited(item.backlogTaskID);
              setNotifications((prevNotifications) =>
                prevNotifications.filter(
                  (notification) =>
                    notification.backlogTaskID !== item.backlogTaskID
                )
              );
            }}
          />
        </List.Item>
      )}
    />
  );

  const getShortTaskDescription = (taskName: string) => {
    const words = taskName.split(" ");
    const maxWords = 5;
    const truncatedWords = words.slice(0, maxWords);
    return truncatedWords.join(" ");
  };

  const logout = () => {
    if (window.confirm("Do you really want to logout?")) {
      localStorage.removeItem("myToken");
      navigate("/");
    }
  };

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
        {/* Left section */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "40%",
          }}
        >
          <div className="logo">
            <img src="./b2b.png" alt="Company Logo" />
          </div>
          <div className="search">
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined className="search-icon" />}
            />
          </div>
        </div>

        {/* Right section */}
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
            <Badge style={{ marginRight: "3%" }} count={notifications.length}>
              <Popover
                style={{ width: "20vw" }}
                content={notificationList}
                placement="bottomRight"
                trigger="click" // Show popover on click instead of hover
              >
                <BellOutlined className="notification-icon" />
              </Popover>
            </Badge>

            <Avatar className="avatar" icon={<UserOutlined />} />
            <span className="username">
              {myData?.firstName} {myData?.lastName}
            </span>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </Header>
    </div>
  );
};

export default Navbar;
