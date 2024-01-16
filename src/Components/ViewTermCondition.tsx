import React, { useState, useEffect, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Menu from "./Menu";
import Navbar from "./Navbar";
import TermConditionTable from "./TermConditionTable";
import axios from "axios";
import { GlobalInfo } from "../App";
import { Spin } from "antd";

interface Task {
  TermID: number;
  term: string;
  currdate: string;
  date: string;
}

const ViewTermCondition: React.FC = () => {
  const [data, setData] = useState<any>();
  const [editID] = useState<any>();
  const [loading, setLoading] = useState(true);
  const { mrngEditID, setMrngEditID } = useContext(GlobalInfo);
  if (editID) {
    setMrngEditID(editID);
  }

  useEffect(() => {
    axios
      .get<Task[]>(`${process.env.REACT_APP_API_BASE_URL}/get/addTermCondition`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
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
                  Term && Conditions....
                </p>
              </div>
              {loading===true ?
                <Spin size="large" className="spinner-antd" />
                :
                <TermConditionTable
                  data={data}
                  mrngEditID={mrngEditID}
                  setMrngEditID={setMrngEditID}
                />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTermCondition;
