import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "./Menu";
import Navbar from "./Navbar";
import { Table, Button, Input, Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";

interface SalesInfoData {
  id: number;
  url: string;
  title: string;
  discription: string;
  EmployeeID: string;
  created_at: string;
  image_url: string[];
  sendTo: string;
  isCompleted: number;
  category: string;
}

const DocTable = () => {

  const [data, setData] = useState<SalesInfoData[]>([]);
  console.log("data",data)

  const [filteredData, setFilteredData] = useState<SalesInfoData[]>(data);
  console.log("filteredData",filteredData)
  console.log()
  const [search, setSearch] = useState<string>("");
  const Navigate = useNavigate();
  const myDataString = localStorage.getItem('myData');
  let empIdMatch = "";
  let jobPosition = "";
  if (myDataString) {
    const myData = JSON.parse(myDataString);
    empIdMatch = myData.EmployeeID;
    jobPosition = myData.jobPosition;

  }
  const matchedData = filteredData.filter(item => item.EmployeeID === empIdMatch);
  console.log("matchedData",matchedData)
  const totalLength = matchedData.length;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisiblee, setModalVisiblee] = useState(false);
  const [modalContent, setModalContent] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<SalesInfoData | null>(
    null
  );
  const [currentImage, setCurrentImage] = useState('');

  const handleImageClick = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setModalVisiblee(true);
  };
  const showModalUrl = (text: string | string[]) => {
    const url = Array.isArray(text) ? text : text.split(',');
    setModalContent(url);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent([]);
  };
  const showModalDel = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setRecordToDelete(null);
  };
  const paginationSettings = {
    pageSize: 100,
  };
  const handleDelete = (id: number) => {
    axios
      .delete(
        `https://empbackend.base2brand.com/deletedocument/${id}`
        // {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        //   },
        // }
      )
      .then((response) => {
        console.log("res@", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    const updatedData = data.filter((e: any) => e.id !== id);
    setData(updatedData);
    filterData(search);
    setIsModalOpen(false);
  };
  useEffect(() => {
    const token = localStorage.getItem("myToken");
    axios
      .get(
        "https://empbackend.base2brand.com/documentdata"
        , {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const resData = response.data;
        console.log("resData", resData)

        setData(resData);
        setFilteredData(resData);
      });
  }, []);

  useEffect(() => {
    filterData(search);
  }, [data]);

  const handleEdit = (id: number) => {
    const recordToEdit = data.find((e: any) => e.id === id);
    Navigate("/DocForm", { state: { record: recordToEdit } });
  };

  const columns = [
    {
      title: "Data Entry Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) => {
        const date = new Date(text);
        const formattedDate = date.toISOString().split('T')[0];
        return <div>{formattedDate}</div>;
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Url",
      dataIndex: "url",
      key: "url",
      render: (text: string | string[]) => (
        <div>
          <button onClick={() => showModalUrl(text)} style={{ color: 'blue' }}>View Url</button>
        </div>
      ),
    },
    {
      title: 'Images',
      dataIndex: 'image_url',
      key: 'image_url',
      render: (text: string | string[]) => {
        let images: { url: string }[] = [];

        if (typeof text === 'string') {
          try {
            const parsedImages = JSON.parse(text);

            if (Array.isArray(parsedImages)) {
              images = parsedImages.map((image: any) => ({ url: image.url }));
            } else {
              images = [{ url: parsedImages.url }];
            }
          } catch (error) {
            console.error('Error parsing image URLs:', error);
          }
        } else {
          images = (text as string[]).map((url: string) => ({ url }));
        }

        return (
          <div>
            {images.map((imageObj: { url: string }, index: number) => (
              <img
                key={index}
                src={imageObj.url}
                alt={`Img ${index + 1}`}
                style={{
                  width: '50px',
                  height: '50px',
                  marginRight: '5px',
                  cursor: 'pointer',
                }}
                onClick={() => handleImageClick(imageObj.url)}
              />
            ))}
          </div>
        );
      },
    },

    {
      title: "Discription",
      dataIndex: "discription",
      key: "discription",
      render: (text: string | string[]) => (
        <div>
          <button onClick={() => showModalUrl(text)} style={{ color: 'blue' }}>Discription</button>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Posted By",
      dataIndex: "postedBy",
      key: "postedBy",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Send To",
      dataIndex: "sendTo",
      key: "sendTo",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Status",
      dataIndex: "isCompleted",
      key: "status",
      render: (isCompleted: number) => (
        isCompleted ? (
          <span style={{ color: "green" }}>&#10003;</span>
        ) : (
          <span style={{ color: "red" }}>&#10005;</span>
        )
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: SalesInfoData) => (
        record?.isCompleted === null ?
        <span>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setRecordToDelete(record);
              showModalDel();
            }}
          >
            Delete
          </Button>
        </span>
        : ""
      ),
    },
  ];

  const filterData = (inputValue: string) => {
    const lowercasedInput = inputValue.toLowerCase();

    if (inputValue) {
      const result = data.filter(
        (e) =>
          e?.title?.toLowerCase().includes(lowercasedInput) ||
          e?.discription?.toLowerCase().includes(lowercasedInput)

      );
      setFilteredData(result);
    } else {
      setFilteredData(data);
    }

  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearch(inputValue);
    filterData(inputValue);
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
                <div className="SalecampusFormList-default-os">

                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      gap: '7px',
                    }}
                  >
                    <div
                      className="search"
                      style={{
                        width: "fit-content",
                      }}
                    >
                      <Input
                        placeholder="Search..."
                        prefix={<SearchOutlined className="search-icon" />}
                        onChange={handleSearch}
                      />
                    </div>
                  </div>
                  <div className="saleInfo-form">
                    {jobPosition === "Managing Director" ?
                      <Table
                        dataSource={filteredData.slice().reverse()}
                        columns={columns}
                        pagination={paginationSettings}
                      />
                      :
                      <Table
                        dataSource={matchedData.slice().reverse()}
                        columns={columns}
                        pagination={paginationSettings}
                      />

                    }
                  </div>
                </div>
                <Modal
                  title="View Data :"
                  visible={modalVisible}
                  onCancel={closeModal}
                  footer={null}
                >
                  {modalContent.map((reason: string, index: number) => (
                    <div key={index}>
                      {reason.trim()}
                      {index !== modalContent.length - 1 && <br /> && <br /> && <br />}
                    </div>
                  ))}
                </Modal>
                <Modal
                  title="Confirmation"
                  open={isModalOpen}
                  onOk={() => {
                    if (recordToDelete) {
                      handleDelete(recordToDelete.id);
                    }
                  }}
                  onCancel={handleCancel}
                >
                  <p>Are you sure, you want to delete</p>
                </Modal>
                <Modal
                  centered
                  width={1000}
                  title="Image Preview"
                  visible={modalVisiblee}
                  onCancel={() => setModalVisiblee(false)}
                  footer={null}
                >
                  <img src={currentImage} alt="Preview" style={{ width: '100%' }} />
                </Modal>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocTable;
