import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Navbar from "./Navbar";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";

interface FormData {
  id?: number; // This makes the id property optional
  name: string;
  phone: string;
  email: string;
  parentPhone: string;
  location: string;
  highestQualification: string;
  duration: string;
  totalFee: string;
  portalType: string;
}

function SaleInfoForm(): JSX.Element {
  const initialFormData: FormData = {
    name: "",
    phone: "",
    email: "",
    parentPhone: "",
    location: "",
    highestQualification: "",
    duration: "1 Year",
    totalFee: "",
    portalType: "Upwork",
  };
  // update api data
  const location = useLocation();
  const Navigate = useNavigate();
  const record: FormData | undefined = location.state?.record;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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
    },{
      id: 4,
      value: "Pending",
      label: "Pending",
    }
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
      try {
        const response = await fetch("http://localhost:8000/submit-form", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const responseData = await response.json();

        if (response.status === 200) {
          console.log("Form submitted successfully");
          setFormData(initialFormData);
          setSubmitted(true);
        } else if (response.status === 400) {
          alert(responseData.message);
        } else {
          console.error("Error submitting form. Status:", response.status);
        }
        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
      console.log("Form submitted!", formData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = "Name is required.";
    }
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    // if (!formData.phone) {
    //   newErrors.phone = "Phone Number is required.";
    // }
    // if (!formData.parentPhone) {
    //   newErrors.parentPhone = "Parent's Phone Number is required.";
    // }
    // if (!formData.location) {
    //   newErrors.location = "Location is required.";
    // }
    // if (!formData.highestQualification) {
    //   newErrors.highestQualification = "Highest Qualification is required.";
    // }
    // if (!formData.duration) {
    //   newErrors.duration = "Duration is required.";
    // }
    // if (!formData.totalFee) {
    //   newErrors.totalFee = "Total Fee is required.";
    // }
    // if (!formData.portalType) {
    //   newErrors.portalType = "portalType is required.";
    // }

    setFormErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      submitForm();
      Navigate("/salecampusFormList");
    }
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:8000/update/${formData.id}`, formData)
      .then((response) => {
        console.log(response.data);
        Navigate("/SalecampusFormList"); // Navigate back to the list after update
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
                              value="Upwork"
                              checked={formData.portalType === "Upwork"}
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
                              value="Freelancer"
                              checked={formData.portalType === "Freelancer"}
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
                              value="Linkedin"
                              checked={formData.portalType === "Linkedin"}
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
                              value="Website"
                              checked={formData.portalType === "Website"}
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
                              value="Other"
                              checked={formData.portalType === "Other"}
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
                            name="name"
                            placeholder="Profile name"
                            value={formData.name}
                            onChange={handleChange}
                          />
                        </div>
                        {formErrors.name && (
                          <div className="error-message-os">
                            {formErrors.name}
                          </div>
                        )}
                      </div>

                      <div className="SalecampusForm-col-os">
                        <div className="SalecampusForm-input-os">
                          <input
                            type="text"
                            name="phone"
                            placeholder="Url"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                        {formErrors.phone && (
                          <div className="error-message-os">
                            {formErrors.phone}
                          </div>
                        )}
                      </div>

                      <div className="SalecampusForm-col-os">
                        <div className="SalecampusForm-input-os">
                          <input
                            type="text"
                            name="email"
                            placeholder="Client name"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </div>
                        {formErrors.email && (
                          <div className="error-message-os">
                            {formErrors.email}
                          </div>
                        )}
                      </div>

                      <div className="SalecampusForm-col-os">
                        <div className="SalecampusForm-input-os">
                          <input
                            type="text"
                            name="parentPhone"
                            placeholder="Handle by"
                            value={formData.parentPhone}
                            onChange={handleChange}
                          />
                        </div>
                        {formErrors.parentPhone && (
                          <div className="error-message-os">
                            {formErrors.parentPhone}
                          </div>
                        )}
                      </div>

                      <div className="SalecampusForm-col-os">
                        <div className="SalecampusForm-input-os">
                          <select
                            name="highestQualification"
                            value={formData.highestQualification}
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
                        {formErrors.highestQualification && (
                          <div className="error-message-os">
                            {formErrors.highestQualification}
                          </div>
                        )}
                      </div>

                      <div className="SalecampusForm-col-os">
                        <div className="SalecampusForm-input-os">
                          <input
                            type="text"
                            name="location"
                            placeholder="Enter status reason"
                            value={formData.location}
                            onChange={handleChange}
                          />
                        </div>
                        {formErrors.location && (
                          <div className="error-message-os">
                            {formErrors.location}
                          </div>
                        )}
                      </div>

                      <div className="SalecampusForm-radio-row-os">
                        <div className="SalecampusForm-radio-os">
                          <label className="male">
                            Skype
                            <input
                              type="radio"
                              name="duration"
                              value="45 Days"
                              checked={formData.duration === "45 Days"}
                              onChange={handleChange}
                            />
                          </label>
                        </div>

                        <div className="SalecampusForm-radio-os">
                          <label className="male">
                            Phone
                            <input
                              type="radio"
                              name="duration"
                              value="3 Months"
                              checked={formData.duration === "3 Months"}
                              onChange={handleChange}
                            />
                          </label>
                        </div>
                      </div>
                      {formErrors.duration && (
                        <div className="error-message-os">
                          {formErrors.duration}
                        </div>
                      )}

                      <div className="SalecampusForm-col-os">
                        <div className="SalecampusForm-input-os">
                          <input
                            type="text"
                            name="totalFee"
                            placeholder="Enter communication reason"
                            value={formData.totalFee}
                            onChange={handleChange}
                          />
                        </div>
                        {formErrors.totalFee && (
                          <div className="error-message-os">
                            {formErrors.totalFee}
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
