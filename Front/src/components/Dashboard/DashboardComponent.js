import React from 'react';
import { useSelector } from 'react-redux';
import Banners from './Sections/Banners';
import Customizations from './Sections/Customizations';
import Images from './Sections/Images';
import Messages from './Sections/Messages';
import Orders from './Sections/Orders';
import Products from './Sections/Products';
import Sells from './Sections/Sells';
import Users from './Sections/Users';

const DashboardComponent = () => {
  const userInfo = useSelector(state => state.orebiReducer.userInfo[0]);
  
  const renderSections = () => {
    if (!userInfo) return null;

    const { role } = userInfo;

    switch (role) {
      case 'Admin':
        return (
          <>
            <Banners />
            <Customizations />
            <Images />
            <Messages />
            <Orders />
            <Products />
            <Sells />
            <Users />
          </>
        );
      case 'Employee':
        return (
          <>
            <Banners />
            <Images />
            <Sells />
            <Products />
            <Orders />
            <Customizations />
          </>
        );
      case 'Customer':
        return (
          <>
            <Sells />
            <Messages />
            <Orders />
            <Customizations />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className='grow p-8'>
      <h2 className='text-2xl mb-4'>Bienvenido, {userInfo.name}!</h2>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {renderSections()}
      </div>
    </div>
  );
};

export default DashboardComponent;
