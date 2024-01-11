import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Navbar from "./Navbar";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    pdfData: string;
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
        pdfData: "",
    };
    const location = useLocation();
    const Navigate = useNavigate();
    const record: FormData | undefined = location.state?.record;
    const [statusUrl, setStatusUrl] = useState(['']);
    const [formData, setFormData] = useState<FormData>(record || initialFormData);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const filteredData = employees.filter((item: any) => item.status === 1);
    const [pdfFiles, setPdfFiles] = useState<File[]>([]);

    const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = e.target.files;
        if (files) {
            setPdfFiles(Array.from(files));
            const formData = new FormData();
            Array.from(files).forEach((file: File) => {
                formData.append("pdf_files[]", file);
            });
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/upload-pdf`, formData);
                const pdfUrl = response.data.pdf_url;
                setFormData((prevData) => ({
                    ...prevData,
                    pdfData: pdfUrl,
                }));
            } catch (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        if (record) {
            setFormData(record);
            if (Array.isArray(record.image_url) && record.image_url.length > 0) {
                setImagePreviews([...record.image_url]);
            } else if (typeof record.image_url === 'string') {
                const trimmedUrl = (record.image_url as string).trim();
                if (trimmedUrl.length > 0) {
                    setImagePreviews([trimmedUrl]);
                } else {
                    setImagePreviews([]);
                }
            } else {
                setImagePreviews([]);
            }
        }
    }, [record]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = e.target.files;
        if (files) {
            const formData = new FormData();
            Array.from(files).forEach((file: File) => {
                formData.append("images", file);
            });
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/upload`, formData);
                const newImageUrls = response.data.image_urls;
                setImageFiles((prevFiles: File[]) => [...prevFiles, ...Array.from(files)]);
                setImagePreviews((prevPreviews: string[]) => [...prevPreviews, ...newImageUrls]);
                setFormData((prevData: FormData) => ({
                    ...prevData,
                    image_url: [...prevData.image_url, ...newImageUrls],
                }));
            } catch (error) {
                console.error(error);
            }
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
            let updatedImageUrls = prevData.image_url;
            if (Array.isArray(prevData.image_url)) {
                updatedImageUrls = prevData.image_url.filter((_, i) => i !== index);
            }
            return {
                ...prevData,
                image_url: updatedImageUrls,
            };
        });
    };

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
            .get<Employee[]>(`${process.env.REACT_APP_API_BASE_URL}/employees`, {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        setFormErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            if (formData.id) {
                handleUpdate();
            } else {
                const formPayload = {
                    ...formData,
                    image_url: imagePreviews,
                };

                try {
                    const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/submit-document`, formPayload);
                    setSubmitted(true);
                    Navigate("/DocTable");
                    toast.success('Submit successfully!', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                } catch (error) {
                    toast.error('Error while inserting.', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            }
        }
    };
    const handleUpdate = () => {
        const updatedFormData = {
            ...formData,
            url: statusUrl.join(','),
        };

        axios
            .put(`${process.env.REACT_APP_API_BASE_URL}/updatedocument/${updatedFormData.id}`, updatedFormData)
            .then((response) => {
                setSubmitted(true);
                Navigate("/DocTable");
                toast.success('Updated successfully!', {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
            .catch((error) => {
                console.error(error);
                toast.error('Error while Updating.', {
                    position: toast.POSITION.TOP_RIGHT,
                });
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
                                    <form action="/upload" method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
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
                                            {!formData.id &&
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
                                                        {imageFiles.map((file, index) => (
                                                            <div key={index} className="SalecampusForm-image-preview">
                                                                <img
                                                                    src={URL.createObjectURL(file)}
                                                                    alt={`Image ${index + 1}`}
                                                                    style={{ width: '10%' }}
                                                                />
                                                                <div
                                                                    style={{ float: 'right' }}
                                                                    onClick={() => handleRemoveImage(index)}
                                                                >
                                                                    <MinusCircleOutlined rev={undefined} />
                                                                </div>
                                                            </div>
                                                        ))}

                                                        {/* {formData.id && imageUrlArray.map((imageUrl, index) => (
                                                        <div key={index} className="SalecampusForm-image-preview">
                                                            <img
                                                                src={imageUrl.trim()}
                                                                alt={`Image ${index + 1}`}
                                                                style={{ width: '10%' }}
                                                            />
                                                            <div
                                                                style={{ float: 'right' }}
                                                                onClick={() => handleRemoveImage(imageFiles?.findIndex((file, fileIndex) => fileIndex === index))}
                                                            >
                                                                <MinusCircleOutlined rev={undefined} />
                                                            </div>
                                                        </div>
                                                    ))} */}

                                                    </div>
                                                    {formErrors.image_url && (
                                                        <div className="error-message-os">
                                                            {formErrors.image_url}
                                                        </div>
                                                    )}
                                                </div>}
                                            {!formData.id &&
                                                <div className="SalecampusForm-col-os">
                                                    <label>Add All Type of File</label>
                                                    <div className="SalecampusForm-input-os">
                                                        <input
                                                            type="file"
                                                            name="pdf_file"
                                                            accept=".pdf, .txt, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                            multiple
                                                            onChange={handlePdfChange}
                                                        />

                                                    </div>
                                                    {pdfFiles.map((file, index) => (
                                                        <div key={index}>
                                                            <p>{file.name}</p>
                                                        </div>
                                                    ))}
                                                </div>}
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
                                                <button type="submit">
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
