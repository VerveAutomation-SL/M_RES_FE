'use client';

import ResortForm from "@/components/forms/resortForm";
import RoomForm from "@/components/forms/roomForm";
import React from "react";

const Page = () => {
  return (
    <>
      <div className="h-full bg-gray-200">
        {/* <div>Test Page</div> */}
        <RoomForm />
        <ResortForm isOpen={true} onClose={() => {}} />
      </div>
    </>
  );
};

export default Page;