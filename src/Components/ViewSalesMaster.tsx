import React, { useState, useEffect, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Menu from "./Menu";
import Navbar from "./Navbar";
import SalesTable from "./SalesTable";
import axios from "axios";
import { GlobalInfo } from "../App";

interface Task {
    saleId: number;
    SalesData: string;
    currdate: string;
    dated: string;
    
}

const ViewSalesMaster: React.FC = () => {
    const [data, setData] = useState<any>();
    const [editID] = useState<any>();
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
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
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
                <div style={{ height: "8%" }}>
                    <Navbar />
                </div>
                <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
                    <div className="menu-div">
                        <Menu />
                    </div>
                    <div
                        style={{ display: "flex", flexDirection: "column" }}
                        className="form-container"
                    >
                        <div
                            style={{
                                display: "flex",
                                width: "80%",
                                alignItems: "center",
                                justifyContent: "flex-start",
                            }}
                        ></div>
                        <div style={{ width: "90%", height: "80%", marginTop: "3%" }}>
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
                                   All Status..
                                </p>
                            </div>
                            <SalesTable
                                data={data}
                                mrngEditID={mrngEditID}
                                setMrngEditID={setMrngEditID}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewSalesMaster;
