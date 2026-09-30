import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Eye, X, Trash2, Mail, Phone } from 'lucide-react';

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Search
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  
  // Drawer / View Mode
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchEnquiries = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/enquiry`);
      setEnquiries(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdate = async (id, updateData) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/enquiry/${id}`, updateData);
      const updated = res.data;
      setEnquiries(enquiries.map(e => e._id === id ? updated : e));
      if (selectedEnquiry && selectedEnquiry._id === id) {
        setSelectedEnquiry(updated);
      }
    } catch (error) {
      console.error("Error updating enquiry:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this enquiry?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/enquiry/${id}`);
        setEnquiries(enquiries.filter(e => e._id !== id));
        setIsDrawerOpen(false);
      } catch (error) {
        console.error("Error deleting enquiry:", error);
      }
    }
  };

  const openView = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsDrawerOpen(true);
  };

  const clearFilters = () => {
    setSearch('');
    setFilterStatus('');
    setFilterPriority('');
  };

  const filteredEnquiries = enquiries.filter(enq => {
    const s = search.toLowerCase();
    const matchSearch = (enq.name && enq.name.toLowerCase().includes(s)) ||
                        (enq.email && enq.email.toLowerCase().includes(s)) ||
                        (enq.phone && enq.phone.includes(s));
    
    const matchStatus = filterStatus ? enq.status === filterStatus : true;
    const matchPriority = filterPriority ? enq.priority === filterPriority : true;

    return matchSearch && matchStatus && matchPriority;
  });

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Loading enquiries...</div>;

  return (
    <div className="enquiry-crm-container">
      <h1 className="page-title text-2xl font-bold mb-4">Customer Enquiries</h1>
        
      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search name, email or phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select className="filter-select" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button className="btn-action" onClick={clearFilters}>
          <Filter size={16} /> Clear
        </button>
      </div>

      {/* Responsive Table */}
      <div className="crm-table-container">
        {filteredEnquiries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No enquiries found.</div>
        ) : (
          <table className="crm-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Service</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.map(enq => (
                <tr key={enq._id}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {new Date(enq.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td><strong>{enq.name}</strong></td>
                  <td>
                    <a href={`mailto:${enq.email}`} className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>{enq.email}</a>
                    <div style={{ color: 'var(--text-muted)' }}>{enq.phone}</div>
                  </td>
                  <td>{enq.subject || '-'}</td>
                  <td>
                    <span className={`badge badge-priority-${enq.priority || 'Medium'}`}>
                      {enq.priority || 'Medium'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-status-${(enq.status || 'New').replace(' ', '-')}`}>
                      {enq.status || 'New'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                       <button className="btn-action btn-primary" onClick={() => openView(enq)}>
                         <Eye size={14} /> View
                       </button>
                       <button className="btn-action text-red-600 hover:bg-red-50" onClick={() => handleDelete(enq._id)}>
                         <Trash2 size={14} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Drawer (Right Side Modal) */}
      {isDrawerOpen && selectedEnquiry && (
        <div className="modal-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="modal-drawer" onClick={e => e.stopPropagation()}>
            
            <div className="modal-header">
              <h2 className="text-xl font-bold m-0">Enquiry Details</h2>
              <button className="btn-action" onClick={() => setIsDrawerOpen(false)}><X size={20} /></button>
            </div>
            
            <div className="modal-body flex flex-col gap-6">
              
              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                 <div className="text-xs text-gray-400 font-bold mb-2">ENQ-{new Date(selectedEnquiry.createdAt).getFullYear()}-{selectedEnquiry._id.slice(-4).toUpperCase()}</div>
                 <div className="text-lg font-bold text-gray-900 mb-1">{selectedEnquiry.name}</div>
                 <div className="text-sm font-semibold text-gray-600 mb-4">{selectedEnquiry.subject || '-'}</div>
                 <div className="flex flex-wrap gap-2 text-xs font-bold uppercase">
                    <span className={`badge badge-status-${(selectedEnquiry.status || 'New').replace(' ', '-')}`}>{selectedEnquiry.status || 'New'}</span>
                    <span className={`badge badge-priority-${selectedEnquiry.priority || 'Medium'}`}>{selectedEnquiry.priority || 'Medium'}</span>
                    <span className="badge bg-gray-200 text-gray-700">Source: {selectedEnquiry.source || 'Website'}</span>
                 </div>
              </div>

              {/* Management */}
              <div className="detail-section">
                <div className="detail-section-title">Management</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Status</label>
                    <select 
                      className="form-input" 
                      value={selectedEnquiry.status || 'New'}
                      onChange={(e) => handleUpdate(selectedEnquiry._id, { status: e.target.value })}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Priority</label>
                    <select 
                      className="form-input" 
                      value={selectedEnquiry.priority || 'Medium'}
                      onChange={(e) => handleUpdate(selectedEnquiry._id, { priority: e.target.value })}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Follow Up */}
              <div className="detail-section">
                <div className="detail-section-title">Follow-up</div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Follow-up Date</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={selectedEnquiry.followUpDate || ''}
                      onChange={(e) => handleUpdate(selectedEnquiry._id, { followUpDate: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Note</label>
                    <textarea 
                      className="form-input" 
                      rows="2"
                      placeholder="Call customer regarding enquiry..."
                      value={selectedEnquiry.followUpNote || ''}
                      onChange={(e) => handleUpdate(selectedEnquiry._id, { followUpNote: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="detail-section">
                <div className="detail-section-title">Customer Details</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Full Name</label>
                    <div className="text-sm font-semibold text-gray-900">{selectedEnquiry.name}</div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Phone Number</label>
                    <div className="text-sm font-semibold text-gray-900">{selectedEnquiry.phone}</div>
                  </div>
                  <div className="flex flex-col sm:col-span-2">
                    <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Email Address</label>
                    <div className="text-sm font-semibold text-gray-900">{selectedEnquiry.email}</div>
                  </div>
                  <div className="flex flex-col sm:col-span-2">
                    <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Service Required</label>
                    <div className="text-sm font-semibold text-gray-900">{selectedEnquiry.subject || '-'}</div>
                  </div>
                  <div className="flex flex-col sm:col-span-2">
                    <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Message / Project Details</label>
                    <div className="text-sm font-semibold text-gray-900 whitespace-pre-wrap">{selectedEnquiry.message}</div>
                  </div>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="detail-section">
                <div className="detail-section-title">Internal Note</div>
                <div className="flex flex-col gap-2">
                  <textarea 
                    className="form-input" 
                    rows="3" 
                    placeholder="Customer requested more information about the service..." 
                    value={selectedEnquiry.internalNote || ''}
                    onChange={(e) => handleUpdate(selectedEnquiry._id, { internalNote: e.target.value })}
                  />
                  <div className="text-xs text-gray-500 italic">This note is automatically saved and is not visible to the customer.</div>
                </div>
              </div>

            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50 flex flex-wrap gap-2 justify-between">
                <div className="flex gap-2">
                   {selectedEnquiry.phone && (
                     <>
                       <a href={`tel:${selectedEnquiry.phone}`} className="btn-action bg-white border border-gray-300 shadow-sm"><Phone size={14}/> Call</a>
                       <a href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="btn-action bg-white border border-gray-300 shadow-sm" style={{ color: '#16a34a' }}>WhatsApp</a>
                     </>
                   )}
                   {selectedEnquiry.email && (
                     <a href={`mailto:${selectedEnquiry.email}`} className="btn-action bg-white border border-gray-300 shadow-sm"><Mail size={14}/> Email</a>
                   )}
                </div>
                <div className="flex gap-2">
                   <button className="btn-action bg-white border border-gray-300 shadow-sm" onClick={() => { handleUpdate(selectedEnquiry._id, { status: 'Closed' }); setIsDrawerOpen(false); }}>Close Enquiry</button>
                   <button className="btn-action bg-red-50 text-red-600 border border-red-200" onClick={() => handleDelete(selectedEnquiry._id)}>Delete</button>
                </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiries;
