import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface Task {
  id: number;
  news: string;
  currdate: string;
  date: string;
}
const TermCondition: React.FC<unknown> = () => {
  const [currentDate] = useState<Date>(new Date());
  const formattedDate = format(currentDate, "yyyy-MM-dd");

  const [termTask, setTermTask] = useState<Task>({
    id: 0,
    news: "",
    currdate: formattedDate,
    date: "",
  });

  const token = localStorage.getItem("myToken");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location?.state?.id) {
      axios
        .get<Task[]>(`${process.env.REACT_APP_API_BASE_URL}/get/daily-news`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const res = response.data.filter(
            (e: Task) => e.id === location?.state?.id
          );

          if (res.length > 0) {
            setTermTask({
              id: res[0]?.id,
              news: res[0]?.news,
              currdate: res[0]?.currdate,
              date: res[0]?.date,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching data:");
        });
    }
  }, [location?.state?.id]);

  const handleDateChange = (value: string) => {
    setTermTask({
      ...termTask,
      date: value,
    });
  };

  const handleSubmit = () => {
    if (termTask.date === "") {
      toast.error('please select the date which date you want to display the news.', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    const isEditMode = !!location?.state?.id;
    const apiEndpoint = isEditMode
      ? `${process.env.REACT_APP_API_BASE_URL}/update/news/${location?.state?.id}`
      : `${process.env.REACT_APP_API_BASE_URL}/create/news`;

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
          alert("Date is Complusary.");
        } else {
          navigate("/ViewNewsTable");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleTermChange = (event: any, editor: any) => {
    const data = editor.getData();
    setTermTask({
      ...termTask,
      news: data,
    });
  };

  return (
    <div className="emp-main-div">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column" }}
          className="form-container"
        >
          <div className="add-div">
            <h1>Daily News</h1>
            <label className="add-label">
              Add News:<span style={{ color: "red" }}>*</span>
            </label>
            {/* <CKEditor
              editor={ClassicEditor}
              data={termTask?.news}
              onChange={handleTermChange}
            /> */}
            <CKEditor
              editor={ClassicEditor}
              data={termTask?.news}
              config={{
                toolbar: [
                  'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList',
                  '|', 'insertTable', 'blockQuote', 'undo', 'redo', 'imageUpload', 'mediaEmbed'
                ],
                image: {
                  toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side']
                },
                simpleUpload: {
                  // This enables Base64 image upload (direct embedding of the image)
                  uploadUrl: 'data:image;base64',
                },
              }}
              onChange={handleTermChange}
            />


            <div className="SalecampusForm-col-os">
              <label className="add-label">
                Date:
              </label>
              <div className="SalecampusForm-input-os">
                <input
                  style={{ width: 'auto' }}
                  type="date"
                  name="date"
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
  );
};

export default TermCondition;
