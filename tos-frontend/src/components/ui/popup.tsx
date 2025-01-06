import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant?: 'success' | 'error' | 'default';
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, title, message, variant = 'default' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-green-500 text-green-700';
      case 'error':
        return ' border-red-500 text-red-700';
      default:
        return ' border-blue-500 text-blue-700';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${getVariantStyles()} p-4 rounded-lg shadow-lg`}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold mb-2">{title}</DialogTitle>
        </DialogHeader>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <Button onClick={onClose} className="bg-[#EF4444] hover:bg-[#DC2626] text-white">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Popup;

