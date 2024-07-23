import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const Appcartify = () => {
    const [data, setData] = useState([]);
    console.log("daTA", data);


    useEffect(() => {
        axios.get('https://invoice-backend.base2brand.com/api/get-appcartify')
            .then(response => {
                if (response.data.success) {
                    // Map the data to the format expected by the table
                    const mappedData = response.data.data.map((item: any) => ({
                        key: item._id,
                        name: item.name,
                        email: item.email,
                        phoneNo: item.phoneNo,
                        website: item.website,
                        sector: item.sector
                    }));
                    setData(mappedData);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);
    const handleClick = (id: any) => {
        axios.delete(`https://invoice-backend.base2brand.com/api/appcartify/${id}`)
        setData(data.filter((item: any) => item.key !== id));
    }
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Phone Number",
            dataIndex: "phoneNo",
            key: "phoneNo",
        },
        {
            title: "Website",
            dataIndex: "website",
            key: "website",
        },
        {
            title: "Sector",
            dataIndex: "sector",
            key: "sector",
        },
        {
            title: "Actions",
            key: "actions",
            render: (text: any, record: any) => (
                <span>
                    <Button icon={<EditOutlined />} style={{ marginRight: 8 }} />
                    <Button icon={<DeleteOutlined />} onClick={() => handleClick(record.key)} />
                </span>
            ),
        }
    ];

    return (
        <div className="cat-table">
            <p
                style={{
                    color: "#094781",
                    justifyContent: "flex-start",
                    fontSize: "32px",
                    fontWeight: "bold",
                    marginBottom: '2rem'
                }}
            >
               Details 
            </p>
            <Table
                dataSource={data}
                columns={columns}
                rowClassName={() => "header-row"}
            />
        </div>
    );
};

export default Appcartify;
