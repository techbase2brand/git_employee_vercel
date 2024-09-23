import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import AppMenu from "./Menu";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface Project {
  ProID: string | number;
  clientName: string;
  projectName: string;
  projectDescription: string;
}

const AddProject: React.FC = (navigation) => {
  const [project, setProject] = useState<Project>({
    ProID: '',
    clientName: "",
    projectName: "",
    projectDescription: "",
  });
  const navigate = useNavigate();
  const location = useLocation();



  useEffect(() => {
    if (location?.state?.projEditObj) {
      setProject(location?.state?.projEditObj);
    }
  }, [location?.state?.projEditObj]);

  const handleProjectChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setProject((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddProject = () => {
    if (
      project?.clientName === "" ||
      project?.projectName === "" ||
      project?.projectDescription === ""
    ) {
      alert("Please fill all credentials");
      return;
    }


    if (location?.state?.projEditObj) {
      const data = {
        clientName: project?.clientName,
        projectName: project?.projectName,
        projectDescription: project?.projectDescription,
      };
      axios
        .put(`${process.env.REACT_APP_API_BASE_URL}/updateProject/${location?.state?.projEditObj.ProID}`, data, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
          }
        })
        .then((response: any) => {
          if (response.data === "Project updated successfully") {
            navigate("/view-project");
          }
        })
        .catch((error: any) => {
          if (error.response && error.response.status === 409) {
            alert(error.response.data);
          } else {
            console.log(error);
          }
        });
    } else {
      const data = {
        clientName: project.clientName,
        projectName: project.projectName,
        projectDescription: project.projectDescription,
      };

      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/add/projects`, data, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`,

          }
        })
        .then((response: any) => {
          if (response.data === "Project with same name already exists") {
            alert("Project with same name already exists");
          }

          if (response.data === "Project added successfully") {
            navigate("/view-project");
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="emp-main-div">
      <div
        style={{ display: "flex", flexDirection: "column", width: 'auto' }}
        className="form-container"
      >
        <p
          className="mrng-tas"
        >
          {location?.state?.projEditObj ? " Edit Project" : "Add Project"}
        </p>
        <label className="add-label">
          Client Name<span style={{ color: "red" }}>*</span>
        </label>
        <input
          className="add-input"
          name="clientName"
          value={project?.clientName}
          onChange={handleProjectChange}
        />
        <label className="add-label">
          Project<span style={{ color: "red" }}>*</span>
        </label>
        <input
          className="add-input"
          name="projectName"
          value={project?.projectName}
          onChange={handleProjectChange}
        >

        </input>
        <label className="add-label">
          Project Description<span style={{ color: "red" }}>*</span>
        </label>
        <input
          className="add-input"
          name="projectDescription"
          value={project?.projectDescription}
          onChange={handleProjectChange}
        />
        <button className="add-button" onClick={handleAddProject}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddProject;
