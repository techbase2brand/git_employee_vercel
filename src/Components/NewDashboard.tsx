import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Task {
  MrngTaskID?: number;
  EvngTaskID?: number;
  projectName: string;
  phaseName: string;
  module: string;
  task: string;
  estTime: string;
  actTime?: string | null;
  upWorkHrs: string;
  employeeID: string;
  currDate: string;
  selectDate?: string;
  approvedBy?: string | null;
  status?: string | null;
}

const NewDashboard = () => {
  const [morningData, setMorningData] = useState<Task[]>([]);
  const [eveningData, setEveningData] = useState<Task[]>([]);
  const [filteredData, setFilteredData] = useState<Task[]>([]);

  useEffect(() => {
    const fetchMorningData = async () => {
      try {
        const response = await axios.get<Task[]>(`${process.env.REACT_APP_API_BASE_URL}/get/addTaskMorning`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('myToken')}`,
          },
        });
        setMorningData(response.data);
      } catch (error) {
        console.error('Error fetching morning data:', error);
      }
    };

    const fetchEveningData = async () => {
      try {
        const response = await axios.get<Task[]>(`${process.env.REACT_APP_API_BASE_URL}/get/addTaskEvening`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('myToken')}`,
          },
        });
        setEveningData(response.data);
      } catch (error) {
        console.error('Error fetching evening data:', error);
      }
    };

    fetchMorningData();
    fetchEveningData();
  }, []);

  useEffect(() => {
    const todayDate = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
    const filteredMorning = morningData.filter(
      (task) => task.currDate === todayDate && task.employeeID === 'B2B00025' // Replace with dynamic employeeID if needed
    );
    const filteredEvening = eveningData.filter(
      (task) => task.currDate === todayDate && task.employeeID === 'B2B00025'
    );

    setFilteredData([...filteredMorning, ...filteredEvening]);
  }, [morningData, eveningData]);

  return (
    <div className="emp-main-div">
      <div style={{ display: 'flex', flexDirection: 'column' }} className="form-container">
        <p className="mrng-tas">New Dashboard</p>
        <table>
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Phase</th>
              <th>Module</th>
              <th>Task</th>
              <th>Est. Time</th>
              <th>Actual Time</th>
              <th>UpWork Hours</th>
              <th>Status</th>
              <th>Date</th>
              <th>Task Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((task) => (
              <tr key={task.MrngTaskID || task.EvngTaskID}>
                <td>{task.projectName}</td>
                <td>{task.phaseName}</td>
                <td>{task.module}</td>
                <td>{task.task}</td>
                <td>{task.estTime}</td>
                <td>{task.actTime || 'N/A'}</td>
                <td>{task.upWorkHrs}</td>
                <td>{task.status || 'Pending'}</td>
                <td>{task.currDate}</td>
                <td>{task.MrngTaskID ? 'Morning' : 'Evening'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewDashboard;
