// import React, { useState, useEffect } from "react";
// import Menu from "./Menu";
// import Navbar from "./Navbar";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router";

// interface FormData {
//   id?: number; // This makes the id property optional
//   name: string;
//   phone: string;
//   email: string;
//   parentPhone: string;
//   location: string;
//   highestQualification: string;
//   duration: string;
//   totalFee: string;
//   gender: string;
// }

// function SalecampusForm(): JSX.Element {
//   const initialFormData: FormData = {
//     name: "",
//     phone: "",
//     email: "",
//     parentPhone: "",
//     location: "",
//     highestQualification: "",
//     duration: "1 Year",
//     totalFee: "",
//     gender: "Male",
//   };
//   // update api data
//   const location = useLocation();
//   const Navigate = useNavigate();
//   const record: FormData | undefined = location.state?.record;

//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   const [formData, setFormData] = useState<FormData>(record || initialFormData);
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});
//   const [submitted, setSubmitted] = useState(false);

//   useEffect(() => {
//     if (record) {
//       setFormData(record);
//     }
//   }, [record]);

//   // course options array
//   const highestQualification = [
//     {
//       id: 0,
//       value: "Choose a Course",
//       label: "Choose a Course",
//     },
//     {
//       id: 1,
//       value: "Graphic Designing",
//       label: "Graphic Designing",
//     },
//     {
//       id: 2,
//       value: "Web Designing",
//       label: "Web Designing",
//     },
//     {
//       id: 3,
//       value: "Web Development",
//       label: "Web Development",
//     },
//     {
//       id: 4,
//       value: "Digital Marketing",
//       label: "Digital Marketing",
//     },
//     {
//       id: 5,
//       value: "Python",
//       label: "Python",
//     },
//     {
//       id: 6,
//       value: "Php",
//       label: "Php",
//     },
//     {
//       id: 7,
//       value: "React.JS",
//       label: "React.JS",
//     },
//     {
//       id: 8,
//       value: "Node.JS",
//       label: "Node.JS",
//     },
//     {
//       id: 9,
//       value: "Data Science",
//       label: "Data Science",
//     },
//     {
//       id: 10,
//       value: "WordPress",
//       label: "WordPress",
//     },
//     {
//       id: 11,
//       value: "Shopify Theme Development",
//       label: "Shopify Theme Development",
//     },
//     {
//       id: 12,
//       value: "Shopify App Development",
//       label: "Shopify App Development",
//     },
//     {
//       id: 13,
//       value: "Laravel",
//       label: "Laravel",
//     },
//     {
//       id: 14,
//       value: "MERN Stack",
//       label: "MERN Stack",
//     },
//     {
//       id: 15,
//       value: "Fright Broker",
//       label: "Fright Broker",
//     },
//     {
//       id: 16,
//       value: "C & C++",
//       label: "C & C++",
//     },
//     {
//       id: 17,
//       value: "Data Structure and Algorithms",
//       label: "Data Structure and Algorithms",
//     },
//     {
//       id: 18,
//       value: "Discrete Mathematics",
//       label: "Discrete Mathematics",
//     },
//     {
//       id: 19,
//       value: "Mathematics-III",
//       label: "Mathematics-III",
//     },
//   ];

//   // input handlechange
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//     setFormErrors((prevErrors) => ({
//       ...prevErrors,
//       [name]: "",
//     }));
//   };

//   const submitForm = async () => {
//     if (formData.id) {
//       // Update API, To update data
//       handleUpdate();
//     } else {
//       try {
//         const response = await fetch("https://empbackend.base2brand.com/submit-form", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         });

//         const responseData = await response.json();

//         if (response.status === 200) {
//           console.log("Form submitted successfully");
//           setFormData(initialFormData);
//           setSubmitted(true);
//         } else if (response.status === 400) {
//           alert(responseData.message);
//         } else {
//           console.error("Error submitting form. Status:", response.status);
//         }
//         setTimeout(() => {
//           setSubmitted(false);
//         }, 3000);
//       } catch (error) {
//         console.error("Error submitting form:", error);
//       }
//       console.log("Form submitted!", formData);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const newErrors: Record<string, string> = {};

//     if (!formData.name) {
//       newErrors.name = "Name is required.";
//     }
//     if (!formData.email) {
//       newErrors.email = "Email is required.";
//     } else if (!emailRegex.test(formData.email)) {
//       newErrors.email = "Invalid email format.";
//     }
//     // if (!formData.phone) {
//     //   newErrors.phone = "Phone Number is required.";
//     // }
//     // if (!formData.parentPhone) {
//     //   newErrors.parentPhone = "Parent's Phone Number is required.";
//     // }
//     // if (!formData.location) {
//     //   newErrors.location = "Location is required.";
//     // }
//     // if (!formData.highestQualification) {
//     //   newErrors.highestQualification = "Highest Qualification is required.";
//     // }
//     // if (!formData.duration) {
//     //   newErrors.duration = "Duration is required.";
//     // }
//     // if (!formData.totalFee) {
//     //   newErrors.totalFee = "Total Fee is required.";
//     // }
//     // if (!formData.gender) {
//     //   newErrors.gender = "Gender is required.";
//     // }

//     setFormErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       submitForm();
//       Navigate("/salecampusformlist");
//     }
//   };

//   const handleUpdate = () => {
//     axios
//       .put(`https://empbackend.base2brand.com/updatecampus/${formData.id}`, formData)
//       .then((response) => {
//         console.log(response.data);
//         Navigate("/salecampusformlist"); // Navigate back to the list after update
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   return (
//     <>
//       <div className="emp-main-div">
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             width: "100%",
//             height: "100%",
//           }}
//         >
//           <div style={{ height: "8%" }}>
//             <Navbar />
//           </div>
//           <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
//             <div className="menu-div">
//               <Menu />
//             </div>
//             <section className="SalecampusForm-section-os">
//               <div className="form-container">
//                 <div className="SalecampusForm-data-os">
//                   <h2>Sale Campus Form</h2>
//                   <form onSubmit={handleSubmit}>
//                     <div className="SalecampusForm-row-os">
//                       <div className="SalecampusForm-radio-row-os">
//                         <div className="SalecampusForm-radio-os">
//                           <label className="male">
//                             Male
//                             <input
//                               type="radio"
//                               name="gender"
//                               value="Male"
//                               checked={formData.gender === "Male"}
//                               onChange={handleChange}
//                             />
//                           </label>
//                         </div>

//                         <div className="SalecampusForm-radio-os">
//                           <label className="male">
//                             Female
//                             <input
//                               type="radio"
//                               name="gender"
//                               value="Female"
//                               checked={formData.gender === "Female"}
//                               onChange={handleChange}
//                             />
//                           </label>
//                         </div>
//                       </div>
//                       {formErrors.gender && (
//                         <div className="error-message-os">
//                           {formErrors.gender}
//                         </div>
//                       )}

//                       <div className="SalecampusForm-col-os">
//                         <div className="SalecampusForm-input-os">
//                           <input
//                             type="text"
//                             name="name"
//                             placeholder="Name"
//                             value={formData.name}
//                             onChange={handleChange}
//                           />
//                         </div>
//                         {formErrors.name && (
//                           <div className="error-message-os">
//                             {formErrors.name}
//                           </div>
//                         )}
//                       </div>

//                       <div className="SalecampusForm-col-os">
//                         <div className="SalecampusForm-input-os">
//                           <input
//                             type="tel"
//                             name="phone"
//                             placeholder="Student Phone Number"
//                             value={formData.phone}
//                             onChange={handleChange}
//                           />
//                         </div>
//                         {formErrors.phone && (
//                           <div className="error-message-os">
//                             {formErrors.phone}
//                           </div>
//                         )}
//                       </div>

//                       <div className="SalecampusForm-col-os">
//                         <div className="SalecampusForm-input-os">
//                           <input
//                             type="email"
//                             name="email"
//                             placeholder="Email"
//                             value={formData.email}
//                             onChange={handleChange}
//                           />
//                         </div>
//                         {formErrors.email && (
//                           <div className="error-message-os">
//                             {formErrors.email}
//                           </div>
//                         )}
//                       </div>

//                       <div className="SalecampusForm-col-os">
//                         <div className="SalecampusForm-input-os">
//                           <input
//                             type="tel"
//                             name="parentPhone"
//                             placeholder="Parents Phone Number"
//                             value={formData.parentPhone}
//                             onChange={handleChange}
//                           />
//                         </div>
//                         {formErrors.parentPhone && (
//                           <div className="error-message-os">
//                             {formErrors.parentPhone}
//                           </div>
//                         )}
//                       </div>

//                       <div className="SalecampusForm-col-os">
//                         <div className="SalecampusForm-input-os">
//                           <input
//                             type="text"
//                             name="location"
//                             placeholder="Enter Current Location"
//                             value={formData.location}
//                             onChange={handleChange}
//                           />
//                         </div>
//                         {formErrors.location && (
//                           <div className="error-message-os">
//                             {formErrors.location}
//                           </div>
//                         )}
//                       </div>

//                       <div className="SalecampusForm-col-os">
//                         <div className="SalecampusForm-input-os">
//                           <select
//                             name="highestQualification"
//                             value={formData.highestQualification}
//                             onChange={handleChange}
//                           >
//                             {highestQualification.map((item) => {
//                               return (
//                                 <option key={item.id} value={item.value}>
//                                   {item.label}
//                                 </option>
//                               );
//                             })}
//                           </select>
//                         </div>
//                         {formErrors.highestQualification && (
//                           <div className="error-message-os">
//                             {formErrors.highestQualification}
//                           </div>
//                         )}
//                       </div>

//                       {/* <div className="SalecampusForm-col-os">
//                         <div className="SalecampusForm-input-os">
//                           <select
//                             name="duration"
//                             value={formData.duration}
//                             onChange={handleChange}
//                           >
//                             <option value="">Select Duration</option>
//                             <option value="2 Months">2 Months</option>
//                             <option value="3 Months">3 Months</option>
//                             <option value="6 Months">6 Months</option>
//                           </select>
//                         </div>
//                         {formErrors.duration && (
//                           <div className="error-message-os">
//                             {formErrors.duration}
//                           </div>
//                         )}
//                       </div> */}

//                       <div className="SalecampusForm-radio-row-os">
//                         <div className="SalecampusForm-radio-os">
//                           <label className="male">
//                             45 Days
//                             <input
//                               type="radio"
//                               name="duration"
//                               value="45 Days"
//                               checked={formData.duration === "45 Days"}
//                               onChange={handleChange}
//                             />
//                           </label>
//                         </div>

//                         <div className="SalecampusForm-radio-os">
//                           <label className="male">
//                             3 Months
//                             <input
//                               type="radio"
//                               name="duration"
//                               value="3 Months"
//                               checked={formData.duration === "3 Months"}
//                               onChange={handleChange}
//                             />
//                           </label>
//                         </div>
//                         <div className="SalecampusForm-radio-os">
//                           <label className="male">
//                             6 Months
//                             <input
//                               type="radio"
//                               name="duration"
//                               value="6 Months"
//                               checked={formData.duration === "6 Months"}
//                               onChange={handleChange}
//                             />
//                           </label>
//                         </div>
//                         <div className="SalecampusForm-radio-os">
//                           <label className="male">
//                             1 Year
//                             <input
//                               type="radio"
//                               name="duration"
//                               value="1 Year"
//                               checked={formData.duration === "1 Year"}
//                               onChange={handleChange}
//                             />
//                           </label>
//                         </div>
//                       </div>
//                       {formErrors.duration && (
//                         <div className="error-message-os">
//                           {formErrors.duration}
//                         </div>
//                       )}

//                       <div className="SalecampusForm-col-os">
//                         <div className="SalecampusForm-input-os">
//                           {/* <select
//                             name="totalFee"
//                             value={formData.totalFee}
//                             onChange={handleChange}
//                           >
//                             <option value="">Select Total Fee</option>
//                             <option>Total Fee :30000/-</option>
//                             <option value="1. 15000/-">1. 15000/-</option>
//                             <option value="2. 10000/-">2. 10000/-</option>
//                             <option value="3. 5000/-">3. 5000/-</option>
//                           </select> */}
//                           <input
//                             type="text"
//                             name="totalFee"
//                             placeholder="Enter Total Fee"
//                             value={formData.totalFee}
//                             onChange={handleChange}
//                           />
//                         </div>
//                         {formErrors.totalFee && (
//                           <div className="error-message-os">
//                             {formErrors.totalFee}
//                           </div>
//                         )}
//                       </div>

//                       <div className="SalecampusForm-submit-os">
//                         <button onClick={handleSubmit} type="submit">
//                           {formData.id ? "Update" : "Submit"}
//                         </button>
//                       </div>
//                     </div>
//                   </form>

//                   {submitted && (
//                     <p style={{ color: "green", paddingTop: "0.5rem" }}>
//                       Thank you for connecting!
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </section>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default SalecampusForm;



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
  gender: string;
  status: string
}

function SalecampusForm(): JSX.Element {
  const initialFormData: FormData = {
    name: "",
    phone: "",
    email: "",
    parentPhone: "",
    location: "",
    highestQualification: "",
    duration: "",
    totalFee: "",
    gender: "Male",
    status: ""
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
  const highestQualification = [
    {
      id: 0,
      value: "Choose a Course",
      label: "Choose a Course",
    },
    {
      id: 1,
      value: "Graphic Designing",
      label: "Graphic Designing",
    },
    {
      id: 2,
      value: "Web Designing",
      label: "Web Designing",
    },
    {
      id: 3,
      value: "Web Development",
      label: "Web Development",
    },
    {
      id: 4,
      value: "Digital Marketing",
      label: "Digital Marketing",
    },
    {
      id: 5,
      value: "Python",
      label: "Python",
    },
    {
      id: 6,
      value: "Php",
      label: "Php",
    },
    {
      id: 7,
      value: "React.JS",
      label: "React.JS",
    },
    {
      id: 8,
      value: "Node.JS",
      label: "Node.JS",
    },
    {
      id: 9,
      value: "Data Science",
      label: "Data Science",
    },
    {
      id: 10,
      value: "WordPress",
      label: "WordPress",
    },
    {
      id: 11,
      value: "Shopify Theme Development",
      label: "Shopify Theme Development",
    },
    {
      id: 12,
      value: "Shopify App Development",
      label: "Shopify App Development",
    },
    {
      id: 13,
      value: "Laravel",
      label: "Laravel",
    },
    {
      id: 14,
      value: "MERN Stack",
      label: "MERN Stack",
    },
    {
      id: 15,
      value: "Fright Broker",
      label: "Fright Broker",
    },
    {
      id: 16,
      value: "C & C++",
      label: "C & C++",
    },
    {
      id: 17,
      value: "Data Structure and Algorithms",
      label: "Data Structure and Algorithms",
    },
    {
      id: 18,
      value: "Discrete Mathematics",
      label: "Discrete Mathematics",
    },
    {
      id: 19,
      value: "Mathematics-III",
      label: "Mathematics-III",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedFormData = { ...formData };

    const newErrors: Record<string, string> = {};

    if (!updatedFormData.name) {
      newErrors.name = "Name is required.";
    }
    if (!updatedFormData.phone) {
      newErrors.phone = "Phone Number is required.";
    }
    if (!updatedFormData.status) {
      newErrors.status = "Status is required.";
    }

    setFormErrors(newErrors);

    // Create a copy of formData to modifyWHY ABOVE '

    // Assigning default value "NA" to each string field if they're empty

    updatedFormData.email = (updatedFormData.email == " ") ? "NA" : updatedFormData.email;
    updatedFormData.parentPhone = (updatedFormData.parentPhone == " ") ? "NA" : updatedFormData.parentPhone;
    updatedFormData.location = (updatedFormData.location == " ") ? "NA" : updatedFormData.location;
    updatedFormData.highestQualification = (updatedFormData.highestQualification === " ") ? "NA" : updatedFormData.highestQualification;
    updatedFormData.duration = (updatedFormData.duration == " ") ? "NA" : updatedFormData.duration;
    updatedFormData.totalFee = (updatedFormData.totalFee == " ") ? "NA" : updatedFormData.totalFee;


    // Update formData with the updated values
    setFormData(updatedFormData);



    if (Object.keys(newErrors).length === 0) {
      submitForm();
      Navigate("/salecampusformlist");
    }
  };


  const submitForm = async () => {
    if (formData.id) {
      handleUpdate();
    } else {
      try {
        const response = await fetch("https://empbackend.base2brand.com/submit-form", {
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
    }
  };

  const handleUpdate = () => {
    axios.put(`https://empbackend.base2brand.com/updatecampus/${formData.id}`, formData)
      .then((response) => {
        console.log(response.data);
        Navigate("/salecampusformlist");
      })
      .catch((error) => {
        console.log(error);
      });
  };


  //... Your other code and component logic


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
                          <label className="male">
                            Male
                            <input
                              type="radio"
                              name="gender"
                              value="Male"
                              checked={formData.gender === "Male"}
                              onChange={handleChange}
                            />
                          </label>
                        </div>

                        <div className="SalecampusForm-radio-os">
                          <label className="male">
                            Female
                            <input
                              type="radio"
                              name="gender"
                              value="Female"
                              checked={formData.gender === "Female"}
                              onChange={handleChange}
                            />
                          </label>
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
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                          >
                            <option value="" disabled>Select Status</option>
                            <option value="interested">Interested</option>
                            <option value="not interested">Not Interested</option>
                            <option value="hopefully">Hopefully</option>
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
                            {highestQualification.map((item) => {
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



                      <div className="SalecampusForm-radio-row-os">
                        <div className="SalecampusForm-radio-os">
                          <label className="male">
                            45 Days
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
                            3 Months
                            <input
                              type="radio"
                              name="duration"
                              value="3 Months"
                              checked={formData.duration === "3 Months"}
                              onChange={handleChange}
                            />
                          </label>
                        </div>
                        <div className="SalecampusForm-radio-os">
                          <label className="male">
                            6 Months
                            <input
                              type="radio"
                              name="duration"
                              value="6 Months"
                              checked={formData.duration === "6 Months"}
                              onChange={handleChange}
                            />
                          </label>
                        </div>
                        <div className="SalecampusForm-radio-os">
                          <label className="male">
                            1 Year
                            <input
                              type="radio"
                              name="duration"
                              value="1 Year"
                              checked={formData.duration === "1 Year"}
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
                          {/* <select
                            name="totalFee"
                            value={formData.totalFee}
                            onChange={handleChange}
                          >
                            <option value="">Select Total Fee</option>
                            <option>Total Fee :30000/-</option>
                            <option value="1. 15000/-">1. 15000/-</option>
                            <option value="2. 10000/-">2. 10000/-</option>
                            <option value="3. 5000/-">3. 5000/-</option>
                          </select> */}
                          <input
                            type="text"
                            name="totalFee"
                            placeholder="Enter Total Fee"
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

export default SalecampusForm;
