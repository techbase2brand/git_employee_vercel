import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DatePicker, Input, Select } from "antd";
import enUS from "antd/lib/date-picker/locale/en_US";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from "dayjs";
import { AppstoreAddOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;

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
    const [selectedClient, setSelectedClient] = useState<string[] | undefined>();
    const [submitting, setSubmitting] = useState(false);
    const [tasks, setTasks] = useState<any[]>([
        {
            createdDate: currentDate,
            deadlineStart: null,
            deadlineEnd: null,
        },
    ]);
    const submition = tasks.filter(((item) => item.task && item.assigneeName && item.deadlineEnd && item.checked))
    const sortedData = [...data1];
    sortedData.sort((a, b) => a.clientName.localeCompare(b.clientName));
    const uniqueClientNames = Array.from(new Set(sortedData.map((project) => project.clientName)));

    const sortedProject = [...data1];
    sortedProject.sort((a, b) => a.projectName.localeCompare(b.projectName));
    const filteredProjects = sortedProject.filter((project) => {
        return Array.isArray(selectedClient) ? selectedClient.includes(project?.clientName) : false;
    });

    const resetFormFields = () => {
        setTasks([
            {
                createdDate: currentDate,
                deadlineStart: null,
                deadlineEnd: null,
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


    const navigate = useNavigate();
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
    // const handleMultiple = (index: number, event?: React.MouseEvent<HTMLButtonElement>) => {
    //     const newTasks = [...tasks];
    //     const currentDate = new Date().toISOString().split("T")[0];
    //     newTasks[index] = {
    //         ...newTasks[index],
    //         checked: !newTasks[index]?.checked,
    //         createdDate: currentDate,
    //     };
    //     setTasks(newTasks);
    //     const selectedAssignees = tasks[index]?.assigneeName || [];
    //     const selectedEmployeeIDs = tasks[index]?.assigneeEmployeeID || [];

    //     if (newTasks[index]?.checked) {
    //         const createdTasks = selectedAssignees.map((assignee: string, assigneeIndex: number) => ({
    //             createdDate: currentDate,
    //             assigneeName: [assignee],
    //             assigneeEmployeeID: [selectedEmployeeIDs[assigneeIndex]],
    //             task: newTasks[index]?.task,
    //             clientName: newTasks[index]?.clientName,
    //             projectName: newTasks[index]?.projectName,
    //             deadlineStart: newTasks[index]?.deadlineStart,
    //             deadlineEnd: newTasks[index]?.deadlineEnd,
    //             checked: true,
    //         }));

    //         setTasks((prevTasks) => [...prevTasks, ...createdTasks]);
    //         setElementCount((prevCount) => prevCount + createdTasks.length);
    //     }
    // };
    const handleMultiple = (index: number, event?: React.MouseEvent<HTMLButtonElement>) => {
        const newTasks = [...tasks];
        const currentDate = new Date().toISOString().split("T")[0];
        newTasks[index] = {
            ...newTasks[index],
            checked: !newTasks[index]?.checked,
            createdDate: currentDate,
        };
        setTasks(newTasks);

        const selectedAssignees = tasks[index]?.assigneeName || [];
        const selectedEmployeeIDs = tasks[index]?.assigneeEmployeeID || [];
        const selectedClients = tasks[index]?.clientName || [];

        if (newTasks[index]?.checked) {
            const createdTasks: any[] = [];

            selectedClients.forEach((client: string) => {
                selectedAssignees.forEach((assignee: string, assigneeIndex: number) => {
                    const task = {
                        createdDate: currentDate,
                        assigneeName: [assignee],
                        assigneeEmployeeID: [selectedEmployeeIDs[assigneeIndex]],
                        task: newTasks[index]?.task,
                        clientName: client,
                        projectName: newTasks[index]?.projectName,
                        deadlineStart: newTasks[index]?.deadlineStart,
                        deadlineEnd: newTasks[index]?.deadlineEnd,
                        checked: true,
                    };
                    createdTasks.push(task);
                });
            });

            setTasks((prevTasks) => [...prevTasks, ...createdTasks]);
            setElementCount((prevCount) => prevCount + createdTasks.length);
        }
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

    // const handleAssignee = (value: string, index: number) => {
    //   const selectedEmployee = employees.find((emp) => emp.firstName === value);
    //   const newTasks = [...tasks];
    //   const currentDate = new Date().toISOString().split("T")[0];
    //   newTasks[index] = {
    //     ...newTasks[index],
    //     assigneeName: value,
    //     assigneeEmployeeID: selectedEmployee?.EmployeeID,
    //     createdDate: currentDate,
    //   };
    //   setTasks(newTasks);
    // };
    const handleAssignee = (selectedAssignees: string[], index: number) => {
        const newTasks = [...tasks];
        const currentDate = new Date().toISOString().split("T")[0];
        newTasks[index] = {
            ...newTasks[index],
            assigneeName: selectedAssignees, // Update to an array of selected assignees
            assigneeEmployeeID: selectedAssignees.map((assignee) => {
                const selectedEmployee = employees.find((emp) => emp.firstName === assignee);
                return selectedEmployee?.EmployeeID || '';
            }),
            createdDate: currentDate,
        };
        setTasks(newTasks);
    };


    const handleProjectName = (value: string, index: number) => {
        const newTasks = [...tasks];
        const currentDate = new Date().toISOString().split("T")[0];
        newTasks[index] = {
            ...newTasks[index],
            projectName: value,
            createdDate: currentDate,
        };
        setTasks(newTasks);
    };
    const handleClientName = (value: string[], index: number) => {
        const newTasks = [...tasks];
        const currentDate = new Date().toISOString().split("T")[0];
        newTasks[index] = {
            ...newTasks[index],
            clientName: value,
            createdDate: currentDate,
        };
        setTasks(newTasks);
        setSelectedClient(value.length > 0 ? value : []);
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
        if (submition.length !== 0) {
            setSubmitting(true)
        }
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
                clientName: task.clientName,
                projectName: task.projectName,
                comment: task.comment,
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
                    navigate("/ViewBacklogPage");
                    toast.success('Tasks inserted successfully!', {
                        position: toast.POSITION.TOP_RIGHT,
                    });

                }
            })
            .catch((error) => {
                toast.error('Error while inserting tasks.', {
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
        axios.get<Project[]>(`${process.env.REACT_APP_API_BASE_URL}/get/projects`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        }).then((response) => {
            const sortedData = response.data.sort(
                (a, b) => Number(b.ProID) - Number(a.ProID)
            );
            setData1(sortedData);
        });
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
                                    <Select
                                        style={{ marginLeft: '15px' }}
                                        className="add-input"
                                        placeholder="Select Client"
                                        value={tasks[index] > 2 ? "" : tasks[index]?.clientName}
                                        onChange={(value) => handleClientName(value, index)}
                                        mode="multiple"
                                        showSearch
                                    >
                                        <Select.Option value="">Client Name</Select.Option>
                                        {uniqueClientNames.map((clientName, idx) => (
                                            <Select.Option key={idx} value={clientName}>
                                                {clientName}
                                            </Select.Option>
                                        ))}
                                    </Select>

                                    <Select
                                        style={{ marginLeft: '15px' }}
                                        className="add-input"
                                        value={tasks[index]?.projectName || ''}
                                        onChange={(value) => handleProjectName(value, index)}
                                        showSearch
                                    >
                                        <Select.Option value="">Project Name</Select.Option>
                                        {filteredProjects.map((project) => (
                                            <Select.Option key={project.ProID} value={project.projectName}>
                                                {project.projectName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                    <Select
                                        style={{ marginLeft: "15px" }}
                                        mode="multiple"
                                        id="assignee"
                                        className="add-input"
                                        placeholder="Select Assignees"
                                        value={tasks[index]?.assigneeName || []}
                                        onChange={(selectedAssignees) => handleAssignee(selectedAssignees, index)}
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
                                </div>
                            ))}
                        </div>
                        <div style={{ position: "relative", bottom: 0, left: 0, right: 0 }}>
                            <div
                                style={{
                                    textAlign: 'center'
                                }}
                            >
                                <button className="add-button" onClick={handleSubmit} disabled={submitting === true} >
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

export default DragAssign;
