import React from "react";
import Card from "./card";

const Modal = () => {
  return (
    <Card classname="bg-white">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-10">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm">Available for check-in</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm">Already checked-in today</span>
          </div>
        </div>
        <div className="text-sm text-gray-600 text-left sm:text-right mt-2 sm:mt-0">
          Click on a room to check-in or view details
        </div>
      </div>
    </Card>
  );
};

export default Modal;
