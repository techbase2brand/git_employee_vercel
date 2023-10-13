import React, { useState, useEffect, ChangeEvent } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Space, Input } from "antd";
import Menu from "./Menu";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

interface Module {
  projectName: string;
  phaseName: string;
  modules: string;
}

interface Phases {
  phaseID: number;
  projectName: string;
  phases: string[];
}

const EditModule: React.FC<any> = () => {
  const [selectedModule, setSelectedModule] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location?.state?.modulejEditObj) {
      setSelectedModule(location?.state?.modulejEditObj?.modules);
    }
  }, [location?.state?.modulejEditObj]);

  const handleModuleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedModule(e.target.value);
  };

  const handleSubmit = () => {
    if (!location?.state?.modulejEditObj?.modID) {
      alert("you can not edit directly from here");
      return;
    }

    if (selectedModule === "") {
      alert("please fill all credentials");
      return;
    }

    const data = {
      projectName: location?.state?.modulejEditObj?.projectName,
      phaseName: location?.state?.modulejEditObj?.phaseName,
      modules: selectedModule,
    };

    axios
      .put(`https://empbackend.base2brand.com/update/module/${location?.state?.modulejEditObj?.modID}`, data,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        }
      })
      .then((response) => {
        if (response.data === "OK") {
          navigate("/view-module");
          alert(" module edited successfully");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data);
        } else {
          console.error(error);
        }
      });
  };


  return (
    <div className="emp-main-div">
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
        <div style={{ height: "8%" }}>
          <Navbar />
        </div>
        <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
          <div className="menu-div">
            <Menu />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }} className="form-container">
            <div className="add-div">
              <p className="add-heading">Edit Module</p>
              <label className="add-label">Project Name<span style={{ color: "red" }}>*</span></label>
              <Input className="add-input" value={location?.state?.modulejEditObj?.projectName} disabled />
              <label className="add-label">Phase<span style={{ color: "red" }}>*</span></label>
              <Input className="add-input" value={location?.state?.modulejEditObj?.phaseName} disabled />
              <label className="add-label">Module<span style={{ color: "red" }}>*</span></label>
              <Input className="add-input" value={selectedModule} onChange={handleModuleChange} />
              <button className="add-button" onClick={handleSubmit}>Submit</button>
            </div>
            <div style={{ marginTop: "50px", height: "80%", width: "100%" }}>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModule;
