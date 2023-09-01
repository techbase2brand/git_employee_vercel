import React, { useState } from "react";
import Menu from "./Menu";
import Navbar from "./Navbar";
// import Swal from 'sweetalert2';

interface FormData {
  name: string;
  phone: string;
  email: string;
  parentPhone: string;
  location: string;
  highestQualification: string;
  duration: string;
  totalFee: string;
  gender: string;
}

function SalecampusForm(): JSX.Element {
  const initialFormData: FormData = {
    name: "",
    phone: "",
    email: "",
    parentPhone: "",
    location: "",
    highestQualification: "",
    duration: "1 Year",
    totalFee: "",
    gender: "male",
  };
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

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

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const isValid = false;
  //   const newErrors: Record<string, string> = {};
  //   if (!formData.name) {
  //     newErrors.name = "Name is required.";
  //   }
  //   if (!formData.email) {
  //     newErrors.email = "Email is required.";
  //   } else if (!emailRegex.test(formData.email)) {
  //     newErrors.email = "Invalid email format.";
  //   }
  //   if (!formData.phone) {
  //     newErrors.phone = "Phone Number is required.";
  //   }
  //   if (!formData.parentPhone) {
  //     newErrors.parentPhone = "Parent's Phone Number is required.";
  //   }
  //   if (!formData.location) {
  //     newErrors.location = "Location is required.";
  //   }
  //   if (!formData.highestQualification) {
  //     newErrors.highestQualification = "Highest Qualification is required.";
  //   }
  //   if (!formData.duration) {
  //     newErrors.duration = "Duration is required.";
  //   }
  //   if (!formData.totalFee) {
  //     newErrors.totalFee = "Total Fee is required.";
  //   }
  //   if (!formData.gender) {
  //     newErrors.gender = "Gender is required.";
  //   }
  //   setFormErrors(newErrors);
  //   console.log("formData.gender", formData.gender);

  //   // if (Object.keys(newErrors).length === 0) {
  //   //   try {
  //   //     const response = await fetch("http://localhost:8000/submit-form", {
  //   //       method: "POST",
  //   //       headers: {
  //   //         "Content-Type": "application/json",
  //   //       },
  //   //       body: JSON.stringify(formData),
  //   //     });

  //   //     const responseData = await response.json(); // Parse the JSON response data

  //   //     if (response.status === 200) {
  //   //       console.log("Form submitted successfully");
  //   //       setFormData(initialFormData);
  //   //       setSubmitted(true);
  //   //       // Swal.fire({
  //   //       //   icon: 'success',
  //   //       //   title: 'Thank you for connecting!',
  //   //       //   text: 'Your message has been submitted successfully.',
  //   //       //   confirmButtonText: 'OK',
  //   //       // });
  //   //     } else if (response.status === 400) {
  //   //       alert(responseData.message); // Show the user exist message from the server
  //   //     } else {
  //   //       console.error("Error submitting form. Status:", response.status);
  //   //     }
  //   //   } catch (error) {
  //   //     console.error("Error submitting form:", error);
  //   //   }
  //   // }
  //   console.log("formDataaaaaaaaaaaaaaaaaaaa", formData);
  // };

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
    if (!formData.phone) {
      newErrors.phone = "Phone Number is required.";
    }
    if (!formData.parentPhone) {
      newErrors.parentPhone = "Parent's Phone Number is required.";
    }
    if (!formData.location) {
      newErrors.location = "Location is required.";
    }
    if (!formData.highestQualification) {
      newErrors.highestQualification = "Highest Qualification is required.";
    }
    if (!formData.duration) {
      newErrors.duration = "Duration is required.";
    }
    if (!formData.totalFee) {
      newErrors.totalFee = "Total Fee is required.";
    }
    if (!formData.gender) {
      newErrors.gender = "Gender is required.";
    }

    setFormErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      submitForm();
    }
  };

  const submitForm = async () => {
    // if (Object.keys(newErrors).length === 0) {
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
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    // }
    console.log("Form submitted!", formData);
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
                  <h2>Sale Campus Form</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="SalecampusForm-row-os">
                      <div className="SalecampusForm-radio-row-os">
                        <div className="SalecampusForm-radio-os">
                          <label className="male">Male</label>
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.gender === "male"}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="SalecampusForm-radio-os">
                          <label className="male">Female</label>
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={formData.gender === "female"}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {formErrors.gender && (
                        <div className="error-message-os">
                          {formErrors.gender}
                        </div>
                      )}

                      <div className="SalecampusForm-col-os">
                        <div className="SalecampusForm-input-os">
                          <input
                            type="text"
                            name="name"
                            placeholder="Name"
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
                            type="email"
                            name="email"
                            placeholder="Email"
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
                            type="tel"
                            name="phone"
                            placeholder="Student Phone Number"
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
                            type="tel"
                            name="parentPhone"
                            placeholder="Parents Phone Number"
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
                          <input
                            type="text"
                            name="location"
                            placeholder="Enter Current Location"
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

                      <div className="SalecampusForm-col-os">
                        <div className="SalecampusForm-input-os">
                          <select
                            name="highestQualification"
                            value={formData.highestQualification}
                            onChange={handleChange}
                          >
                            <option value="">Select Course</option>
                            <option value="Web Designing Course">
                              Web Designing Course
                            </option>
                            <option value="Graphic Designing Course">
                              Graphic Designing Course
                            </option>
                            <option value="Digital Marketing Cource">
                              Digital Marketing Cource
                            </option>
                            <option value="Web Development">
                              Web Development
                            </option>
                            <option value="Python">Python</option>
                            <option value="Laravel">Laravel</option>
                          </select>
                        </div>
                        {formErrors.highestQualification && (
                          <div className="error-message-os">
                            {formErrors.highestQualification}
                          </div>
                        )}
                      </div>

                      {/* <div className="SalecampusForm-col-os">
                        <div className="SalecampusForm-input-os">
                          <select
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                          >
                            <option value="">Select Duration</option>
                            <option value="2 Months">2 Months</option>
                            <option value="3 Months">3 Months</option>
                            <option value="6 Months">6 Months</option>
                          </select>
                        </div>
                        {formErrors.duration && (
                          <div className="error-message-os">
                            {formErrors.duration}
                          </div>
                        )}
                      </div> */}

                      <div className="SalecampusForm-radio-row-os">
                        <div className="SalecampusForm-radio-os">
                          <label className="male">45 Days</label>
                          <input
                            type="radio"
                            name="duration"
                            value="45 Days"
                            checked={formData.duration === "45 Days"}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="SalecampusForm-radio-os">
                          <label className="male">3 Months</label>
                          <input
                            type="radio"
                            name="duration"
                            value="3 Months"
                            checked={formData.duration === "3 Months"}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="SalecampusForm-radio-os">
                          <label className="male">6 Months</label>
                          <input
                            type="radio"
                            name="duration"
                            value="6 Months"
                            checked={formData.duration === "6 Months"}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="SalecampusForm-radio-os">
                          <label className="male">1 Year</label>
                          <input
                            type="radio"
                            name="duration"
                            value="1 Year"
                            checked={formData.duration === "1 Year"}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {formErrors.duration && (
                        <div className="error-message-os">
                          {formErrors.duration}
                        </div>
                      )}

                      <div className="SalecampusForm-col-os">
                        <div className="SalecampusForm-input-os">
                          <select
                            name="totalFee"
                            value={formData.totalFee}
                            onChange={handleChange}
                          >
                            <option value="">Select Total Fee</option>
                            <option>Total Fee :30000/-</option>
                            <option value="1. 15000/-">1. 15000/-</option>
                            <option value="2. 10000/-">2. 10000/-</option>
                            <option value="3. 5000/-">3. 5000/-</option>
                          </select>
                        </div>
                        {formErrors.totalFee && (
                          <div className="error-message-os">
                            {formErrors.totalFee}
                          </div>
                        )}
                      </div>

                      <div className="SalecampusForm-submit-os">
                        <button type="submit">Submit</button>
                      </div>
                    </div>
                  </form>

                  {submitted && <p>Thank you for connecting!</p>}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default SalecampusForm;
