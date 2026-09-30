import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, FileText, Trash2 } from 'lucide-react';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/career`);
      setApplications(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Unable to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/career/${id}`);
        setApplications(applications.filter(a => a._id !== id));
      } catch (err) {
        console.error("Error deleting application:", err);
      }
    }
  };

  if (loading && applications.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 font-medium">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 m-0">Job Applications</h1>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {applications.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <p className="text-gray-500 font-medium mb-4">No applications received yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Candidate Name</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Applied For</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Experience</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Resume</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Date</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm font-bold text-gray-900">{app.fullName}</td>
                      <td className="p-4 text-sm font-semibold text-blue-600">
                        {app.jobRole || app.position || 'Unknown Job'}
                      </td>
                      <td className="p-4 text-sm text-gray-600">{app.experience || '-'}</td>
                      <td className="p-4 text-sm text-gray-600">
                        <div className="flex flex-col gap-0.5">
                          <a href={`mailto:${app.email}`} className="text-blue-600 hover:underline">{app.email}</a>
                          <span className="text-xs text-gray-500">{app.phone}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {app.resumeUrl ? (
                          <a 
                            href={app.resumeUrl.startsWith('http') ? app.resumeUrl : `${import.meta.env.VITE_API_URL}${app.resumeUrl}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-xs font-bold"
                          >
                            <FileText size={14} /> View Resume
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">No Resume</span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-gray-500 text-right">
                        {new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-4 flex gap-2 justify-end items-center h-full">
                        <button className="btn-action text-red-600 hover:bg-red-50 mt-1" onClick={() => handleDelete(app._id)}>
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
    </div>
  );
};

export default Applications;
