import React, { useState, useEffect, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import SalesTable from "./SalesTable";
import axios from "axios";
import { GlobalInfo } from "../App";
import { Spin } from "antd";

interface Task {
    saleId: number;
    SalesData: string;
    currdate: string;
    dated: string;
}

const ViewSalesMaster: React.FC = () => {
    const [data, setData] = useState<any>();
    const [editID] = useState<any>();
    const [loading, setLoading] = useState(true);
    const { mrngEditID, setMrngEditID } = useContext(GlobalInfo);
    if (editID) {
        setMrngEditID(editID);
    }

    useEffect(() => {
        axios
            .get<Task[]>(`${process.env.REACT_APP_API_BASE_URL}/get/addSales`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("myToken")}`,
                },
            })
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

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

                <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
                    <div
                        style={{ display: "flex", flexDirection: "column" }}
                        className="form-container"
                    >
                        <p
                            className="mrng-tas"
                        >
                            All Status..
                        </p>
                        {loading ?
                            <Spin size="large" className="spinner-antd" />
                            :
                            <SalesTable
                                data={data}
                                mrngEditID={mrngEditID}
                                setMrngEditID={setMrngEditID}
                            />
                        }
                    </div>
                </div>
            </div>

        </div>

    );
};

export default ViewSalesMaster;
