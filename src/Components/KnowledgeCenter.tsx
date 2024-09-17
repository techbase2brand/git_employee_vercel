import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Navbar from "./Navbar";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MinusCircleOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from "react-router";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
interface FormData {
    id?: number;
    image_url: string[];
    title: string;
    term: string;
    discription: string;
    EmployeeID: string;
    pagetitle: string;
    pageKeyword: string;
    status: number;
    category: string;
}
function KnowledgeCenter(): JSX.Element {
    const myDataString = localStorage.getItem('myData');
    let employeeID = "";
    if (myDataString) {
        const myData = JSON.parse(myDataString);
        employeeID = myData.EmployeeID;
    }

    const initialFormData: FormData = {
        image_url: [],
        title: "",
        term: "",
        discription: "",
        EmployeeID: employeeID,
        pagetitle: "",
        pageKeyword: "",
        status: 0,
        category: ""
    };
    const location = useLocation();
    const Navigate = useNavigate();
    const record: FormData | undefined = location.state?.record;
    const [formData, setFormData] = useState<FormData>(record || initialFormData);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [categoryNames, setCategoryNames] = useState<Array<{ id: number; CategoryData: string }>>([]);

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

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_BASE_URL}/get/category`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("myToken")}`,
                },
            })
            .then((response) => {
                setCategoryNames(response.data)
            })
            .catch((error) => {
                console.error("Error fetching data:");
            });
    }, []);

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
        }
    }, [record]);

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
                    const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/knowledge-blogpost`, formPayload);
                    setSubmitted(true);
                    Navigate("/KnowledgeCenterList");
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
    const handleTermChange = (event: any, editor: any) => {
        const data = editor.getData();
        setFormData({
            ...formData,
            term: data,
        });
    };
    const handleUpdate = () => {
        const updatedFormData = {
            ...formData,
        };

        axios
            .put(`${process.env.REACT_APP_API_BASE_URL}/update-knowledge-blog/${updatedFormData.id}`, updatedFormData)
            .then((response) => {
                setSubmitted(true);
                Navigate("/KnowledgeCenterList");
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

    const handleCheckboxToggle = () => {
        setFormData((prevData) => ({
            ...prevData,
            status: prevData.status === 1 ? 0 : 1,
        }));
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

                    <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>

                        <section className="SalecampusForm-section-os">
                            <div className="form-container">
                                <div className="SalecampusForm-data-os">
                                    <h2>Knowledge center Form</h2>
                                    <form action="/upload" method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
                                        <div className="SalecampusForm-row-os">
                                            <div className="SalecampusForm-col-os">
                                                <div className="SalecampusForm-input-os">
                                                    <select
                                                        name="category"
                                                        value={formData.category}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="">Choose a Category</option>

                                                        {categoryNames?.map((item) => {
                                                            return (
                                                                <option key={item.id} value={item.CategoryData}>
                                                                    {item.CategoryData}
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
                                            <div className="SalecampusForm-col-os">
                                                <label>Editor</label>
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={formData?.term}
                                                    onChange={handleTermChange}

                                                />
                                            </div>
                                            {!formData.id &&
                                                <div className="SalecampusForm-col-os">
                                                    <label>Featured Image</label>
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


                                                    </div>
                                                    {formErrors.image_url && (
                                                        <div className="error-message-os">
                                                            {formErrors.image_url}
                                                        </div>
                                                    )}
                                                </div>}
                                            <div className="SalecampusForm-col-os">
                                                <label>Page Title</label>

                                                <div className="SalecampusForm-input-os">
                                                    <input
                                                        type="text"
                                                        name="pagetitle"
                                                        placeholder="page Title"
                                                        value={formData.pagetitle}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="SalecampusForm-col-os">
                                                <label>Page Keyword</label>

                                                <div className="SalecampusForm-input-os">
                                                    <input
                                                        type="text"
                                                        name="pageKeyword"
                                                        placeholder="Page Keyword"
                                                        value={formData.pageKeyword}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="SalecampusForm-col-os">
                                                <label>Page Discription</label>
                                                <div className="SalecampusForm-input-os">
                                                    <textarea
                                                        name="discription"
                                                        placeholder="Page Description"
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
                                            <div className="SalecampusForm-col-os" style={{ display: 'flex' }}>
                                                <label>Status : -</label>
                                                <input
                                                    type="checkbox"
                                                    style={{
                                                        marginBottom: "32px",
                                                        paddingBottom: "20px",
                                                        width: "80px",
                                                        height: '26px'
                                                    }}
                                                    checked={formData.status === 1}
                                                    onChange={handleCheckboxToggle}
                                                />
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

export default KnowledgeCenter;
