import React, { useState, useEffect, useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Menu from "./Menu";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  selectDate: string;
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

interface Phases {
  phaseID: number;
  projectName: string;
  phases: string[];
}
const AddModule: React.FC<unknown> = () => {
  const [projectNames, setProjectNames] = useState<string[]>([]);
  const [phases, setPhases] = useState<Phases[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedPhase, setSelectedPhase] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [employeeID, setEmployeeID] = useState<string>("");
  const [currentDate] = useState<Date>(new Date());
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const [morningTask, setMorningTask] = useState<Task>({
    MrngTaskID: 0,
    projectName: "",
    phaseName: "",
    module: "",
    task: "",
    estTime: "",
    upWorkHrs: "0:00", // Set the initial value to "0:00"
    employeeID: "",
    currDate: formattedDate,
    selectDate: formattedDate,
  });
  const token = localStorage.getItem("myToken");
  const emptyData = selectedProject && morningTask.estTime && morningTask.task && selectedModule && selectedPhase
  console.log("emptyData", emptyData);

  const location = useLocation();
  useEffect(() => {
    if (location?.state?.MrngTaskID) {
      axios
        .get<Task[]>(`${process.env.REACT_APP_API_BASE_URL}/get/addTaskMorning/${location?.state?.MrngTaskID}`, {
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
              selectDate: res[0]?.selectDate,
            });

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

  const dataString = localStorage.getItem("myData");
  const empInfo = useMemo(
    () => (dataString ? JSON.parse(dataString) : []),
    [dataString]
  );


  const navigate = useNavigate();
  // useEffect(() => {
  //   axios
  //     .get<AssignedEmployees[]>(
  //       `${process.env.REACT_APP_API_BASE_URL}/get/PhaseAssignedTo`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         params: {
  //           employeeID: empInfo?.EmployeeID,
  //         },
  //       }
  //     )
  //       .then((response) => {
  //         const sortedData = response?.data?.sort(
  //           (a, b) => Number(b.PhaseAssigneeID) - Number(a.PhaseAssigneeID)
  //         );
  //         const arr = sortedData
  //           .map((e) => {
  //             if (empInfo && e?.EmployeeID === empInfo?.EmployeeID) {
  //               return e.projectName;
  //             }
  //             return null;
  //           })
  //           .filter((value, index, self) => {
  //             return value !== null && self.indexOf(value) === index;
  //           })
  //           .reduce((unique: Array<string>, value: string | null) => {
  //             if (value !== null && !unique.includes(value)) {
  //               unique.push(value);
  //             }
  //             return unique;
  //           }, []);

  //         setProjectNames(arr);

  //         if (morningTask?.projectName) {
  //           const arr = sortedData
  //             .filter(
  //               (obj) =>
  //                 obj?.projectName === morningTask?.projectName &&
  //                 obj?.EmployeeID === empInfo.EmployeeID
  //             )
  //             .map((obj) => obj.phaseName);


  //           const phasesArr = arr.map((phase, index) => ({
  //             phaseID: index + 1,
  //             projectName: morningTask.projectName,
  //             phases: [phase],
  //           }));

  //           setPhases(phasesArr);
  //         }
  //       });
  //   }, [morningTask.projectName]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<AssignedEmployees[]>(
          `${process.env.REACT_APP_API_BASE_URL}/get/PhaseAssignedTo/param`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              employeeID: empInfo?.EmployeeID,
            },
          }
        );

        // console.log("response.data",response.data)
        // Handle the response data
        const sortedData = response?.data?.sort(
          (a, b) => Number(b.PhaseAssigneeID) - Number(a.PhaseAssigneeID)
        );
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

          const phasesArr = arr.map((phase, index) => ({
            phaseID: index + 1,
            projectName: morningTask.projectName,
            phases: [phase],
          }));

          setPhases(phasesArr);
        }
      } catch (error) {
        // Handle errors
        console.error('Error while fetching data:', error);
      }
    };

    fetchData();
  }, [empInfo?.EmployeeID, morningTask.projectName]);


  useEffect(() => {
    axios
      .get<Module[]>(`${process.env.REACT_APP_API_BASE_URL}/get/modules`, {
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
  const handleDateChange = (value: string) => {
    setMorningTask({
      ...morningTask,
      selectDate: value,
    });
  };

  const handleEstTimeChange = (value: string) => {
    setMorningTask((prevMorningTask) => ({
      ...prevMorningTask,
      estTime: value,
    }));
  };

  const handleUpWorkHrsChange = (value: string) => {
    setMorningTask({
      ...morningTask,
      upWorkHrs: value,
    });
  };


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
    if (emptyData) {
      if (morningTask.module && morningTask.task && morningTask.estTime) {
        setSubmitting(true)
      }
      if (location?.state?.MrngTaskID) {
        axios
          .put(
            `${process.env.REACT_APP_API_BASE_URL}/update/addMrngTask/${location?.state?.MrngTaskID}`,
            morningTask,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            navigate("/view-morning-task");
            toast.success('Updated successfully!', {
              position: toast.POSITION.TOP_RIGHT,
            });
          })
          .catch((error) => {
            toast.error('Error while Updating task.', {
              position: toast.POSITION.TOP_RIGHT,
            });
          });
      } else {
        axios
          .post(
            `${process.env.REACT_APP_API_BASE_URL}/create/addTaskMorning`,
            morningTask,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            setSelectedProject("");
            setSelectedPhase("");
            setSelectedModule("");
            setMorningTask({
              MrngTaskID: 0,
              projectName: "",
              phaseName: "",
              module: "",
              task: "",
              estTime: "",
              upWorkHrs: "0:00",
              employeeID: "",
              currDate: formattedDate,
              selectDate: formattedDate,
            });
            navigate("/view-morning-task");
            toast.success('Morning Task added successfully!', {
              position: toast.POSITION.TOP_RIGHT,
            });
          })
          .catch((error) => {
            toast.error('Error while inserting tasks.', {
              position: toast.POSITION.TOP_RIGHT,

            });
          });
      }
    } else {
      alert("Some fields are missing. Please fill in all required fields.");
    }
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

        <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>

          <div
            style={{ display: "flex", flexDirection: "column", width: '100%' }}
            className="form-container"
          >
            <div style={{ width: '50%' }}>
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
                  className="add-input"
                  id="project"
                  name="project"
                  value={selectedProject}
                  onChange={(e) => handleProjectChange(e.target.value)}
                >
                  <option value="">Select a project</option>
                  {projectNames?.map((project) => (
                    <option key={project} value={project}>
                      {project}
                    </option>
                  ))}
                </select>
                <div
                  className="phase-mod"
                >
                  <div className="mrng-phase">
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
                          return phase.phases.map((singlePhase, index) => (
                            <option key={index} value={singlePhase}>
                              {singlePhase}
                            </option>
                          ));
                        })}
                    </select>
                  </div>

                  <div className="mrng-phase">
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
                        .filter((module) => module.phaseName == selectedPhase && module.projectName == selectedProject)
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
                  <div style={{ width: "auto" }} className="form-control">
                    <textarea
                      style={{
                        outline: "none",
                        border: "none",
                        width: "100%",
                        height: "10vh",
                        resize: "none",  // Add this line
                        boxSizing: "content-box", // set boxSizing to content-box
                      }}
                      name="task"
                      className="textarea-control" // use the new class
                      value={morningTask.task}
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
                      value={morningTask?.selectDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "auto",
                    gap: '4px'
                  }}
                >
                  <div className="mrng-phase">
                    <label className="add-label">
                      Estimate Hrs<span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      name="estTime"
                      className="form-control"
                      value={morningTask.estTime}
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

                  <div className="mrng-phase">
                    <label className="add-label">Upwork Hrs</label>
                    <select
                      name="upWorkHrs"
                      className="form-control"
                      value={morningTask.upWorkHrs}
                      onChange={(e) => handleUpWorkHrsChange(e.target.value)}
                    >
                      <option value="0:00">0 hours 0 mins</option> {/* Add this option */}
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
                </div>
                <button className="add-button-2" onClick={handleSubmit} disabled={submitting === true}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddModule;
