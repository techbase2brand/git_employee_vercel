import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Navbar from "./Navbar";
import axios from "axios";
import { Table, Checkbox, Select } from "antd";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Employee {
    EmpID: string | number;
    firstName: string;
    role: string;
    dob: string | Date;
    EmployeeID: string;
}
interface Project {
    key: string | number;
    ProID: string | number;
    clientName: string;
    projectName: string;
    projectDescription: string;
}



const ClientSheet: React.FC<any> = () => {
    const [data1, setData1] = useState<Project[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string>("");
    const [employeeFirstNames, setEmployeeFirstNames] = useState<string[]>([]);
    const [morningComments, setMorningComments] = useState<Record<string, string>>({});
    const [morningChecks, setMorningChecks] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [eveningChecks, setEveningChecks] = useState<Record<string, boolean>>({});
    const [eveningComments, setEveningComments] = useState<Record<string, string>>({});

    const myDataString = localStorage.getItem('myData');
    let assignedBy = "";
    if (myDataString) {
        const myData = JSON.parse(myDataString);
        assignedBy = myData.firstName;
    }
console.log("assignedBy",assignedBy);

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
                const employeeNames = sortedData.map((employee) => employee.firstName);

                setEmployeeFirstNames(employeeNames);
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

    const filteredData: Project[] = data1
        .filter((project) => project.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((project) => ({
            ...project,
            key: project.ProID,
            eveningComment: "",
        }));

    const columns = [
        {
            title: "Project Name",
            dataIndex: "projectName",
            key: "projectName",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Morning task",
            dataIndex: "select",
            key: "select",
            render: (_: any, record: Project) => (
                <Checkbox
                    checked={morningChecks[record.projectName]}
                    onChange={() => handleCheckboxChange(record.projectName, true)}
                />
            ),
        },
        {
            title: "Morning Comment",
            dataIndex: "projectName",
            key: "morningComment",
            render: (text: string, record: Project) => (
                <div>
                    {morningChecks[record.projectName] &&
                        <textarea
                            value={morningComments[text] || ""}
                            onChange={(e) => {
                                const updatedComments = { ...morningComments, [text]: e.target.value };
                                setMorningComments(updatedComments);
                            }}
                        />
                    }
                </div>
            ),
        },
        {
            title: "Evening task",
            dataIndex: "projectName",
            key: "eveningCheck",
            render: (_: any, record: Project) => (
                <Checkbox
                    checked={eveningChecks[record.projectName]}
                    onChange={() => handleCheckboxChange(record.projectName, false)}
                    disabled={!morningChecks[record.projectName]}
                />
            ),
        },
        {
            title: "Evening Comment",
            dataIndex: "projectName",
            key: "eveningComment",
            render: (text: string, record: Project) => (
                <div>
                    {eveningChecks[record.projectName] &&
                        <textarea
                            value={eveningComments[record.projectName] || ""}
                            onChange={(e) => {
                                const updatedComments = { ...eveningComments, [record.projectName]: e.target.value };
                                setEveningComments(updatedComments);
                            }}
                        />
                    }
                </div>
            ),
        },



    ];


    const handleCheckboxChange = (projectName: string, isMorning: boolean) => {
        if (isMorning) {
            setMorningChecks((prevChecks) => ({
                ...prevChecks,
                [projectName]: !prevChecks[projectName],
            }));
        } else {
            setEveningChecks((prevChecks) => ({
                ...prevChecks,
                [projectName]: !prevChecks[projectName],
            }));
        }
    };

    const handleSend = () => {
        if (!selectedEmployee) {
            toast.error('Please select an employee', {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }

        const requestData = {
            employee: selectedEmployee,
            clients: Object.keys(morningChecks),
            morningComments: morningComments,
            morningChecks: morningChecks,
            eveningChecks: eveningChecks,
            eveningComments: eveningComments,
            assignedBy:assignedBy
        };

        axios
            .post(
                `${process.env.REACT_APP_API_BASE_URL}/add-data`,
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('myToken')}`,
                    },
                }
            )
            .then((response) => {
                console.log('Data sent successfully:', response.data);
                toast.success('Data sent successfully!', {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setMorningChecks({});
                setEveningChecks({});
                setMorningComments({});
                setEveningComments({});
                setSelectedEmployee("");
            })
            .catch((error) => {
                console.error('Error while sending data:', error);
                toast.error('Error while sending data.', {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    const paginationSettings = {
        pageSize: 100,
    };
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
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search"
                                    style={{
                                        marginLeft: 10,
                                        border: '1px solid #d9d9d9',
                                        borderRadius: '6px',
                                        height: '43px',
                                    }}
                                />
                                <Select
                                    showSearch
                                    placeholder="Select assigned Name"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        typeof option?.children === "string" &&
                                        (option?.children as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    style={{
                                        width: '30%', height: 'fit-Content', border: '1px solid #d8d6d6',
                                        borderRadius: '6px'
                                    }}
                                    onChange={(value) => setSelectedEmployee(value)}
                                    value={selectedEmployee || undefined}
                                >
                                    {employeeFirstNames.map((name, index) => (
                                        <Select.Option key={index} value={name}>
                                            {name}
                                        </Select.Option>
                                    ))}
                                </Select>

                                <div
                                    style={{
                                        textAlign: "center",

                                    }}
                                >
                                    <button className="add-button" onClick={handleSend} style={{ marginTop: '0' }}>
                                        Send
                                    </button>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                    marginTop: "35px",
                                }}
                            >
                                <Table columns={columns} dataSource={filteredData} pagination={paginationSettings} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientSheet;
