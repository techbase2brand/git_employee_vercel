import React, { useState, useEffect } from "react";
import { Checkbox, Modal, Table } from "antd";
import axios from "axios";
interface BacklogTask {
    backlogTaskID: number;
    taskName: string;
    assigneeName: string;
    employeeID: string;
    deadlineStart: string;
    deadlineEnd: string;
    currdate: string;
    UserEmail: string;
    isCompleted: number;
    AssignedBy: string;
    clientName: string;
    projectName: string;
    comment: string;
    faChecked: number;
}
interface Employee {
    EmpID: string | number;
    firstName: string;
    role: string;
    dob: string | Date;
    EmployeeID: string;
}
interface Props {
    searchTerm: string;
    dateRange: any;
}
const ViewTlBacklog: React.FC<Props> = ({ searchTerm, dateRange }) => {
    const [data, setData] = useState<BacklogTask[]>([]);
    const [selectedAssignee] = useState('');
    const [originalData, setOriginalData] = useState<BacklogTask[]>([]);
    const [modalRecord, setModalRecord] = useState<BacklogTask | null>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const myDataString = localStorage.getItem('myData');

    let employeeName = "";
    let EmpId = "";
    let myName = "";
    if (myDataString) {
        const myData = JSON.parse(myDataString);
        employeeName = `${myData.jobPosition}`;
        myName = `${myData.firstName}`;
        EmpId = `${myData.EmployeeID}`;
    }

    useEffect(() => {
        let filteredData = originalData;

        if (selectedAssignee) {
            filteredData = originalData.filter((item) => item.assigneeName === selectedAssignee);
        }
        setData(filteredData);
    }, [selectedAssignee, originalData])

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

    const storedData = JSON.parse(localStorage.getItem("myData") || "");
    const adminID = storedData ? storedData.EmployeeID : "";
    const UserEmail = storedData ? storedData.email : "";

    const paginationSettings = {
        pageSize: 100,
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<BacklogTask[]>(`${process.env.REACT_APP_API_BASE_URL}/get/BacklogTasks`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("myToken")}`,
                    },
                });
                setOriginalData(response.data)
                const sortedData = response.data.sort((a, b) => b.backlogTaskID - a.backlogTaskID);
                const filteredData = sortedData?.filter((e) => {
                    e.UserEmail === UserEmail;
                    const assigneeMatch = e.assigneeName.toLowerCase().includes(searchTerm.toLowerCase());
                    const assignedByMatch = e.taskName.toLowerCase().includes(searchTerm.toLowerCase());
                    const clientNameMatch = e.clientName && e.clientName.toLowerCase().includes(searchTerm.toLowerCase())
                    const projectNameMatch = e.projectName && e.projectName.toLowerCase().includes(searchTerm.toLowerCase())
                    return assigneeMatch || assignedByMatch || clientNameMatch || projectNameMatch;
                });
                const filteredDataWithDate = filteredData?.filter((e) => {
                    return (
                        new Date(e.deadlineStart) >= new Date(dateRange[0]) &&
                        new Date(e.deadlineEnd) <= new Date(dateRange[1])
                    );
                });
                setData(filteredDataWithDate);
                const today = new Date();
                const tenDaysAgo = new Date();
                tenDaysAgo.setDate(today.getDate() - 10);
                if (
                    employeeName === "Managing Director") {
                    const filteredData = sortedData?.filter((e) => {
                        e.UserEmail === UserEmail;
                        const assigneeMatch = e.assigneeName.toLowerCase().includes(searchTerm.toLowerCase());
                        const assignedByMatch = e.taskName.toLowerCase().includes(searchTerm.toLowerCase());
                        const clientNameMatch = e.clientName && e.clientName.toLowerCase().includes(searchTerm.toLowerCase())
                        const projectNameMatch = e.projectName && e.projectName.toLowerCase().includes(searchTerm.toLowerCase())
                        return assigneeMatch || assignedByMatch || clientNameMatch || projectNameMatch;

                    });
                    const finalFilteredData = filteredData?.filter((e) => e.faChecked === null || e.faChecked === 0);
                    setData(finalFilteredData);
                } else {
                    const finalFilteredData = filteredData?.filter((e) => {
                        const isAssignedByAdmin = e.UserEmail === UserEmail || e.assigneeName === myName;
                        return isAssignedByAdmin;
                    });
                    const finalFilteredData2 = finalFilteredData?.filter((e) => e.faChecked === null || e.faChecked === 0);
                    setData(finalFilteredData2);
                }

            } catch (error: any) {
                console.error(error);
            }
        };
        fetchData();
    }, [adminID, dateRange, searchTerm]);

    const handleCheckChange = (record: BacklogTask) => {
        setModalRecord(record);
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        setIsModalVisible(false);
        const updatedData = data.map((item) =>
            item.backlogTaskID === modalRecord?.backlogTaskID ? { ...item, faChecked: item.faChecked === 1 ? 0 : 1 } : item
        );
        setData(updatedData);

        axios.put(`${process.env.REACT_APP_API_BASE_URL}/update-faChecked-tl/${modalRecord?.backlogTaskID}`, {
            faChecked: modalRecord?.faChecked === 1 ? 0 : 1,
        })
            .then(response => {
                console.log('check updated successfully:', response.data);
            })
            .catch(error => {
                console.error('Error while updating check:', error);
            });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };
    const getCheckboxState = (backlogTaskID: number) => {
        const task = data.find((task) => task.backlogTaskID === backlogTaskID);
        return !!task?.isCompleted;
    };
    const handleCheckboxChange = (isChecked: boolean, backlogTaskID: number) => {
        const updatedData = data.map((task) =>
            task.backlogTaskID === backlogTaskID ? { ...task, isCompleted: isChecked ? 1 : 0 } : task
        );
        setData(updatedData);
        axios
            .put(`${process.env.REACT_APP_API_BASE_URL}/update/task-completion/${backlogTaskID}`,
                { isCompleted: isChecked ? 1 : 0 },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("myToken")}`,
                    },
                }
            )
            .then((response) => {
                // toast.success('status Updated!', {
                //   position: toast.POSITION.TOP_RIGHT,
                // });
            })
            .catch((error) => {
                // toast.error('Failed!', {
                //   position: toast.POSITION.TOP_RIGHT,
                // });
            });
    };
    const columns = [
        {
            title: "Assigned By",
            dataIndex: "AssignedBy",
            key: "AssignedBy",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Assigned To",
            dataIndex: "assigneeName",
            key: "assigneeName",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Task Name",
            dataIndex: "taskName",
            key: "taskName",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Status",
            dataIndex: "isCompleted",
            key: "isCompleted",
            render: (isCompleted: boolean, record: BacklogTask) => (
                <>
                    {EmpId === "B2B00100" ?
                        isCompleted ? (
                            <span style={{ color: "green" }}>&#10003;</span>
                        ) : (
                            <span style={{ color: "red" }}>&#10005;</span>
                        )
                        :
                        <input
                            type="checkbox"
                            checked={getCheckboxState(record.backlogTaskID)}
                            onChange={(event) =>
                                handleCheckboxChange(event.target.checked, record.backlogTaskID)
                            }
                        />
                    }

                </>
            ),
        },
        {
            title: "F/A",
            dataIndex: "faChecked",
            key: "faChecked",
            render: (text: string, record: BacklogTask) => {
                return (
                    <>
                        {EmpId === "B2B00100" &&
                            <Checkbox
                                style={{ border: '2px solid black', borderRadius: '6px' }}
                                checked={record.faChecked === 1}
                                onChange={() => handleCheckChange(record)}
                            />
                        }
                    </>
                )
            },
        },
    ];

    return (
        <>
            <div
                className="clientSheetTlTask"
            >
                <Table
                    style={{ width: "80vw" }}
                    dataSource={data}
                    columns={columns}
                    rowClassName={() => "header-row"}
                    pagination={paginationSettings}
                />
            </div>
            <Modal
                title="Are you sure?"
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <p>This is your final Approve for remove data.</p>
            </Modal>
        </>
    );
};

export default ViewTlBacklog;
