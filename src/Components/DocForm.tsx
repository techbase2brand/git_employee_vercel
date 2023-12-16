import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Navbar from "./Navbar";
import axios from "axios";
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from "react-router";
interface FormData {
    id?: number;
    image_url: string[];
    title: string;
    url: string[];
    role: string;
    discription: string;
    EmployeeID: string;
    postedBy: string;
    sendTo: string;
    category: string;
}
interface Employee {
    EmpID: string | number;
    firstName: string;
    role: string;
    dob: string | Date;
    EmployeeID: string;
}
function DocForm(): JSX.Element {
    const myDataString = localStorage.getItem('myData');
    let employeeID = "";
    let employeeName = "";
    let rolled = "";
    if (myDataString) {
        const myData = JSON.parse(myDataString);
        employeeID = myData.EmployeeID;
        employeeName = `${myData.firstName} ${myData.lastName}`;
        rolled = myData.role;
    }

    const initialFormData: FormData = {
        image_url: [],
        title: "",
        url: [],
        role: rolled,
        discription: "",
        EmployeeID: employeeID,
        postedBy: employeeName,
        sendTo: "",
        category: "",
    };
    const location = useLocation();
    const Navigate = useNavigate();
    const record: FormData | undefined = location.state?.record;
    const [statusUrl, setStatusUrl] = useState(['']);
    const [state, setState] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>(record || initialFormData);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const filteredData = employees.filter((item: any) => item.status === 1);

    useEffect(() => {
        if (record) {
            setFormData(record);
        }
    }, [record]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = e.target.files;
        if (files) {
            console.log("files", files)
            const newFilesArray: File[] = Array.from(files);
            console.log("newFilesArray", newFilesArray)

            const newImageUrls = newFilesArray.map((file) => URL.createObjectURL(file));
            console.log("newImageUrls", newImageUrls)

            setImageFiles([...imageFiles, ...newFilesArray]);
            setImagePreviews([...imagePreviews, ...newImageUrls]);
            setFormData((prevData) => ({
                ...prevData,
                image_url: [...prevData.image_url, ...newImageUrls],
            }));
        }
    };


    const handleRemoveImage = (index: number) => {
        const newImageFiles = [...imageFiles];
        newImageFiles.splice(index, 1);
        setImageFiles(newImageFiles);

        const newImagePreviews = [...imagePreviews];
        newImagePreviews.splice(index, 1);
        setImagePreviews(newImagePreviews);
        setFormData((prevData) => {
            const updatedImageUrls = prevData.image_url.filter((_, i) => i !== index);
            return {
                ...prevData,
                image_url: updatedImageUrls,
            };
        });
    };

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
    useEffect(() => {
        if (record) {
            setFormData(record);
            if (typeof record.url === 'string' && (record.url as string).trim().length > 0) {
                const reasonsArray = (record.url as string).split(',');
                setStatusUrl(reasonsArray);
            }
        }
    }, [record]);

    const handleAddUrl = () => {
        setStatusUrl([...statusUrl, '']);
        setState(true)
    };
    const handleRemoveUrl = (index: number) => {
        setStatusUrl((prevState) => {
            const newState = [...prevState];
            newState.splice(index, 1);
            return newState;
        });
    };
    const handleChangeReason = (value: string, index: number) => {
        const newStatusUrl = [...statusUrl];
        newStatusUrl[index] = value;
        setStatusUrl(newStatusUrl);
        setFormData((prevData) => ({
            ...prevData,
            url: newStatusUrl,
        }));
    };
    useEffect(() => {
        axios
            .get<Employee[]>("https://empbackend.base2brand.com/employees", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("myToken")}`,
                },
            })
            .then((response) => {
                const sortedData = response?.data.sort(
                    (a, b) => Number(b.EmpID) - Number(a.EmpID)
                );

                setEmployees(sortedData);
            })
            .catch((error) => console.log(error));
    }, []);

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
            handleUpdate();
        } else {
            console.log("submitForm-else-os");
            axios
                .post(`https://empbackend.base2brand.com/submit-document`, formData)
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
        setFormErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            submitForm();
            Navigate("/DocTable");
        }
    };

    const handleUpdate = () => {
        const statusUrlString = statusUrl.join(',');
        const updatedFormData = {
            ...formData,
            url: statusUrlString,
        };
        axios
            .put(`https://empbackend.base2brand.com/updatedocument/${updatedFormData?.id}`, updatedFormData)
            .then((response) => {
                Navigate("/DocTable");
                setSubmitted(true);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const Language = [
        {
            "id": 1,
            "firstName": "Shopify-app",
        },
        {
            "id": 2,
            "firstName": "Shopify-theme",
        },
        {
            "id": 3,
            "firstName": "React",
        },
        {
            "id": 4,
            "firstName": "Wordpress",
        }
    ];
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
                                    <h2>Documentation Form</h2>
                                    <form onSubmit={handleSubmit}>
                                        <div className="SalecampusForm-row-os">
                                            <div className="SalecampusForm-col-os">
                                                <label>Title</label>

                                                <div className="SalecampusForm-input-os">
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        placeholder="Title"
                                                        value={formData.title}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            {statusUrl.map((reason, index) => (
                                                <div key={index} className="SalecampusForm-col-os">
                                                    <label>Add Url</label>

                                                    <div className="SalecampusForm-input-os">
                                                        <input
                                                            type="text"
                                                            placeholder={`Url... ${index + 1}`}
                                                            value={reason}
                                                            onChange={(e) => handleChangeReason(e.target.value, index)}
                                                        />
                                                    </div>
                                                    {index !== 0 && (
                                                        <div
                                                            style={{
                                                                float: 'right'
                                                            }}
                                                            onClick={() => handleRemoveUrl(index)}
                                                        >
                                                            <MinusCircleOutlined rev={undefined} />
                                                        </div>
                                                    )}
                                                    {index === statusUrl.length - 1 && (
                                                        <div
                                                            style={{
                                                                float: 'right'
                                                            }}
                                                            onClick={handleAddUrl}
                                                        >
                                                            <PlusCircleOutlined rev={undefined} />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            <div className="SalecampusForm-col-os">
                                                <label>Add Images</label>
                                                <div className="SalecampusForm-input-os">
                                                    <input
                                                        type="file"
                                                        name="image_url"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handleImageChange}
                                                    />
                                                    {imagePreviews.map((preview, index) => (
                                                        <div key={index} className="SalecampusForm-image-preview">
                                                            <img src={preview} alt={`Image ${index + 1} not found`} style={{ width: '10%' }} />
                                                            <div
                                                                style={{ float: 'right' }}
                                                                onClick={() => handleRemoveImage(index)}
                                                            >
                                                                <MinusCircleOutlined rev={undefined} />
                                                            </div>
                                                        </div>
                                                    ))}


                                                </div>
                                                {formErrors.image_url && (
                                                    <div className="error-message-os">
                                                        {formErrors.image_url}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="SalecampusForm-col-os">
                                                <label>Discription</label>
                                                <div className="SalecampusForm-input-os">
                                                    <textarea
                                                        name="discription"
                                                        placeholder="Discription"
                                                        value={formData.discription}
                                                        onChange={handleTextareaChange}
                                                        className="additional-notes"
                                                    />
                                                </div>
                                                {formErrors.discription && (
                                                    <div className="error-message-os">
                                                        {formErrors.discription}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="SalecampusForm-col-os">
                                                <div className="SalecampusForm-input-os">
                                                    <select
                                                        className="add-input"
                                                        id="sendTo"
                                                        name="sendTo"
                                                        value={formData?.sendTo}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="">Send To</option>
                                                        {filteredData.map((employee) => (
                                                            <option
                                                                value={employee.firstName}
                                                                key={employee.EmployeeID}
                                                            >
                                                                {employee.firstName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="SalecampusForm-col-os">
                                                <div className="SalecampusForm-input-os">
                                                    <select
                                                        className="add-input"
                                                        id="category"
                                                        name="category"
                                                        value={formData?.category}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="">Select Category</option>
                                                        {Language.map((item) => (
                                                            <option
                                                                value={item.firstName}
                                                                key={item.id}
                                                            >
                                                                {item.firstName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
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

export default DocForm;
