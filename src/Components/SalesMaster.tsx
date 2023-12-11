import React, { useState, useEffect} from "react";
import "react-datepicker/dist/react-datepicker.css";
import Menu from "./Menu";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";

interface Task {
  saleId: number;
  SalesData: string;
  currdate: string;
  date: string;
}
const SalesMaster: React.FC<unknown> = () => {
  const [currentDate] = useState<Date>(new Date());
  const [getIp, setGetIp] = useState("");
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const [termTask, setTermTask] = useState<Task>({
    saleId: 0,
    SalesData: "",
    currdate: formattedDate,
    date: formattedDate,
  });
  const token = localStorage.getItem("myToken");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location?.state?.saleId) {
      axios
        .get<Task[]>(`http://localhost:5000/get/addSales`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const res = response.data.filter(
            (e: Task) => e.saleId === location?.state?.saleId
          );

          if (res.length > 0) {
            setTermTask({
              saleId: res[0]?.saleId,
              SalesData: res[0]?.SalesData,
              currdate: res[0]?.currdate,
              date: res[0]?.date,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [location?.state?.saleId]);

  useEffect(() => {
    axios.get('https://api.ipify.org?format=json')
      .then((response) => {
        setGetIp(response.data.ip)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []); 
  const handleSubmit = () => {
    const isEditMode = !!location?.state?.saleId;
    if (!termTask.SalesData) {
      alert("All fields are required.");
      return;
    }
    console.log("location?.state", location)
    const apiEndpoint = isEditMode
      ? `http://localhost:5000/update/addSales/${location?.state?.saleId}`
      : "http://localhost:5000/create/addSales";

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
          navigate("/ViewSalesMaster");
        }
      })
      .catch((error) => {
        console.log(error?.response?.data);
      });
  };
  const handleTermChange = (value: string) => {
    setTermTask({
      ...termTask,
      SalesData: value,
    });
  };
  const handleDateChange = (value: string) => {
    setTermTask({
      ...termTask,
      date: value,
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
            <div className="add-div" style={{gap: '15px'}}>
              <h1>Add a Status</h1>
              <div>
                <div className="SalecampusForm-col-os">
                  <div className="SalecampusForm-input-os">
                    <input
                      type="text"
                      name="profileName"
                      placeholder="Status"
                      value={termTask.SalesData}
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

export default SalesMaster;
