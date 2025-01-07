import OrdersTable from './OrderTable'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react';
import { IOrder } from '@/types/types';
import api from '@/utils/axios';
import { Pagination } from './pagination-order';

export default function OrderHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [orders, setOrders] = useState<IOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await api.get('/orders/all') // Replace with your actual API endpoint
        const data = response.data.data
        setOrders(data)
      } catch (err) {
        setError('An error occurred while fetching orders')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [orders])
  console.log(orders)
  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const page_buffer = 5
  const totalPages = Math.ceil(filteredOrders.length / page_buffer)
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * page_buffer,
    currentPage * page_buffer
  )

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }
  return (
    <div className=" py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by customer name or order ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      <OrdersTable orders={paginatedOrders} />
      <div className="mt-4 flex  justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

