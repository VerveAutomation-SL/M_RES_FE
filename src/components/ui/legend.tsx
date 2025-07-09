import React from "react";
import Card from "./card";

const Modal = () => {
  return (
    <Card classname="bg-white">
      <div className="flex flex-wrap items-center justify-between px-6">
        <div className="flex items-center gap-20">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm">Available for check-in</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm">Already checked-in today</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 text-right">Click on a room to check-in or view details</div>
      </div>
    </Card>
    
  )
};

export default Modal;
