import React, { useState, useEffect, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import NewsTable from "./NewsTable";
import axios from "axios";
import { Spin } from "antd";
import { GlobalInfo } from "../../App";

interface Task {
  TermID: number;
  term: string;
  currdate: string;
  date: string;
}

const ViewNewsTable: React.FC = () => {
  const [data, setData] = useState<any>();
  const [editID] = useState<any>();
  const [loading, setLoading] = useState(true);
  const { mrngEditID, setMrngEditID } = useContext(GlobalInfo);
//   if (editID) {
//     setMrngEditID(editID);
//   }
  useEffect(() => {
    axios
      .get<Task[]>(`${process.env.REACT_APP_API_BASE_URL}/get/daily-news`, {
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

      <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
        <div
          style={{ display: "flex", flexDirection: "column" }}
          className="form-container"
        >
          <p
            className="mrng-tas"
          >
            News
          </p>
          {loading === true ?
            <Spin size="large" className="spinner-antd" />
            :
            <NewsTable
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

export default ViewNewsTable;
