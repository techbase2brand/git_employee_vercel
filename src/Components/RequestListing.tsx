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
    name: string;
    phoneNo: number;
    email: string; 
    discription: string;

}

const RequestListing = () => {

    const [data, setData] = useState<BlogPostTable[]>([]);
    const [filteredData, setFilteredData] = useState<BlogPostTable[]>(data);
    const [search, setSearch] = useState<string>("");
  
    const paginationSettings = {
        pageSize: 100,
    };
    

    useEffect(() => {
        const token = localStorage.getItem("myToken");
        axios
            .get(
                `${process.env.REACT_APP_API_BASE_URL}/get-requestQuotes`
                , {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                const resData = response.data;
                console.log(resData,':::-----------resDataresData')
                setData(resData);
                setFilteredData(resData);
            });
    }, []);

   

    useEffect(() => {
        filterData(search);
    }, [data]);

   
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text: string) => <div>{text}</div>,
        },
         
         
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Phone No",
            dataIndex: "phoneNo",
            key: "phoneNo",
            render: (text: number) => <div>{text}</div>,
        }, 
        {
            title: "Message",
            dataIndex: "message",
            key: "message",
            render: (text: string) => <div>{text}</div>,
        } 
    ];

    const filterData = (inputValue: string) => {
        const lowercasedInput = inputValue.toLowerCase();

        if (inputValue) {
            const result = data.filter(
                (e) =>
                    e?.name?.toLowerCase().includes(lowercasedInput) ||
                    e?.discription?.toLowerCase().includes(lowercasedInput) ||
                    e?.email?.toLowerCase().includes(lowercasedInput)   

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
                                            Contact Us listing
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
                               
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RequestListing;
