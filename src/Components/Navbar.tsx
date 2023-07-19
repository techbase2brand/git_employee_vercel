import React, { useState, useEffect, useContext } from "react";
import Menu from "./Menu";
import Navbar from "./Navbar";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GlobalInfo } from "../App";
// import { Space, Select, Radio, Tabs, RadioChangeEvent } from "antd";
import { DatePicker } from "antd";
import enUS from "antd/lib/date-picker/locale/en_US";

import dayjs, { Dayjs } from "dayjs";

import { Moment } from "moment";

const { RangePicker } = DatePicker;

type Phase = {
  phaseID: number;
  projectName: string;
};

interface Employee {
  EmpID: string | number;
  firstName: string;
  role: string;
  dob: string | Date;
  EmployeeID: string;
}

const currentDate = new Date().toISOString().split("T")[0];

const AssignTaskPage: React.FC<any> = ({ navigation, classes }) => {
  const [elementCount, setElementCount] = useState(1);
  const [showIncrement, setShowIncrement] = useState(true);
  const [deadline, setDeadline] = useState<Dayjs | null>(null);
  // const [deadline, setDeadline] = useState<any | null>(null);
  const [assignedBy, setAssignedBy] = useState<any | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks] = useState<any[]>([
    {
      createdDate: currentDate,
      deadlineStart: null,
      deadlineEnd: null,
    },
  ]);
  const [formattedTasks, setFormattedTasks] = useState<any[]>([]);

  const adminInfo = localStorage.getItem("admin");

  let userEmail: string | null = null;
  if (adminInfo) {
    const userInfo = JSON.parse(adminInfo);
    userEmail = userInfo?.email;
    console.log("User email: ", userEmail);
  } else {
    console.log("No admin info found in local storage");
  }

  useEffect(() => {
    axios
      .get<any[]>("https://empbackend.base2brand.com/get/userlogin", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        const sortedData = response?.data.sort(
          (a, b) => Number(b.UserID) - Number(a.UserID)
        );

        console.log("Userlogin fetched:", sortedData);

        const filteredData = sortedData.filter((e) => e?.email === userEmail);

        setAssignedBy(filteredData[0].adminName);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    console.log(tasks);
  }, [tasks]);

  const navigate = useNavigate();

  const { modulejEditObj, setModulejEditObj } = useContext(GlobalInfo);

  const handleIncrement = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    setTasks([
      ...tasks,
      {
        createdDate: currentDate,
      },
    ]);
    setElementCount(elementCount + 1);
  };

  const handleDecrement = (index: number) => {
    if (elementCount > 1) {
      setElementCount(elementCount - 1);
      setTasks(tasks.filter((_, i) => i !== index));
    }
  };

  const handleTask = (value: string, index: number) => {
    const newTasks = [...tasks];
    const currentDate = new Date().toISOString().split("T")[0];
    newTasks[index] = {
      ...newTasks[index],
      task: value,
      createdDate: currentDate,
    };
    setTasks(newTasks);
  };

  const handleAssignee = (value: string, index: number) => {
    const selectedEmployee = employees.find((emp) => emp.firstName === value);
    const newTasks = [...tasks];
    const currentDate = new Date().toISOString().split("T")[0];
    newTasks[index] = {
      ...newTasks[index],
      assigneeName: value,
      assigneeEmployeeID: selectedEmployee?.EmployeeID,
      createdDate: currentDate,
    };
    setTasks(newTasks);
  };

  // ...
  // const handleDeadlineChange = (dates: [Moment | null, Moment | null], index: number) => {
  //   if (dates && dates.length === 2) {
  //     const newTasks = [...tasks];
  //     newTasks[index] = {
  //       ...newTasks[index],
  //       deadline: [
  //         dates[0]?.format("YYYY-MM-DD") || null,
  //         dates[1]?.format("YYYY-MM-DD") || null,
  //       ],
  //     };
  //     setTasks(newTasks);
  //   }
  // };

  const handleDeadlineChange = (dates: any, index: number) => {
    const [start, end] = dates;
    const newTasks = [...tasks];
    const currentDate = new Date().toISOString().split("T")[0];
    newTasks[index] = {
      ...newTasks[index],
      deadlineStart: start ? start.format("YYYY-MM-DD") : null,
      deadlineEnd: end ? end.format("YYYY-MM-DD") : null,
      createdDate: currentDate,
    };
    setTasks(newTasks);
  };

  const handleCheckboxToggle = (index: number) => {
    const newTasks = [...tasks];
    const currentDate = new Date().toISOString().split("T")[0];
    newTasks[index] = {
      ...newTasks[index],
      checked: !newTasks[index]?.checked,
      createdDate: currentDate,
    };
    setTasks(newTasks);
  };

  const handleSubmit = () => {
    const atLeastOneChecked = tasks.some((task) => task.checked);

    if (!atLeastOneChecked) {
      alert("Please check at least one task before clicking Send.");
      return;
    }

    const checkedTasks = tasks.filter((task) => task.checked);

    const allFieldsFilled = checkedTasks.every(
      (task) =>
        task.task && task.assigneeName && task.deadlineStart && task.deadlineEnd
    );

    if (!allFieldsFilled) {
      alert("Please fill all the required fields for checked tasks.");
      return;
    }

    const outputTasks = checkedTasks.map((task) => {
      return {
        assigneeEmployeeID: task.assigneeEmployeeID,
        assigneeName: task.assigneeName,
        createdDate: task.createdDate,
        deadlineStart: task.deadlineStart,
        deadlineEnd: task.deadlineEnd,
        task: task.task,
        userEmail: userEmail,
        assignedBy: assignedBy,
        isCompleted: false,
      };
    });

    console.log("Output tasks:", outputTasks);

    axios
      .post(
        "https://empbackend.base2brand.com/create/addBacklogTasks",
        { tasks: outputTasks },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      .then((response) => {
        if (response.data === "Tasks inserted") {
          navigate("/ViewBacklogPage");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get<Employee[]>("https://empbackend.base2brand.com/employees", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        const sortedData = response?.data.sort(
          (a, b) => Number(b.EmpID) - Number(a.EmpID)
        );

        setEmployees(sortedData);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="emp-main-div">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{ height: "8%" }}>
          <Navbar />
        </div>
        <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
          <div className="menu-div">
            <Menu />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column" }}
            className="form-containerr"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "50px",
                marginLeft: "40px",
                width: "80%",
              }}
              className="add-div"
            >
              <p className="add-heading">Assign Task</p>

              {Array.from({ length: elementCount }, (_, index) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginTop: "35px",
                  }}
                  key={index}
                >
                  <textarea
                    style={{
                      padding: "8px",
                      width: "300px",
                      height: "100px",
                      resize: "none",
                    }}
                    className="add-input task-input"
                    id="task"
                    name="task"
                    value={tasks[index]?.task || ""}
                    onChange={(e) => handleTask(e.target.value, index)}
                    placeholder="Please write task"
                  />

                  <select
                    style={{ marginLeft: "15px" }}
                    className="add-input"
                    id="assignee"
                    name="assignee"
                    value={tasks[index]?.assigneeName || ""}
                    onChange={(e) => handleAssignee(e.target.value, index)}
                  >
                    <option value="">Assgn. To</option>
                    {employees.map((employee) => (
                      <option
                        value={employee.firstName}
                        key={employee.EmployeeID}
                      >
                        {employee.firstName}
                      </option>
                    ))}
                  </select>

                  <div>
                    <RangePicker
                      style={{
                        width: "150px",
                        marginRight: "15px",
                        marginLeft: "15px",
                        paddingBottom: "35px",
                      }}
                      className="add-input"
                      value={[
                        tasks[index]?.deadlineStart
                          ? dayjs(tasks[index]?.deadlineStart)
                          : null,
                        tasks[index]?.deadlineEnd
                          ? dayjs(tasks[index]?.deadlineEnd)
                          : null,
                      ]}
                      onChange={(dates) => handleDeadlineChange(dates, index)}
                      format="YYYY-MM-DD"
                      locale={enUS}
                    />
                  </div>
                  <input
                    type="checkbox"
                    style={{
                      marginBottom: "32px",
                      paddingBottom: "20px",
                      width: "30px",
                    }}
                    className="add-checkbox"
                    checked={tasks[index]?.checked || false}
                    onClick={() => handleCheckboxToggle(index)}
                  />

                  <div
                    style={{
                      marginLeft: "10px",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    {index === elementCount - 1 && (
                      <button
                        className="round-button"
                        onClick={handleIncrement}
                      >
                        +
                      </button>
                    )}
                    {index !== 0 && (
                      <button
                        className="round-button"
                        onClick={() => handleDecrement(index)}
                      >
                        -
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ position: "relative", bottom: 0, left: 0, right: 0 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: "300px",
                }}
              >
                <button className="add-button" onClick={handleSubmit}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTaskPage;
