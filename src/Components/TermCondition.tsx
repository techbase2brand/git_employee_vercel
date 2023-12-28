import React, { useState, useEffect, useContext, useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Menu from "./Menu";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";

interface Task {
  TermID: number;
  term: string;
  currdate: string;
  date: string;
}
const TermCondition: React.FC<unknown> = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const [termTask, setTermTask] = useState<Task>({
    TermID: 0,
    term: "",
    currdate: formattedDate,
    date: "",
  });
  const token = localStorage.getItem("myToken");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location?.state?.TermID) {
      axios
        .get<Task[]>(`${process.env.REACT_APP_API_BASE_URL}/get/addTermCondition`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const res = response.data.filter(
            (e: Task) => e.TermID === location?.state?.TermID
          );

          if (res.length > 0) {
            setTermTask({
              TermID: res[0]?.TermID,
              term: res[0]?.term,
              currdate: res[0]?.currdate,
              date: res[0]?.date,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [location?.state?.TermID]);

  const handleDateChange = (value: string) => {
    setTermTask({
      ...termTask,
      date: value,
    });
  };

  const handleSubmit = () => {
    const isEditMode = !!location?.state?.TermID;
    const apiEndpoint = isEditMode
      ? `${process.env.REACT_APP_API_BASE_URL}/update/addTermCondition/${location?.state?.TermID}`
      : `${process.env.REACT_APP_API_BASE_URL}/create/addTermCondition`;

    axios({
      method: isEditMode ? "put" : "post",
      url: apiEndpoint,
      data: termTask,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.data === "All fields are required.") {
          alert("All compulsory fields are required.");
        } else {
          navigate("/ViewTermCondition");
        }
      })
      .catch((error) => {
        console.log(error?.response?.data);
      });
  };
  const handleTermChange = (value: string) => {
    setTermTask({
      ...termTask,
      term: value,
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
              <h1>Term & Conditions</h1>

                <label className="add-label">
                  Term:<span style={{ color: "red" }}>*</span>
                </label>
                  <textarea
                    style={{
                      border: "none",
                      width: "100%",
                      height: "20vh",
                      boxSizing: "content-box",
                    }}
                    name="task"
                    className="textarea-control"
                    value={termTask.term}
                    onChange={(e) => handleTermChange(e.target.value)}
                    required
                  />
              <div className="SalecampusForm-col-os">
                <label className="add-label">
                  Date:
                </label>
                <div className="SalecampusForm-input-os">
                  <input
                    style={{ width: 'auto' }}
                    type="date"
                    name="selectDate"
                    value={termTask?.date}
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

export default TermCondition;
