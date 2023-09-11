import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Navbar from "./Navbar";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";

interface FormData {
  id?: number; // This makes the id property optional
  portalType: string;
  profileName: string;
  url: string;
  clientName: string;
  handleBy: string;
  status: string;
  statusReason: string;
  communicationMode: string;
  communicationReason: string;
}

function SaleInfoForm(): JSX.Element {
  const initialFormData: FormData = {
    portalType: "upwork",
    profileName: "",
    url: "",
    clientName: "",
    handleBy: "",
    status: "",
    statusReason: "",
    communicationMode: "skype",
    communicationReason: "",
  };
  // update api data
  const location = useLocation();
  const Navigate = useNavigate();
  const record: FormData | undefined = location.state?.record;

  // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [formData, setFormData] = useState<FormData>(record || initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (record) {
      setFormData(record);
    }
  }, [record]);

  // course options array
  const status = [
    {
      id: 0,
      value: "Choose a status",
      label: "Choose a status",
    },
    {
      id: 1,
      value: "Hired",
      label: "Hired",
    },
    {
      id: 2,
      value: "Discussion",
      label: "Discussion",
    },
    {
      id: 3,
      value: "Closed",
      label: "Closed",
    },
    {
      id: 4,
      value: "Pending",
      label: "Pending",
    },
  ];

  // input handlechange
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const submitForm = async () => {
    if (formData.id) {
      // Update API, To update data
      handleUpdate();
    } else {
      // console.log("formData-os", formData);
      axios
        .post(`http://localhost:8000/submit-salesform`, formData)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.profileName) {
      newErrors.profileName = "Profile name is required.";
    }
    if (!formData.clientName) {
      newErrors.clientName = "Client name is required.";
    }
    // else if (!emailRegex.test(formData.email)) {
    //   newErrors.email = "Invalid email format.";
    // }
    // if (!formData.url) {
    //   newErrors.url = "Url is required.";
    // }
    // if (!formData.parentPhone) {
    //   newErrors.parentPhone = "Parent's Phone Number is required.";
    // }
    // if (!formData.statusReason) {
    //   newErrors.statusReason = "status reason is required.";
    // }
    // if (!formData.status) {
    //   newErrors.status = "status is required.";
    // }
    // if (!formData.communicationMode) {
    //   newErrors.communicationMode = "communicationMode is required.";
    // }
    // if (!formData.communicationReason) {
    //   newErrors.communicationReason = "communicationReason is required.";
    // }
    // if (!formData.portalType) {
    //   newErrors.portalType = "portalType is required.";
    // }

    setFormErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      submitForm();
      Navigate("/saleinfoformlist");
    }
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:8000/updatesaleinfo/${formData.id}`, formData)
      .then((response) => {
        console.log(response.data);
        Navigate("/saleinfoformlist"); // Navigate back to the list after update
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
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
            <section className="SalecampusForm-section-os">
              <div className="form-container">
                <div className="SalecampusForm-data-os">
                  <h2>Sale Info Form</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="SalecampusForm-row-os">
                      {/* <h4>Portal type</h4> */}
                      <div className="SalecampusForm-radio-row-os">
                        <div className="SalecampusForm-radio-os">
                          <label>
                            Upwork
                            <input
                              type="radio"
                              name="portalType"
                              value="upwork"
                              checked={formData.portalType === "upwork"}
                              onChange={handleChange}
                            />
                          </label>
                        </div>

                        <div className="SalecampusForm-radio-os">
                          <label>
                            PPH
                            <input
                              type="radio"
                              name="portalType"
                              value="PPH"
                              checked={formData.portalType === "PPH"}
                              onChange={handleChange}
                            />
                          </label>
                        </div>
                        <div className="SalecampusForm-radio-os">
                          <label>
                            Freelancer
                            <input
                              type="radio"
                              name="portalType"
                              value="freelancer"
                              checked={formData.portalType === "freelancer"}
                              onChange={handleChange}
                            />
                          </label>
                        </div>
                        <div className="SalecampusForm-radio-os">
                          <label>
                            Linkedin
                            <input
                              type="radio"
                              name="portalType"
                              value="linkedin"
                              checked={formData.portalType === "linkedin"}
                              onChange={handleChange}
                            />
                          </label>
                        </div>
                        <div className="SalecampusForm-radio-os">
                          <label>
                            Website
                            <input
                              type="radio"
                              name="portalType"
                              value="website"
                              checked={formData.portalType === "website"}
                              onChange={handleChange}
                            />
                          </label>
                        </div>
                        <div className="SalecampusForm-radio-os">
                          <label>
                            Other
                            <input
                              type="radio"
                              name="portalType"
                              value="other"
                              checked={formData.portalType === "other"}
                              onChange={handleChange}
                            />
                          </label>
                        </div>
                      </div>
                      {formErrors.portalType && (
                        <div className="error-message-os">
                          {formErrors.portalType}
                        </div>
                      )}

                      <div className="SalecampusForm-col-os">
                        <div className="SalecampusForm-input-os">
                          <input
                            type="text"
                            name="profileName"
                            placeholder="Profile name"
                            value={formData.profileName}
                            onChange={handleChange}
                          />
                        </div>
                        {formErrors.profileName && (
                          <div className="error-message-os">
                            {formErrors.profileName}
                          </div>
                        )}
                      </div>

                      <div className="SalecampusForm-col-os">
                        <div className="SalecampusForm-input-os">
                          <input
                            type="text"
                            name="url"
                            placeholder="Url"
                            value={formData.url}
                            onChange={handleChange}
                          />
                        </div>
                        {formErrors.url && (
                          <div className="error-message-os">
                            {formErrors.url}
                          </div>
                        )}
                      </div>

                      <div className="SalecampusForm-col-os">
                        <div className="SalecampusForm-input-os">
                          <input
                            type="text"
                            name="clientName"
                            placeholder="Client name"
                            value={formData.clientName}
                            onChange={handleChange}
                          />
                        </div>
                        {formErrors.clientName && (
                          <div className="error-message-os">
                            {formErrors.clientName}
                          </div>
                        )}
                      </div>

                      <div className="SalecampusForm-col-os">
                        <div className="SalecampusForm-input-os">
                          <input
                            type="text"
                            name="handleBy"
                            placeholder="Handle by"
                            value={formData.handleBy}
                            onChange={handleChange}
                          />
                        </div>
                        {formErrors.handleBy && (
                          <div className="error-message-os">
                            {formErrors.handleBy}
                          </div>
                        )}
                      </div>

                      <div className="SalecampusForm-col-os">
                        <div className="SalecampusForm-input-os">
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                          >
                            {status.map((item) => {
                              return (
                                <option key={item.id} value={item.value}>
                                  {item.label}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        {formErrors.status && (
                          <div className="error-message-os">
                            {formErrors.status}
                          </div>
                        )}
                      </div>

                      <div className="SalecampusForm-col-os">
                        <div className="SalecampusForm-input-os">
                          <input
                            type="text"
                            name="statusReason"
                            placeholder="Enter status reason"
                            value={formData.statusReason}
                            onChange={handleChange}
                          />
                        </div>
                        {formErrors.statusReason && (
                          <div className="error-message-os">
                            {formErrors.statusReason}
                          </div>
                        )}
                      </div>

                      <div className="SalecampusForm-radio-row-os">
                        <div className="SalecampusForm-radio-os">
                          <label className="male">
                            Skype
                            <input
                              type="radio"
                              name="communicationMode"
                              value="skype"
                              checked={formData.communicationMode === "skype"}
                              onChange={handleChange}
                            />
                          </label>
                        </div>

                        <div className="SalecampusForm-radio-os">
                          <label className="male">
                            Phone
                            <input
                              type="radio"
                              name="communicationMode"
                              value="phone"
                              checked={formData.communicationMode === "phone"}
                              onChange={handleChange}
                            />
                          </label>
                        </div>
                      </div>
                      {formErrors.communicationMode && (
                        <div className="error-message-os">
                          {formErrors.communicationMode}
                        </div>
                      )}

                      <div className="SalecampusForm-col-os">
                        <div className="SalecampusForm-input-os">
                          <input
                            type="text"
                            name="communicationReason"
                            placeholder="Enter communication reason"
                            value={formData.communicationReason}
                            onChange={handleChange}
                          />
                        </div>
                        {formErrors.communicationReason && (
                          <div className="error-message-os">
                            {formErrors.communicationReason}
                          </div>
                        )}
                      </div>

                      <div className="SalecampusForm-submit-os">
                        <button onClick={handleSubmit} type="submit">
                          {formData.id ? "Update" : "Submit"}
                        </button>
                      </div>
                    </div>
                  </form>

                  {submitted && (
                    <p style={{ color: "green", paddingTop: "0.5rem" }}>
                      Thank you for connecting!
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default SaleInfoForm;
