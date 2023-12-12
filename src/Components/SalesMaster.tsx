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
  dated: string;
}
const SalesMaster: React.FC<unknown> = () => {
  const [currentDate] = useState<Date>(new Date());
  const [getIp, setGetIp] = useState("");
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const [termTask, setTermTask] = useState<Task>({
    saleId: 0,
    SalesData: "",
    currdate: formattedDate,
    dated: formattedDate,
  });
  const token = localStorage.getItem("myToken");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location?.state?.saleId) {
      axios
        .get<Task[]>(`https://empbackend.base2brand.com/get/addSales`, {
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
              dated: res[0]?.dated,
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
    const dataToSend = isEditMode
    ? termTask
    : { SalesData: termTask.SalesData, dated: termTask.dated,currdate: termTask.currdate };
    
    const apiEndpoint = isEditMode
      ? `https://empbackend.base2brand.com/update/addSales/${location?.state?.saleId}`
      : "https://empbackend.base2brand.com/create/addSales";

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

export default SalesMaster;
