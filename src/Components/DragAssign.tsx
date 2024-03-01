import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppstoreAddOutlined } from "@ant-design/icons";

interface Employee {
  EmpID: string | number;
  firstName: string;
  role: string;
  dob: string | Date;
  EmployeeID: string;
}
interface Project {
  ProID: string | number;
  clientName: string;
  projectName: string;
  projectDescription: string;
}
const currentDate = new Date().toISOString().split("T")[0];

const DragAssign: React.FC<any> = () => {
  const [elementCount, setElementCount] = useState(1);
  const [data, setData] = useState<Employee[]>([]);
  const [assignedBy, setAssignedBy] = useState<any | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [data1, setData1] = useState<Project[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [tasks, setTasks] = useState<any[]>([
    {
      createdDate: currentDate,
      deadlineStart: null,
      deadlineEnd: null,
      checked: true,
    },
  ]);
  const submition = tasks.filter(
    (item) => item.task && item.assigneeName && item.deadlineEnd && item.checked
  );
  const sortedData = [...data1];
  sortedData.sort((a, b) => a.clientName.localeCompare(b.clientName));

  const resetFormFields = () => {
    setTasks([
      {
        createdDate: currentDate,
        deadlineStart: null,
        deadlineEnd: null,
        checked: true,
      },
    ]);
    setElementCount(1);
  };
  const filteredData = data.filter((item: any) => item.status === 1);
  const sortedEmployees = [...filteredData];

  sortedEmployees.sort((a, b) => a.firstName.localeCompare(b.firstName));
  const adminInfo = localStorage.getItem("myData");

  let userEmail: string | null = null;
  if (adminInfo) {
    const userInfo = JSON.parse(adminInfo);
    userEmail = userInfo?.email;
  } else {
    console.log("No admin info found in local storage");
  }

  useEffect(() => {
    axios
      .get<any[]>(`${process.env.REACT_APP_API_BASE_URL}/employees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        const sortedData = response?.data.sort(
          (a, b) => Number(b.EmpID) - Number(a.EmpID)
        );
        setData(sortedData);
        const filteredData = sortedData.filter((e) => e?.email === userEmail);
        setAssignedBy(filteredData[0].firstName);
      })
      .catch((error) => console.log(error));
  }, [setData]);

  const handleIncrement = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    setTasks((prevTasks) => [
      ...prevTasks,
      {
        createdDate: currentDate,
        deadlineStart: null,
        deadlineEnd: null,
        checked: true,
      },
    ]);
    setElementCount(elementCount + 1);
  };

  const handleMultiple = (
    index: number,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      const currentDate = new Date().toISOString().split("T")[0];
      newTasks[index] = {
        ...newTasks[index],
        checked: true, // Mark the task as checked when it's added
        createdDate: currentDate,
        deadlineStart: null, // Include these properties
        deadlineEnd: null, // Include these properties
      };

      const selectedAssignees = newTasks[index]?.assigneeName || [];
      const selectedEmployeeIDs = newTasks[index]?.assigneeEmployeeID || [];

      if (newTasks[index]?.checked) {
        const createdTasks: any[] = [];

        selectedAssignees.forEach((assignee: string, assigneeIndex: number) => {
          const task = {
            assigneeName: [assignee],
            assigneeEmployeeID: [selectedEmployeeIDs[assigneeIndex]],
            task: newTasks[index]?.task,
            checked: true,
            createdDate: currentDate,
            deadlineStart: null,
            deadlineEnd: null,
          };
          createdTasks.push(task);
        });

        // Combine previous tasks and newly created tasks
        const updatedTasks = [...newTasks, ...createdTasks];

        setElementCount(
          (prevCount) =>
            prevCount +
            (selectedAssignees.length > 1 ? selectedAssignees.length : 1)
        );

        return updatedTasks;
      } else {
        setElementCount((prevCount) => prevCount + 1);
        return newTasks;
      }
    });
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

  const handleAssignee = (selectedAssignees: string[], index: number) => {
    const newTasks = [...tasks];
    const currentDate = new Date().toISOString().split("T")[0];
    newTasks[index] = {
      ...newTasks[index],
      assigneeName: selectedAssignees, // Update to an array of selected assignees
      assigneeEmployeeID: selectedAssignees.map((assignee) => {
        const selectedEmployee = employees.find(
          (emp) => emp.firstName === assignee
        );
        return selectedEmployee?.EmployeeID || "";
      }),
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
    if (submition.length !== 0) {
      setSubmitting(true);
    }
    const atLeastOneChecked = tasks.some((task) => task.checked);

    if (!atLeastOneChecked) {
      alert("Please check at least one task before clicking Send.");
      return;
    }
    const checkedTasks = tasks.filter((task) => task.checked);
    const outputTasks = checkedTasks.map((task) => {
      return {
        assigneeEmployeeID: task.assigneeEmployeeID,
        assigneeName: task.assigneeName,
        task: task.task,
        userEmail: userEmail,
        assignedBy: assignedBy,
        isCompleted: false,
      };
    });

    axios
      .post(
        ` ${process.env.REACT_APP_API_BASE_URL}/create/addBacklogTasks`,
        { tasks: outputTasks },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("myToken")}`,
          },
        }
      )
      .then((response) => {
        if (response.data === "Tasks inserted") {
          resetFormFields();
          toast.success("Tasks inserted successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      })
      .catch((error) => {
        toast.error("Error while inserting tasks.", {
          position: toast.POSITION.TOP_RIGHT,
          // Other configuration options as needed
        });
      });
  };

  useEffect(() => {
    axios
      .get<Employee[]>(`${process.env.REACT_APP_API_BASE_URL}/employees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
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

  useEffect(() => {
    axios
      .get<Project[]>(`${process.env.REACT_APP_API_BASE_URL}/get/projects`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        const sortedData = response.data.sort(
          (a, b) => Number(b.ProID) - Number(a.ProID)
        );
        setData1(sortedData);
      });
  }, []);

  return (
    <div
      style={{
        width: "100%",
        margin: "7px",
      }}
    >
      <p className="add-heading">Backlog Task</p>

      {Array.from({ length: elementCount }, (_, index) => (
        <div
          className="placeholder-color"
          key={index}
        >
          <textarea
            style={{
              border: "2px solid black",
            }}
            className="add-input task-input"
            id="task"
            name="task"
            value={tasks[index]?.task || ""}
            onChange={(e) => handleTask(e.target.value, index)}
            placeholder="Add task"
          />
          <Select
            style={{ border: "2px solid black", height: "auto", width: '25%' }}
            mode="multiple"
            id="assignee"
            className="add-input"
            placeholder="Select Assignees"
            value={tasks[index]?.assigneeName || []}
            onChange={(selectedAssignees) =>
              handleAssignee(selectedAssignees, index)
            }
          >
            {sortedEmployees.map((employee) => (
              <Select.Option
                value={employee.firstName}
                key={employee.EmployeeID}
              >
                {employee.firstName}
              </Select.Option>
            ))}
          </Select>
          <input
            type="checkbox"
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
                onClick={(event) => handleIncrement()}
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
            {index === elementCount - 1 && (
              <button
                className="round-button"
                onClick={(event) => handleMultiple(index, event)}
              >
                <AppstoreAddOutlined />
              </button>
            )}
          </div>
          <button
            className="add-button"
            onClick={handleSubmit}
            disabled={submitting === true}
            style={{ margin: "14px" }}
          >
            Send
          </button>
        </div>
      ))}

    </div>
  );
};

export default DragAssign;
