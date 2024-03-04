import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Checkbox, Select } from "antd";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Option } from "antd/es/mentions";
import { format } from "date-fns";
import DragAssign from "./DragAssign";
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
    estTimes: string;
    actTimes: string;
}

interface FilterOptions {
    message: string;
    data: Record<string, boolean>;
}

interface FilterOption {
    projectName: string;
    favorite: number;
    assignedBy: string;
    EmployeeID: string;
    AssigneeName: string;
}

interface ClientSheetData {
    id: number;
    projectName: string;
    AssigneeName: string;
    morningComment: string | null;
    morningCheck: number;
    eveningCheck: number;
    eveningComment: string | null;
    assignedBy: string;
    estTime: string;
    actTime: string;
    created_at: string;
}

const ClientSheet: React.FC<any> = () => {
    const [data1, setData1] = useState<Project[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string>("");
    const [employeeFirstNames, setEmployeeFirstNames] = useState<string[]>([]);
    const [morningComments, setMorningComments] = useState<Record<string, string>>({});
    const [morningChecks, setMorningChecks] = useState<Record<string, boolean>>({});
    const [data, setData] = useState<ClientSheetData[]>([]);
    const [favirotes, setFavirotesChecks] = useState<Record<string, boolean>>({});
    const [taskRemainder, setTaskRemainder] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [eveningChecks, setEveningChecks] = useState<Record<string, boolean>>({});
    const [eveningComments, setEveningComments] = useState<Record<string, string>>({});
    const [filterOption, setFilterOption] = useState<string>("FAVORITE");
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({ message: "", data: {} });
    const [filterOpt, setFilterOpt] = useState<FilterOptions>();
    const [estTimes, setEstTimes] = useState<Record<string, string>>({});
    const [actTimes, setActTimes] = useState<Record<string, string>>({});
    const [selectAllMorningTasks, setSelectAllMorningTasks] = useState<boolean>(false);
    const [currentDate] = useState<Date>(new Date());
    const formattedDate = format(currentDate, "yyyy-MM-dd");

    const myDataString = localStorage.getItem('myData');
    let assignedBy = "";
    let EmployeeId = "";
    if (myDataString) {
        const myData = JSON.parse(myDataString);
        assignedBy = myData.firstName;
        EmployeeId = myData.EmployeeID
    }

    const filteredDataByEmployee = Array.isArray(filterOpt?.data)
        ? filterOpt?.data.filter((item: FilterOption) => item.AssigneeName === filterOption)
        : [];

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
    }, [data]);

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

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/get/filter-options`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        }).then((response) => {
            setFilterOpt(response.data);

            const filterOptionsData: Record<string, boolean> = response.data.data.reduce((acc: any, project: any) => {
                acc[project.projectName] = project.favorite === 1;
                return acc;
            }, {});

            const updatedFilterOptions: FilterOptions = {
                message: response.data.message,
                data: filterOptionsData,
            };

            setFilterOptions(updatedFilterOptions);
        });
    }, [data1, filterOption]);

    const handleFilterChange = (value: string) => {
        setFilterOption(value);
        setMorningChecks({});
    };

    const filteredData: Project[] = data1
        .filter((project) => {
            if (filterOption === "ALL") {
                return project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || project.clientName.toLowerCase().includes(searchTerm.toLowerCase());
            } else if (filterOption === "FAVORITE" && filterOpt?.data && Array.isArray(filterOpt.data)) {
                const assignedProjects = filterOpt.data.filter((opt: FilterOption | boolean): opt is FilterOption => typeof opt !== 'boolean');
                return (
                    (assignedProjects.some((opt) => opt.projectName === project.projectName) ||
                        favirotes[project.projectName]) &&
                    (project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        project.clientName.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            } else if (filterOption !== "ALL" && filteredDataByEmployee && filteredDataByEmployee.length > 0) {
                return (
                    filteredDataByEmployee.some((opt) => opt.projectName === project.projectName) &&
                    (project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        project.clientName.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }
            return false;
        })
        .map((project) => ({
            ...project,
            key: project.ProID,
            eveningComment: "",
        }));

    const handleEstTimeChange = (projectName: string, value: string) => {
        setEstTimes((prevEstTimes) => ({
            ...prevEstTimes,
            [projectName]: value,
        }));
    };
    const handleActTimeChange = (projectName: string, value: string) => {
        setActTimes((prevEstTimes) => ({
            ...prevEstTimes,
            [projectName]: value,
        }));
    };

    const columns = [
        {
            title: "Client Name",
            dataIndex: "clientName",
            key: "clientName",
            render: (text: string) => <div>{text}</div>,
        },
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
            render: (_: any, record: Project) => {
                return (
                    <Checkbox
                        style={{ border: '2px solid black', borderRadius: '6px' }}
                        checked={morningChecks[record.projectName]}
                        onChange={() => handleCheckboxChange(record.projectName, true)}
                    />
                )
            },
        },
        {
            title: "favorite",
            dataIndex: "select",
            key: "select",
            render: (_: any, record: Project) => {
                return (
                    <Checkbox
                        style={{
                            border: '2px solid black',
                            borderRadius: '6px',
                        }}
                        checked={favirotes[record.projectName]}
                        onChange={() => handleCheckboxChangeFav(record.projectName, true)}
                    />
                );
            },
        },
        {
            title: "Reply/Rem.",
            dataIndex: "select",
            key: "select",
            render: (_: any, record: Project) => {
                return (
                    <Checkbox
                        style={{
                            border: '2px solid black',
                            borderRadius: '6px',
                        }}
                        checked={taskRemainder[record.projectName]}
                        onChange={() => handleCheckboxChangeTask(record.projectName, true)}
                    />
                );
            },
        },
        {
            title: "Est.Hour",
            dataIndex: "estTime",
            key: "estTime",
            render: (text: string, record: Project) => {
                return (
                    <Select
                        value={estTimes[record.projectName] || ""}
                        onChange={(value) => handleEstTimeChange(record.projectName, value)}
                    >
                        <Option value="">--Select Time--</Option>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((hour) =>
                            [0, 10, 20, 30, 40, 50].map((minute) => (
                                <Option
                                    key={`${hour}:${minute}`}
                                    value={`${hour}:${minute}`}
                                >
                                    {`${hour} hours ${minute} mins`}
                                </Option>
                            ))
                        )}
                    </Select>
                )
            },
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
                    style={{ border: '2px solid black', borderRadius: '6px' }}
                    checked={eveningChecks[record.projectName]}
                    onChange={() => handleCheckboxChange(record.projectName, false)}
                    disabled={!morningChecks[record.projectName]}
                />
            ),
        },
        {
            title: "Act.Hour",
            dataIndex: "estTime",
            key: "estTime",
            render: (text: string, record: Project) => {
                return (
                    <Select
                        value={actTimes[record.projectName] || ""}
                        onChange={(value) => handleActTimeChange(record.projectName, value)}
                    >
                        <Option value="">--Select Time--</Option>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((hour) =>
                            [0, 10, 20, 30, 40, 50].map((minute) => (
                                <Option
                                    key={`${hour}:${minute}`}
                                    value={`${hour}:${minute}`}
                                >
                                    {`${hour} hours ${minute} mins`}
                                </Option>
                            ))
                        )}
                    </Select>
                )
            },
        },
        {
            title: "Evening Comment",
            dataIndex: "projectName",
            key: "eveningComment",
            render: (text: string, record: Project) => {
                return (
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
                )
            },
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

    useEffect(() => {
        let initialFavirotes: Record<string, boolean> = {};

        if (filterOptions.data) {
            const filterOptionArray: FilterOption[] = Object.entries(filterOptions.data).map(([projectName, favorite]) => ({
                projectName,
                favorite: favorite ? 1 : 0,
                assignedBy: '',
                EmployeeID: '',
                AssigneeName: '',
            }));
            initialFavirotes = filterOptionArray.reduce(
                (acc: Record<string, boolean>, project: FilterOption) => {
                    acc[project.projectName] = project.favorite === 1;
                    return acc;
                },
                {}
            );
        }

        setFavirotesChecks(initialFavirotes);
    }, [filterOptions.data]);


    const handleCheckboxChangeFav = (projectName: string, isMorning: boolean) => {
        setFavirotesChecks((prevChecks: any) => {
            const updatedChecks = {
                ...prevChecks,
                [projectName]: !prevChecks[projectName],
            };
            axios
                .put(
                    `${process.env.REACT_APP_API_BASE_URL}/update-favorite-status`,
                    {
                        projectName,
                        favorite: updatedChecks[projectName] ? 1 : 0,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('myToken')}`,
                        },
                    }
                )
                .then((response) => {
                    console.log("Favorite status updated successfully");
                })
                .catch((error) => {
                    console.error('Error while updating favorite status:', error);
                });

            return updatedChecks;
        });
    };

    const handleCheckboxChangeTask = (projectName: string, isMorning: boolean) => {
        setTaskRemainder((prevChecks: any) => {
            const updatedChecks = {
                ...prevChecks,
                [projectName]: !prevChecks[projectName],
            };
            if (updatedChecks[projectName]) {
                setMorningChecks((prevMorningChecks) => ({
                    ...prevMorningChecks,
                    [projectName]: true,
                }));
            }
            axios
                .put(
                    `${process.env.REACT_APP_API_BASE_URL}/update-task-status`,
                    {
                        projectName,
                        taskRemainder: updatedChecks[projectName] ? 1 : 0,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('myToken')}`,
                        },
                    }
                )
                .then((response) => {
                    console.log("taskRemainder status updated successfully");
                })
                .catch((error) => {
                    console.error('Error while updating taskRemainder status:', error);
                });

            return updatedChecks;
        });
    };
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/get-data`)
            .then(response => {
                const filteredData = response.data.data.filter((item: any) => item.created_at.split('T')[0] === formattedDate)
                const sortedData = filteredData.sort(
                    (a: any, b: any) => Number(b.id) - Number(a.id)
                );
                setData(sortedData);
            })
            .catch(error => {
                console.error('Error while fetching data:', error);
            });
    }, []);

    const handleSend = () => {
        if (!selectedEmployee) {
            toast.error('Please select an employee', {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }
        const newMorningChecks: Record<string, boolean> = Object.keys(morningChecks)
            .filter((projectName) => !data.some((item) =>
                item.AssigneeName === selectedEmployee &&
                item.created_at.split('T')[0] === formattedDate &&
                item.morningCheck &&
                item.projectName === projectName
            ))
            .reduce((acc, projectName) => {
                acc[projectName] = true;
                return acc;
            }, {} as Record<string, boolean>);


        // const selectedMorningChecks: Record<string, boolean> = Object.keys(morningChecks)
        //     .filter((projectName) => morningChecks[projectName])
        //     .reduce((acc, projectName) => {
        //         acc[projectName] = true;
        //         return acc;
        //     }, {} as Record<string, boolean>);

        const requestData = {
            employee: selectedEmployee,
            clients: Object.keys(morningChecks),
            morningComments: morningComments,
            morningChecks: morningChecks,
            eveningChecks: eveningChecks,
            eveningComments: eveningComments,
            assignedBy: assignedBy,
            favirotes: favirotes,
            EmployeeID: EmployeeId,
            estTimes: estTimes,
            actTimes: actTimes,
            taskRemainder: taskRemainder,
            clientNames: filteredData.reduce((acc, project) => {
                acc[project.projectName] = project.clientName;
                return acc;
            }, {} as Record<string, string>),
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
                toast.success('Data sent successfully!', {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setMorningChecks({});
                setEveningChecks({});
                setMorningComments({});
                setEveningComments({});
                setSelectedEmployee("");
                setSelectAllMorningTasks(false);
                setActTimes({});
                setEstTimes({});
                setSearchTerm("");
            })
            .catch((error) => {
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

                <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>

                    <div
                        style={{ display: "flex", flexDirection: "column" }}
                        className="form-container"
                    >
                        <div
                        >
                            <p
                                className="mrng-tas"
                            >
                                AssignTl Task</p>
                            <div className="placeholder-color">
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search"
                                    style={{
                                        marginLeft: 10,
                                        border: '2px solid black',
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
                                        width: '30%', height: 'fit-Content',
                                        borderRadius: '6px', border: '2px solid black'
                                    }}
                                    onChange={(value) => setSelectedEmployee(value)}
                                    value={selectedEmployee || undefined}
                                >
                                    {employeeFirstNames
                                        .filter(name => ["Arshpreet", "Manpreet", "Yugal", "Sahil", "Sandeep", "Zaid", "Sameer", "Suraj"].includes(name))
                                        .sort()
                                        .map((name, index) => (
                                            <Select.Option key={index} value={name}>
                                                {name}
                                            </Select.Option>
                                        ))}
                                </Select>
                                {EmployeeId === "B2B00100" &&
                                    <Select defaultValue="FAVORITE" onChange={handleFilterChange} style={{ width: '15%', border: '2px solid black', borderRadius: '5px' }}>
                                        <Option value="ALL">ALL</Option>
                                        <Option value="FAVORITE">ALL FAVORITE</Option>
                                        <Select.Option value="Yugal">Yugal</Select.Option>
                                        <Select.Option value="Manpreet">Manpreet</Select.Option>
                                        <Select.Option value="Arshpreet">Arshpreet</Select.Option>
                                        <Select.Option value="Zaid">Zaid</Select.Option>
                                        <Select.Option value="Sandeep">Sandeep</Select.Option>
                                        <Select.Option value="Sahil">Sahil</Select.Option>
                                        <Select.Option value="Sameer">Sameer</Select.Option>
                                        <Select.Option value="Suraj">Suraj</Select.Option>
                                    </Select>
                                }
                                {EmployeeId === "B2B00048" &&
                                    <Select defaultValue="FAVORITE" onChange={handleFilterChange} style={{ width: 120, border: '1px solid black', borderRadius: '5px' }}>
                                        <Option value="ALL">ALL</Option>
                                        <Option value="FAVORITE">ALL FAVORITE</Option>
                                        <Select.Option value="Suraj">Suraj</Select.Option>
                                    </Select>
                                }
                                {EmployeeId === "B2B00022" &&
                                    <Select defaultValue="FAVORITE" onChange={handleFilterChange} style={{ width: 120, border: '1px solid black', borderRadius: '5px' }}>
                                        <Option value="ALL">ALL</Option>
                                        <Option value="FAVORITE">ALL FAVORITE</Option>
                                        <Select.Option value="Yugal">Yugal</Select.Option>
                                    </Select>
                                }

                                {EmployeeId === "B2B00026" &&
                                    <Select defaultValue="FAVORITE" onChange={handleFilterChange} style={{ width: 120, border: '1px solid black', borderRadius: '5px' }}>
                                        <Option value="ALL">ALL</Option>
                                        <Option value="FAVORITE">ALL FAVORITE</Option>
                                        <Select.Option value="Manpreet">Manpreet</Select.Option>
                                    </Select>
                                }

                                {EmployeeId === "B2B00027" &&
                                    <Select defaultValue="FAVORITE" onChange={handleFilterChange} style={{ width: 120, border: '1px solid black', borderRadius: '5px' }}>
                                        <Option value="ALL">ALL</Option>
                                        <Option value="FAVORITE">ALL FAVORITE</Option>
                                        <Select.Option value="Arshpreet">Arshpreet</Select.Option>
                                    </Select>
                                }

                                {EmployeeId === "B2B00033" &&
                                    <Select defaultValue="FAVORITE" onChange={handleFilterChange} style={{ width: 120, border: '1px solid black', borderRadius: '5px' }}>
                                        <Option value="ALL">ALL</Option>
                                        <Option value="FAVORITE">ALL FAVORITE</Option>
                                        <Select.Option value="Sahil">Sahil</Select.Option>
                                    </Select>
                                }
                                {EmployeeId === "B2B00010" &&
                                    <Select defaultValue="FAVORITE" onChange={handleFilterChange} style={{ width: 120, border: '1px solid black', borderRadius: '5px' }}>
                                        <Option value="ALL">ALL</Option>
                                        <Option value="FAVORITE">ALL FAVORITE</Option>
                                        <Select.Option value="Sandeep">Sandeep</Select.Option>
                                    </Select>
                                }
                                {EmployeeId === "B2B00008" &&
                                    <Select defaultValue="FAVORITE" onChange={handleFilterChange} style={{ width: 120, border: '1px solid black', borderRadius: '5px' }}>
                                        <Option value="ALL">ALL</Option>
                                        <Option value="FAVORITE">ALL FAVORITE</Option>
                                        <Select.Option value="Zaid">Zaid</Select.Option>
                                    </Select>
                                }
                                {EmployeeId === "B2B00029" &&
                                    <Select defaultValue="FAVORITE" onChange={handleFilterChange} style={{ width: 120, border: '1px solid black', borderRadius: '5px' }}>
                                        <Option value="ALL">ALL</Option>
                                        <Option value="FAVORITE">ALL FAVORITE</Option>
                                        <Select.Option value="Sameer">Sameer</Select.Option>
                                    </Select>
                                }
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
                            <DragAssign />
                            {(filterOption === "FAVORITE" || filterOption === "Arshpreet" || filterOption === "Manpreet" || filterOption === "Yugal") &&
                                <Checkbox
                                    style={{
                                        marginLeft: '28%'
                                    }}
                                    checked={selectAllMorningTasks}
                                    onChange={(e) => {
                                        setSelectAllMorningTasks(e.target.checked);
                                        if (e.target.checked) {
                                            const checkedMorningTasks: Record<string, boolean> = {};
                                            filteredData.forEach((project) => {
                                                checkedMorningTasks[project.projectName] = true;
                                            });
                                            setMorningChecks(checkedMorningTasks);
                                        } else {
                                            setMorningChecks({});
                                        }
                                    }}
                                >Select All Morning Check</Checkbox>
                            }
                            <div
                                className="clientSheetTlTask"
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
