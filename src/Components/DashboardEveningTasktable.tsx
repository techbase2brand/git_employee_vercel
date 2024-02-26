import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Checkbox } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { Console } from "console";

interface Task {
  EvngTaskID: number;
  projectName: string;
  phaseName: string;
  module: string;
  task: string;
  estTime: string;
  upWorkHrs: number | string;
  employeeID: string;
  actTime: string;
  currDate: string;
  selectDate: string;
  approvedBy: string;
}

interface EmployeeTime {
  employeeID: string;
  formattedTime: string;
}

interface Employee {
  EmpID: string | number;
  firstName: string;
  lastName: string;
  role: string;
  dob: string | Date;
  EmployeeID: string;
  status: number;
}

interface Props {
  data: Task[][];
  totalUpwork: any;
  setTotalUpWork: React.Dispatch<React.SetStateAction<any>>;
  totalEstHrs: any;
  setTotalEstHrs: React.Dispatch<React.SetStateAction<any>>;
  totalUpworkhrs: any;
  setTotalUpworkhrs: React.Dispatch<React.SetStateAction<any>>;
  searchQuery: any;
  setSelectedRole: React.Dispatch<React.SetStateAction<any>>;
  selectedRole: any;
  del: any;
  setDel: any;
}

const DashboardEveningTasktable: React.FC<Props> = ({
  data,
  totalUpwork,
  setTotalUpWork,
  totalEstHrs,
  setTotalEstHrs,
  totalUpworkhrs,
  setTotalUpworkhrs,
  searchQuery,
  setSelectedRole,
  selectedRole,
  del,
  setDel,

}) => {
  const [employeeArr, setEmployeeArr] = useState<any>([]);
  const [recordToDelete, setRecordToDelete] = useState<Task | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({});

  const myDataString = localStorage.getItem('myData');
  let employeeName = "";
  let jobPosition = "";
  if (myDataString) {
    const myData = JSON.parse(myDataString);
    employeeName = myData?.firstName;
    jobPosition = myData?.jobPosition;
  }
  const showModalDel = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setRecordToDelete(null);
  };
  const handleDelete = (EvngTaskID: number) => {
    axios
      .delete(`${process.env.REACT_APP_API_BASE_URL}/delete/eveningDashboard/${EvngTaskID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        setDel(true)
      })
      .catch((error) => {
        console.log(error);
      });
    setIsModalOpen(false);
  };


  useEffect(() => {
    axios
      .get<Employee[]>(`${process.env.REACT_APP_API_BASE_URL}/employees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        const sortedData = response?.data.sort(
          (a, b) => a?.firstName.localeCompare(b?.firstName)
        );
        const filteredData = sortedData?.filter((emp) => emp?.status === 1)
        setEmployeeArr(filteredData);
        setDel(false)
      })
      .catch((error) => console.log(error));
  }, [del]);

  const arrayOfArray = Object.values(data);

  const handleApproval = (EvngTaskID: number) => {
    const updatedData = arrayOfArray?.map((task) =>
      task?.map((item) =>
        item?.EvngTaskID === EvngTaskID
          ? { ...item, approvedBy: employeeName }
          : item
      )
    )
    setTotalUpWork(updatedData);
    setCheckedTasks((prevCheckedTasks) => ({
      ...prevCheckedTasks,
      [EvngTaskID]: true,
    }));
    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/update/approvedBy/${EvngTaskID}`,
        {
          approvedBy: employeeName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      .then((response) => {
        setCheckedTasks((prevCheckedTasks) => ({
          ...prevCheckedTasks,
          [EvngTaskID]: true,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",
    },
    {
      title: "Phase",
      dataIndex: "phaseName",
      key: "phaseName",
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
    },
    {
      title: "Task",
      dataIndex: "task",
      key: "task",
    },
    {
      title: "Est time (hrs)",
      dataIndex: "estTime",
      key: "estTime",
    },
    {
      title: "Act time (hrs)",
      dataIndex: "actTime",
      key: "actTime",
    },
    {
      title: "UpWork(hrs)",
      dataIndex: "upWorkHrs",
      key: "upWorkHrs",
    },
    {
      title: "Date",
      dataIndex: "selectDate",
      key: "selectDate",
    },
    {
      title: "TL Approved",
      dataIndex: "approvedBy",
      key: "approvedBy",
      render: (text: string, record: Task) => {
        return (
          <>
            {(jobPosition === "Project Manager" || jobPosition === "Team Lead" || jobPosition === "Sales-Dashboard") &&
              <Checkbox
                checked={!!text || checkedTasks[record.EvngTaskID]}
                onChange={() => handleApproval(record.EvngTaskID)}
              />}
            {
              jobPosition === "Managing Director" &&
              <div>{text}</div>
            }
          </>
        )
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Task) => (
        <span>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            // onClick={() => handleDelete(record.EvngTaskID)}
            onClick={() => {
              setRecordToDelete(record);
              showModalDel();
            }}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  const totalMinutes = arrayOfArray.reduce((acc, curr) => {
    curr.forEach((obj) => {
      if (obj?.actTime) {
        const [hours, minutes] = obj.actTime.split(":").map(Number);
        const timeInMinutes = hours * 60 + minutes;
        acc += timeInMinutes;
      }
    });
    return acc;
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;
  setTotalUpWork(formattedTime);
  const totalEstTime = arrayOfArray.reduce((acc, curr) => {
    curr.forEach((obj) => {
      if (obj?.estTime) {
        const [hours, minutes] = obj.estTime.split(":").map(Number);
        const timeInMinutes = hours * 60 + minutes;
        acc += timeInMinutes;
      }
    });
    return acc;
  }, 0);

  const hoursEst = Math.floor(totalEstTime / 60);
  const minutesEst = totalEstTime % 60;
  const formattedTimeEst = `${hoursEst}:${minutesEst
    .toString()
    .padStart(2, "0")}`;

  setTotalEstHrs(formattedTimeEst);

  const totalMinutesUpworkhrs = arrayOfArray.reduce((acc, curr) => {
    curr.forEach((obj) => {
      if (obj?.actTime) {
        let hours, minutes;

        if (typeof obj.upWorkHrs === "number") {
          hours = obj.upWorkHrs;
          minutes = 0;
        } else {
          [hours, minutes] = obj.upWorkHrs.split(":").map(Number);
        }
        const timeInMinutes = hours * 60 + minutes;
        acc += timeInMinutes;
      }
    });
    return acc;
  }, 0);



  const hoursUpworkhrs = Math.floor(totalMinutesUpworkhrs / 60);
  const minutesUpworkhrs = totalMinutesUpworkhrs % 60;
  const formattedTimeUpworkhrs = `${hoursUpworkhrs}:${minutesUpworkhrs
    .toString()
    .padStart(2, "0")}`;

  setTotalUpworkhrs(formattedTimeUpworkhrs);

  const estTimeByEmployee = arrayOfArray.reduce((acc: any, curr: any) => {
    curr.forEach((obj: any) => {
      if (obj?.estTime) {
        const [hours, minutes] = obj.estTime.split(":").map(Number);
        const timeInMinutes = hours * 60 + minutes;
        if (!acc[obj.employeeID]) {
          acc[obj.employeeID] = 0;
        }
        acc[obj.employeeID] += timeInMinutes;
      }
    });
    return acc;
  }, {});

  const employeeTimes: EmployeeTime[] = [];

  for (const employeeID in estTimeByEmployee) {
    const totalMinutes = estTimeByEmployee[employeeID];
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;
    employeeTimes.push({ employeeID, formattedTime });
  }

  const upWorkByEmployee = arrayOfArray.reduce((acc: any, curr: any) => {

    curr.forEach((obj: any) => {
      if (obj?.upWorkHrs) {
        let hours, minutes;
        if (typeof obj.upWorkHrs === "number") {
          hours = obj.upWorkHrs;
          minutes = 0;
        } else {
          [hours, minutes] = obj.upWorkHrs.split(":").map(Number);
        }
        const timeInMinutes = hours * 60 + minutes;
        acc += timeInMinutes;
      }
    });
    return acc;
  }, 0);


  const employeeUpworkTimes: EmployeeTime[] = [];

  for (const employeeID in upWorkByEmployee) {
    const totalMinutes = upWorkByEmployee[employeeID];
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;
    employeeUpworkTimes.push({ employeeID, formattedTime });
  }

  const actTimeByEmployee = arrayOfArray.reduce((acc: any, curr: any) => {
    curr.forEach((obj: any) => {
      if (obj?.actTime) {
        const [hours, minutes] = obj.actTime.split(":").map(Number);
        const timeInMinutes = hours * 60 + minutes;
        if (!acc[obj.employeeID]) {
          acc[obj.employeeID] = 0;
        }
        acc[obj.employeeID] += timeInMinutes;
      }
    });
    return acc;
  }, {});

  const employeeactTimes: EmployeeTime[] = [];
  for (const employeeID in actTimeByEmployee) {
    const totalMinutes = actTimeByEmployee[employeeID];
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;
    employeeactTimes.push({ employeeID, formattedTime });
  }
  let filteredEmployees;
  if (selectedRole) {
    filteredEmployees = employeeArr.filter((emp: Employee) => emp?.role === selectedRole);
  } else {
    filteredEmployees = employeeArr;
  }

  const tables = filteredEmployees
    .filter((emp: Employee) => {
      if (!searchQuery) return true;
      if (emp.firstName.toLowerCase().includes(searchQuery) || emp.lastName.toLowerCase().includes(searchQuery)) {
        return true;
      }

      const tasksForEmployee = arrayOfArray?.find(
        (e) => e[0]?.employeeID === emp?.EmployeeID
      );
      if (tasksForEmployee) {
        return tasksForEmployee.some(task =>
          task?.phaseName.toLowerCase().includes(searchQuery) ||
          task?.projectName.toLowerCase().includes(searchQuery) ||
          task?.module.toLowerCase().includes(searchQuery)
        );
      }

      return false;
    })
    .map((emp: Employee) => {
      const tasksForEmployee = arrayOfArray.find(
        (e) => e[0]?.employeeID === emp?.EmployeeID
      );

      const filteredEstTime = employeeTimes.find(
        (obj) => obj?.employeeID === emp?.EmployeeID
      );
      const filteredUpworkTime = employeeUpworkTimes.find(
        (obj) => obj?.employeeID === emp?.EmployeeID
      );
      const filteredactTime = employeeactTimes.find(
        (obj) => obj?.employeeID === emp?.EmployeeID
      );

      const renderEmptyText = () => (
        <div style={{ color: 'red' }}>
          No data found for this employee.
        </div>
      );
      return (

        <div key={emp.EmpID}>
          <div style={{ display: "flex", flexDirection: "row", marginTop: '30px' }}>
            <p>{emp.firstName} {emp.lastName}</p>
            <div
              style={{
                marginLeft: "71%",
                display: "flex",
                flexDirection: "row",
                float: "right",
              }}
            >
              <p style={{ marginRight: "2vw" }}>{filteredEstTime?.formattedTime}</p>
              <p style={{ marginLeft: "5vw" }}>{filteredactTime?.formattedTime}</p>
              <p style={{ marginLeft: "5vw" }}>{filteredUpworkTime?.formattedTime}</p>
            </div>
          </div>
          <div className="evening-dashboard">
            <Table
              dataSource={tasksForEmployee || []}
              columns={columns}
              rowClassName={() => "header-row"}
              locale={{
                emptyText: renderEmptyText
              }}
            />
          </div>
          <Modal
            title="Confirmation"
            open={isModalOpen}
            onOk={() => {
              if (recordToDelete) {
                handleDelete(recordToDelete.EvngTaskID);
              }
            }}
            onCancel={handleCancel}
          >
            <p>Are you sure, you want to delete</p>
          </Modal>
        </div>
      );
    })
    .filter(Boolean); // filter out any nulls

  return <>{tables}</>;
};
export default DashboardEveningTasktable;
