import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Input } from "antd";

const { Search } = Input;

interface Task {
    MrngTaskID?: number;
    EvngTaskID?: number;
    projectName: string;
    phaseName: string;
    module: string;
    task: string;
    estTime: string;
    actTime: string;
    upWorkHrs: string;
    employeeID: string;
    currDate: string;
    selectDate: string;
    approvedBy: string | null;
    status: string | null;
}

interface Project {
    ProID: string | number;
    clientName: string;
    projectName: string;
    projectDescription: string;
    hiding: string;
}

interface Employee {
    EmpID: number;
    firstName: string;
    lastName: string;
    role: string;
    dob: string | Date;
    EmployeeID: string;
    status: number;
}

const NewDashboard = () => {
    const [morning, setMorning] = useState<Task[]>([]);
    const [evening, setEvening] = useState<Task[]>([]);
    const [combinedTasks, setCombinedTasks] = useState<Task[]>([]);
    const [empName, setEmpName] = useState<Employee[]>([]);
    const [projectsInfo, setProjectsInfo] = useState<Project[]>([]);
    const [searchText, setSearchText] = useState<string>(""); // State for search input
    const [selectedRole, setSelectedRole] = useState<string>(""); // State for selected role

    useEffect(() => {
        axios
            .get<Task[]>(`${process.env.REACT_APP_API_BASE_URL}/get/addTaskMorning`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('myToken')}`
                }
            })
            .then((response) => {
                setMorning(response.data);
            })
            .catch((error) => {
                console.error("Error fetching morning tasks:", error);
            });
    }, []);

    useEffect(() => {
        axios
            .get<Project[]>(`${process.env.REACT_APP_API_BASE_URL}/get/projects`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("myToken")}`,
                },
            })
            .then((response) => {
                setProjectsInfo(response.data);
            });
    }, []);

    useEffect(() => {
        axios
            .get<Task[]>(`${process.env.REACT_APP_API_BASE_URL}/get/addTaskEvening`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('myToken')}`
                }
            })
            .then((response) => {
                setEvening(response.data);
            })
            .catch((error) => {
                console.error("Error fetching evening tasks:", error);
            });
    }, []);

    useEffect(() => {
        axios
            .get<Employee[]>(`${process.env.REACT_APP_API_BASE_URL}/employees`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("myToken")}`,
                },
            })
            .then((response) => {
                const sortedData = response.data.sort((a, b) =>
                    a.firstName.localeCompare(b.firstName)
                );
                const filteredData = sortedData.filter((emp) => emp.status === 1);
                setEmpName(filteredData);
            })
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

        const morningTasks = morning.filter(task => task.currDate === today);
        const eveningTasks = evening.filter(task => task.currDate === today);

        // Interleave morning and evening tasks where employeeID matches
        const combined: Task[] = [];
        morningTasks.forEach((morningTask) => {
            combined.push(morningTask); // Add the morning task first

            // Find corresponding evening task with matching employeeID
            const matchingEveningTask = eveningTasks.find(
                (eveningTask) => eveningTask.employeeID === morningTask.employeeID
            );

            if (matchingEveningTask) {
                combined.push(matchingEveningTask); // Add the matching evening task
                // Remove the matched evening task from the array to prevent duplicate entries
                eveningTasks.splice(eveningTasks.indexOf(matchingEveningTask), 1);
            }
        });

        // Add remaining evening tasks that did not have a matching morning task
        combined.push(...eveningTasks);

        setCombinedTasks(combined);
    }, [morning, evening]);

    // Helper function to get the employee's first name by employeeID
    const getEmployeeName = (employeeID: string) => {
        const employee = empName.find(emp => emp.EmployeeID === employeeID);
        return employee ? employee.firstName : employeeID; // Return firstName if found, otherwise fallback to employeeID
    };

    // Function to convert time string (e.g., "1:50") to total minutes
    const convertTimeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return (hours || 0) * 60 + (minutes || 0);
    };

    // Function to format time in "H:MM" format from total minutes
    const formatTimeFromMinutes = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}:${mins < 10 ? '0' : ''}${mins}`;
    };

    // Group tasks by employeeID
    const groupedTasks = combinedTasks.reduce((acc, task) => {
        if (!acc[task.employeeID]) {
            acc[task.employeeID] = [];
        }
        acc[task.employeeID].push(task);
        return acc;
    }, {} as Record<string, Task[]>);

    // Filter grouped tasks based on search input and selected role
    const filteredGroupedTasks = Object.entries(groupedTasks).filter(([employeeID]) => {
        const employee = empName.find(emp => emp.EmployeeID === employeeID);
        const employeeName = employee ? employee.firstName.toLowerCase() : "";
        const employeeRole = employee ? employee.role : "";

        const matchesName = employeeName.includes(searchText.toLowerCase());
        const matchesRole = selectedRole === "" || employeeRole === selectedRole;

        return matchesName && matchesRole;
    });

    const uniqueRoles = Array.from(new Set(empName.map(emp => emp.role)));

    return (
        <div className="emp-main-div">
            <div style={{ display: "flex", flexDirection: "column" }} className="form-container">
                <p className="mrng-tas">Employee Activity</p>
                <div className='fiters-dashboard-rs'>
                    <Search
                        placeholder="Search by employee name"
                        onChange={(e) => setSearchText(e.target.value)} // Update search text on change
                        style={{ width: 300 }}
                    />
                    <select
                        className='roles-rs'
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)} // Update selected role on change
                    >
                        <option value="">Select Role</option>
                        {uniqueRoles.map((role, index) => (
                            <option key={index} value={role}>{role}</option>
                        ))}
                    </select>
                </div>

                {filteredGroupedTasks.map(([employeeID, tasks]) => {
                    // Calculate totals for Morning and Evening
                    const morningTotals = { actTime: 0, estTime: 0, upWorkHrs: 0 };
                    const eveningTotals = { actTime: 0, estTime: 0, upWorkHrs: 0 };

                    tasks.forEach((task) => {
                        const isMorning = task.MrngTaskID !== undefined;
                        if (isMorning) {
                            morningTotals.actTime += convertTimeToMinutes(task.actTime || "0:00");
                            morningTotals.estTime += convertTimeToMinutes(task.estTime || "0:00");
                            morningTotals.upWorkHrs += convertTimeToMinutes(task.upWorkHrs || "0:00");
                        } else {
                            eveningTotals.actTime += convertTimeToMinutes(task.actTime || "0:00");
                            eveningTotals.estTime += convertTimeToMinutes(task.estTime || "0:00");
                            eveningTotals.upWorkHrs += convertTimeToMinutes(task.upWorkHrs || "0:00");
                        }
                    });

                    return (
                        <div key={employeeID} className='emp-table-rs'>
                            <h3 className='emp-name_rs'>{getEmployeeName(employeeID)}</h3> {/* Display the employee's name */}
                            <div className='mrng-newDashboard'>Morning :- <span>Act. Time: {formatTimeFromMinutes(morningTotals.actTime)}</span>,<span> Est. Time: {formatTimeFromMinutes(morningTotals.estTime)}</span>,<span> Upwork Time: {formatTimeFromMinutes(morningTotals.upWorkHrs)}</span></div>
                            <div className='evng-newDashboard'>Evening :- <span>Act. Time: {formatTimeFromMinutes(eveningTotals.actTime)}</span>,<span>Est. Time: {formatTimeFromMinutes(eveningTotals.estTime)}</span>,<span> Upwork Time: {formatTimeFromMinutes(eveningTotals.upWorkHrs)}</span></div>
                            <table>
                                <thead>
                                    <tr className='table-new-row'>
                                        <th>Day Type</th>
                                        <th>Project</th>
                                        <th>Phase</th>
                                        <th>Module</th>
                                        <th>Task</th>
                                        <th>Est.</th>
                                        <th>Act.</th>
                                        <th>UpWork</th>
                                        <th>TL</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((task) => {
                                        const project = projectsInfo.find(
                                            (project) => project.projectName === task.projectName
                                        );
                                        const clientName = project ? project?.clientName : "";
                                        const projectName = project ? project?.projectName : "";
                                        return (
                                            <tr
                                                key={task.MrngTaskID || task.EvngTaskID}
                                                style={{
                                                    backgroundColor: task.MrngTaskID ? '#329d32' : 'transparent', // Green background for morning tasks
                                                    color: task.MrngTaskID ? 'white' : 'inherit' // White text color for better contrast on green background
                                                }}
                                            >
                                                <td>{task.MrngTaskID ? "Morning" :"Evening"}</td>
                                                <td style={{ maxWidth: '220px' }}>{`${clientName} - ${projectName}`}</td>
                                                <td>{task.phaseName}</td>
                                                <td>{task.module}</td>
                                                <td className='task-color-rs'>{task.task}</td>
                                                <td>{task.estTime}</td>
                                                <td>{task.actTime}</td>
                                                <td>{task.upWorkHrs}</td>
                                                <td>{task.approvedBy}</td>
                                                <td>{task.status}</td>
                                                <td>{task.currDate}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default NewDashboard;
