'use client'

import { useState } from 'react'
import { Bell, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from '../ui/scroll-area'
import { useAppStore } from '@/state'

// type Notification = {
//   id: number
//   title: string
//   message: string
//   time: string
// }
//
// const mockNotifications: Notification[] = [
//   { id: 1, title: "New Message", message: "You have a new message from John Doe", time: "2 minutes ago" },
//   { id: 2, title: "Meeting Reminder", message: "Team meeting starts in 15 minutes", time: "15 minutes ago" },
//   { id: 3, title: "Task Completed", message: "Project X has been marked as complete", time: "1 hour ago" },
//   { id: 4, title: "New Comment", message: "Sarah commented on your recent post", time: "2 hours ago" },
//   { id: 5, title: "New Message", message: "You have a new message from John Doe", time: "2 minutes ago" },
//   { id: 6, title: "Meeting Reminder", message: "Team meeting starts in 15 minutes", time: "15 minutes ago" },
//   { id: 7, title: "Task Completed", message: "Project X has been marked as complete", time: "1 hour ago" },
//   { id: 8, title: "New Comment", message: "Sarah commented on your recent post", time: "2 hours ago" },
// ]

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  // const [notifications, setNotifications] = useState(mockNotifications)
  const { notification, clearNotification, removeNotification } = useAppStore()
  console.log(notification)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {notification.length > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4" align="end">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <Button variant="ghost" size="sm" onClick={clearNotification}>
            Clear all
          </Button>
        </div>
        <ScrollArea className='h-1/6' >
          <div className='h-1/4' >
            {notification.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No new notifications</p>
            ) : (
              <ul className="space-y-4">
                {notification.map((notification, idx) => (
                  <li key={idx} className="flex items-start space-x-4">
                    <div className="flex-grow">
                      <h3 className="text-sm font-medium">{notification.topic}</h3>
                      <p className="text-sm text-gray-500">{notification.msg}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Dismiss notification</span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

