import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "./Menu";
import Navbar from "./Navbar";
import { Table, Button, Input, Modal } from "antd";
import { format } from "date-fns";

import {
    SearchOutlined,
} from "@ant-design/icons";
interface Employee {
    EmpID: string | number;
    firstName: string;
    lastName: string
    role: string;
    dob: string | Date;
    EmployeeID: string;
    status: number;
}

interface SalesInfoData {
    id: number;
    portalType: string;
    profileName: string;
    url: string;
    clientName: string;
    handleBy: string;
    status: string;
    statusReason: string;
    communicationMode: string;
    communicationReason: string;
    updated_at: string;
    dateData: string;
    EmployeeID: string;
    created_at: string;
    RegisterBy: string;
    inviteBid: string;
    commModeEmail: string;
    commModeOther: string;
    commModePhone: string;
    commModePortal: string;
    commModeWhatsapp: string;
    commModeSkype: string;
    othermode: string;
    sendTo: string;
    enterCmnt: string;
}

const ViewLead = () => {
    const [data, setData] = useState<SalesInfoData[]>([]);
    const [filteredData, setFilteredData] = useState<SalesInfoData[]>(data);
    const [search, setSearch] = useState<string>("");
    const [currentDate] = useState<Date>(new Date());
    const formattedDate = format(currentDate, "yyyy-MM-dd");
    const [dateRange] = useState<[string | null, string | null]>([null, null]);
    const [editMode, setEditMode] = useState<number | null>(null);
    const [editedComments, setEditedComments] = useState<Record<string, string>>({});
    const sortedDataa = [...filteredData].sort((a, b) => a.id - b.id);

    const DataString = localStorage.getItem("myData");
    let myName = "";
    let EmployeId = "";
    if (DataString) {
        const parsing = JSON.parse(DataString);
        myName = parsing.firstName;
        EmployeId = parsing.EmployeeID;
    }
    const holderData = sortedDataa.filter((item) => item.sendTo === myName);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState<string[]>([]);

    const showModal = (text: string | string[]) => {
        const reasons = Array.isArray(text) ? text : text.split(',');
        setModalContent(reasons);
        setModalVisible(true);
    };
    const showModalUrl = (text: string | string[]) => {
        const url = Array.isArray(text) ? text : text.split(',');
        setModalContent(url);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setModalContent([]);
    };

    const paginationSettings = {
        pageSize: 100,
    };

    useEffect(() => {
        axios
            .get(
                ` ${process.env.REACT_APP_API_BASE_URL}/salesinfodata`
                // , {
                //   headers: {
                //     Authorization: `Bearer ${token}`,
                //   },
                // }
            )
            .then((response) => {
                const resData = response.data;
                setData(resData);
                setFilteredData(resData);
                let filteData = response.data;

                if (dateRange[0] && dateRange[1]) {
                    const startDate = new Date(dateRange[0]!).getTime();
                    const endDate = new Date(dateRange[1]!).getTime();

                    filteData = response.data.filter((obj: SalesInfoData) => {
                        const taskDate = new Date(obj.dateData).getTime();
                        return taskDate >= startDate && taskDate <= endDate;
                    });
                }
            });
    }, [dateRange, formattedDate]);

    useEffect(() => {
        axios
            .get<Employee[]>(`${process.env.REACT_APP_API_BASE_URL}/employees`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("myToken")}`,
                },
            })
            .then((response) => {
                console.log("");
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);


    useEffect(() => {
        filterData(search);
    }, [data]);

    const generateCommModeContent = (record: any) => {
        const {
            commModeSkype,
            commModePhone,
            commModeWhatsapp,
            commModeEmail,
            commModePortal,
            commModeOther,
        } = record;

        const modes = [
            `Email: ${commModeSkype}`,
            `Other: ${commModePhone}`,
            `Phone: ${commModeWhatsapp}`,
            `Portal: ${commModeEmail}`,
            `Whatsapp: ${commModePortal}`,
            `Skype: ${commModeOther}`,
        ];
        return modes.join(', ');
    };
    const handleCommentChange = (record: SalesInfoData, value: string) => {
        setEditedComments({ ...editedComments, [record.id]: value });
        setEditMode(record.id);
    };
    const handleSaveComments = (record: SalesInfoData) => {
        const id = record.id;
        const enterCmnt = editedComments[id] || record.enterCmnt || "";

        const updatedData = data.map((item) =>
            item.id === record.id
                ? { ...item, enterCmnt }
                : item
        );
        setData(updatedData);
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/update-comments-lead/${id}`, {
            enterCmnt,
        })
            .then(response => {
                setEditedComments({ ...editedComments, [record.id]: "" });
                setEditMode(null);
            })
            .catch(error => {
                console.error('Error while updating comments:', error);
            });
    };

    const columns = [
        {
            title: "Lead Date",
            dataIndex: "dateData",
            key: "dateData",
            render: (text: string) => <div>{text}</div>,
            sorter: (a: SalesInfoData, b: SalesInfoData) => {
                const dateA = new Date(a.dateData).getTime();
                const dateB = new Date(b.dateData).getTime();
                return dateA - dateB;
            },
        },
        {
            title: "Data Entry Date",
            dataIndex: "created_at",
            key: "created_at",
            render: (text: string) => {
                const date = new Date(text);
                const formattedDate = date.toISOString().split('T')[0];
                return <div>{formattedDate}</div>;
            },
        },
        {
            title: "Client name",
            dataIndex: "clientName",
            key: "clientName",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Portal type",
            dataIndex: "portalType",
            key: "portalType",
            render: (text: string) => <div style={{ width: 80 }}>{text}</div>,
        },
        {
            title: "Other Portal Name",
            dataIndex: "othermode",
            key: "othermode",
            render: (text: string) => <div style={{ width: 80 }}>{text}</div>,
        },
        {
            title: "Profile name",
            dataIndex: "profileName",
            key: "profileName",
        },
        {
            title: "Handle by",
            dataIndex: "handleBy",
            key: "handleBy",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Bid-By/Invite",
            dataIndex: "inviteBid",
            key: "inviteBid",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Register By",
            dataIndex: "RegisterBy",
            key: "RegisterBy",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Status Reason",
            dataIndex: "statusReason",
            key: "statusReason",
            render: (text: string | string[], record: SalesInfoData) => (
                <div>
                    <button onClick={() => showModal(text)} style={{ color: 'blue' }}>View Reasons</button>
                </div>
            ),
        },
        {
            title: "Url",
            dataIndex: "url",
            key: "url",
            render: (text: string | string[], record: SalesInfoData) => (
                <div>
                    <button onClick={() => showModalUrl(text)} style={{ color: 'blue' }}>View Url</button>
                </div>
            ),
        },
        {
            title: "Comment",
            dataIndex: "enterCmnt",
            key: "enterCmnt",
            render: (text: string, record: SalesInfoData) => (
                <div>
                    {editMode === record.id ? (
                        <>
                            <textarea
                                value={editedComments[record.id] || text || ""}
                                onChange={(e) => handleCommentChange(record, e.target.value)}
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
            title: "Comm. mode",
            dataIndex: "commModePortal",
            key: "commModePortal",
            render: (text: string, record: SalesInfoData) => (
                <div>
                    <Button onClick={() => showModal(generateCommModeContent(record))}>
                        View Comm. Modes
                    </Button>
                </div>
            ),
        },
        {
            title: "Additional",
            dataIndex: "communicationReason",
            key: "communicationReason",
            render: (text: string) => <div>{text}</div>,
        }
    ];

    const filterData = (inputValue: string) => {
        const lowercasedInput = inputValue.toLowerCase();

        if (inputValue) {
            const result = data.filter(
                (e) =>
                    e?.clientName?.toLowerCase().includes(lowercasedInput) ||
                    e?.status?.toLowerCase().includes(lowercasedInput) ||
                    e?.communicationMode?.toLowerCase().includes(lowercasedInput) ||
                    e?.communicationReason?.toLowerCase().includes(lowercasedInput) ||
                    e?.handleBy?.toLowerCase().includes(lowercasedInput) ||
                    e?.portalType?.toLowerCase().includes(lowercasedInput) ||
                    e?.profileName?.toLowerCase().includes(lowercasedInput) ||
                    e?.statusReason?.toLowerCase().includes(lowercasedInput) ||
                    e?.url?.toLowerCase().includes(lowercasedInput) ||
                    e?.dateData?.toLowerCase().includes(lowercasedInput) ||
                    e?.RegisterBy?.toLowerCase().includes(lowercasedInput) ||
                    e?.inviteBid?.toLowerCase().includes(lowercasedInput) ||
                    e?.othermode?.toLowerCase().includes(lowercasedInput)
            );
            setFilteredData(result);
        } else {
            setFilteredData(data);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setSearch(inputValue);
        filterData(inputValue);
    };
    const getStatusRowClassName = (record: SalesInfoData) => {
        if (record.status === "Discussion") {
            return "yellow-row";
        } else if (record.status === "Hired") {
            return "green-row";
        } else if (record.status === "Closed") {
            return "red-row";
        } else if (record.status === "Pending") {
            return "pending-row";
        } else if (record.status === "May Work Again") {
            return "work-row";
        } else {
            return "";
        }
    };

    return (
        <>
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
                        <section className="SalecampusForm-section-os">
                            <div className="form-container">
                                <div
                                    style={{
                                        display: "flex",
                                        width: "100%",
                                        alignItems: "center",
                                        gap: '7px',
                                        margin: '10px 0 0 48px'
                                    }}
                                >
                                    <div
                                        className="search"
                                        style={{
                                            width: "fit-content",
                                        }}
                                    >
                                        <Input
                                            placeholder="Search..."
                                            prefix={<SearchOutlined className="search-icon" />}
                                            onChange={handleSearch}
                                        />
                                    </div>
                                </div>
                                <div className="SalecampusFormList-default-os">
                                    <div className="infotech-form">
                                        {/* {EmployeId === "B2B00100" ?
                                            <Table
                                                dataSource={sortedAllData.slice().reverse()}
                                                columns={columns}
                                                rowClassName={getStatusRowClassName}
                                                pagination={paginationSettings}
                                            /> */}

                                        <Table
                                            dataSource={holderData.slice().reverse()}
                                            columns={columns}
                                            rowClassName={getStatusRowClassName}
                                            pagination={paginationSettings}
                                        />
                                    </div>
                                    <Modal
                                        title="View Data :"
                                        visible={modalVisible}
                                        onCancel={closeModal}
                                        footer={null}
                                    >
                                        {modalContent.map((reason: string, index: number) => (
                                            <div key={index}>
                                                {reason.trim()}
                                                {index !== modalContent.length - 1 && <br />}
                                            </div>
                                        ))}
                                    </Modal>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewLead;
