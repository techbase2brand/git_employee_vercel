import React, {  useEffect } from "react";
// import { Table, Button, Select } from "antd";
// import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import dayjs from "dayjs";
// import { Option } from "antd/lib/mentions";
import Menu from "./Menu";
import Navbar from "./Navbar";
import HrLeaveReportTable from "./HrLeaveReportTable";

interface LeaveData {
  LeaveInfoID: 0;
  employeeName: string;
  startDate: Date | string;
  endDate: Date | string;
  leaveType: string;
  leaveReason: string;
  teamLead: string;
  employeeID: string;
  adminID: string;
  approvalOfTeamLead: string;
  approvalOfHR: string;
}

interface Employee {
  EmpID: string | number;
  firstName: string;
  role: string;
  dob: string | Date;
  EmployeeID: string;
}

const HrLeaveReport: React.FC = () => {
  // const [allLeave, setAllLeave] = useState<LeaveData[]>([]);
  // const [allEmployee, setAllEmployee] = useState<Employee[]>([]);

  // const [selectedEmployee, setSelectedEmployee] = useState<{
  //   name: string;
  //   id: string;
  // } | null>(null);

  // const handleEmployeeSelect = (value: string, option: any) => {
  //   // setSelectedEmployee({ name: option.children, id: value });
  // };

  // const navigate = useNavigate();

  // useEffect(() => {
  //   axios
  //     .get<LeaveData[]>(`${process.env.REACT_APP_API_BASE_URL}/get/leaveinfo`)
  //     // .then((response) => {
  //     //   // const sortedData = response.data.sort(
  //     //   //   (a, b) => Number(b.LeaveInfoID) - Number(a.LeaveInfoID)
  //     //   // );
  //     //   // setAllLeave(sortedData);
  //     // });
  //   // console.log(allEmployee, "ggggg---");
  // }, []);

  // useEffect(() => {
  //   axios
  //     .get<Employee[]>(`${process.env.REACT_APP_API_BASE_URL}/employees`)
  //     // .then((response) => {
  //     //   // const sortedData = response?.data.sort(
  //     //   //   (a, b) => Number(b.EmpID) - Number(a.EmpID)
  //     //   // );
  //     //   // setAllEmployee(sortedData);
  //     // })
  //     .catch((error) => console.log(error));
  // }, []);

  return (
    <>
      <div className="emp-main-div">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            maxHeight: "100vh",
            backgroundColor: "#F7F9FF",
          }}
        >
          <div style={{ height: "8%" }}>
            <Navbar />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              height: "90%",
            }}
          >
            <div className="menu-div">
              <Menu />
            </div>

            <div style={{ width: "92%", marginTop: "5%" ,marginLeft:"25px" ,marginRight:"25px"}}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
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
                  Leave Report
                </p>
              </div>

              <HrLeaveReportTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HrLeaveReport;
