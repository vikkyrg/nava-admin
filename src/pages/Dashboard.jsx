import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, MessageSquare, Briefcase } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    enquiries: 0,
    careers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [enqRes, carRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/enquiry`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/career`)
        ]);
        
        setStats({
          enquiries: enqRes.data.length,
          careers: carRes.data.length
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="page-title">Dashboard Overview</h1>
      
      <div className="grid-3">
        <div className="card stat-card">
          <div className="stat-icon">
            <MessageSquare size={24} />
          </div>
          <div className="stat-details">
            <h3>Total Enquiries</h3>
            <p>{stats.enquiries}</p>
          </div>
        </div>
        
        <div className="card stat-card">
          <div className="stat-icon">
            <Briefcase size={24} />
          </div>
          <div className="stat-details">
            <h3>Career Applications</h3>
            <p>{stats.careers}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
