import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "./Menu";
import Navbar from "./Navbar";
import { Table } from "antd";
import dayjs from "dayjs";

interface SalecampusData {
  gender: string;
  name: string;
  email: string;
  phone: string;
  parentPhone: string;
  location: string;
  course: string; // I'm guessing from the render method
  duration: string;
  totalFee: string;
  highestQualification: string;
}

const SalecampusFormList = () => {
  const [data, setData] = useState<SalecampusData[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("myToken");

    axios
      .get(
        "http://localhost:8000/salecampus"
        //   , {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
      )
      .then((response) => {
        const resData = response.data;
        console.log("resData", resData);
        setData(resData);
      });
  }, []);

  const columns = [
    {
      title: "Team Lead",
      dataIndex: "teamLead",
      key: "teamLead",
      render: (text: string) => <div style={{ width: 80 }}>{text}</div>,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text: string) => (
        <div style={{ width: 100 }}>{dayjs(text).format("YYYY-MM-DD")}</div>
      ),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text: string) => (
        <div style={{ width: 100 }}>{dayjs(text).format("YYYY-MM-DD")}</div>
      ),
    },
    {
      title: "leaveCategory",
      dataIndex: "leaveCategory",
      key: "leaveCategory",
      render: (text: string) => <div style={{ width: 100 }}>{text}</div>,
    },
    {
      title: "Leave Type",
      dataIndex: "leaveType",
      key: "leaveType",
      render: (text: string) => <div style={{ width: 50 }}>{text}</div>,
    },
    {
      title: "Leave Reason",
      dataIndex: "leaveReason",
      key: "leaveReason",
      render: (text: string) => <div style={{ width: 250 }}>{text}</div>,
    },
    {
      title: "Status (TL)",
      dataIndex: "approvalOfTeamLead",
      key: "approvalOfTeamLead",
      render: (text: string) => <div style={{ width: 80 }}>{text}</div>,
    },
    {
      title: "Status (HR)",
      dataIndex: "approvalOfHR",
      key: "approvalOfHR",
      render: (text: string) => <div style={{ width: 80 }}>{text}</div>,
    },
  ];
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
                  {/* <Table
                  style={{ width: "80vw" }}
                  dataSource={data}
                  columns={columns}
                  rowClassName={() => "header-row"}
                /> */}
                  <table>
                    <tr>
                      <th>Gender</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone No.</th>
                      <th>Parent Phone No.</th>
                      <th>Location</th>
                      <th>Course</th>
                      <th>Duration</th>
                      <th>Total Fees</th>
                    </tr>
                    {data.length > 0 &&
                      data.map((val, index) => {
                        return (
                          <tr key={index}>
                            <td>{val.gender}</td>
                            <td>{val.name}</td>
                            <td>{val.email}</td>
                            <td>{val.phone}</td>
                            <td>{val.parentPhone}</td>
                            <td>{val.location}</td>
                            <td>{val.duration}</td>
                            <td>{val.totalFee}</td>
                            <td>{val.highestQualification}</td>
                          </tr>
                        );
                      })}
                  </table>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalecampusFormList;
