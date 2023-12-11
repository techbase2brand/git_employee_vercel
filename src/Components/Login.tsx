import React, { useState, useEffect, useContext } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import { useNavigate } from "react-router";
import { GlobalInfo } from "../App";

interface Task {
  TermID: number;
  term: string;
  currdate: string;
  date: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [getIp, setGetIp] = useState("");
  const [employeedata] = useState<unknown>();
  const { getEmpInfo, setEmpInfo } = useContext(GlobalInfo);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [termsAndConditions, setTermsAndConditions] = useState<any[]>([]);
  const onFinish = (values: { email: string; password: string }) => {
    console.log("Received values of form: ", values);

    axios
    .post("http://localhost:5000/user/login", values)
    .then((res) => {
      setApiResponse(res.data);
      console.log("res", res)
      if (res?.data === "Invalid username or password") {
        alert("Invalid username or password");
      } else {
        console.log("Login successful");
        if (res.data.user.logged === 0) {
          setShowTermsModal(true);
          axios
          .put(
            `http://localhost:5000/employeeipAddress/${res?.data?.user?.EmpID}`,
            {
              IpAddress: getIp,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("myToken")}`,
              },
            }
          )
          .then((response) => {
            console.log('IpAddress updated successfully');
          })
          .catch((error) => {
            console.error('Error updating IpAddress:', error);
          });
        } else {
          navigate("/add-morning-task");
        }
        // Save user info and token in state and local storage
        const { user, token } = res.data;

        // Convert the user data to a JSON string
        const dataString = JSON.stringify(user);

        // Store the user data and the token in localStorage
        localStorage.setItem("myData", dataString);
        localStorage.setItem("myToken", token);
        // navigate("/add-morning-task"); 
      }

    })
    .catch((error) => {
      console.log(error.response?.data); // Log the error message
      // Show an error message to the user
    });
  };
  
  useEffect(() => {
    axios
      .get<Task[]>("http://localhost:5000/get/addTermCondition", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        setTermsAndConditions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  
  useEffect(() => {
    axios.get('https://api.ipify.org?format=json')
      .then((response) => {
        console.log("resssss",response.data.ip)
        setGetIp(response.data.ip)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []); 

  const handleAcceptTerms = () => {
    if (apiResponse && apiResponse.user) {
      axios
        .put(`http://localhost:5000/employeeUpdatelogged/${apiResponse.user.EmpID}`, {
          logged: 1,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("myToken")}`,
          },
        })
        .then((response) => {
          setShowTermsModal(false);
          navigate('/add-morning-task');
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  return (
    <>
      <div className="outer-container">
        <div
          style={{
            width: "50%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#094781",
          }}
        >
          <img src="./Group 56.png" alt="Example Image" />
        </div>
        <div
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div style={{ marginBottom: "8%" }}>
              <p
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "#094781",
                }}
              >
                {" "}
                Login{" "}
              </p>
            </div>
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                style={{}}
                name="email"
                rules={[
                  { required: true, message: "Please input your Username!" },
                ]}
              >
                <Input
                  style={{ padding: "3%", paddingRight: "3%", width: "30vw " }}
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Type Email Here"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
              >
                <Input
                  style={{ padding: "3%", paddingRight: "3%", width: "30vw " }}
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password"
                  prefix={
                    <FontAwesomeIcon
                      icon={passwordVisible ? faEye : faEyeSlash}
                      style={{ color: "#bfbfbf", cursor: "pointer" }}
                      onClick={togglePasswordVisibility}
                    />
                  }
                />
              </Form.Item>
              <Form.Item>
                <Form.Item
                  name="remember"
                  valuePropName="checked"
                  noStyle
                ></Form.Item>
              </Form.Item>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  textAlign: "center",
                  justifyContent: "center",
                  height: "6vh",
                }}
              >
                <Button
                  style={{
                    width: "40%",
                    height: "100%",
                    borderRadius: "25px",
                    backgroundColor: "#094781",
                    paddingRight: "10%",
                    paddingLeft: "10%",
                    color: "white",
                    textAlign: "center",
                  }}
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  <h3
                    style={{
                      fontWeight: "bold",
                      width: "3vw",
                      marginLeft: "12px",
                    }}
                  >
                    Login
                  </h3>
                </Button>
              </div>
              <Modal
                title="Terms and Conditions"
                visible={showTermsModal}
                onCancel={() => setShowTermsModal(false)}
                footer={[
                  <Button key="back" onClick={() => setShowTermsModal(false)}>
                    Decline
                  </Button>,
                  <Button key="submit" type="primary" onClick={handleAcceptTerms}>
                    Accept
                  </Button>,
                ]}
              >
                {termsAndConditions.map((item) => {
                  return (
                    <div key={item.TermID}>
                      <p>{item.term}</p>
                      <p>{item.date}</p>
                    </div>
                  );
                })}
              </Modal>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
