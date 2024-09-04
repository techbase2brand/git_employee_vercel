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
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [termsAndConditions, setTermsAndConditions] = useState<any[]>([]);

  const onFinish = (values: { email: string; password: string }) => {
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/user/login`, values)
      .then((res) => {
        setApiResponse(res.data);
        if (res?.data === "Invalid username or password") {
          alert("Invalid username or password");
        } else {

          const { user, token } = res.data;
          const dataString = JSON.stringify(user);
          localStorage.setItem("myData", dataString);
          localStorage.setItem("myToken", token);
          if (res.data.user.logged === 0) {
            setShowTermsModal(true);
            axios.get('https://api.ipify.org?format=json')
              .then((response) => {
                const ipAddress = response?.data?.ip;
                setGetIp(ipAddress);
                axios
                  .put(
                    `${process.env.REACT_APP_API_BASE_URL}/employeeipAddress/${res?.data?.user?.EmpID}`,
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
              })
              .catch((error) => {
                console.error('Error fetching data:', error);
              });
          } else {
            const { user, token } = res.data;
            const dataString = JSON.stringify(user);
            localStorage.setItem("myData", dataString);
            localStorage.setItem("myToken", token);
            if (token) {
              navigate("/add-morning-task");
            }
          }
          // const { user, token } = res.data;
          // const dataString = JSON.stringify(user);
          // localStorage.setItem("myData", dataString);
          // localStorage.setItem("myToken", token);
        }
      })
      .catch((error) => {
        console.log(error.response?.data);
      });
  };

  useEffect(() => {
    axios
      .get<Task[]>(`${process.env.REACT_APP_API_BASE_URL}/get/addTermCondition`, {
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

  // useEffect(() => {
  //   axios.get('https://api.ipify.org?format=json')
  //     .then((response) => {
  //       console.log("resssss",response.data.ip)
  //       setGetIp(response.data.ip)
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching data:', error);
  //     });
  // }, []); 

  const handleAcceptTerms = () => {
    if (apiResponse && apiResponse.user) {
      axios
        .put(`${process.env.REACT_APP_API_BASE_URL}/employeeUpdatelogged/${apiResponse.user.EmpID}`, {
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
          className="login-img"
        >
          <img src="./Group 56.png" alt="Example Image" />
        </div>
        <div
          className="login-main"
        >
          <div
            className="emp-form-login"
          >
            <div style={{ marginBottom: "8%" }} className="login-text">
              <p
                className="b2b-login"
              >
                B2b Login
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
                  className="email-input"
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
                  className="email-input"
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
              {/* <Form.Item>
                <Form.Item
                  name="remember"
                  valuePropName="checked"
                  noStyle
                ></Form.Item>
              </Form.Item> */}

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  textAlign: "center",
                  justifyContent: "center",
                  height: "6vh",
                }}
              >
                <button
                  // type="primary"
                  // htmlType="submit"
                  className="login-form-button"
                >
                  {/* <h3
                    style={{
                      fontWeight: "bold",
                      width: "3vw",
                      marginLeft: "12px",
                    }}
                  > */}
                  Login
                  {/* </h3> */}
                </button>
              </div>
              <Modal
                title="Terms and Conditions"
                centered
                width={1200}
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
                {termsAndConditions.map((item, index) =>
                  index !== 0 && (
                    <div key={item.TermID}>
                      <div dangerouslySetInnerHTML={{ __html: item.term }} />
                      <p>{item.date}</p>
                    </div>
                  )
                )}
              </Modal>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
