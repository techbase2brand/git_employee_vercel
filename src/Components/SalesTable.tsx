import React, { useState, useEffect, useMemo } from "react";
import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Task {
    saleId: number;
    SalesData: string;
    currdate: string;
    dated: string;
}

interface Props {
    data: Task[];
    mrngEditID: number;
    setMrngEditID: React.Dispatch<React.SetStateAction<number>>;
}

const SalesTable: React.FC<Props> = ({ data, setMrngEditID }) => {
    const [propsData, setPropsData] = useState<Task[]>(data || []);
    const [employeeFirstname, setEmployeeFirstname] = useState<string>("");
    const navigate = useNavigate();
    const dataString = localStorage.getItem("myData");

    useEffect(() => {
        setPropsData(data || []);
    }, [data]);

    const handleEdit = (saleId: number) => {
        setMrngEditID(saleId);
        navigate("/SalesMaster", { state: { saleId: saleId } });
    };

    const handleDelete = (saleId: number) => {
        axios
            .delete(`${process.env.REACT_APP_API_BASE_URL}/delete/addSales/${saleId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("myToken")}`,
                },
            })
            .then(() => {
                setPropsData(prev => prev.filter(task => task.saleId !== saleId));
            })
            .catch(console.error);
    };


    const employeeInfo = useMemo(() => (dataString ? JSON.parse(dataString) : []), [dataString]);

    useEffect(() => {
        setEmployeeFirstname(employeeInfo[0]?.firstName);
    }, [employeeInfo]);

    const columns = [
        {
            title: "Status",
            dataIndex: "SalesData",
            key: "SalesData",
        },
        {
            title: "currdate",
            dataIndex: "currdate",
            key: "currdate",
        },
        {
            title: "date",
            dataIndex: "dated",
            key: "dated",
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: Task) => (
                <span>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record.saleId)}>Edit</Button>
                    <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.saleId)}>Delete</Button>
                </span>
            ),
        },
    ];
    return (
        <>
            <p>{employeeFirstname}</p>
            <Table
                dataSource={propsData}
                columns={columns}
                rowClassName={() => "header-row"}
            />
        </>
    );
};

export default SalesTable;
