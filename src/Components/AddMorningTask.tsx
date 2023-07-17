import React, { useState, useEffect, useContext, useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Space } from "antd";
import Menu from "./Menu";
import Navbar from "./Navbar";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { GlobalInfo } from "../App";
import { format } from "date-fns";

interface Task {
  MrngTaskID: number;
  projectName: string;
  phaseName: string;
  module: string;
  task: string;
  estTime: string;
  upWorkHrs: string;
  employeeID: string;
  currDate: string;
}

interface AssignedEmployees {
  EmployeeID: string;
  PhaseAssigneeID: number;
  projectName: string;
  phaseName: string;
  assignedNames: string[];
}

interface Module {
  modID: number;
  projectName: string;
  phaseName: string;
  modules: string;
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

const AddModule: React.FC<unknown> = () => {
  const [projectNames, setProjectNames] = useState<string[]>([]);
  const [phases, setPhases] = useState<Phases[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [phaseAssignedArr, setPhaseAssignedArr] = useState<AssignedEmployees[]>(
    []
  );

  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedPhase, setSelectedPhase] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [employeeID, setEmployeeID] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const { mrngEditID, setMrngEditID } = useContext(GlobalInfo);
  const [projectName, setProjectName] = useState<string>("");
  const [phaseName, setPhaseName] = useState<string>("");
  const [moduleName, setModuleName] = useState<string>("");

  const formattedDate = format(currentDate, "yyyy-MM-dd");

  console.log("ggggg", employeeID);

  const [morningTask, setMorningTask] = useState<Task>({
    MrngTaskID: 0,
    projectName: "",
    phaseName: "",
    module: "",
    task: "",
    estTime: "",
    upWorkHrs: "",
    employeeID: "",
    currDate: formattedDate,
  });

  const location = useLocation();
  useEffect(() => {
    const token = localStorage.getItem("myToken");
    if (location?.state?.MrngTaskID) {
      axios
        .get<Task[]>(`https://empmgt.base2brand.com/get/addTaskMorning`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const res = response.data.filter(
            (e: Task) => e.MrngTaskID === location?.state?.MrngTaskID
          );

          if (res.length > 0) {
            setMorningTask({
              MrngTaskID: res[0]?.MrngTaskID,
              projectName: res[0]?.projectName,
              phaseName: res[0]?.phaseName,
              module: res[0]?.module,
              task: res[0]?.task,
              estTime: res[0]?.estTime,
              upWorkHrs: res[0]?.upWorkHrs,
              employeeID: res[0]?.employeeID,
              currDate: res[0]?.currDate,
            });

            // Update the state variables
            setProjectName(res[0]?.projectName);
            setPhaseName(res[0]?.phaseName);
            setModuleName(res[0]?.module);

            // Update the selectedProject, selectedPhase, and selectedModule
            setSelectedProject(res[0]?.projectName);
            setSelectedPhase(res[0]?.phaseName);
            setSelectedModule(res[0]?.module);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [location?.state?.MrngTaskID]);

  // const { getEmpInfo, empInfo, setEmpInfo } = useContext(GlobalInfo);

  const dataString = localStorage.getItem("myData");
  const empInfo = useMemo(
    () => (dataString ? JSON.parse(dataString) : []),
    [dataString]
  );

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("myToken");
    axios
      .get<AssignedEmployees[]>("https://empmgt.base2brand.com/get/PhaseAssignedTo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        const sortedData = response?.data?.sort(
          (a, b) => Number(b.PhaseAssigneeID) - Number(a.PhaseAssigneeID)
        );

        setPhaseAssignedArr(sortedData);

        const arr = sortedData
          .map((e) => {
            if (empInfo && e?.EmployeeID === empInfo?.EmployeeID) {
              return e.projectName;
            }
            return null;
          })
          .filter((value, index, self) => {
            return value !== null && self.indexOf(value) === index;
          })
          .reduce((unique: Array<string>, value: string | null) => {
            if (value !== null && !unique.includes(value)) {
              unique.push(value);
            }
            return unique;
          }, []);

        setProjectNames(arr);

        if (morningTask?.projectName) {
          const arr = sortedData
            .filter(
              (obj) =>
                obj?.projectName === morningTask?.projectName &&
                obj?.EmployeeID === empInfo.EmployeeID
            )
            .map((obj) => obj.phaseName);

          console.log(arr, "zzzzzzz");

          const phasesArr = arr.map((phase, index) => ({
            phaseID: index + 1,
            projectName: morningTask.projectName,
            phases: [phase],
          }));

          setPhases(phasesArr);
        }
      });
  }, [morningTask.projectName]);

  useEffect(() => {
    const token = localStorage.getItem("myToken");
    // Fetch employees from the backend API
    axios
      .get<Module[]>("https://empmgt.base2brand.com/get/modules", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const sortedData = response.data.sort(
          (a, b) => Number(b.modID) - Number(a.modID)
        );

        setModules(sortedData);
      });
  }, []);

  const handleModuleChange = (value: string) => {
    setSelectedModule(value);
    setMorningTask({
      ...morningTask,
      module: value,
    });
  };

  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    const currentPhase = phases.find((phase) => phase.projectName === value);
    console.log(currentPhase?.phases[0], "dddffff---------");

    if (currentPhase) {
      setMorningTask((prev) => ({
        ...prev,
        projectName: value,
      }));
    } else {
      setSelectedPhase("");
      setMorningTask((prev) => ({
        ...prev,
        projectName: value,
        phaseName: "",
      }));
    }
  };

  const handlePhaseChange = (value: string) => {
    setSelectedPhase(value);
    setMorningTask({
      ...morningTask,
      phaseName: value,
    });
  };

  const handleTaskChange = (value: string) => {
    setMorningTask({
      ...morningTask,
      task: value,
    });
  };

  const handleEstTimeChange = (value: string) => {
    setMorningTask({
      ...morningTask,
      estTime: value,
    });
  };

  const handleUpWorkHrsChange = (value: string) => {
    setMorningTask({
      ...morningTask,
      upWorkHrs: value,
    });
  };

  // const dataString = localStorage.getItem("myData");

  useEffect(() => {
    if (empInfo) {
      setEmployeeID(empInfo?.EmployeeID);
      setMorningTask((prevState) => ({
        ...prevState,
        employeeID: empInfo?.EmployeeID,
      }));
    } else {
      console.log("empInfo is undefined");
    }
  }, [empInfo]);
  const handleSubmit = () => {
    if (location?.state?.MrngTaskID) {
      axios
        .put(
          `https://empmgt.base2brand.com/update/addMrngTask/${location?.state?.MrngTaskID}`,
          morningTask,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("myToken")}`,
            },
          }
        )
        .then((response) => {
          if (response.data === "All fields are required.") {
            alert("All fields are required.");
          } else {
            navigate("/view-morning-task");
            setMrngEditID();
          }
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    } else {
      const token = localStorage.getItem("myToken");

      axios
        .post("https://empmgt.base2brand.com/create/addTaskMorning", morningTask, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data === "All fields are required.") {
            alert("All fields are required.");
          } else {
            navigate("/view-morning-task");
          }

          console.log(response?.data); // log the response message
          // show a success message to the user/*  */
        })
        .catch((error) => {
          console.log(error?.response?.data); // log the error message
          // show an error message to the user
        });
    }
    // Submit module data to server
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
              <p className="add-heading">
                {location?.state?.MrngTaskID
                  ? "Update Morning Task"
                  : "Add Morning Task"}
              </p>
              <label className="add-label">
                Project Name<span style={{ color: "red" }}>*</span>
              </label>

              <select
                // onChange={handleChange}
                style={{ width: "95%" }}
                className="add-input"
                id="project"
                name="project"
                value={selectedProject}
                onChange={(e) => handleProjectChange(e.target.value)}
              >
                <option value="">Select a project</option>
                {projectNames.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "95%",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label className="add-label">
                    Phase<span style={{ color: "red" }}>*</span>
                  </label>
                  {/* {selectedProject &&  ( */}
                  {/* <select
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
                        // console.log(phase, "77777777");

                        return (
                          <React.Fragment key={phase.phaseID}>
                            <option value={phase.phases}>{phase.phases}</option>
                          </React.Fragment>
                        );
                      })}
                  </select> */}

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
                        return phase.phases.map((singlePhase, index) => (
                          <option key={index} value={singlePhase}>
                            {singlePhase}
                          </option>
                        ));
                      })}
                  </select>

                  {/* )} */}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label className="add-label">
                    Module<span style={{ color: "red" }}>*</span>
                  </label>

                  {/* {selectedProject && selectedPhase && ( */}
                  <select
                    className="add-input"
                    id="module"
                    name="module"
                    value={selectedModule}
                    onChange={(e) => handleModuleChange(e.target.value)}
                  >
                    <option value="">Select a module</option>
                    {modules
                      .filter((module) => module.phaseName === selectedPhase)
                      .map((module) => {
                        return (
                          <option key={module.modID} value={module.modules}>
                            {module.modules}
                          </option>
                        );
                      })}
                  </select>
                </div>

                {/* )} */}
              </div>

              <div>
                <label className="add-label">
                  task:<span style={{ color: "red" }}>*</span>
                </label>

                <div style={{ width: "89%" }} className="form-control">
                  <textarea
                    style={{
                      outline: "none",
                      border: "none",
                      maxWidth: "100%",
                    }}
                    // type="text"
                    name="task"
                    className="form-control"
                    value={morningTask.task}
                    onChange={(e) => handleTaskChange(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "94%",
                }}
              >
                <div className="form-group">
                  <label className="add-label">Upwork Hrs</label>
                  <select
                    style={{ width: "16.8vw" }}
                    name="upWorkHrs"
                    className="form-control"
                    value={morningTask.upWorkHrs}
                    onChange={(e) => handleUpWorkHrsChange(e.target.value)}
                    required
                  >
                    <option value="">--Select Time--</option>
                    {Array.from({ length: 25 }, (_, i) => i).map((hour) =>
                      [0, 10, 20, 30, 40, 50].map((minute) => {
                        if (hour === 24 && minute > 0) {
                          return null;
                        }
                        return (
                          <option
                            key={`${hour}:${
                              minute < 10 ? "0" + minute : minute
                            }`}
                            value={`${hour}:${
                              minute < 10 ? "0" + minute : minute
                            }`}
                          >
                            {`${hour} hour${
                              hour !== 1 ? "s" : ""
                            } ${minute} min${minute !== 1 ? "s" : ""}`}
                          </option>
                        );
                      })
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label className="add-label">Upwork Hrs</label>
                  <select
                    style={{ width: "16.8vw" }}
                    name="upWorkHrs"
                    className="form-control"
                    value={morningTask.upWorkHrs}
                    onChange={(e) => handleUpWorkHrsChange(e.target.value)}
                    required
                  >
                    <option value="">--Select Time--</option>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((hour) =>
                      [0, 10, 20, 30, 40, 50].map((minute) => (
                        <option
                          key={`${hour}:${minute}`}
                          value={`${hour}:${minute}`}
                        >
                          {`${hour} hours ${minute} mins`}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
              <button className="add-button" onClick={handleSubmit}>
                Submit
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

export default AddModule;
