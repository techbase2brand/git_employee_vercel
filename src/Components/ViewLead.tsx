import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Checkbox, Modal } from "antd";
import { format } from "date-fns";

interface SalesInfoData {
  id: number;
  portalType: string;
  profileName: string;
  url: string;
  clientName: string;
  handleBy: string;
  status: string;
  statusReason: string;
  communicationMode: string;
  communicationReason: string;
  updated_at: string;
  dateData: string;
  EmployeeID: string;
  created_at: string;
  RegisterBy: string;
  inviteBid: string;
  commModeEmail: string;
  commModeOther: string;
  commModePhone: string;
  commModePortal: string;
  commModeWhatsapp: string;
  commModeSkype: string;
  othermode: string;
  sendTo: string;
  enterCmnt: string;
  checked: number;
}

interface Props {
  selectedAssignee: string | null;
  searchTerm: string;
  dateRange: any;
  buttonClick1: any;
}
const ViewLead: React.FC<Props> = ({
  selectedAssignee,
  searchTerm,
  dateRange,
  buttonClick1,
}) => {
  const [data, setData] = useState<SalesInfoData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalRecord, setModalRecord] = useState<SalesInfoData | null>(null);
  const [filteredData, setFilteredData] = useState<SalesInfoData[]>(data);
  const [currentDate] = useState<Date>(new Date());
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  // const [dateRange] = useState<[string | null, string | null]>([null, null]);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [editedComments, setEditedComments] = useState<Record<string, string>>(
    {}
  );
  const sortedDataa = [...filteredData].sort((a, b) => a.id - b.id);

  const DataString = localStorage.getItem("myData");
  let myName = "";
  let EmployeId = "";
  if (DataString) {
    const parsing = JSON.parse(DataString);
    myName = parsing.firstName;
    EmployeId = parsing.EmployeeID;
  }

  const holderData = sortedDataa.filter(
    (item) =>
      item?.sendTo === myName && (item.checked === 0 || item.checked === null)
  );
  const allData = sortedDataa.filter((item) => {
    if (selectedAssignee) {
      return (
        item.sendTo === selectedAssignee &&
        (item.checked === 0 || item.checked === null)
      );
    } else {
      return (
        item?.sendTo !== null && (item.checked === 0 || item.checked === null)
      );
    }
  });

  const paginationSettings = {
    pageSize: 100,
  };

  useEffect(() => {
    axios
      .get(
        ` ${process.env.REACT_APP_API_BASE_URL}/salesinfodata`
        // , {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      )
      .then((response) => {
        const resData = response.data;
        let filteredData = resData;

        if (dateRange[0] && dateRange[1]) {
          const startDate = new Date(dateRange[0]!).getTime();
          const endDate = new Date(dateRange[1]!).getTime();

          filteredData = resData.filter((obj: SalesInfoData) => {
            const taskDate = new Date(obj.dateData).getTime();
            return taskDate >= startDate && taskDate <= endDate;
          });
        }

        setData(filteredData);
        setFilteredData(filteredData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [dateRange, formattedDate, buttonClick1]);

  useEffect(() => {
    filterData(searchTerm);
  }, [data, searchTerm]);

  const handleCommentChange = (record: SalesInfoData, value: string) => {
    setEditedComments({ ...editedComments, [record.id]: value });
    setEditMode(record.id);
  };
  const handleSaveComments = (record: SalesInfoData) => {
    const id = record.id;
    const enterCmnt = editedComments[id] || record.enterCmnt || "";

    const updatedData = data.map((item) =>
      item.id === record.id ? { ...item, enterCmnt } : item
    );
    setData(updatedData);
    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/update-comments-lead/${id}`, {
        enterCmnt,
      })
      .then((response) => {
        setEditedComments({ ...editedComments, [record.id]: "" });
        setEditMode(null);
      })
      .catch((error) => {
        console.error("Error while updating comments:", error);
      });
  };

  // const handleCheckChange = (record: SalesInfoData) => {
  //     const updatedData = data.map((item) =>
  //         item.id === record.id ? { ...item, checked: item.checked === 1 ? 0 : 1 } : item
  //     );

  //     setData(updatedData);

  //     axios.put(`${process.env.REACT_APP_API_BASE_URL}/update-checked-tl/${record.id}`, {
  //         checked: record.checked === 1 ? 0 : 1,
  //     })
  //         .then(response => {
  //             console.log('check updated successfully:', response.data);
  //         })
  //         .catch(error => {
  //             console.error('Error while updating check:', error);
  //         });
  // };
  const handleCheckChange = (record: SalesInfoData) => {
    setModalRecord(record);
    setIsModalVisible(true);
  };
  const handleModalOk = () => {
    setIsModalVisible(false);

    // Your existing code for handling checkbox change
    const updatedData = data.map((item) =>
      item.id === modalRecord?.id
        ? { ...item, checked: item.checked === 1 ? 0 : 1 }
        : item
    );
    setData(updatedData);

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/update-checked-tl/${modalRecord?.id}`,
        {
          checked: modalRecord?.checked === 1 ? 0 : 1,
        }
      )
      .then((response) => {
        console.log("check updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error while updating check:", error);
      });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Client name",
      dataIndex: "clientName",
      key: "clientName",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Portal type",
      dataIndex: "portalType",
      key: "portalType",
      render: (text: string) => <div style={{ width: 80 }}>{text}</div>,
    },
    {
      title: "Profile name",
      dataIndex: "profileName",
      key: "profileName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Register By",
      dataIndex: "RegisterBy",
      key: "RegisterBy",
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Comment",
      dataIndex: "enterCmnt",
      key: "enterCmnt",
      render: (text: string, record: SalesInfoData) => (
        <div>
          {editMode === record.id ? (
            <>
              <textarea
                value={editedComments[record.id] || text || ""}
                onChange={(e) => handleCommentChange(record, e.target.value)}
              />
              <Button onClick={() => handleSaveComments(record)}>Save</Button>
            </>
          ) : (
            <>
              <div>{text}</div>
              <Button
                onClick={() => setEditMode(record.id)}
                style={{ float: "right" }}
              >
                Edit
              </Button>
            </>
          )}
        </div>
      ),
    },
    {
      title: "F/A",
      dataIndex: "checked",
      key: "checked",
      render: (text: string, record: SalesInfoData) => {
        return (
          <>
            {EmployeId === "B2B00100" && record.enterCmnt && (
              <Checkbox
                style={{ border: "2px solid black", borderRadius: "6px" }}
                checked={record.checked === 1}
                onChange={() => handleCheckChange(record)}
              />
            )}
          </>
        );
      },
    },
  ];

  const filterData = (inputValue: string) => {
    const lowercasedInput = inputValue.toLowerCase();
    if (inputValue) {
      const result = data.filter(
        (e) =>
          e?.clientName?.toLowerCase().includes(lowercasedInput) ||
          e?.status?.toLowerCase().includes(lowercasedInput) ||
          e?.portalType?.toLowerCase().includes(lowercasedInput) ||
          e?.profileName?.toLowerCase().includes(lowercasedInput) ||
          e?.RegisterBy?.toLowerCase().includes(lowercasedInput) ||
          e?.sendTo?.toLowerCase().includes(lowercasedInput)
      );
      setFilteredData(result);
    } else {
      setFilteredData(data);
    }
  };

  const getStatusRowClassName = (record: SalesInfoData) => {
    if (record.status === "Discussion") {
      return "yellow-row";
    } else if (record.status === "Hired") {
      return "green-row";
    } else if (record.status === "Closed") {
      return "red-row";
    } else if (record.status === "Pending") {
      return "pending-row";
    } else if (record.status === "May Work Again") {
      return "work-row";
    } else {
      return "";
    }
  };

  return (
    <div>
      <div>
        <div className="clientSheetTlTask">
          {EmployeId === "B2B00100" ? (
            <Table
              dataSource={allData.slice().reverse()}
              columns={columns}
              rowClassName={getStatusRowClassName}
              pagination={paginationSettings}
            />
          ) : (
            <Table
              dataSource={holderData.slice().reverse()}
              columns={columns}
              rowClassName={getStatusRowClassName}
              pagination={paginationSettings}
            />
          )}
          <Modal
            title="Are you sure?"
            visible={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
          >
            <p>This is your final Approve for remove data.</p>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ViewLead;
