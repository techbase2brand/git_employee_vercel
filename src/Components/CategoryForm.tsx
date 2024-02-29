import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Menu from "./Menu";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";

interface Task {
  id: number;
  CategoryData: string;
  dated: string;
}
const CategoryForm: React.FC<unknown> = () => {
  const [currentDate] = useState<Date>(new Date());
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const [termTask, setTermTask] = useState<Task>({
    id: 0,
    CategoryData: "",
    dated: formattedDate,
  });
  const token = localStorage.getItem("myToken");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location?.state?.id) {
      axios
        .get<Task[]>(`${process.env.REACT_APP_API_BASE_URL}/get/category`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const res = response.data.filter(
            (e: Task) => e.id === location?.state?.id
          );

          if (res.length > 0) {
            setTermTask({
              id: res[0]?.id,
              CategoryData: res[0]?.CategoryData,
              dated: res[0]?.dated,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [location?.state?.id]);

  const handleSubmit = () => {
    const isEditMode = !!location?.state?.id;
    if (!termTask.CategoryData) {
      alert("All fields are required.");
      return;
    }
    const dataToSend = isEditMode
      ? termTask
      : { CategoryData: termTask.CategoryData, dated: termTask.dated };

    const apiEndpoint = isEditMode
      ? `${process.env.REACT_APP_API_BASE_URL}/update/category/${location?.state?.id}`
      : `${process.env.REACT_APP_API_BASE_URL}/create/Category`;

    axios({
      method: isEditMode ? "put" : "post",
      url: apiEndpoint,
      data: dataToSend,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.data === "All fields are required.") {
          alert("All compulsory fields are required.");
        } else {
          navigate("/CategoryList");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleTermChange = (value: string) => {
    setTermTask({
      ...termTask,
      CategoryData: value,
    });
  };
  const handleDateChange = (value: string) => {
    setTermTask({
      ...termTask,
      dated: value,
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
        
        <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
          
          <div
            style={{ display: "flex", flexDirection: "column", width: '100%' }}
            className="form-container"
          >
            <div className="add-div" style={{ gap: '15px' }}>
              <h1>Add a Category</h1>
              <div>
                <div className="SalecampusForm-col-os">
                  <div className="SalecampusForm-input-os">
                    <input
                      type="text"
                      name="profileName"
                      placeholder="Status"
                      value={termTask.CategoryData}
                      onChange={(e) => handleTermChange(e.target.value)}
                    />
                  </div>
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
                    value={termTask?.dated}
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

export default CategoryForm;
