import React, { useState } from "react";
import Navbar from "./Navbar";
import Chatmenu from "./Chatmenu";
import ChatMessageComp from "./ChatMessageComp";


interface Employee {
  EmpID: string | number;
  firstName: string;
  lastName: string;
  role: string;
  dob: string | Date;
  EmployeeID: string;
  status: number;
}
const ChatMessagePage = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [chatMessage, setChatMessage] = useState("");

  return (
    <div className="emp-main-div">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#F7F9FF",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
          <div className="menu-div">
            <Chatmenu
              selectedEmployee={selectedEmployee}
              chatMessage={chatMessage}
              setSelectedEmployee={setSelectedEmployee}
              setChatMessage={setChatMessage}
            />
          </div>
          <div>
            <div style={{ width: "92%", marginLeft: "4.4%", marginTop: "5%" }}>
              <div
                style={{
                  display: "flex",
                  width: "80%",
                  alignItems: "center",
                }}
              >
                {selectedEmployee && (
                  <p
                    style={{
                      color: "#094781",
                      justifyContent: "flex-start",
                      fontSize: "32px",
                      fontWeight: "bold",
                    }}
                  >
                    {selectedEmployee.firstName}  {selectedEmployee.lastName}
                  </p>
                )}
              </div>
              {
                selectedEmployee && (
                    < ChatMessageComp
            selectedEmployee={selectedEmployee}
                    chatMessage={chatMessage}
                    setSelectedEmployee={setSelectedEmployee}
                    setChatMessage={setChatMessage}
                    />
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessagePage;
