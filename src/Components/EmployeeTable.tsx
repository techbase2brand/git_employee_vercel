import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

// Define the type for the data array
interface Employee {
  EmpID: string | number;
  firstName: string;
  lastName:string
  role: string;
  dob: string | Date;
  EmployeeID: string;
  status: number;
}

interface Props {
  empObj: Employee | undefined;
  setEmpObj: React.Dispatch<React.SetStateAction<Employee | undefined>>;
}

// Define the Table component
const EmployeeTable: React.FC<Props> = ({ empObj, setEmpObj }) => {
  const [data, setData] = useState<Employee[]>([]);
  const [editID, setEditID] = useState<string | number | undefined>();

  const navigate = useNavigate();

  if (editID !== undefined) {

    const filteredObj = data.filter((obj) => {
      return obj.EmpID === editID;
    });
    setEmpObj(filteredObj[0]);
    navigate("/employee-form", { state: { empEditObj: filteredObj[0] } });
  }

  useEffect(() => {
    axios
      .get<Employee[]>("https://empbackend.base2brand.com/employees", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        const sortedData = response?.data.sort(
          (a, b) => Number(b.EmpID) - Number(a.EmpID)
        );

        setData(sortedData);
      })
      .catch((error) => console.log(error));
  }, [setData]);

  const handleEdit = (EmpID: string | number) => {
    if (EmpID !== undefined) {
      setEditID(EmpID);
    }



  };

  const handleDelete = (EmpID: string | number) => {
    console.log(`Delete employee with id ${EmpID}`);

    axios
      .delete(`https://empbackend.base2brand.com/users/${EmpID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        // do something with the response data
      })
      .catch((error) => {
        console.log(error);
        // handle the error
      });

    setData(data.filter((employee) => employee.EmpID !== EmpID));
  };

  const handleStatusChange = (EmpID: string | number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    // Call the API to update the status
    axios.put(`https://empbackend.base2brand.com/employeeUpdateStatus/${EmpID}`, {
      status: newStatus
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("myToken")}`,
      },
    })
    .then((response) => {
      // Update the local data state
      setData(prevData =>
        prevData.map(employee =>
          employee.EmpID === EmpID
          ? { ...employee, status: newStatus }
          : employee
        )
      );
    })
    .catch((error) => {
      console.log(error);
    });
  };


  const columns = [
    {
      title: "Full Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Employee) => (
        <div>{record.firstName} {record.lastName}</div>
      ),
    },
    {
      title: "Employee ID",
      dataIndex: "EmployeeID",
      key: "EmployeeID",
    },
    {
      title: "Designation",
      dataIndex: "team",
      key: "team",
    },
    {
      title: "DOB",
      dataIndex: "date",
      key: "date",
      render: (text: string) => (
        <div style={{}}>{dayjs(text).format("YYYY-MM-DD")}</div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: Employee) => (
        <input
          type="checkbox"
          checked={record.status === 1}
          onChange={() => handleStatusChange(record.EmpID, record.status)}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Employee) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined rev={undefined} />}
            onClick={() => handleEdit(record.EmpID)}
          >
            {/* Edit */}
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined rev={undefined} />}
            onClick={() => handleDelete(record.EmpID)}
          >
            {/* Delete   */}
          </Button>
        </span>
      ),
    },
  ];

  // Map over the data array and render a row for each employee
  const rows = data.map((employee) => ({
    EmpID: employee.EmpID,
    firstName: employee.firstName,
    lastName: employee.lastName,
    role: employee.role,
    dob: employee.dob.toString(),
    key: employee.EmpID,
    name: employee.firstName ,
    id: employee.EmpID,
    team: employee.role,
    date: employee.dob.toString(),
    EmployeeID: employee.EmployeeID,
    status :employee.status
  }));

  return <Table dataSource={rows} columns={columns} />;
};

export default EmployeeTable;
