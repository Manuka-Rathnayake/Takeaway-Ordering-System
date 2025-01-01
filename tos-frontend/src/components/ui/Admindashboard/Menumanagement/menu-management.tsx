'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MenuItemCard } from '@/components/ui/Admindashboard/Menumanagement/menu-item-card'
import { MenuItemForm } from '@/components/ui/Admindashboard/Menumanagement/menu-item-form'
import { useMenuStore } from '@/Store/useMenuStore'
import { Plus } from 'lucide-react'

export default function MenuManagement() {
  const [showAddForm, setShowAddForm] = useState(false)
  const { menuItems, loading, error, fetchMenuItems } = useMenuStore()

  useEffect(() => {
    fetchMenuItems()
  }, [fetchMenuItems])

  if (loading) {
    return <div className="container mx-auto py-8">Loading...</div>
  }

  if (error) {
    return <div className="container mx-auto py-8">Error: {error}</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Menu Management</h1>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      {menuItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-xl text-gray-500">No menu items available.</p>
        </div>
      )}

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
          </DialogHeader>
          <MenuItemForm onSubmit={() => setShowAddForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

