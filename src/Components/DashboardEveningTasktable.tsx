import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Checkbox, Tooltip, Select } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

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
  status: string;
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
interface Project {
  ProID: string | number;
  clientName: string;
  projectName: string;
  projectDescription: string;
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
  const [projectsInfo, setProjectsInfo] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({});
  const [taskStatuses, setTaskStatuses] = useState<Record<number, string>>({});

  const myDataString = localStorage.getItem('myData');
  let employeeName = "";
  let jobPosition = "";
  let EmployeeID = "";
  if (myDataString) {
    const myData = JSON.parse(myDataString);
    employeeName = myData?.firstName;
    jobPosition = myData?.jobPosition;
    EmployeeID = myData?.EmployeeID;
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
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
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
      .get<Project[]>(`${process.env.REACT_APP_API_BASE_URL}/get/projects`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        setProjectsInfo(response.data);
      });
  }, []);

  useEffect(() => {
    axios
      .get<Employee[]>(`${process.env.REACT_APP_API_BASE_URL}/employees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
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

  const getRowClassName = (record: Task) => {
    if (record.status === "success") {
      return "row-success"; // Apply this class when status is "success"
    }
    return "";
  };
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
            Authorization: `Bearer ${localStorage.getItem("myToken")}`,
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
  const handleStatusChange = (EvngTaskID: number, value: string) => {
    // Update local state first
    setTaskStatuses((prevStatuses) => ({
      ...prevStatuses,
      [EvngTaskID]: value,
    }));

    // Make API call to update the status in the backend
    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/update/status/evng/${EvngTaskID}`,
        { status: value },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("myToken")}`,
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          console.log("Status updated successfully in backend.");
        }
      })
      .catch((error) => console.log(error));
  };
  const columns = [
    {
      title: "Client & Project",
      dataIndex: "clientAndProject",
      key: "clientAndProject",
      render: (text: string, record: Task) => {
        const project = projectsInfo.find(
          (project) => project.projectName === record.projectName
        );
        const clientName = project ? project?.clientName : "";
        const projectName = project ? project?.projectName : "";
        const projectDescription = project ? project.projectDescription : "";

        return (
          <Tooltip title={projectDescription} color="volcano">
            <span>{`${clientName} - ${projectName}`}</span>
          </Tooltip>
        );
      },
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
      title: "Est",
      dataIndex: "estTime",
      key: "estTime",
    },
    {
      title: "Act",
      dataIndex: "actTime",
      key: "actTime",
    },
    {
      title: "UpWork",
      dataIndex: "upWorkHrs",
      key: "upWorkHrs",
    },
    {
      title: "TL Approved",
      dataIndex: "approvedBy",
      key: "approvedBy",
      render: (text: string, record: Task) => {
        return (
          <>
            {(jobPosition === "Project Manager" || jobPosition === "Team Lead" || jobPosition === "Sales-Dashboard" || EmployeeID === "B2B00012" || EmployeeID === "B2B00028") &&
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string, record: Task) => {
        return (
          <>
            {(jobPosition === "Project Manager" || jobPosition === "Team Lead" || jobPosition === "Sales-Dashboard" || employeeName === "Vikash") &&
              <Select
                value={taskStatuses[record.EvngTaskID] || record.status || "Select"}
                onChange={(value) => handleStatusChange(record.EvngTaskID, value)}
                style={{ width: 120 }}
              >
                <Select.Option value="completed">Completed</Select.Option>
                <Select.Option value="pending">Pending</Select.Option>
                <Select.Option value="in-progress">In-Progress</Select.Option>
                <Select.Option value="not-satisfy">Not-Satisfy</Select.Option>
              </Select>
            }
            {
              jobPosition === "Managing Director" &&
              <div>{text}</div>
            }
          </>
        )
      },
    },
    {
      title: "Date",
      dataIndex: "selectDate",
      key: "selectDate",
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_: any, record: Task) => (
    //     <span>
    //       <Button
    //         type="link"
    //         danger
    //         icon={<DeleteOutlined />}
    //         // onClick={() => handleDelete(record.EvngTaskID)}
    //         onClick={() => {
    //           setRecordToDelete(record);
    //           showModalDel();
    //         }}
    //       >
    //         Delete
    //       </Button>
    //     </span>
    //   ),
    // },
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
              // rowClassName={() => "header-row"}
              rowClassName={getRowClassName}
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
