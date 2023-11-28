import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Navbar from "./Navbar";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import { PlusCircleOutlined } from '@ant-design/icons';
interface FormData {
  id?: number;
  portalType: string;
  profileName: string;
  url: string;
  clientName: string;
  handleBy: string;
  status: string;
  statusReason: string[];
  communicationMode: string;
  communicationReason: string;
  othermode: string;
  commModeSkype: string;
  commModePhone: string;
  commModeWhatsapp: string;
  commModeEmail: string;
  commModePortal: string;
  dateData: string;
  EmployeeID: string;
  RegisterBy: string;
  commModeOther: string;
}

interface communicationModeInterface {
  skype: boolean;
  phone: boolean;
  whatsapp: boolean;
  email: boolean;
  portal: boolean;
  other: boolean;
}

function SaleInfoForm(): JSX.Element {
  const myDataString = localStorage.getItem('myData');
  const [statusReasons, setStatusReasons] = useState(['']);
  const [state, setState] = useState<boolean>(false);
  let employeeID = "";
  let employeeName = "";
  if (myDataString) {
    const myData = JSON.parse(myDataString);
    employeeID = myData.EmployeeID;
    employeeName = `${myData.firstName} ${myData.lastName}`;
  }
  const today = new Date().toISOString().split("T")[0];
  const initialFormData: FormData = {
    portalType: "upwork",
    profileName: "",
    url: "",
    clientName: "",
    handleBy: "",
    status: "Discussion",
    statusReason: [],
    communicationMode: "skype",
    communicationReason: "",
    othermode: "",
    commModeSkype: "",
    commModePhone: "",
    commModeWhatsapp: "",
    commModeEmail: "",
    commModePortal: "",
    dateData: today,
    EmployeeID: employeeID,
    RegisterBy: employeeName,
    commModeOther: "",
  };
  //
  const initialCommunicationModeInterface: communicationModeInterface = {
    skype: false,
    phone: false,
    whatsapp: false,
    email: false,
    portal: false,
    other: false,
  };

  // update api data
  const location = useLocation();
  const Navigate = useNavigate();
  const record: FormData | undefined = location.state?.record;

  // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [formData, setFormData] = useState<FormData>(record || initialFormData);
  console.log("formData",formData)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [communicationMode, setCommunicationMode] =
    useState<communicationModeInterface>(initialCommunicationModeInterface);
  useEffect(() => {
    if (record) {
      console.log("Record from location state:", record);
      setFormData(record);
      if (typeof record.statusReason === 'string' && (record.statusReason as string).trim().length > 0) {
        const reasonsArray = (record.statusReason as string).split(',');
        setStatusReasons(reasonsArray);
      }
    }
  }, [record]);

  const handleAddReason = () => {
    setStatusReasons([...statusReasons, '']);
    setState(true)
  };

  const handleChangeReason = (value: string, index: number) => {
    const newStatusReasons = [...statusReasons];
    newStatusReasons[index] = value;
    setStatusReasons(newStatusReasons);
    setFormData((prevData) => ({
      ...prevData,
      statusReason: newStatusReasons,
    }));
  };
  // course options array
  const status = [
    {
      id: 0,
      value: "Hired",
      label: "Hired",
    },
    {
      id: 1,
      value: "Discussion",
      label: "Discussion",
    },
    {
      id: 2,
      value: "Closed",
      label: "Closed",
    },
    {
      id: 3,
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

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      console.log("submitForm-else-os");
      axios
        .post(`https://empbackend.base2brand.com/submit-salesform`, formData)
        .then((response) => {
          console.log("response.data", response);
          setSubmitted(true);
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
      Navigate("/saleinfoformlist"); // Navigate back to the list after update
    }
  };

  const handleUpdate = () => {
    const statusReasonString = statusReasons.join(',');
    const updatedFormData = {
      ...formData,
      statusReason: statusReasonString,
    };
    axios
      .put(`https://empbackend.base2brand.com/updatesale/${updatedFormData.id}`, updatedFormData)
      .then((response) => {
        Navigate("/saleinfoformlist"); // Navigate back to the list after update
        console.log("handleUpdate-working-os");
        setSubmitted(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCommunicationMode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCommunicationMode((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
    console.log(communicationMode);
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
                      <h4 style={{ paddingBottom: "1rem" }}>Portal type</h4>
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
                      {formData.portalType === "other" && (
                        <div className="SalecampusForm-col-os">
                          <div className="SalecampusForm-input-os">
                            <input
                              type="text"
                              name="othermode"
                              placeholder="Portal Name"
                              value={formData.othermode}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      )}

                      <div className="SalecampusForm-col-os">
                        <div className="SalecampusForm-input-os">
                          {!formData.profileName && <label className="star-red">*</label>}
                          <input
                            type="text"
                            name="profileName"
                            placeholder="Profile id name"
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
                            placeholder="Lead url"
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
                          {!formData.clientName && <label className="star-red" style={{
                            marginLeft: '88px'
                          }}>*</label>}
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
                            <option value="">Choose a status</option>

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
                      {statusReasons.map((reason, index) => (
                        <div key={index} className="SalecampusForm-col-os">
                          <div className="SalecampusForm-input-os">
                            <input
                              type="text"
                              placeholder={`Status Reason ${index + 1}`}
                              value={reason}
                              onChange={(e) => handleChangeReason(e.target.value, index)}
                              // readOnly={formData.statusReason.includes(reason[index])}
                            />
                          </div>
                          {formData.id && index === statusReasons.length - 1 && (
                            <div style={{
                              float: 'right'
                            }}
                              onClick={handleAddReason}
                            >
                              <PlusCircleOutlined />
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="SalecampusForm-col-os">
                        <div className="SalecampusForm-input-os">
                          <input
                            type="date"
                            name="dateData"
                            value={formData?.dateData}
                            onChange={handleChange}
                          />
                        </div>
                        {formErrors.dateData && (
                          <div className="error-message-os">
                            {formErrors.dateData}
                          </div>
                        )}
                      </div>

                      <div
                        className="SalesInfoForm-radio-row-os"
                        style={{ paddingBottom: "2rem" }}
                      >
                        <h4 style={{ paddingBottom: "1rem" }}>
                          Communication Mode
                        </h4>
                        <div className="SalesInfoForm-radio-os">
                          <label>
                            <input
                              type="checkbox"
                              name="skype"
                              // value="skype"
                              checked={communicationMode.skype}
                              onChange={handleCommunicationMode}
                            />
                            Skype
                          </label>
                          <div className="SalesInfoForm-input-os">
                            <input
                              type="text"
                              name="commModeSkype"
                              placeholder="Skype id"
                              disabled={!communicationMode.skype}
                              value={formData.commModeSkype}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="SalesInfoForm-radio-os">
                          <label>
                            <input
                              type="checkbox"
                              name="phone"
                              // value="phone"
                              checked={communicationMode.phone}
                              onChange={handleCommunicationMode}
                            />
                            Phone
                          </label>
                          <div className="SalesInfoForm-input-os">
                            <input
                              type="text"
                              name="commModePhone"
                              placeholder="Phone no."
                              disabled={!communicationMode.phone}
                              value={formData.commModePhone}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="SalesInfoForm-radio-os">
                          <label>
                            <input
                              type="checkbox"
                              name="whatsapp"
                              // value="whatsapp"
                              checked={communicationMode.whatsapp}
                              onChange={handleCommunicationMode}
                            />
                            Whats app
                          </label>
                          <div className="SalesInfoForm-input-os">
                            <input
                              type="text"
                              name="commModeWhatsapp"
                              placeholder="Whats app no."
                              disabled={!communicationMode.whatsapp}
                              value={formData.commModeWhatsapp}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="SalesInfoForm-radio-os">
                          <label>
                            <input
                              type="checkbox"
                              name="email"
                              // value="email"
                              checked={communicationMode.email}
                              onChange={handleCommunicationMode}
                            />
                            Email
                          </label>
                          <div className="SalesInfoForm-input-os">
                            <input
                              type="text"
                              name="commModeEmail"
                              placeholder="Email"
                              disabled={!communicationMode.email}
                              value={formData.commModeEmail}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="SalesInfoForm-radio-os">
                          <label>
                            <input
                              type="checkbox"
                              name="portal"
                              // value="portal"
                              checked={communicationMode.portal}
                              onChange={handleCommunicationMode}
                            />
                            Portal
                          </label>
                          <div className="SalesInfoForm-input-os">
                            <input
                              type="text"
                              name="commModePortal"
                              placeholder="Portal"
                              disabled={!communicationMode.portal}
                              value={formData.commModePortal}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="SalesInfoForm-radio-os">
                          <label>
                            <input
                              type="checkbox"
                              name="other"
                              // value="other"
                              checked={communicationMode.other}
                              onChange={handleCommunicationMode}
                            />
                            Other
                          </label>
                          <div className="SalesInfoForm-input-os">
                            <input
                              type="text"
                              name="commModeOther"
                              placeholder="Other"
                              disabled={!communicationMode.other}
                              value={formData.commModeOther}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      {formErrors.communicationMode && (
                        <div className="error-message-os">
                          {formErrors.communicationMode}
                        </div>
                      )}
                      <div className="SalecampusForm-col-os">
                        <div className="SalecampusForm-input-os">
                          <textarea
                            name="communicationReason"
                            placeholder="Additional Notes"
                            value={formData.communicationReason}
                            onChange={handleTextareaChange}
                            className="additional-notes"
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
