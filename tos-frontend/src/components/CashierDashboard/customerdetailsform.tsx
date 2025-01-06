import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCashierStore from '@/Store/cashierStore';

const CustomerDetailsForm: React.FC = () => {
  const { customerDetails, setCustomerDetails } = useCashierStore();

  const handleCustomerDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Customer Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerNumber" className="flex items-center gap-1">
              Customer Number
              <span className="text-[#EF4444]">*</span>
            </Label>
            <Input
              id="customerNumber"
              name="customerNumber"
              value={customerDetails.customerNumber}
              onChange={handleCustomerDetailsChange}
              placeholder="Enter customer number"
              required
            />
          </div>
          <div>
            <Label htmlFor="customerName" className="flex items-center gap-1">
              Customer Name
              <span className="text-[#EF4444]">*</span>
            </Label>
            <Input
              id="customerName"
              name="customerName"
              value={customerDetails.customerName}
              onChange={handleCustomerDetailsChange}
              placeholder="Enter customer name"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerDetailsForm;

