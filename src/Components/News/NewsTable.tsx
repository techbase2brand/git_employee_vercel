import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Task {
    id: number;
    news: string;
    currdate: string;
    date: string;
}

interface Props {
    data: Task[];
    mrngEditID: number;
    setMrngEditID: React.Dispatch<React.SetStateAction<number>>;
}

const NewsTable: React.FC<Props> = ({ data, setMrngEditID }) => {
    const [propsData, setPropsData] = useState<Task[]>(data || []);
    const [employeeFirstname, setEmployeeFirstname] = useState<string>("");
    const [modalVisible, setModalVisible] = useState<boolean>(false); // State for modal visibility
    const [modalContent, setModalContent] = useState<string>(""); // State for modal content
    const navigate = useNavigate();
    const dataString = localStorage.getItem("myData");

    useEffect(() => {
        setPropsData(data || []);
    }, [data]);

    const handleEdit = (id: number) => {
        setMrngEditID(id);
        navigate("/dailyNews", { state: { id: id } });
    };

    const handleDelete = (id: number) => {
        axios
            .delete(`${process.env.REACT_APP_API_BASE_URL}/delete/news/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("myToken")}`,
                },
            })
            .then(() => {
                setPropsData(prev => prev.filter(task => task.id !== id));
            })
            .catch(console.error);
    };


    const employeeInfo = useMemo(() => (dataString ? JSON.parse(dataString) : []), [dataString]);

    useEffect(() => {
        setEmployeeFirstname(employeeInfo[0]?.firstName);
    }, [employeeInfo]);
    const handleTermClick = (text: string) => {
        setModalContent(text); // Set the content for the modal
        setModalVisible(true); // Show the modal
    };

    const columns = [
        {
            title: "News",
            dataIndex: "news",
            key: "news",
            render: (text: string) => (
                <div onClick={() => handleTermClick(text)}>
                    <button>view News</button>
                </div>
            ),
        },
        {
            title: "Currdate",
            dataIndex: "currdate",
            key: "currdate",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: Task, index: number) => {
                console.log("record", record);

                return (
                    <span>
                        <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record.id)} />
                        <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                    </span>
                )
            },
        },
    ];
    return (
        <>
            <p>{employeeFirstname}</p>
            <div className="view-news">
                <Table
                    dataSource={propsData.slice().reverse()}
                    columns={columns}
                    rowClassName={() => "header-row"}
                />
            </div>
            <Modal
                title="News"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <p dangerouslySetInnerHTML={{ __html: modalContent }} />
            </Modal>
        </>
    );
};

export default NewsTable;
