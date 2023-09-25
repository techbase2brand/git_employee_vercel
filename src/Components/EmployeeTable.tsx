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
  role: string;
  dob: string | Date;
  EmployeeID: string;
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
    // console.log(data,"gggg----");

    const filteredObj = data.filter((obj) => {
      return obj.EmpID === editID;
    });
    setEmpObj(filteredObj[0]);
  navigate('/employee-form'   , { state: { empEditObj: filteredObj[0] } } );
}

 useEffect(() => {
    axios
      .get<Employee[]>("http://localhost:5000/employees",{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      .then((response) => {
        const sortedData = response?.data.sort(
          (a, b) => Number(b.EmpID) - Number(a.EmpID)
        );
        console.log(sortedData, "///////-----");

        setData(sortedData);
      })
      .catch((error) => console.log(error));
  }, [setData]);


  const handleEdit = (EmpID: string | number) => {
    if (EmpID !== undefined) {
      setEditID(EmpID);
    }

    console.log(EmpID, "jjjjgggggg----");

    //     let num = EmpID;
    // let text = num.toString();
    // console.log(text,"-----");

    // localStorage.setItem("EMPID", text);
    // console.log(`Edit employee with id ${EmpID}`);
  };

  const handleDelete = (EmpID: string | number) => {
    console.log(`Delete employee with id ${EmpID}`);

    axios
      .delete(`http://localhost:5000/users/${EmpID}`,  {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      .then((response) => {
        console.log(response.data);
        // do something with the response data
      })
      .catch((error) => {
        console.log(error);
        // handle the error
      },);

    setData(data.filter((employee) => employee.EmpID !== EmpID));
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
      render: (text: string) => <div style={{}}>{dayjs(text).format("YYYY-MM-DD")}</div>,
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
    role: employee.role,
    dob: employee.dob.toString(),
    key: employee.EmpID,
    name: employee.firstName,
    id: employee.EmpID,
    team: employee.role,
    date: employee.dob.toString(),
    EmployeeID: employee.EmployeeID,
  }));

  return <Table dataSource={rows} columns={columns} />;
};

export default EmployeeTable;
