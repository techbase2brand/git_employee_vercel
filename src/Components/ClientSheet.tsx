import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Navbar from "./Navbar";
import axios from "axios";
import { Table, Checkbox, Select } from "antd";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Option } from "antd/es/mentions";

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

const ClientSheet: React.FC<any> = () => {
    const [data1, setData1] = useState<Project[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string>("");
    const [employeeFirstNames, setEmployeeFirstNames] = useState<string[]>([]);
    const [morningComments, setMorningComments] = useState<Record<string, string>>({});
    const [morningChecks, setMorningChecks] = useState<Record<string, boolean>>({});
    const [favirotes, setFavirotesChecks] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [eveningChecks, setEveningChecks] = useState<Record<string, boolean>>({});
    const [eveningComments, setEveningComments] = useState<Record<string, string>>({});
    const [filterOption, setFilterOption] = useState<string>("FAVORITE");
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({ message: "", data: {} });
    const [filterOpt, setFilterOpt] = useState<FilterOptions>();
    const [estTimes, setEstTimes] = useState<Record<string, string>>({});
    const [actTimes, setActTimes] = useState<Record<string, string>>({});

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

    const filteredChecked = Array.isArray(filterOpt?.data)
        ? filterOpt?.data.filter((item: FilterOption) => item.favorite === 1)
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
                const isFavoriteForEmployee =
                    filteredChecked &&
                    filteredChecked.some(
                        (item) =>
                            item.projectName === record.projectName && item.favorite === 1
                    );

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
            assignedBy: assignedBy,
            favirotes: favirotes,
            EmployeeID: EmployeeId,
            estTimes: estTimes,
            actTimes: actTimes,
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
                            <div style={{ display: 'flex', gap: '20px' }} className="placeholder-color">
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
                                        .filter(name => ["Arshpreet", "Manpreet", "Aashu", "Yugal"].includes(name))
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
                                        <Select.Option value="Aashu">Aashu</Select.Option>
                                        <Select.Option value="Arshpreet">Arshpreet</Select.Option>
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

                                {EmployeeId === "B2B00023" &&
                                    <Select defaultValue="FAVORITE" onChange={handleFilterChange} style={{ width: 120, border: '1px solid black', borderRadius: '5px' }}>
                                        <Option value="ALL">ALL</Option>
                                        <Option value="FAVORITE">ALL FAVORITE</Option>
                                        <Select.Option value="Aashu">Aashu</Select.Option>
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
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                    marginTop: "35px",
                                }}
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
