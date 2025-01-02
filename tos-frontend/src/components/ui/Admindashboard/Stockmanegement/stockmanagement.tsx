'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AddStockForm } from '@/components/ui/Admindashboard/Stockmanegement/AddStockForm'
import { EditStockForm } from '@/components/ui/Admindashboard/Stockmanegement/EditStockForm'
import { useStockStore } from '@/Store/userStockStore'
import type { FoodItem } from '@/stockData'	

export function StockManagement() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  const { 
    items, 
    loading, 
    fetchStock, 
    addStock, 
    updateStock, 
    deleteStock, 
    selectedItem, 
    setSelectedItem 
  } = useStockStore()

  useEffect(() => {
    fetchStock()
  }, [fetchStock])

  const handleEdit = (item: FoodItem) => {
    setSelectedItem(item)
    setIsEditFormOpen(true)
  }

  const handleAdd = async (data: Omit<FoodItem, 'id'>) => {
    await addStock(data)
  }

  const handleUpdate = async (data: Omit<FoodItem, 'id'>) => {
    if (selectedItem) {
      await updateStock(selectedItem.id, data)
      setSelectedItem(null)
    }
  }

  const filteredItems = items.filter((item) => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.brand.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredItems.slice(startIndex, endIndex)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Stock Management</h1>
        <Button onClick={() => setIsAddFormOpen(true)} className='bg-[#EF4444] text-white'>
          <Plus className="w-4 h-4 mr-2" />
          Add Stock
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search by name or brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No items found</TableCell>
              </TableRow>
            ) : (
              currentItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.brand}</TableCell>
                  <TableCell>{item.quantity} {item.unit}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteStock(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {filteredItems.length} row(s) selected
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      <AddStockForm
        open={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onSubmit={handleAdd}
      />

      <EditStockForm
        open={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onSubmit={handleUpdate}
        editItem={selectedItem}
      />
    </div>
  )
}

