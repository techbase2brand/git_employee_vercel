import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "./Menu";
import Navbar from "./Navbar";
import { Table, Input, Modal } from "antd";
import {
    SearchOutlined,
} from "@ant-design/icons";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SalesInfoData {
    id: number;
    url: string;
    title: string;
    discription: string;
    EmployeeID: string;
    created_at: string;
    image_url: string[];
    sendTo: string;
    isCompleted: boolean;
    category: string;
    pdfData: string;
}

const ViewDocumentation = () => {
    const [data, setData] = useState<SalesInfoData[]>([]);
    const [filteredData, setFilteredData] = useState<SalesInfoData[]>(data);
    const [search, setSearch] = useState<string>("");
    const myDataString = localStorage.getItem('myData');

    let clientName = "";
    if (myDataString) {
        const myData = JSON.parse(myDataString);
        clientName = myData.firstName;

    }
    const matchedData = filteredData.filter(item => item.sendTo === clientName);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisiblee, setModalVisiblee] = useState(false);
    const [modalContent, setModalContent] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<SalesInfoData | null>(
        null
    );
    const [currentImage, setCurrentImage] = useState('');
    const [currentPdf, setCurrentPdf] = useState<string>('');
    const [modalVisiblePdf, setModalVisiblePdf] = useState<boolean>(false);

    const handleImageClick = (imageUrl: string) => {
        setCurrentImage(imageUrl);
        setModalVisiblee(true);
    };
    const handlePdfClick = (pdfUrl: string) => {
        setCurrentPdf(pdfUrl);
        setModalVisiblePdf(true);
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
                `${process.env.REACT_APP_API_BASE_URL}/deletedocument/${id}`
                // {
                //   headers: {
                //     Authorization: `Bearer ${localStorage.getItem("myToken")}`,
                //   },
                // }
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
                `${process.env.REACT_APP_API_BASE_URL}/documentdata`
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

    useEffect(() => {
        filterData(search);
    }, [data]);

    const getCheckboxState = (id: number) => {
        const item = localStorage.getItem(`task-${id}`);
        if (item !== null) {
            return JSON.parse(item);
        } else {
            return false;
        }
    };
    const handleCheckboxChange = (isChecked: boolean, id: number) => {
        const updatedData = data.map((task) =>
            task.id === id ? { ...task, isCompleted: isChecked } : task
        );
        setData(updatedData);
        axios
            .put(`${process.env.REACT_APP_API_BASE_URL}/update/task-doc/${id}`,
                { isCompleted: isChecked },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("myToken")}`,
                    },
                }
            )
            .then((response) => {
                toast.success('updated successfully!', {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
            .catch((error) => {
                toast.error('Error while Updating.', {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
        localStorage.setItem(`task-${id}`, JSON.stringify(isChecked));
    };

    const columns = [
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
            title: "Title",
            dataIndex: "title",
            key: "title",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Url",
            dataIndex: "url",
            key: "url",
            render: (text: string | string[]) => (
                <div>
                    <button onClick={() => showModalUrl(text)} style={{ color: 'blue' }}>View Url</button>
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
            title: 'PDF Data',
            dataIndex: 'pdfData',
            key: 'pdfData',
            render: (pdf: string | string[]) => {
                let pdfFiles: string[] = [];

                if (Array.isArray(pdf)) {
                    pdfFiles = pdf;
                } else if (typeof pdf === 'string') {
                    pdfFiles = [pdf];
                }

                return (
                    <div>
                        {pdfFiles.map((pdfUrl: string, index: number) => (
                            <div key={index}>
                                <button onClick={() => handlePdfClick(pdfUrl)} style={{ color: 'blue' }}>Open PDF</button>
                            </div>
                        ))}
                    </div>
                );
            },
        },

        {
            title: "Discription",
            dataIndex: "discription",
            key: "discription",
            render: (text: string | string[]) => (
                <div>
                    <button onClick={() => showModalUrl(text)} style={{ color: 'blue' }}>Discription</button>
                </div>
            ),
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Posted By",
            dataIndex: "postedBy",
            key: "postedBy",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Send To",
            dataIndex: "sendTo",
            key: "sendTo",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Approved",
            dataIndex: "isCompleted",
            key: "isCompleted",
            render: (isCompleted: boolean, record: SalesInfoData) => (
                <input
                    type="checkbox"
                    checked={getCheckboxState(record.id)}
                    onChange={(event) =>
                        handleCheckboxChange(event.target.checked, record.id)
                    }
                />
            ),
        },
    ];

    const filterData = (inputValue: string) => {
        const lowercasedInput = inputValue.toLowerCase();

        if (inputValue) {
            const result = data.filter(
                (e) =>
                    e?.title?.toLowerCase().includes(lowercasedInput) ||
                    e?.discription?.toLowerCase().includes(lowercasedInput)

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
                    <div style={{ height: "8%" }}>
                        <Navbar />
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
                        <div className="menu-div">
                            <Menu />
                        </div>
                        <section className="SalecampusForm-section-os">
                            <div className="form-container">
                                <div className="SalecampusFormList-default-os">

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
                                    <div className="saleInfo-form">
                                        <Table
                                            dataSource={matchedData.slice().reverse()}
                                            columns={columns}
                                            pagination={paginationSettings}
                                        />
                                    </div>
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
                                            {index !== modalContent.length - 1 && <br /> && <br /> && <br />}
                                        </div>
                                    ))}
                                </Modal>
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
                                    centered
                                    width={800}
                                    title={<span style={{ color: 'red' }}>File Preview</span>}
                                    visible={modalVisiblePdf}
                                    onCancel={() => setModalVisiblePdf(false)}
                                    footer={null}
                                >
                                    {currentPdf.endsWith('.pdf') ? (
                                        <iframe src={currentPdf} style={{ width: '100%', height: '500px' }} />
                                    ) : (
                                        <div>
                                            <p>Unable to preview this file. Click below to download:</p>
                                            <a href={currentPdf} download>
                                                Download File
                                            </a>
                                        </div>
                                    )}
                                </Modal>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewDocumentation;
