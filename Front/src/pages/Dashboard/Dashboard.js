import React from 'react';
import Navbar from '../../components/Dashboard/Navbar';
import Sidebar from '../../components/Dashboard/Sidebar';
import DashboardComponent from '../../components/Dashboard/DashboardComponent';

const Dashboard = () => {
  return (
    <div className='flex'>
      <Sidebar />
      <div className='grow ml-16 md:ml-64 h-full lg:h-screen bg-white text-gray-900'>
        <Navbar />
        <div>
          <DashboardComponent />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;