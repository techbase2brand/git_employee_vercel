import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "./Menu";
import Navbar from "./Navbar";
import { Table, Button, Input, Modal } from "antd";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";

interface BlogPostTable {
    id: number;
    image_url: string[];
    title: string;
    term: string;
    discription: string;
    EmployeeID: string;
    pagetitle: string;
    pageKeyword: string;
    status: string;
    created_at: string;
    approved: number;
}

const InfotechTable = () => {

    const [data, setData] = useState<BlogPostTable[]>([]);
    const [filteredData, setFilteredData] = useState<BlogPostTable[]>(data);
    const [search, setSearch] = useState<string>("");
    const Navigate = useNavigate();
    // const myDataString = localStorage.getItem('myData');
    // let jobPosition = "";
    // if (myDataString) {
    //   const myData = JSON.parse(myDataString);
    //   jobPosition = myData.jobPosition;
    // }
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState<string>("");
    const [modalVisiblee, setModalVisiblee] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<BlogPostTable | null>(
        null
    );
    const [currentImage, setCurrentImage] = useState('');

    const handleImageClick = (imageUrl: string) => {
        setCurrentImage(imageUrl);
        setModalVisiblee(true);
    };

    const showModalDel = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setRecordToDelete(null);
    };
    const paginationSettings = {
        pageSize: 100,
    };
    const handleDelete = (id: number) => {
        axios
            .delete(
                `${process.env.REACT_APP_API_BASE_URL}/delete-infotech-blog/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("myToken")}`,
                  },
                }
            )
            .then((response) => {
                toast.success('Deleted successfully!', {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
            .catch((error) => {
                toast.error('Deleting Failed.', {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
        const updatedData = data.filter((e: any) => e.id !== id);
        setData(updatedData);
        filterData(search);
        setIsModalOpen(false);
    };

    useEffect(() => {
        const token = localStorage.getItem("myToken");
        axios
            .get(
                `${process.env.REACT_APP_API_BASE_URL}/infotech-blog-data`
                , {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                const resData = response.data;
                setData(resData);
                setFilteredData(resData);
            });
    }, []);

    const handleStatusChange = (id: string | number, currentStatus: number) => {
        const newLogged = currentStatus === 1 ? 0 : 1;

        // Call the API to update the status
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/approved-infotech-blog/${id}`, {
            approved: newLogged
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("myToken")}`,
            },
        })
            .then((response) => {
                setData(prevData =>
                    prevData.map(employee =>
                        employee.id === id
                            ? { ...employee, approved: newLogged }
                            : employee
                    )
                );
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        filterData(search);
    }, [data]);

    const handleEdit = (id: number) => {
        const recordToEdit = data.find((e: any) => e.id === id);
        Navigate("/InfotechBlog", { state: { record: recordToEdit } });
    };
    const handleTermClick = (text: string) => {
        setModalContent(text); // Set the content for the modal
        setModalVisible(true); // Show the modal
    };
    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Paragraph",
            dataIndex: "term",
            key: "term",
            render: (text: string) => (
                <div onClick={() => handleTermClick(text)}>
                    <button>View para</button>
                </div>
            ),
        },
        {
            title: 'Images',
            dataIndex: 'image_url',
            key: 'image_url',
            render: (text: string | string[]) => {
                let images: string[] = [];

                if (Array.isArray(text)) {
                    images = text;
                } else if (typeof text === 'string') {
                    images = text.split(',');
                }

                return (
                    <div>
                        {images.map((imageUrl: string, index: number) => (
                            <img
                                key={index}
                                src={imageUrl}
                                alt={`Img ${index + 1}`}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    marginRight: '5px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleImageClick(imageUrl)}
                            />
                        ))}
                    </div>
                );
            },
        },
        {
            title: "Page Discription",
            dataIndex: "discription",
            key: "discription",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Page Title",
            dataIndex: "pagetitle",
            key: "pagetitle",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Page Keyword",
            dataIndex: "pageKeyword",
            key: "pageKeyword",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: number) => (
                status ? (
                    <span style={{ color: "green" }}>&#10003;</span>
                ) : (
                    <span style={{ color: "red" }}>&#10005;</span>
                )
            ),
        },
        {
            title: "Home Page Approved",
            dataIndex: "approved",
            key: "approved",
            render: (_: any, record: BlogPostTable) => (
                <input
                    type="checkbox"
                    checked={record.approved === 1}
                    onChange={() => handleStatusChange(record.id, record.approved)}
                />
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: BlogPostTable) => (
                <span>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record.id)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            setRecordToDelete(record);
                            showModalDel();
                        }}
                    >
                        Delete
                    </Button>
                </span>

            ),
        },
    ];

    const filterData = (inputValue: string) => {
        const lowercasedInput = inputValue.toLowerCase();

        if (inputValue) {
            const result = data.filter(
                (e) =>
                    e?.title?.toLowerCase().includes(lowercasedInput) ||
                    e?.discription?.toLowerCase().includes(lowercasedInput) ||
                    e?.pagetitle?.toLowerCase().includes(lowercasedInput) ||
                    e?.pageKeyword?.toLowerCase().includes(lowercasedInput)

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
                    
                    <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
                      
                        <section className="SalecampusForm-section-os">
                            <div className="form-container">
                                <div className="SalecampusFormList-default-os">
                                    <div
                                        style={{
                                            display: "flex",
                                            width: "80%",
                                            alignItems: "center",
                                            justifyContent: "flex-start",
                                        }}
                                    >
                                        <p
                                            style={{
                                                color: "#094781",
                                                justifyContent: "flex-start",
                                                fontSize: "32px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Infotech Blog list
                                        </p>
                                    </div>
                                    <br />
                                    <div
                                        style={{
                                            display: "flex",
                                            width: "100%",
                                            alignItems: "center",
                                            gap: '7px',
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
                                    <br />
                                    <div className="saleInfo-form">
                                        <Table
                                            dataSource={filteredData.slice().reverse()}
                                            columns={columns}
                                            pagination={paginationSettings}
                                        />
                                    </div>
                                </div>
                                <Modal
                                    title="Confirmation"
                                    open={isModalOpen}
                                    onOk={() => {
                                        if (recordToDelete) {
                                            handleDelete(recordToDelete.id);
                                        }
                                    }}
                                    onCancel={handleCancel}
                                >
                                    <p>Are you sure, you want to delete</p>
                                </Modal>
                                <Modal
                                    centered
                                    width={1500}
                                    title={
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'red' }}>Image Preview - {currentImage}</span>
                                            <a href={currentImage} download="image.jpg" style={{ color: 'blue' }}>
                                                Download
                                            </a>
                                        </div>
                                    }
                                    visible={modalVisiblee}
                                    onCancel={() => setModalVisiblee(false)}
                                    footer={null}
                                >
                                    <img src={currentImage} alt="Preview" style={{ width: '100%' }} />
                                </Modal>
                                <Modal
                                    title="Term Details"
                                    visible={modalVisible}
                                    onCancel={() => setModalVisible(false)}
                                    footer={null}
                                >
                                    <p dangerouslySetInnerHTML={{ __html: modalContent }} />
                                </Modal>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InfotechTable;
