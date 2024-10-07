import React from 'react';
import Navbar from '../../components/Dashboard/Navbar';
import Sidebar from '../../components/Dashboard/Sidebar';
import DashboardComponent from '../../components/Dashboard/DashboardComponent';

const Dashboard = () => {
  return (
    <div className='flex bg-gray-50'>
      <Sidebar />
      <div className='grow ml-16 md:ml-64 h-full lg:h-screen bg-white text-gray-900 shadow-lg'>
        <Navbar />
        <div className='p-4'>
          <DashboardComponent />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
