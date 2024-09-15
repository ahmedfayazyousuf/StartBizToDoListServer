// admin/dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [tasksCount, setTasksCount] = useState({
    total: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
  });

  useEffect(() => {
    console.log("HELLO I AM IN USEEFFECT");
    const fetchTaskStats = async () => {
      try {
        const { data } = await axios.get('/admin/tasks/stats');
        setTasksCount(data);
      } catch (error) {
        console.error('Error fetching task stats:', error);
      }
    };

    fetchTaskStats();
  }, []);

  return (
    <div>
      <h1>Task Dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <div style={{ flex: 1, padding: '10px', backgroundColor: '#4CAF50', color: 'white', marginRight: '10px' }}>
          <h3>Total Tasks</h3>
          <p>{tasksCount.total}</p>
        </div>
        <div style={{ flex: 1, padding: '10px', backgroundColor: '#2196F3', color: 'white', marginRight: '10px' }}>
          <h3>Accepted Tasks</h3>
          <p>{tasksCount.accepted}</p>
        </div>
        <div style={{ flex: 1, padding: '10px', backgroundColor: '#f44336', color: 'white', marginRight: '10px' }}>
          <h3>Rejected Tasks</h3>
          <p>{tasksCount.rejected}</p>
        </div>
        <div style={{ flex: 1, padding: '10px', backgroundColor: '#FFC107', color: 'white' }}>
          <h3>Pending Tasks</h3>
          <p>{tasksCount.pending}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
