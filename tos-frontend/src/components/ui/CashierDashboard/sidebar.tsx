import NavSidebarLayout from '@/components/default/sidebarTemplate';
import { Package2, PackageCheck, PackagePlus, PackageSearch, PackageX } from 'lucide-react';

function CashierSidebar() {
  // Custom navigation items
  const myNavItems = [
    {
      name: 'Add Order',
      path: '/cashier',
      icon: PackagePlus
    },
    {
      name: 'Pending Orders',
      path: '/cashier/pendingorders',
      icon: PackageSearch
    },
    {
      name: 'Processing Orders',
      path: '/cashier/processingorders',
      icon: Package2
    },
    {
      name: 'Complete Orders',
      path: '/cashier/completeorders',
      icon: PackageCheck
    },
    {
      name: 'Cancel Orders',
      path: '/cashier/cancelorders',
      icon: PackageX
    },
    {
      name: 'Orders History',
      path: '/cashier/orderhistory',
      icon: PackageX
    },
  ];

  // Custom sidebar footer
  const sidebarFooter = (
    <div className="bg-blue-50 rounded-lg p-4">
      <p></p>
    </div>
  );

  return (

    <div>

      <NavSidebarLayout
        logoContent={<img src='/Logo.png' alt="logo" className="w-full h-full object-contain" />}
        navigationItems={myNavItems}
        sidebarFooter={sidebarFooter}
        onSearchChange={(term) => console.log('Search term:', term)}
        notificationsEndpoint="/my-custom-notifications-api"
      />
    </div>
  )
}

export default CashierSidebar;
