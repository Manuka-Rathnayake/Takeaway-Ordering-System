'use client'

import React, { useState } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { StatusBadge } from './status-badge'
import OrderDetails from './order-details'
import { useOrderStore } from '@/Store/useOrderhistory'

export default function OrderHistory() {
  const { orders, statusFilter, searchQuery, setStatusFilter, setSearchQuery } = useOrderStore()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const ordersPerPage = 8

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesSearch = !searchQuery || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Order history</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Order status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by Order ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">ORDER ID</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">DATE</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">CUSTOMER NAME</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">STATUS</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500">TOTAL</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="px-6 py-4 text-sm">{order.id}</td>
                <td className="px-6 py-4 text-sm">
                  {format(new Date(order.createdAt), 'MMM d, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 text-sm">{order.customerName}</td>
                <td className="px-6 py-4 text-sm">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 text-sm">
                  ${order.totalPrice.toFixed(2)} ({order.menuItems.length} Products)
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-[#EF4444] hover:text-red-700 font-medium text-sm"
                  >
                    View Details →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-2 mt-4">
        <div className="text-sm text-gray-500">
          {indexOfFirstOrder + 1} of {filteredOrders.length} row(s) selected
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredOrders.length / ordersPerPage)))}
            disabled={indexOfLastOrder >= filteredOrders.length}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  )
}

