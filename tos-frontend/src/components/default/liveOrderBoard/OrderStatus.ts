export const ORDER_STATUS = {
  NEW: 'new',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
} as const;

export const STATUS_COLORS = {
  [ORDER_STATUS.NEW]: 'bg-yellow-200',
  [ORDER_STATUS.PROCESSING]: 'bg-blue-200',
  [ORDER_STATUS.COMPLETED]: 'bg-green-200',
} as const;

