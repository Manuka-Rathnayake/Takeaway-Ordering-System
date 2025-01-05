import NavSidebarLayout from '@/components/default/sidebarTemplate';
import { Boxes, Package2, PackageCheck, PackageSearch, PackageX } from 'lucide-react';

function KitchenSidebar() {
  // Custom navigation items
  const myNavItems = [
    {
      name: 'All Orders',
      path: '/kitchen',
      icon: Boxes
    },
    {
      name: 'Pending Orders',
      path: '/kitchen/pendingorders',
      icon: PackageSearch
    },
    {
      name: 'Processing Orders',
      path: '/kitchen/processingorders',
      icon: Package2
    },
    {
      name: 'Complete Orders',
      path: '/kitchen/completeorders',
      icon: PackageCheck
    },
    {
      name: 'Cancel Orders',
      path: '/kitchen/cancelorders',
      icon: PackageX
    },

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
