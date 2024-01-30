import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Navbar from "./Navbar";
import axios from "axios";
import { Button, Checkbox, Table } from "antd";
import 'react-toastify/dist/ReactToastify.css';

interface ClientSheetData {
    id: number;
    projectName: string;
    AssigneeName: string;
    morningComment: string | null;
    morningCheck: number;
    eveningCheck: number;
    eveningComment: string | null;
    assignedBy: string;
}

const ViewClientSheet: React.FC<any> = () => {
    const [data, setData] = useState<ClientSheetData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [editMode, setEditMode] = useState<number | null>(null);
    const [editEveningCommentMode, setEditEveningCommentMode] = useState<number | null>(null);
    const [editedMorningComments, setEditedMorningComments] = useState<Record<string, string>>({});
    const [editedEveningComments, setEditedEveningComments] = useState<Record<string, string>>({});

    const myDataString = localStorage.getItem('myData');
    let employeeName = "";
    let employeeID = "";
    if (myDataString) {
        const myData = JSON.parse(myDataString);
        employeeName = myData.firstName;
        employeeID = myData.EmployeeID;
    }

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/get-data`)
            .then(response => {
                console.log('Data received successfully:', response.data);
                setData(response.data.data || []);
            })
            .catch(error => {
                console.error('Error while fetching data:', error);
            });
    }, []);

    const filteredData = data.filter((project) => {
        if (employeeID === "B2B00100") {
            return project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) && project.AssigneeName !== "";
        } else {
            const isAssignedByEmployee = project.assignedBy === employeeName;
            const isAssignedToEmployee = project.AssigneeName === employeeName;
            return (
                (isAssignedByEmployee || isAssignedToEmployee) &&
                project.assignedBy !== "" &&
                project.AssigneeName !== "" &&
                project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
    });


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
            title: "Assign To",
            dataIndex: "AssigneeName",
            key: "AssigneeName",
            render: (text: string) => <div>{text}</div>,
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

export default ViewClientSheet;
