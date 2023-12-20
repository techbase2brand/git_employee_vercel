import React, { useEffect, useState,useMemo } from "react";
import axios from "axios";
import io from "socket.io-client";

interface Employee {
  EmpID: string | number;
  firstName: string;
  lastName: string;
  role: string;
  dob: string | Date;
  EmployeeID: string;
  status: number;
}
interface ChatmenuProps {
  selectedEmployee: Employee | null;
  chatMessage: string;
  setSelectedEmployee: React.Dispatch<React.SetStateAction<Employee | null>>;
  setChatMessage: React.Dispatch<React.SetStateAction<string>>;
}
const Chatmenu: React.FC<ChatmenuProps> = ({ selectedEmployee, chatMessage ,setSelectedEmployee , setChatMessage }) => {
  const [employeeArr, setEmployeeArr] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios
      .get<Employee[]>("https://empbackend.base2brand.com/employees", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        const sortedData = response.data.sort((a, b) => a.firstName.localeCompare(b.firstName));
        const filteredData = sortedData.filter((emp) => emp.status === 1);
        setEmployeeArr(filteredData);
      })
      .catch((error) => console.log(error));
  }, []);

  // Function to filter employees based on the search term
  const filteredEmployees = searchTerm
    ? employeeArr.filter((employee) =>
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

// Function to handle employee selection for chat
    const handleEmployeeSelect = (employee: Employee) => {
      setSelectedEmployee(employee);
      // Additional logic when an employee is selected
    };
    // Function to send a chat message
  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Search by First Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {searchTerm && (
          <div>
            {filteredEmployees.map((employee) => (
              <div key={employee.EmpID}
              onClick={() => handleEmployeeSelect(employee)}

              >
                {employee.firstName} {employee.lastName}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Chatmenu;
