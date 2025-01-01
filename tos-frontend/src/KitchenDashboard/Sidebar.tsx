import NavSidebarLayout from '@/components/default/sidebarTemplate';
import { Radio } from 'lucide-react';
import { FaHome } from 'react-icons/fa';

function KitchenSidebar() {
  // Custom navigation items
  const myNavItems = [
    {
      name: 'Dashboard',
      path: '/kitchen',
      icon: FaHome
    },
    {
      name: 'Live Board',
      path: '/kitchen/liveorderboard',
      icon: Radio
    }
  ];

  // Custom sidebar footer
  const sidebarFooter = (
    <div className="bg-blue-50 rounded-lg p-4">
      <p>Custom Footer Content</p>
    </div>
  );

  return (

    <div>

      <NavSidebarLayout
        navigationItems={myNavItems}
        sidebarFooter={sidebarFooter}
        onSearchChange={(term) => console.log('Search term:', term)}
        notificationsEndpoint="/my-custom-notifications-api"
      />
    </div>
  )
}

export default KitchenSidebar;
