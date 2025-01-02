interface StatusBadgeProps {
    status: string
  }
  
  export function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case 'completed':
          return 'bg-green-100 text-green-800'
        case 'in progress':
          return 'bg-yellow-100 text-yellow-800'
        case 'pending':
          return 'bg-gray-100 text-gray-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
  
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
          status
        )}`}
      >
        {status}
      </span>
    )
  }
  
  