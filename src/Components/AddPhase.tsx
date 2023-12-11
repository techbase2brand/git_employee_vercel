import React, { useState, useEffect, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Space } from "antd";
import Menu from "./Menu";
import Navbar from "./Navbar";
import EmployeeTable from "./EmployeeTable";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GlobalInfo } from "../App";

interface Phase {
  // projectName: string;
  phaseName: string;
  // ProID: string | number;
  // clientName: string;
  // projectName: string;
  // projectDescription: string;
}
interface Project {
  ProID: string | number;
  clientName: string;
  projectName: string;
  projectDescription: string;
  // costBefore: number;
  // costAfter: number;
  // estTime: number;
  // actTime: number;
}
interface Phases {
  phaseID: number;
  projectName: string;
  phases: string[];
}
const data: Phases[] = [
  {
    phaseID: 0,
    projectName: "",
    phases: ["", ""],
  },
];
const AddPhase: React.FC = () => {
  const [projectName, setProjectName] = useState<string>("");
  const [phases, setPhases] = useState<Phase[]>([{ phaseName: "" }]);
  const [data, setData] = useState<any[]>([]);
  const [phaseArr, setphaseArr] = useState<Phases[]>([]);

  const navigate = useNavigate();

  console.log(projectName, "projectName");
  console.log(phases, "phases");
  console.log(data, "data");
  console.log(phaseArr, "phaseArr");

  const { phasejEditObj, setPhasejEditObj } = useContext(GlobalInfo);

  console.log(phasejEditObj, "ggjjjjkkk---");

  useEffect(() => {
    if (phasejEditObj) {
      setProjectName(phasejEditObj.projectName);
    }
  }, [phasejEditObj]);

  const projectNames = data.map((e) => {
    return e.projectName;
  });

  console.log(projectNames, "00---");

  const handleClientNameChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setProjectName(event.target.value);
  };

  useEffect(() => {
    axios
      .get<Project[]>("https://empbackend.base2brand.com/get/projects", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        }
      })
      .then((response) => {
        setData(response.data);
      });
  }, []);

  const handlePhaseNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = event.target;
    setPhases((prevState) => {
      const newState = [...prevState];
      newState[index].phaseName = value;
      return newState;
    });
  };

  const handleSubmit = () => {
    if (!projectName || !phases.every((phase) => phase.phaseName)) {
      alert("Please fill all credentials");
      return;
    }



    const data = {
      projectName,
      phases: phases.map((phase) => phase.phaseName),
    };

    axios
      .post("https://empbackend.base2brand.com/api/add-phase", data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        }
      })
      .then((response) => {
        console.log(response, "999");
        if (response.data === "OK") {
          navigate("/view-phase");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data);
        } else {
          console.log(error, "8888");
        }
      });

    console.log("Form submitted with data:", data);


    console.log("Form submitted with data:", data);
  };

  const handleAddPhase = () => {
    setPhases((prevState) => [...prevState, { phaseName: "" }]);
  };

  const handleRemovePhase = (index: number) => {
    setPhases((prevState) => {
      const newState = [...prevState];
      newState.splice(index, 1);
      return newState;
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
              <p className="add-heading">Add Phase</p>
              <label className="add-label">
                Project<span style={{ color: "red" }}>*</span>{" "}
              </label>
              <select
                className="add-input"
                value={projectName}
                onChange={handleClientNameChange}
              >
                <option value="">Select a project</option>
                {projectNames.sort((a, b) => a.localeCompare(b)).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}

              </select>

              {phases.map((phase, index) => (
                <div key={index} style={{ marginTop: "10px" }}>
                  <label className="add-label">
                    Phase {index + 1} Name
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <div style={{ display: "flex" }}>
                    <input
                      className="add-input"
                      value={phase.phaseName}
                      onChange={(e) => handlePhaseNameChange(e, index)}
                    />
                    {index !== 0 && (
                      <div
                        style={{
                          marginLeft: "10px",
                          cursor: "pointer",
                          marginTop: "16px",
                        }}
                        onClick={() => handleRemovePhase(index)}
                      >
                        <MinusCircleOutlined rev={undefined} />
                      </div>
                    )}
                    {index === phases.length - 1 && (
                      <div
                        style={{
                          marginLeft: "5px",
                          cursor: "pointer",
                          marginTop: "16px",
                        }}
                        onClick={handleAddPhase}
                      >
                        <PlusCircleOutlined rev={undefined} />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <button className="add-button" onClick={handleSubmit}>
                Add Phase
              </button>
            </div>
            <div style={{ width: "90%", height: "80%", marginTop: "3%" }}>
              <div>{/* <EmployeeTable  /> */}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPhase;
