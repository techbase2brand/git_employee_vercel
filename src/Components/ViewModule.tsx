import React, { useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Menu from "./Menu";
import Navbar from "./Navbar";
import ViewModuleTable from "./ViewModuleTable";
import { GlobalInfo } from "../App";

interface Employee {
  EmpID: number;
  firstName: string;
  role: string;
  dob: Date;
}

const data: Employee[][] = [
  [
    { EmpID: 1, firstName: 'Alice', role: 'Manager', dob: new Date(1996, 1, 1) },
    { EmpID: 2, firstName: 'Bob', role: 'Developer', dob: new Date(1991, 2, 2) },
    { EmpID: 3, firstName: 'Charlie', role: 'Designer', dob: new Date(1986, 3, 3) },
  ],
  [
    { EmpID: 4, firstName: 'Dave', role: 'Developer', dob: new Date(1981, 4, 4) },
    { EmpID: 5, firstName: 'Eve', role: 'Designer', dob: new Date(1976, 5, 5) },
  ],
  [
    { EmpID: 6, firstName: 'Frank', role: 'Manager', dob: new Date(1971, 6, 6) },
  ]
];

const ViewProject: React.FC = () => {
  const { modulejEditObj, setModulejEditObj } = useContext(GlobalInfo);

  return (
    <div className="emp-main-div">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          maxHeight: '100vh'
        }}
      >
        <div style={{
          height: "8%",
        }}>
          <Navbar />
        </div>
        <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
          <div className="menu-div">
            <Menu />
          </div>
          <div  >
            <div>
            </div>
            <div style={{ width: '92%', marginLeft: '4.4%', marginTop: '5%' }}>
              <div
                style={{
                  display: "flex",
                  width: "80%",
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
                  Module List
                </p>
              </div>
              <     ViewModuleTable modulejEditObj={modulejEditObj} setModulejEditObj={setModulejEditObj} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProject;
