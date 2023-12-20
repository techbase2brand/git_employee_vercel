import React, { useEffect ,useState} from "react";
import io from "socket.io-client";
import axios from "axios";

interface Employee {
  EmpID: string | number;
  firstName: string;
  lastName: string;
  role: string;
  dob: string | Date;
  EmployeeID: string;
  status: number;
}
interface ChatmenuProps {
  selectedEmployee: Employee | null;
  chatMessage: string;
  setSelectedEmployee: React.Dispatch<React.SetStateAction<Employee | null>>;
  setChatMessage: React.Dispatch<React.SetStateAction<string>>;
}
// Initialize socket connection outside of the component
const socket = io("http://localhost:5000");

const ChatMessageComp: React.FC<ChatmenuProps> = ({
  selectedEmployee,
  chatMessage,
  setSelectedEmployee,
  setChatMessage,
}) => {
    const [initialMessages, setInitialMessages] = useState([]); // State to store initial messages
    useEffect(() => {
        // This listener is for connecting to the socket server
        socket.on("connect", () => {
          console.log("Connected to socket.io server");
        });

        // Listener for initial chat messages
        socket.on("initialChatMessages", (data) => {
          console.log("Initial messages:", data);
          setInitialMessages(data.chats); // Assuming data has a 'chats' property
        });

        socket.on("connect_error", (error) => {
          console.error("Connection failed:", error);
        });

        // Cleanup listeners on unmount
        return () => {
          socket.off("connect");
          socket.off("initialChatMessages");
          socket.off("connect_error");
        };
      }, []);



  const sendChatMessage = () => {
    const storedData = localStorage.getItem("myData");
    const senderEmployee = storedData ? JSON.parse(storedData) : null;

    if (selectedEmployee && chatMessage && senderEmployee?.EmployeeID) {
      const data = {
        chatMessage,
        senderID: senderEmployee.EmployeeID,
        receiverID: selectedEmployee.EmployeeID,
      };

      axios
        .post("https://empbackend.base2brand.com/chat", data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("myToken")}`,
          },
        })
        .then((response) => {
          console.log(response.data, "Chat message response");

                  setChatMessage("");
        })
        .catch((error) => {
          console.error("Error sending chat message:", error);
        });
    } else {
      console.error("Sender employee data is invalid");
    }
    socket.on("connect", () => {
        console.log("Connected to socket.io server");
      });

      // Listener for initial chat messages
      socket.on("initialChatMessages", (data) => {
        console.log("Initial messages:", data);
        setInitialMessages(data.chats); // Assuming data has a 'chats' property
      });

      socket.on("connect_error", (error) => {
        console.error("Connection failed:", error);
      });

      // Cleanup listeners on unmount
      return () => {
        socket.off("connect");
        socket.off("initialChatMessages");
        socket.off("connect_error");
      };
  };



  return (
    <div style={{ padding: "10px" }}>
      {selectedEmployee ? (
        <>
          <div style={{ marginBottom: "10px" }}>
            <strong>Chatting with: </strong>
            {selectedEmployee.firstName} {selectedEmployee.lastName}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type your message here..."
              style={{ flex: 1, marginRight: "10px", padding: "10px" }}
            />
            <button onClick={sendChatMessage} style={{ padding: "10px 15px" }}>
              Send
            </button>
          </div>
        </>
      ) : (
        <div>Please select an employee to chat with.</div>
      )}
    </div>
  );
};
export default ChatMessageComp;
