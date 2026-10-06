import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Briefcase, LogOut, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={closeSidebar}></div>
      )}
      
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff' }}>
          <img src="/logo.png" alt="Navadurga Logo" style={{ maxHeight: '60px', objectFit: 'contain' }} />
          <button className="mobile-close-btn" onClick={closeSidebar}>
            <X size={24} color="#000" />
          </button>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" onClick={closeSidebar} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/enquiries" onClick={closeSidebar} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <MessageSquare size={20} />
            <span>Enquiries</span>
          </NavLink>
          <NavLink to="/careers" onClick={closeSidebar} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Briefcase size={20} />
            <span>Job Openings</span>
          </NavLink>
          <NavLink to="/applications" onClick={closeSidebar} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
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
          <div className="topbar-left">
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <div className="text-sm font-medium text-gray-500 welcome-text">
              Welcome back, Admin
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="btn btn-danger"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
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
