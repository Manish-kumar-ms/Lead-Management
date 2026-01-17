import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";



export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const { serverUrl } = useContext(UserDataContext);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${serverUrl}/api/leads/${id}`, {
          withCredentials: true
        });
        setLead(response.data.data);
      } catch (error) {
        console.error("Error fetching lead details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-800 border-blue-200',
      'Contacted': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Qualified': 'bg-purple-100 text-purple-800 border-purple-200',
      'Converted': 'bg-green-100 text-green-800 border-green-200',
      'Lost': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getSourceColor = (source) => {
    const colors = {
      'Website': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Facebook': 'bg-blue-100 text-blue-800 border-blue-200',
      'Referral': 'bg-green-100 text-green-800 border-green-200',
      'LinkedIn': 'bg-sky-100 text-sky-800 border-sky-200',
      'Other': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[source] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Lead Not Found</h3>
          <p className="text-gray-500 mb-4">The lead you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/leads')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className=" cusro-pointer flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Leads
            </button>
          
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Lead Info - Takes 2 columns on desktop */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Lead Profile Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32"></div>
              <div className="px-6 pb-6">
                <div className="flex items-end -mt-12 mb-4">
                  <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {lead.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
                    <p className="text-gray-600">{lead.company || 'No Company'}</p>
                  </div>
                </div>

                {/* Status and Source Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getSourceColor(lead.source)}`}>
                    {lead.source}
                  </span>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Email</span>
                    </div>
                    <a href={`mailto:${lead.email}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                      {lead.email}
                    </a>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Phone</span>
                    </div>
                    <a href={`tel:${lead.phone}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                      {lead.phone || 'No Phone'}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline/Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-1.5 mr-4"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Lead Created</p>
                    <p className="text-sm text-gray-500">New lead added to the system</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(lead.createdAt).toLocaleDateString()} at {new Date(lead.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                {lead.status !== 'New' && (
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-yellow-600 rounded-full mt-1.5 mr-4"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Status Updated</p>
                      <p className="text-sm text-gray-500">Lead status changed to {lead.status}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(lead.updatedAt).toLocaleDateString()} at {new Date(lead.updatedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Takes 1 column on desktop */}
          <div className="space-y-6">
                       
            {/* Lead Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Lead Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Lead ID</dt>
                  <dd className="text-sm text-gray-900 font-mono">{lead._id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created Date</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(lead.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(lead.updatedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
