import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import useStockStore from '@/Store/userStockStore';
import AddStockForm from './AddStockForm';
import EditStockForm from '@/components/ui/Admindashboard/Stockmanegement/EditStockForm';
import { DataTable } from '@/components/ui/datatable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from 'lucide-react';

const StockManagement: React.FC = () => {
  const { items, deleteItem } = useStockStore();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingItemId(id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(id);
    }
  };

  const columns = [
    {
      accessorKey: "id",
      header: "Item ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const status = row.getValue("status") as string;
        return (
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              status === 'In Stock'
                ? 'bg-green-100 text-green-800'
                : status === 'Low Stock'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {status}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => {
        const item = row.original;
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(item.id)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Stock Management</h1>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => setIsAddFormOpen(true)}>
          Add Stock
        </Button>
      </div>
      <DataTable columns={columns} data={items} />

      <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Stock Item</DialogTitle>
          </DialogHeader>
          <AddStockForm onClose={() => setIsAddFormOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingItemId} onOpenChange={() => setEditingItemId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Stock Item</DialogTitle>
          </DialogHeader>
          {editingItemId && (
            <EditStockForm
              itemId={editingItemId}
              onClose={() => setEditingItemId(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockManagement;

