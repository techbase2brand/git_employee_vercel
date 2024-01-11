import React, { useState, useEffect, useContext, useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Menu from "./Menu";
import Navbar from "./Navbar";
import axios from "axios";
import { GlobalInfo } from "../App";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Task {
  EvngTaskID: number;
  projectName: string;
  phaseName: string;
  module: string;
  task: string;
  estTime: string;
  upWorkHrs: string;
  actTime: string;
  employeeID: string;
  currDate: string;
  selectDate: string;
}
interface AssignedEmployees {
  EmployeeID: string;
  PhaseAssigneeID: number;
  projectName: string;
  phaseName: string;
  assignedNames: string[]; // add the assignedNames property
}
interface Module {
  modID: number;
  projectName: string;
  phaseName: string;
  modules: string;
}

interface Phases {
  phaseID: number;
  projectName: string;
  phases: string[];
}

const AddModule: React.FC<any> = () => {
  const [projectNames, setProjectNames] = useState<string[]>([]);
  const [phases, setPhases] = useState<Phases[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedPhase, setSelectedPhase] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [currentDate] = useState<Date>(new Date());

  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const [eveningTask, setEveningTask] = useState<Task>({
    EvngTaskID: 0,
    projectName: "",
    phaseName: "",
    module: "",
    task: "",
    estTime: "",
    actTime: "",
    upWorkHrs: "0:00",
    employeeID: "",
    currDate: formattedDate,
    selectDate: formattedDate,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const { evngEditID, setEvngEditID } = useContext(GlobalInfo);
  const dataString = localStorage.getItem("myData");
  const employeeInfo = useMemo(
    () => (dataString ? JSON.parse(dataString) : []),
    [dataString]
  );

  useEffect(() => {
    if (location?.state?.EvngTaskID) {
      axios
        .get<Task[]>(`${process.env.REACT_APP_API_BASE_URL}/get/addTaskEvening`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("myToken")}`,
          },
        })
        .then((response) => {
          const res = response?.data.filter((e) => e.EvngTaskID === location?.state?.EvngTaskID);

          setSelectedProject(res[0]?.projectName);
          setSelectedPhase(res[0]?.phaseName);
          setSelectedModule(res[0]?.module); // Add this line to set the module
          handleEstTimeChange(res[0]?.estTime || "");

          setEveningTask((prevEveningTask) => ({
            ...prevEveningTask,
            EvngTaskID: res[0]?.EvngTaskID,
            projectName: res[0]?.projectName,
            phaseName: res[0]?.phaseName,
            module: res[0]?.module,
            task: res[0]?.task,
            estTime: res[0]?.estTime,
            actTime: res[0]?.actTime,
            upWorkHrs: res[0]?.upWorkHrs,
            employeeID: res[0]?.employeeID,
            currDate: res[0]?.currDate,
            selectDate: res[0]?.selectDate,
          }));
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [evngEditID]); // Remove handleEstTimeChange from here



  useEffect(() => {
    // Fetch employees from the backend API
    const token = localStorage.getItem("myToken");
    axios
      .get<AssignedEmployees[]>(`${process.env.REACT_APP_API_BASE_URL}/get/PhaseAssignedTo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const sortedData = response.data.sort(
          (a, b) => Number(b.PhaseAssigneeID) - Number(a.PhaseAssigneeID)
        );
        const arr = sortedData
          .map((e) => {
            if (e.EmployeeID === employeeInfo.EmployeeID) {
              return e.projectName;
            }
            return null; // or some other default value
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

        if (eveningTask?.projectName) {
          const arr = sortedData
            .filter(
              (obj) =>
                obj.projectName === eveningTask.projectName &&
                obj.EmployeeID === employeeInfo?.EmployeeID
            )
            .map((obj) => obj.phaseName);
          const phasesArr = arr.map((phase, index) => ({
            phaseID: index + 1,
            projectName: eveningTask.projectName,
            phases: [phase],
          }));

          setPhases(phasesArr);
        }
      });
  }, [employeeInfo, eveningTask?.projectName]);

  useEffect(() => {
    const token = localStorage.getItem("myToken");
    // Fetch employees from the backend API
    axios.get<Module[]>(`${process.env.REACT_APP_API_BASE_URL}/get/modules`, {
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
    setEveningTask({
      ...eveningTask,
      module: value,
    });
  };

  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    const currentPhase = phases.find((phase) => phase.projectName === value);
    if (currentPhase) {
      setSelectedPhase(currentPhase.phases[0]);
      const currentModule = modules.find(
        (module) =>
          module.projectName === value &&
          module.phaseName === currentPhase.phases[0]
      );
      if (currentModule) {
        setSelectedModule(currentModule.modules); // Assume the currentModule object has a "modules" property
      } else {
        setSelectedModule("");
      }
      setEveningTask((prevEveningTask) => ({
        ...prevEveningTask,
        projectName: value,
        phaseName: currentPhase.phases[0],
        module: currentModule ? currentModule.modules : "",
      }));
    } else {
      setSelectedPhase("");
      setSelectedModule("");
      setEveningTask((prevEveningTask) => ({
        ...prevEveningTask,
        projectName: value,
        phaseName: "",
        module: "",
      }));
    }
  };

  const handlePhaseChange = (value: string) => {
    setSelectedPhase(value);
    setEveningTask((prevEveningTask) => ({
      ...prevEveningTask,
      phaseName: value,
    }));
  };
  const handleDateChange = (value: string) => {
    setEveningTask({
      ...eveningTask,
      selectDate: value,
    });
  };
  const handleTaskChange = (value: string) => {
    setEveningTask((prevEveningTask) => ({
      ...prevEveningTask,
      task: value,
    }));
  };
  const handleEstTimeChange = (value: string) => {
    setEveningTask((prevEveningTask) => ({
      ...prevEveningTask,
      estTime: value,
    }));
  };




  const handleActTimeChange = (value: string) => {
    setEveningTask((prevEveningTask) => ({
      ...prevEveningTask,
      actTime: value,
    }));
  };

  const handleUpWorkHrsChange = (value: string) => {
    setEveningTask((prevEveningTask) => ({
      ...prevEveningTask,
      upWorkHrs: value,
    }));
  };

  const handleSubmit = () => {
    if (evngEditID) {
      axios
        .put(
          `${process.env.REACT_APP_API_BASE_URL}/update/addEvngTask/${evngEditID}`,
          eveningTask,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("myToken")}`,
            },
          })
        .then((response) => {
          if (response.data === "All fields are required.") {
            alert("All fields are required.");
          } else {
            navigate("/view-evening-task");
            setEvngEditID();
            toast.success('Updated successfully!', {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        })
        .catch((error) => {
          toast.error('Error while Updating tasks.', {
            position: toast.POSITION.TOP_RIGHT,
          });
        });
    } else {
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/create/addTaskEvening`, eveningTask, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("myToken")}`,
          },
        })
        .then((response) => {
          if (response.data === "All fields are required.") {
            alert("All fields are required.");
          } else {
            setSelectedProject("");
            setSelectedPhase("");
            setSelectedModule("");
            setEveningTask({
              EvngTaskID: 0,
              projectName: "",
              phaseName: "",
              module: "",
              task: "",
              estTime: "",
              actTime: "",
              upWorkHrs: "0:00",
              employeeID: "",
              currDate: formattedDate,
              selectDate: formattedDate,
            });
            navigate("/view-evening-task");
            toast.success('Evening Task added successfully!', {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        })
        .catch((error) => {
          toast.error('Error while inserting tasks.', {
            position: toast.POSITION.TOP_RIGHT,
          });
        });
    }
  };



  useEffect(() => {
    if (employeeInfo) {
      setEveningTask((prevState) => ({
        ...prevState,
        employeeID: employeeInfo?.EmployeeID
      }));
    } else {
      console.log("empInfo is undefined");
    }


  }, [employeeInfo]);

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
                {location?.state?.EvngTaskID ? "Update Evening Task" : "Add Evening Task"}
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
                  {/* )} */}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label className="add-label">
                    Module<span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    className="add-input"
                    id="module"
                    name="module"
                    value={selectedModule}
                    onChange={(e) => handleModuleChange(e.target.value)}
                  >
                    <option value="">Select a module</option>
                    {modules
                      .filter((module) => module.phaseName === selectedPhase && module.projectName == selectedProject)
                      .map((module) => {
                        return (
                          <option key={module.modID} value={module.modules}>
                            {module.modules}
                          </option>
                        );
                      })}
                  </select>
                </div>
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
                      // maxWidth: "100%",
                      width: "100%",
                      height: "10vh",
                      resize: "none",  // Add this line
                      boxSizing: "content-box", // set boxSizing to content-box
                    }}
                    name="task"
                    className="textarea-control" // use the new class
                    value={eveningTask.task}
                    onChange={(e) => handleTaskChange(e.target.value)}
                    required
                  />
                </div>


              </div>
              <div className="SalecampusForm-col-os">
                <label className="add-label">
                  Date:
                </label>
                <div className="SalecampusForm-input-os">
                  <input
                    style={{ width: 'auto' }}
                    type="date"
                    name="selectDate"
                    value={eveningTask?.selectDate}
                    onChange={(e) => handleDateChange(e.target.value)}
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
                  <label className="add-label">
                    Est. time :<span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    style={{ width: "16.8vw" }}
                    name="estTime"
                    className="form-control"
                    value={eveningTask?.estTime}
                    onChange={(e) => handleEstTimeChange(e.target.value)}
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
                <div className="form-group">
                  <label className="add-label">Upwork Hrs</label>
                  <select
                    style={{ width: "16.8vw" }}
                    name="upWorkHrs"
                    className="form-control"
                    value={eveningTask.upWorkHrs}
                    onChange={(e) => handleUpWorkHrsChange(e.target.value)}
                    required
                  >
                    <option value="0:00">--Select Time--</option>
                    {Array.from({ length: 25 }, (_, i) => i).map((hour) =>
                      [0, 10, 20, 30, 40, 50].map((minute) => {
                        if (hour === 24 && minute > 0) {
                          return null;
                        }
                        return (
                          <option
                            key={`${hour}:${minute < 10 ? "0" + minute : minute
                              }`}
                            value={`${hour}:${minute < 10 ? "0" + minute : minute
                              }`}
                          >
                            {`${hour} hour${hour !== 1 ? "s" : ""
                              } ${minute} min${minute !== 1 ? "s" : ""}`}
                          </option>
                        );
                      })
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label className="add-label">
                    Act. time : <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    style={{ width: "16.8vw" }}
                    name="actTime"
                    className="form-control"
                    value={eveningTask.actTime}
                    onChange={(e) => handleActTimeChange(e.target.value)}
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
