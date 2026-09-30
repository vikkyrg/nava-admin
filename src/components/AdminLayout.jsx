import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Briefcase, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header" style={{ padding: '1rem', display: 'flex', justifyContent: 'center', backgroundColor: '#ffffff' }}>
          <img src="/logo.png" alt="Navadurga Logo" style={{ maxHeight: '60px', objectFit: 'contain' }} />
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/enquiries" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <MessageSquare size={20} />
            <span>Enquiries</span>
          </NavLink>
          <NavLink to="/careers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Briefcase size={20} />
            <span>Job Openings</span>
          </NavLink>
          <NavLink to="/applications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <MessageSquare size={20} />
            <span>Applications</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer p-4">
          <button 
            onClick={handleLogout}
            className="nav-item w-full bg-transparent border-none text-left" 
            style={{ cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem', color: '#ef4444' }}
          >
            <LogOut size={20} />
            <span style={{ fontWeight: 600 }}>Logout</span>
          </button>
        </div>
      </aside>
      
      <main className="main-content">
        <header className="topbar">
          <div className="text-sm font-medium text-gray-500">
            Welcome back, Admin
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#4F46E5', color: 'white' }}>
              A
            </div>
          </div>
        </header>
        
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
