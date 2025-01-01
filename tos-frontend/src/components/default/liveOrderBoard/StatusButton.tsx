import { Button } from "@/components/ui/button"
import { ORDER_STATUS } from "./OrderStatus"

interface StatusButtonProps {
  currentStatus: keyof typeof ORDER_STATUS;
  onStatusChange: (newStatus: keyof typeof ORDER_STATUS) => void;
}

export const StatusButton: React.FC<StatusButtonProps> = ({ currentStatus, onStatusChange }) => {
  const getNextStatus = () => {
    switch (currentStatus) {
      case ORDER_STATUS.NEW:
        return ORDER_STATUS.PROCESSING;
      case ORDER_STATUS.PROCESSING:
        return ORDER_STATUS.COMPLETED;
      default:
        return ORDER_STATUS.NEW;
    }
  };

  return (
    <Button onClick={() => onStatusChange(getNextStatus())}>
      {currentStatus === ORDER_STATUS.COMPLETED ? 'Reset' : 'Next Status'}
    </Button>
  );
};

