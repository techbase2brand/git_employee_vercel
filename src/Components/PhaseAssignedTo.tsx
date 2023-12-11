import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Space } from "antd";
import Menu from "./Menu";
import Navbar from "./Navbar";
import EmployeeTable from "./EmployeeTable";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface AssignedEmployees {
  projectName: string;
  phaseName: string;
  assignedNames: string[];
  EmployeeID: string[]
}

interface Employee {
  EmpID: string | number;
  firstName: string;
  lastName: string;
  role: string;
  dob: string | Date;
  EmployeeID: string;
}
interface Employees {
  id: number;
  name: string;
}

interface Project {
  ProID: string | number;
  clientName: string;
  projectName: string;
  projectDescription: string;
}

interface Phases {
  phaseID: number;
  projectName: string;
  phases: string[];
}
type Phase = {
  phaseID: number;
  projectName: string;
};

const dummyEmployeeList: Employees[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

const PhaseAssignedTo: React.FC<any> = ({ navigation, classes }) => {
  const [data, setData] = useState<Employee[]>([]);
  const [filteredAssignee, setfilteredAssignee] = useState<any>([]);
  const [assignee, setAssignee] = useState<Employee[]>([]);
  const [assigneeEmployeeID, setAssigneeEmployeeID] = useState<Employee[]>([]);
  const [projectNames, setProjectNames] = useState<string[]>([]);
  const [phases, setPhases] = useState<Phases[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedPhase, setSelectedPhase] = useState<string>("");
  const [assignedEmployees, setAssignedEmployees] = useState<AssignedEmployees>(
    {
      projectName: "",
      phaseName: "",
      assignedNames: [],
      EmployeeID: [],
    }
  );

  const navigate = useNavigate();
  const filteredData = data.filter((item:any) => item.status === 1);

  useEffect(() => {
    axios
      .get<Employee[]>("http://localhost:5000/employees", {
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

  useEffect(() => {
    axios
      .get<Project[]>("http://localhost:5000/get/projects", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      .then((response) => {
        setProjectNames(response.data.map((project) => project.projectName));
      });
  }, []);

  useEffect(() => {
    axios.get<Phases[]>("http://localhost:5000/get/phases", {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    })
      .then((response) => {
        setPhases(response.data);
      });
  }, []);
  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    const currentPhase = phases.find((phase) => phase.projectName === value);
    if (currentPhase) {
      setSelectedPhase(currentPhase.phases[0]);
      setAssignedEmployees({
        projectName: value,
        phaseName: currentPhase.phases[0],
        assignedNames: ["", ""],
        EmployeeID: ["", ""],
      });
    } else {
      setSelectedPhase("");
      setAssignedEmployees({
        projectName: value,
        phaseName: "",
        assignedNames: ["", ""],
        EmployeeID: ["", ""],

      });
    }
  };
  const handlePhaseChange = (value: string) => {
    setSelectedPhase(value);
    setAssignedEmployees({
      ...assignedEmployees,
      phaseName: value,
    });
  };

  const handleCheckboxChange = (employee: Employee) => {
    if (assignee.some((e) => e.EmployeeID === employee.EmployeeID)) {
      console.log(employee.EmployeeID, "jjjjj---kkk");

      setAssignee((prev) =>
        prev.filter((e) => e.EmployeeID !== employee.EmployeeID)
      );
    } else {
      setAssignee((prev) => [...prev, employee]);

    }
  };
  useEffect(() => {
    const assignedNames = assignee.map((e) => e.firstName);
    setAssignedEmployees((prev) => ({ ...prev, assignedNames }));
    const EmployeeID = assignee.map((e) => e.EmployeeID);
    setAssignedEmployees((prev) => ({ ...prev, EmployeeID }));

  }, [assignee]);

  const handleSubmit = () => {
    axios
      .post("http://localhost:5000/api/add-phaseAssignee", assignedEmployees, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      .then((response) => {
        console.log(response.data);
        navigate("/ViewPhaseAssign");
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data);
        } else {
          console.log(error);
        }
      });
  };

  return (
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
          <div
            style={{ display: "flex", flexDirection: "column" }}
            className="form-container"
          >
            <div className="add-div">
              <p className="add-heading">Assignee to</p>
              <label className="add-label">
                Project Name<span style={{ color: "red" }}>*</span>
              </label>

              <select
                className="add-input"
                id="project"
                name="project"
                value={selectedProject}
                onChange={(e) => handleProjectChange(e.target.value)}
              >
                <option value="">Select a project</option>
                {projectNames.sort((a, b) => a.localeCompare(b)).map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
              <label className="add-label">
                Phase<span style={{ color: "red" }}>*</span>
              </label>
              <select
                className="add-input"
                id="phase"
                name="phase"
                value={selectedPhase}
                onChange={(e) => handlePhaseChange(e.target.value)}
              >
                <option value="">Select a phase</option>
                {phases
                  .filter((phase) => phase.projectName === selectedProject)
                  .map((phase) => {
                    return (
                      <React.Fragment key={phase.phaseID}>
                        <option value={phase.phases}>{phase.phases}</option>
                      </React.Fragment>
                    );
                  })}
              </select>
              <label className="add-label">
                  Assigned to <span style={{ color: "red" }}>*</span>
                </label>
              <div style={{ overflow: "auto", height: "230px",marginTop: "8px" }}>
                {filteredData.sort((a, b) => a.firstName.localeCompare(b.firstName)).map((employee) => (
                  <div
                    style={{ display: "flex", flexDirection: "column" }}
                    key={employee.EmployeeID}
                  >
                    <label key={employee.EmployeeID}>
                      <input
                        type="checkbox"
                        checked={assignee.some(
                          (e) => e.EmployeeID === employee.EmployeeID
                        )}
                        onChange={() => handleCheckboxChange(employee)}
                      />
                      {employee.firstName} {employee.lastName}
                    </label>
                  </div>
                ))}
              </div>
              <button className="add-button" onClick={handleSubmit}>
                Assign
              </button>
            </div>
            <div
              style={{ marginTop: "50px", height: "80%", width: "100%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseAssignedTo;
