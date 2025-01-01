import { useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useDashboardStore } from '@/Store/useDashboardStore'

export default function Dashboard() {
  const {
    userName,
    totalOrders,
    activeOrders,
    totalUsers,
    totalRevenue,
    isLoading,
    error,
    fetchDashboardData,
    fetchUserName
  } = useDashboardStore()

  useEffect(() => {
    const initializeDashboard = async () => {
      await fetchUserName()
      await fetchDashboardData()
    }

    initializeDashboard()

    const intervalId = setInterval(() => {
      fetchDashboardData()
    }, 30000)

    return () => clearInterval(intervalId)
  }, [fetchDashboardData, fetchUserName])

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error loading dashboard: {error}
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-600">
        Hi, {isLoading ? '...' : userName || 'User'}. Welcome back!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <DashboardCard 
          title="Total Orders" 
          value={totalOrders} 
          icon="/Icon_Order.png" 
          isLoading={isLoading} 
        />
        <DashboardCard 
          title="Active Orders" 
          value={activeOrders} 
          icon="/icon Delivered.png" 
          isLoading={isLoading} 
        />
        <DashboardCard 
          title="Total Users" 
          value={totalUsers} 
          icon="/Group 210.png" 
          isLoading={isLoading} 
        />
        <DashboardCard 
          title="Total Revenue" 
          value={totalRevenue} 
          icon="/Group 148.png" 
          isLoading={isLoading} 
          prefix="Rs." 
        />
      </div>
    </div>
  )
}

interface DashboardCardProps {
  title: string
  value: number
  icon: string
  isLoading: boolean
  prefix?: string
}

function DashboardCard({ title, value, icon, isLoading, prefix = '' }: DashboardCardProps) {
  return (
    <Card className="shadow-lg rounded-lg p-4 bg-white">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src={icon} alt={title} className="w-full h-full object-contain" />
          </div>
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-gray-800">
          {isLoading ? (
            <span className="text-gray-400">Loading...</span>
          ) : (
            `${prefix}${value}`
          )}
        </p>
      </CardContent>
    </Card>
  )
}