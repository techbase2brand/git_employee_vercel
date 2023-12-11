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
  lastName: string
  role: string;
  dob: string | Date;
  EmployeeID: string;
  status: number;
  logged: number;
  IpAddress: string;
}

interface Props {
  empObj: Employee | undefined;
  setEmpObj: React.Dispatch<React.SetStateAction<Employee | undefined>>;
}

// Define the Table component
const EmployeeTable: React.FC<Props> = ({ empObj, setEmpObj }) => {
  const [data, setData] = useState<Employee[]>([]);
  const [editID, setEditID] = useState<string | number | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

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
      .get<Employee[]>("http://localhost:5000/employees", {
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
      .delete(`http://localhost:5000/users/${EmpID}`, {
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
    axios.put(`http://localhost:5000/employeeUpdateStatus/${EmpID}`, {
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
  const handleloggedChange = (EmpID: string | number, currentStatus: number) => {
    const newLogged = currentStatus === 1 ? 0 : 1;

    // Call the API to update the status
    axios.put(`http://localhost:5000/employeeUpdatelogged/${EmpID}`, {
      logged: newLogged
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
              ? { ...employee, logged: newLogged }
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
      title: "logged",
      dataIndex: "logged",
      key: "logged",
      render: (_: any, record: Employee) => (
        <input
          type="checkbox"
          checked={record.logged === 1}
          onChange={() => handleloggedChange(record.EmpID, record.logged)}
        />
      ),
    },
    {
      title: "IpAddress",
      dataIndex: "IpAddress",
      key: "IpAddress",
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
    name: employee.firstName,
    id: employee.EmpID,
    team: employee.role,
    date: employee.dob.toString(),
    EmployeeID: employee.EmployeeID,
    status: employee.status,
    logged: employee.logged,
    IpAddress: employee.IpAddress,
  }));
  const filteredData = rows.filter(project =>
    project.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.EmployeeID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleCheckAll = () => {
    const allCheckedIn = data.every(employee => employee.logged === 1);
    const newStatus = allCheckedIn ? 0 : 1;

    data.forEach(employee => {
      axios.put(`http://localhost:5000/employeeUpdatelogged/${employee.EmpID}`, {
        logged: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
        .then((response) => {
          setData(prevData =>
            prevData.map(emp =>
              emp.EmpID === employee.EmpID ? { ...emp, logged: newStatus } : emp
            )
          );
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };
  const paginationSettings = {
    pageSize: 100,
  };
  return (
    <>
      <div className="search-section" style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 10, display: 'flex' }}>
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search"
            style={{
              marginLeft: 10, border: '1px solid #d9d9d9',
              borderRadius: '6px', height: '30px'
            }}
          />
          <div style={{
            marginBottom: 10, marginLeft: '49%',
            position: 'absolute',
            marginTop: '26px',
            color: 'red'
          }}>
            Term & condition

            <input
              type="checkbox"
              checked={data.every(employee => employee.logged === 1)}
              onChange={handleCheckAll}
            />
            <span>Logged</span>
          </div>
        </div>
      </div >
      <Table dataSource={filteredData} columns={columns} pagination={paginationSettings}/>
    </>
  )
};

export default EmployeeTable;
