import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Navbar from "./Navbar";
import axios from "axios";
import { Button, Checkbox, Select, Table, DatePicker } from "antd";
import 'react-toastify/dist/ReactToastify.css';
import { DeleteOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import { format } from "date-fns";
import ViewLead from "./ViewLead";
import ViewTlBacklog from "./ViewTlBacklog";
const { RangePicker } = DatePicker;

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
    taskRemainder: number;
}




const ViewClientSheet: React.FC<any> = () => {
    const [data, setData] = useState<ClientSheetData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [editMode, setEditMode] = useState<number | null>(null);
    const [editEveningCommentMode, setEditEveningCommentMode] = useState<number | null>(null);
    const [editedMorningComments, setEditedMorningComments] = useState<Record<string, string>>({});
    const [editedEveningComments, setEditedEveningComments] = useState<Record<string, string>>({});
    const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
    const [assigneeOptions, setAssigneeOptions] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);
    const [currentDate] = useState<Date>(new Date());
    const formattedDate = format(currentDate, "yyyy-MM-dd");
    //viewleads

    const myDataString = localStorage.getItem('myData');
    let employeeName = "";
    let employeeID = "";
    if (myDataString) {
        const myData = JSON.parse(myDataString);
        employeeName = myData.firstName;
        employeeID = myData.EmployeeID;
    }

    const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
        setDateRange(dateStrings);
    };

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/get-data`)
            .then(response => {
                let filteredData;
                const uniqueAssignees: string[] = Array.from(new Set((response.data.data as ClientSheetData[]).map(item => item.AssigneeName)))
                    .filter(assignee => assignee !== "");
                setAssigneeOptions(uniqueAssignees);

                if (dateRange[0] && dateRange[1]) {
                    const startDate = new Date(dateRange[0]!).getTime();
                    const endDate = new Date(dateRange[1]!).getTime();
                    filteredData = response.data.data.filter((obj: any) => {
                        const taskDate = new Date(obj.created_at.split('T')[0]).getTime();
                        return taskDate >= startDate && taskDate <= endDate;
                    });
                } else {
                    filteredData = response.data.data.filter((item: any) => item.created_at.split('T')[0] === formattedDate)
                }
                const sortedData = filteredData.sort(
                    (a: any, b: any) => Number(b.id) - Number(a.id)
                );
                setData(sortedData);
            })
            .catch(error => {
                console.error('Error while fetching data:', error);
            });
    }, [dateRange]);

    // const filteredData = data.filter((project) => {
    //     if (employeeID === "B2B00100") {
    //         return project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) && project.AssigneeName !== "" && project.AssigneeName === selectedAssignee;
    //     } else {
    //         const isAssignedByEmployee = project.assignedBy === employeeName;
    //         const isAssignedToEmployee = project.AssigneeName === employeeName;
    //         return (
    //             (isAssignedByEmployee || isAssignedToEmployee) &&
    //             project.assignedBy !== "" &&
    //             project.AssigneeName !== "" &&
    //             project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    //             project.AssigneeName === selectedAssignee
    //         );
    //     }
    // });
    const filteredData = data.filter((project) => {
        if (employeeID === "B2B00100" && project.taskRemainder === 0) {
            return (
                project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                project.AssigneeName !== "" &&
                (selectedAssignee ? project.AssigneeName === selectedAssignee : true)
            );
        } else {
            const isAssignedByEmployee = project.assignedBy === employeeName && project.taskRemainder === 0;
            const isAssignedToEmployee = project.AssigneeName === employeeName && project.taskRemainder === 0;
            return (
                (isAssignedByEmployee || isAssignedToEmployee) &&
                project.assignedBy !== "" &&
                project.AssigneeName !== "" &&
                project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (selectedAssignee ? project.AssigneeName === selectedAssignee : true)
            );
        }
    });

    const filteredRemainder = data.filter((project) => {
        if (employeeID === "B2B00100" && project.taskRemainder === 1) {
            return (
                project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                project.AssigneeName !== "" &&
                (selectedAssignee ? project.AssigneeName === selectedAssignee : true)
            );
        } else {
            const isAssignedByEmployee = project.assignedBy === employeeName && project.taskRemainder === 1;
            const isAssignedToEmployee = project.AssigneeName === employeeName && project.taskRemainder === 1;
            return (
                (isAssignedByEmployee || isAssignedToEmployee) &&
                project.assignedBy !== "" &&
                project.AssigneeName !== "" &&
                project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (selectedAssignee ? project.AssigneeName === selectedAssignee : true)
            );
        }
    });
    //act time
    const entriesWithActTime = filteredData.filter(entry => entry.actTime !== null && entry.actTime !== "");
    const actTimeStrings = entriesWithActTime.map(entry => entry.actTime);
    const actTimeArrays = actTimeStrings.map(timeString => timeString.split(':').map(Number));
    const totalMinutes = actTimeArrays.reduce((sum, [hours, minutes]) => sum + hours * 60 + minutes, 0);
    const totalHoursFormatted = Math.floor(totalMinutes / 60);
    const totalMinutesFormatted = totalMinutes % 60;

    //est time
    const entriesWithEstTime = filteredData.filter(entry => entry.estTime !== null && entry.estTime !== "");
    const estTimeStrings = entriesWithEstTime.map(entry => entry.estTime);
    const estTimeArrays = estTimeStrings.map(timeString => timeString.split(':').map(Number));
    const totalEstMinutes = estTimeArrays.reduce((sum, [hours, minutes]) => sum + hours * 60 + minutes, 0);
    const totalEstHoursFormatted = Math.floor(totalEstMinutes / 60);
    const totalEstMinutesFormatted = totalEstMinutes % 60;
    // act time
    const entriesWithAct = filteredRemainder.filter(entry => entry.actTime !== null && entry.actTime !== "");
    const actTimeString = entriesWithAct.map(entry => entry.actTime);
    const actTimeArray = actTimeString.map(timeString => timeString.split(':').map(Number));
    const totalMinute = actTimeArray.reduce((sum, [hours, minutes]) => sum + hours * 60 + minutes, 0);
    const totalHoursFormat = Math.floor(totalMinute / 60);
    const totalMinutesFormat = totalMinute % 60;

    //est time
    const entriesWithEstTimes = filteredRemainder.filter(entry => entry.estTime !== null && entry.estTime !== "");
    const estTimeString = entriesWithEstTimes.map(entry => entry.estTime);
    const estTimeArray = estTimeString.map(timeString => timeString.split(':').map(Number));
    const totalEstMinute = estTimeArray.reduce((sum, [hours, minutes]) => sum + hours * 60 + minutes, 0);
    const totalEstHoursFormat = Math.floor(totalEstMinute / 60);
    const totalEstMinutesFormat = totalEstMinute % 60;
    const paginationSettings = {
        pageSize: 100,
    };

    const handleMorningCheckChange = (record: ClientSheetData) => {
        const updatedData = data.map((item) =>
            item.id === record.id ? { ...item, morningCheck: item.morningCheck === 1 ? 0 : 1 } : item
        );

        setData(updatedData);
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/update-checks/${record.id}`, {
            morningCheck: record.morningCheck === 1 ? 0 : 1,
        })
            .then(response => {
                console.log('Morning check updated successfully:', response.data);
            })
            .catch(error => {
                console.error('Error while updating morning check:', error);
            });
    };

    const handleEveningCheckChange = (record: ClientSheetData) => {
        const updatedData = data.map((item) =>
            item.id === record.id ? { ...item, eveningCheck: item.eveningCheck === 1 ? 0 : 1 } : item
        );

        setData(updatedData);

        axios.put(`${process.env.REACT_APP_API_BASE_URL}/update-checks/${record.id}`, {
            eveningCheck: record.eveningCheck === 1 ? 0 : 1,
        })
            .then(response => {
                console.log('Evening check updated successfully:', response.data);
            })
            .catch(error => {
                console.error('Error while updating evening check:', error);
            });
    };

    const handleMorningCommentChange = (record: ClientSheetData, value: string) => {
        setEditedMorningComments({ ...editedMorningComments, [record.id]: value });
        setEditMode(record.id);
    };

    const handleEveningCommentChange = (record: ClientSheetData, value: string) => {
        setEditedEveningComments({ ...editedEveningComments, [record.id]: value });
        setEditEveningCommentMode(record.id);
    };

    const handleSaveComments = (record: ClientSheetData) => {
        const id = record.id;
        const morningComment = editedMorningComments[id] || record.morningComment || "";
        const eveningComment = editedEveningComments[id] || record.eveningComment || "";

        const updatedData = data.map((item) =>
            item.id === record.id
                ? { ...item, morningComment, eveningComment }
                : item
        );
        setData(updatedData);
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/update-comments/${id}`, {
            morningComment,
            eveningComment,
        })
            .then(response => {
                setEditedMorningComments({ ...editedMorningComments, [record.id]: "" });
                setEditedEveningComments({ ...editedEveningComments, [record.id]: "" });
                setEditMode(null);
                setEditEveningCommentMode(null);
            })
            .catch(error => {
                console.error('Error while updating comments:', error);
            });
    };

    const handleEstTimeChange = (id: number, value: string) => {
        const updatedData = data.map((item) =>
            item.id === id ? { ...item, estTime: value } : item
        );
        setData(updatedData);
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/update-est-time/${id}`, {
            estTime: value,
        })
            .then(response => {
                console.log('Est. time updated successfully:', response.data);
            })
            .catch(error => {
                console.error('Error while updating est. time:', error);
            });
    };

    const handleActTimeChange = (id: number, value: string) => {
        const updatedData = data.map((item) =>
            item.id === id ? { ...item, actTime: value || "" } : item
        );
        setData(updatedData);
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/update-act-time/${id}`, {
            actTime: value || "",
        })
            .then(response => {
                console.log('Act. time updated successfully:', response.data);
            })
            .catch(error => {
                console.error('Error while updating act. time:', error);
            });
    };
    const handleDelete = (id: number) => {
        axios
            .delete(`${process.env.REACT_APP_API_BASE_URL}/delete/viewClient/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("myToken")}`,
                },
            })
            .then((response) => {
                setData(prev => prev.filter(task => task.id !== id));
            })
            .catch(console.error);
    };


    const columns = [
        {
            title: "Project Name",
            dataIndex: "projectName",
            key: "projectName",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Assigned By",
            dataIndex: "assignedBy",
            key: "assignedBy",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Date",
            dataIndex: "created_at",
            key: "created_at",
            render: (text: string) => {
                const date = new Date(text);
                const formattedDate = date.toISOString().split('T')[0];
                return <div>{formattedDate}</div>;
            },
        },
        {
            title: "Morning task",
            dataIndex: "morningCheck",
            key: "morningCheck",
            render: (text: string, record: ClientSheetData) => (
                <Checkbox
                    style={{ border: '2px solid black', borderRadius: '6px' }}
                    checked={record.morningCheck === 1}
                    onChange={() => handleMorningCheckChange(record)}
                    disabled={record.morningCheck === 1}
                />
            ),
        },
        {
            title: "Est.Hour",
            dataIndex: "estTime",
            key: "estTime",
            render: (text: string, record: ClientSheetData) => (
                <Select
                    value={record.estTime || ""}
                    onChange={(value) => handleEstTimeChange(record.id, value)}
                >
                    <Option value="">--Select Time--</Option>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((hour) =>
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
            ),
        },
        {
            title: "Morning Comment",
            dataIndex: "morningComment",
            key: "morningComment",
            render: (text: string, record: ClientSheetData) => (
                <div>
                    {editMode === record.id ? (
                        <>
                            <textarea
                                value={editedMorningComments[record.id] || text || ""}
                                onChange={(e) => handleMorningCommentChange(record, e.target.value)}
                            />
                            <Button onClick={() => handleSaveComments(record)}>Save</Button>
                        </>
                    ) : (
                        <>
                            <div>{text}</div>
                            <Button onClick={() => setEditMode(record.id)} style={{ float: 'right' }}>Edit</Button>
                        </>
                    )}
                </div>
            ),
        },
        {
            title: "Evening task",
            dataIndex: "eveningCheck",
            key: "eveningCheck",
            render: (text: string, record: ClientSheetData) => (
                <Checkbox
                    style={{ border: '2px solid black', borderRadius: '6px' }}
                    checked={record.eveningCheck === 1}
                    onChange={() => handleEveningCheckChange(record)}
                />
            ),
        },
        {
            title: "Act.Hour",
            dataIndex: "actTime",
            key: "actTime",
            render: (text: string, record: ClientSheetData) => (
                <Select
                    value={record.actTime || ""}
                    onChange={(value) => handleActTimeChange(record.id, value)}
                >
                    <Option value="">--Select Time--</Option>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((hour) =>
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
            ),
        },
        {
            title: "Evening Comment",
            dataIndex: "eveningComment",
            key: "eveningComment",
            render: (text: string, record: ClientSheetData) => (
                <div>
                    {editEveningCommentMode === record.id ? (
                        <>
                            <textarea
                                value={editedEveningComments[record.id] || text || ""}
                                onChange={(e) => handleEveningCommentChange(record, e.target.value)}
                            />
                            <Button onClick={() => handleSaveComments(record)}>Save</Button>
                        </>
                    ) : (
                        <>
                            <div>{text}</div>
                            <Button onClick={() => setEditEveningCommentMode(record.id)} style={{ float: 'right' }}>Edit</Button>
                        </>
                    )}
                </div>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: ClientSheetData) => {

                return (
                    <span>
                        {record.eveningComment === "" &&
                            <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>Delete</Button>
                        }
                    </span>
                )
            },
        },

    ];


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
                                        borderRadius: '6px',
                                        height: '43px',
                                        border: '2px solid black'
                                    }}
                                />
                                {employeeID === "B2B00100" &&
                                    <Select
                                        style={{
                                            width: 200, border: '2px solid black',
                                            borderRadius: '10px'
                                        }}
                                        placeholder="Select Assignee"
                                        onChange={(value) => setSelectedAssignee(value)}
                                        value={selectedAssignee}
                                    >
                                        {assigneeOptions.map((assignee) => (
                                            <Option key={assignee} value={assignee}>
                                                {assignee}
                                            </Option>
                                        ))}
                                    </Select>
                                }
                                <div
                                    style={{
                                        display: "flex",
                                        width: "100%",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <RangePicker onChange={handleDateRangeChange} style={{ border: '2px solid black', height: '43px' }} />
                                </div>
                            </div>

                            <div
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                    marginTop: "20px",
                                }}
                                className="clientSheetTlTask"
                            >
                                <h3>Task</h3>
                                <div style={{
                                    display: 'flex', gap: '61px',
                                    marginLeft: '9px'
                                }}>
                                    <p>{`Total Mrng Time: ${totalEstHoursFormatted} hours ${totalEstMinutesFormatted} minutes`}</p>
                                    <p>{`Total Evng Time: ${totalHoursFormatted} hours ${totalMinutesFormatted} minutes`}</p>
                                </div>
                                <Table columns={columns} dataSource={filteredData} pagination={paginationSettings} />
                                <h3>Reply/Remainder</h3>
                                <div style={{
                                    display: 'flex', gap: '50px',
                                    marginLeft: '9px'
                                }}>
                                    <p>{`Total Mrng Time: ${totalEstHoursFormat} hours ${totalEstMinutesFormat} minutes`}</p>
                                    <p>{`Total Evng Time: ${totalHoursFormat} hours ${totalMinutesFormat} minutes`}</p>
                                </div>
                                <br />
                                <Table columns={columns} dataSource={filteredRemainder} pagination={paginationSettings} />

                                <h3 style={{ marginBottom: '10px' }}>View Lead</h3>
                                <ViewLead selectedAssignee={selectedAssignee} searchTerm={searchTerm} dateRange={dateRange} />

                                <h3 style={{ marginBottom: '10px' }}>BacklogTable</h3>
                                <ViewTlBacklog searchTerm={searchTerm} dateRange={dateRange} selectedAssignee={selectedAssignee} />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewClientSheet;
