import React, { useState, useContext, useEffect  } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Space } from "antd";
import AppMenu  from "./Menu";
import Navbar from "./Navbar";
import EmployeeTable from "./EmployeeTable";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { GlobalInfo } from "../App";
import { useLocation } from "react-router-dom";

interface Project {
  clientName: string;
  projectName: string;
  projectDescription: string;
}

const AddProject: React.FC = (navigation) => {
  const [project, setProject] = useState<Project>({
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

  const id = parseInt(localStorage.getItem("ProID") || "0");

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
      console.log("edit ab hoga");



      axios
      .put(`https://empbackend.base2brand.com/updateProject/${location?.state?.projEditObj.ProID}`, data,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
        }
      })
      .then((response: any) => {
        console.log("edit kb hoga");

        // Check if the response data is "Project updated successfully"
        if (response.data === "Project updated successfully") {
          navigate("/view-project");
        }
      })
      .catch((error: any) => {
        if (error.response && error.response.status === 409) {
          alert(error.response.data);
        } else {
          console.log(error, "8888");
        }
      });


    } else {
      const data = {
        clientName: project.clientName,
        projectName: project.projectName,
        projectDescription: project.projectDescription,
      };

      axios
        .post("https://empbackend.base2brand.com/add/projects", data, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('myToken')}`
          }
        })
        .then((response: any) => {
          console.log(response.data, "999");

          if (response.data === "Project with same name already exists") {
            alert("Project with same name already exists");
          }

          if (response.data === "Project added successfully") {
            navigate("/view-project");

            // navigation.navigate(/view-projects);

            // alert("Project added successfully");
          }
        })
        .catch((error: any) => {
          console.log(error, "8888");
        });
    }
  };

  type DashboardScreenProps = {
    navigation: any;
    // classes: any;
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
            <AppMenu  />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column" }}
            className="form-container"
          >
            <div className="add-div">
              <p className="add-heading">
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
            <div style={{ width: "90%", height: "80%", marginTop: "3%" }}>
              <div>{/* <EmployeeTable  /> */}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProject;
