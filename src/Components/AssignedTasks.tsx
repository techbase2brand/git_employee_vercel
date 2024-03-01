import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import AssignedTasksTable from "./AssignedTasksTable";
const AssignedTasks: React.FC = () => {
  return (
    <div className="emp-mrng">
      <div style={{ margin: '1px 25px' }}>
        <p className="add-heading" style={{ marginBottom: '2rem' }}>
          Assigned Task
        </p>
        <AssignedTasksTable />
      </div>
    </div>
  );
};

export default AssignedTasks;
