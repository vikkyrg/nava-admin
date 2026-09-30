import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, PlusCircle, MinusCircle } from 'lucide-react';

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    jobRole: '',
    experience: '',
    location: '',
    employmentType: 'Full-time',
    jobDescription: '',
    responsibilities: [''],
    requirements: [''],
    salary: '',
    industry: '',
    additionalInformation: '',
    status: 'Active'
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobOpenings/admin`);
      setJobs(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Unable to load job openings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleOpenModal = (job = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        jobRole: job.jobRole || '',
        experience: job.experience || '',
        location: job.location || '',
        employmentType: job.employmentType || 'Full-time',
        jobDescription: job.jobDescription || '',
        responsibilities: job.responsibilities && job.responsibilities.length > 0 ? job.responsibilities : [''],
        requirements: job.requirements && job.requirements.length > 0 ? job.requirements : [''],
        salary: job.salary || '',
        industry: job.industry || '',
        additionalInformation: job.additionalInformation || '',
        status: job.status || 'Active'
      });
    } else {
      setEditingJob(null);
      setFormData({
        jobRole: '',
        experience: '',
        location: '',
        employmentType: 'Full-time',
        jobDescription: '',
        responsibilities: [''],
        requirements: [''],
        salary: '',
        industry: '',
        additionalInformation: '',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (e, index, field) => {
    const newArray = [...formData[field]];
    newArray[index] = e.target.value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (index, field) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Clean up empty array items before saving
    const cleanedData = {
      ...formData,
      responsibilities: formData.responsibilities.filter(item => item.trim() !== ''),
      requirements: formData.requirements.filter(item => item.trim() !== '')
    };

    try {
      if (editingJob) {
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/jobOpenings/${editingJob._id}`, cleanedData);
        setJobs(jobs.map(j => (j._id === editingJob._id ? res.data : j)));
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/jobOpenings`, cleanedData);
        // Latest created job goes to the bottom (queue format)
        setJobs([...jobs, res.data]);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error saving job opening:", err);
      alert(err.response?.data?.message || "Failed to save job opening.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job opening?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/jobOpenings/${id}`);
        setJobs(jobs.filter(j => j._id !== id));
      } catch (err) {
        console.error("Error deleting job:", err);
      }
    }
  };

  const toggleStatus = async (job) => {
    const newStatus = job.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/jobOpenings/${job._id}`, { status: newStatus });
      setJobs(jobs.map(j => (j._id === job._id ? res.data : j)));
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 font-medium">Loading job openings...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 m-0">Career Openings</h1>
        <button className="btn-primary flex items-center gap-2" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Job Opening
        </button>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {jobs.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <p className="text-gray-500 font-medium mb-4">No job openings added yet.</p>
              <button className="btn-action bg-gray-50 border border-gray-300 shadow-sm flex items-center gap-2" onClick={() => handleOpenModal()}>
                <Plus size={16} /> Add Job Opening
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Job Role</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Experience</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Created Date</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm font-bold text-gray-900">{job.jobRole}</td>
                      <td className="p-4 text-sm text-gray-600">{job.experience}</td>
                      <td className="p-4 text-sm text-gray-600">{job.location}</td>
                      <td className="p-4 text-sm text-gray-600">{job.employmentType}</td>
                      <td className="p-4">
                        <button 
                          onClick={() => toggleStatus(job)}
                          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors ${
                            job.status === 'Active' 
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${job.status === 'Active' ? 'bg-emerald-600' : 'bg-gray-400'}`}></span>
                          {job.status}
                        </button>
                      </td>
                      <td className="p-4 text-sm text-gray-500 text-right">
                        {new Date(job.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-4 flex gap-2 justify-end">
                        <button className="btn-action hover:bg-gray-100" onClick={() => handleOpenModal(job)}>
                          <Edit2 size={14} className="text-gray-600" /> Edit
                        </button>
                        <button className="btn-action text-red-600 hover:bg-red-50" onClick={() => handleDelete(job._id)}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900 m-0">
                {editingJob ? 'Edit Job Opening' : 'Add Job Opening'}
              </h2>
              <button className="text-gray-400 hover:text-gray-600 transition-colors" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form id="jobForm" onSubmit={handleSave} className="flex flex-col gap-8">
                
                {/* SECTION 1: BASIC INFO */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase border-b border-gray-200 pb-2 mb-4">Job Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Job Role *</label>
                      <input 
                        type="text" name="jobRole" required
                        placeholder="e.g. Senior Electrical Engineer"
                        className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        value={formData.jobRole} onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Experience *</label>
                      <input 
                        type="text" name="experience" required
                        placeholder="e.g. 5 - 7 Years"
                        className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        value={formData.experience} onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location *</label>
                      <input 
                        type="text" name="location" required
                        placeholder="e.g. Bangalore"
                        className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        value={formData.location} onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Employment Type *</label>
                      <select 
                        name="employmentType" required
                        className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                        value={formData.employmentType} onChange={handleInputChange}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: JOB DESCRIPTION */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase border-b border-gray-200 pb-2 mb-4">Job Description</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description *</label>
                    <textarea 
                      name="jobDescription" required rows="4"
                      placeholder="Detailed description of the position..."
                      className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      value={formData.jobDescription} onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>

                {/* SECTION 3: RESPONSIBILITIES */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase border-b border-gray-200 pb-2 mb-4">Responsibilities</h3>
                  <div className="flex flex-col gap-3">
                    {formData.responsibilities.map((req, idx) => (
                      <div key={`resp-${idx}`} className="flex gap-2 items-center">
                        <input
                          type="text" required={idx === 0}
                          placeholder="e.g. Plan and supervise electrical projects."
                          className="flex-1 text-sm p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          value={req} onChange={(e) => handleArrayChange(e, idx, 'responsibilities')}
                        />
                        {formData.responsibilities.length > 1 && (
                          <button type="button" onClick={() => removeArrayItem(idx, 'responsibilities')} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                            <MinusCircle size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem('responsibilities')} className="text-blue-600 font-bold text-sm flex items-center gap-1.5 hover:text-blue-700 w-max mt-1">
                      <PlusCircle size={16} /> Add Responsibility
                    </button>
                  </div>
                </div>

                {/* SECTION 4: REQUIREMENTS */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase border-b border-gray-200 pb-2 mb-4">Requirements</h3>
                  <div className="flex flex-col gap-3">
                    {formData.requirements.map((req, idx) => (
                      <div key={`req-${idx}`} className="flex gap-2 items-center">
                        <input
                          type="text" required={idx === 0}
                          placeholder="e.g. Bachelor's degree in Electrical Engineering."
                          className="flex-1 text-sm p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          value={req} onChange={(e) => handleArrayChange(e, idx, 'requirements')}
                        />
                        {formData.requirements.length > 1 && (
                          <button type="button" onClick={() => removeArrayItem(idx, 'requirements')} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                            <MinusCircle size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem('requirements')} className="text-blue-600 font-bold text-sm flex items-center gap-1.5 hover:text-blue-700 w-max mt-1">
                      <PlusCircle size={16} /> Add Requirement
                    </button>
                  </div>
                </div>

                {/* SECTION 5: ADDITIONAL INFO */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase border-b border-gray-200 pb-2 mb-4">Additional Information (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Salary</label>
                      <input 
                        type="text" name="salary"
                        placeholder="e.g. ₹25,000 - ₹40,000"
                        className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        value={formData.salary} onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Industry / Department</label>
                      <input 
                        type="text" name="industry"
                        placeholder="e.g. Electrical Engineering"
                        className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        value={formData.industry} onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Additional Text / Perks</label>
                    <textarea 
                      name="additionalInformation" rows="2"
                      placeholder="Optional text..."
                      className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      value={formData.additionalInformation} onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>

                {/* SECTION 6: STATUS */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase border-b border-gray-200 pb-2 mb-4">Status</h3>
                  <div className="w-full md:w-1/3">
                    <select 
                      name="status"
                      className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                      value={formData.status} onChange={handleInputChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button type="button" className="btn-action bg-white border border-gray-300" onClick={handleCloseModal}>
                Cancel
              </button>
              <button type="submit" form="jobForm" className="btn-primary px-5 py-2.5 rounded-lg font-bold text-sm shadow-sm">
                {editingJob ? 'Save Changes' : 'Add Job Opening'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
