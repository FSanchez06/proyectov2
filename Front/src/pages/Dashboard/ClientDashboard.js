import React from 'react';
import Dashboard from '../../components/Dashboard/Dashboard';
import Navbar from '../../components/Dashboard/Navbar';
import Sidebar from '../../components/Dashboard/Sidebar';

const ClientDashboard = () => {
  return (
    <div className='flex'>
      <Sidebar />
      <div className='grow ml-16 md:ml-64 h-full lg:h-screen bg-white text-gray-900'>
        <Navbar />
        <div>
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default ClientDashboard;