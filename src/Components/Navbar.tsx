/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect, useContext, useCallback } from "react";
import {
  Input,
  Layout,
  Avatar,
  Badge,
  Popover,
  List,
  // notification,
} from "antd";
import { SearchOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { AssignedTaskCountContext } from "../App";
import io from "socket.io-client";
// import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";

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

const Navbar: React.FunctionComponent = () => {
  const [newTaskAssignedWhileHidden, setNewTaskAssignedWhileHidden] =
    useState(false);

  const [notifications, setNotifications] = useState<BacklogTask[]>([]);

  const { assignedTaskCount, setAssignedTaskCount } = useContext(
    AssignedTaskCountContext
  );

  const storedData = localStorage.getItem("myData");
  const myData = storedData ? JSON.parse(storedData) : null;
  console.log(myData, "myData");

  console.log(notifications, "notifications");
  console.log(assignedTaskCount, "assignedTaskCount");

  // const initialNotificationCount = Number(
  //   localStorage.getItem("notificationCount") || 0
  // );
  // const [notificationCount, setNotificationCount] = useState(0);

  const navigate = useNavigate();

  const updateNotificationCount = () => {
    // setNotificationCount(notifications.length);
  };

  // Call updateNotificationCount() whenever you update the notifications state

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notifications.");
      return;
    }
    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
  };

  const showDesktopNotification = (
    title: string,
    onClick?: () => void,
    options?: Omit<NotificationOptions, "onclick">
  ) => {
    if (Notification.permission === "granted") {
      const notification = new Notification(title, options);

      if (onClick) {
        notification.onclick = onClick;
      }
    } else {
      console.log("Notification permission is not granted.");
    }
  };

  useEffect(() => {
    // Request notification permission when the component mounts
    requestNotificationPermission();

    // Show a dummy desktop notification when the component mounts
    showDesktopNotification("Welcome!", () => {
      // Action to perform when the notification is clicked
      navigate("/dashboard");
    });
  }, []);


  // const handleTaskAssigned = useCallback(
  //   (assigneeEmployeeID: string) => {
  //     if (myData && myData[0] && myData[0].EmployeeID === assigneeEmployeeID) {
  //       setAssignedTaskCount((prevCount) => prevCount + 1);

  //       // Fetch all tasks.
  //       axios.get<BacklogTask[]>(`https://empbackend.base2brand.com/get/BacklogTasks`)
  //         .then(response => {
  //           // Filter the tasks assigned to the current user.
  //           const newTasks = response.data.filter(task => task.assigneeEmployeeID === assigneeEmployeeID);
  //      console.log(newTasks,"newTasks ");
  //      console.log(response.data[0].assigneeEmployeeID,"response.data[0].assigneeEmployeeID");
  //      console.log(assigneeEmployeeID,"assigneeEmployeeID");
  //      console.log(notifications);

  //           // Add the new tasks to notifications.
  //           setNotifications((prevNotifications) => [...prevNotifications, ...newTasks]);
  //         })
  //         .catch(error => {
  //           console.error('Error fetching tasks:', error);
  //         });
  //     }
  //   },
  //   [assignedTaskCount, myData]
  // );

  const handleTaskAssigned = useCallback(
    (assigneeEmployeeID: string) => {
      if (myData && myData[0] && myData[0].EmpID === assigneeEmployeeID) {
        setAssignedTaskCount((prevCount) => prevCount + 1);

        console.log("added handle task from chatGPT");


        // Fetch all tasks.
        axios
          .get<BacklogTask[]>("https://empbackend.base2brand.com/get/BacklogTasks", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("myToken")}`,
            },
          })
          .then((response) => {
            // Filter the tasks assigned to the current user.
            const newTasks = response.data.filter(
              (task) => task.assigneeEmployeeID === assigneeEmployeeID
            );

            // Add the new tasks to notifications.
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              ...newTasks,
            ]);

            // Show desktop notification for each new task
            newTasks.forEach((task) => {
              showDesktopNotification(
                `New task assigned by ${task.AssignedBy}`,
                () => {
                  // Action to perform when the notification is clicked
                  navigate("/dashboard");
                },
                {
                  body: task.taskName,
                }
              );
            });
          })
          .catch((error) => {
            console.error("Error fetching tasks:", error);
          });
      }
    },
    [assignedTaskCount, myData]
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

  useEffect(() => {
    const socket = io("https://empbackend.base2brand.com");

    socket.on("taskAssigned", (task: BacklogTask) => {
      console.log("New task assigned:", task);

      if (myData && myData[0] && myData[0].EmpID === task.assigneeEmployeeID) {
        setAssignedTaskCount((prevCount) => prevCount + 1);

        // Update the notifications state with the new task
        setNotifications((prevNotifications) => [...prevNotifications, task]);

        // Show desktop notification for the new task
        showDesktopNotification(
          `New task assigned by ${task.AssignedBy}`,
          () => {
            navigate("/dashboard");
          },
          {
            body: task.taskName,
          }
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [myData]);



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

  useEffect(() => {
    axios
      .get<BacklogTask[]>("https://empbackend.base2brand.com/get/BacklogTasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        const visitedNotificationIds = getVisitedNotificationIds();
        const filteredData = response?.data?.filter(
          (item) =>
            !visitedNotificationIds.includes(item.backlogTaskID) &&
            item.employeeID === myData.EmployeeID
        );
        const sortedData = filteredData.sort(
          (a, b) => Number(b.backlogTaskID) - Number(a.backlogTaskID)
        );

        setNotifications(sortedData);
        updateNotificationCount(); // Update the notification count
      })
      .catch((error) => {
        console.log(localStorage.getItem("myToken"), "mmmyyyy tokennnn");
      });
  }, []);

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
    const words = taskName.split(" ");
    const maxWords = 5;
    const truncatedWords = words.slice(0, maxWords);
    return truncatedWords.join(" ");
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
            updateNotificationCount(); // Update the notification count
            console.log(item, "ffggg-------");
          }}
          style={listItemStyle}
        >
          <List.Item.Meta
            title={`A new task assigned by ${item?.AssignedBy}: ${getShortTaskDescription(
              item.taskName
            )}`}
          />
          <CloseOutlined
            onClick={(e) => {
              e.stopPropagation(); // Prevents the parent click event from triggering
              markNotificationAsVisited(item.backlogTaskID);
              setNotifications((prevNotifications) =>
                prevNotifications.filter(
                  (notification) =>
                    notification.backlogTaskID !== item.backlogTaskID
                )
              );
              updateNotificationCount(); // Update the notification count
            }}
          />
        </List.Item>
      )}
      style={listStyle}
    />
  );

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
              // eslint-disable-next-line react/react-in-jsx-scope
              prefix={<SearchOutlined className="search-icon" />}
            />
          </div>
        </div>
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
              >
                <BellOutlined className="notification-icon" />
              </Popover>
            </Badge>

            <Avatar className="avatar" icon={<UserOutlined />} />
            <span className="username">
              {myData?.firstName}
              {myData?.lastName}
            </span>
            <button onClick={logout}>logout</button>
          </div>
        </div>
      </Header>
    </div>
  );
};

export default Navbar;
