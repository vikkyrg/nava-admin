import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, MessageSquare, Briefcase, FileText } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    enquiries: 0,
    jobOpenings: 0,
    applications: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [enqRes, jobsRes, appRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/enquiry`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/jobOpenings`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/career`)
        ]);
        
        setStats({
          enquiries: enqRes.data.length,
          jobOpenings: jobsRes.data.length,
          applications: appRes.data.length
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-black text-slate-800 mb-8 font-['Plus_Jakarta_Sans']">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1: Enquiries */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[60px] fill-white opacity-20 transform translate-y-2">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.42,126.11,196.2,118.84,239.5,114.07,281.34,70.93,321.39,56.44Z"></path>
            </svg>
          </div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-6 border border-white/10">
              <MessageSquare size={28} className="text-white" />
            </div>
            <h3 className="text-sm font-bold text-indigo-100 uppercase tracking-wider mb-1">Total Enquiries</h3>
            <p className="text-5xl font-black">{stats.enquiries}</p>
          </div>
        </div>
        
        {/* Card 2: Job Openings */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[60px] fill-white opacity-20 transform translate-y-2">
                <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
            </svg>
          </div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-6 border border-white/10">
              <Briefcase size={28} className="text-white" />
            </div>
            <h3 className="text-sm font-bold text-teal-100 uppercase tracking-wider mb-1">Job Openings</h3>
            <p className="text-5xl font-black">{stats.jobOpenings}</p>
          </div>
        </div>

        {/* Card 3: Applications */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[60px] fill-white opacity-20 transform translate-y-2">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.15,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
            </svg>
          </div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-6 border border-white/10">
              <FileText size={28} className="text-white" />
            </div>
            <h3 className="text-sm font-bold text-blue-100 uppercase tracking-wider mb-1">Job Applications</h3>
            <p className="text-5xl font-black">{stats.applications}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
