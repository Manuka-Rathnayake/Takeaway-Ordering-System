import React, { useEffect } from "react";
import MenuCardWithPopup from "@/components/ui/Admindashboard/Menumanagement/menucard";
import AddMenuForm from "@/components/ui/Admindashboard/Menumanagement/addmenu";
import { useMenuStore } from "@/Store/useMenuStore";

const Menu = () => {
  const { menuItems, fetchMenuItems, addMenuItem } = useMenuStore();

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const handleAddMenuItem = (newItem: any) => {
    addMenuItem(newItem);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <AddMenuForm onSubmit={handleAddMenuItem} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <MenuCardWithPopup
            key={item.id}
            id={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
            ingredients={item.ingredients}
          />
        ))}
      </div>
    </div>
  );
};

export default Menu;