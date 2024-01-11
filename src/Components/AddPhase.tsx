import React, { useState, useEffect, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Menu from "./Menu";
import Navbar from "./Navbar";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GlobalInfo } from "../App";

interface Phase {
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
  const { phasejEditObj } = useContext(GlobalInfo);

  useEffect(() => {
    if (phasejEditObj) {
      setProjectName(phasejEditObj.projectName);
    }
  }, [phasejEditObj]);

  const projectNames = data.map((e) => {
    return e.projectName;
  });

  const handleClientNameChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setProjectName(event.target.value);
  };

  useEffect(() => {
    axios
      .get<Project[]>(`${process.env.REACT_APP_API_BASE_URL}/get/projects`, {
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
      .post(`${process.env.REACT_APP_API_BASE_URL}/api/add-phase`, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        }
      })
      .then((response) => {
        if (response.data === "OK") {
          navigate("/view-phase");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data);
        } else {
          console.log(error);
        }
      });
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPhase;
