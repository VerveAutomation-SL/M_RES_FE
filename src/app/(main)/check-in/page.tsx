import Header from "@/components/layout/header";
import RoomGrid from "@/components/layout/roomGrid";
import Card from "@/components/ui/card";
import Modal from "@/components/ui/legend";
import { MapPin } from "lucide-react";



export default function CheckInPage() {
  return (
    <div className="space-y-6 ">
        <Header title="Dining Check-ins" subtitle="The Residence Maldives - Daily Dining Management" />

        <div className="flex flex-wrap gap-6 justify-between">
          {/* Resort*/}
            <Card classname="w-[48%] gap-6 bg-white">
                <div className="grid grid-cols-1 ">
                    <div className="flex items-center mb-4">
                        <MapPin className="w-5 h-5 text-gray-950 mr-2 mb-1" />
                        <h1 className="font-semibold text-gray-900 text-2xl">Diguraha Island</h1>
                    </div>
                    <p className="text-sm text-gray-600">Maldives</p>
                    <div className="mt-2 flex items-center justify-between pt-4">
                        <span className="text-sm text-green-600 bg-green-100 p-2 px-4 rounded-2xl">Available: 50 </span>
                        <span className="text-sm text-red-600 bg-red-100 p-2 px-4 rounded-2xl">Checked In: 0</span>
                        <span className="text-sm text-gray-600 bg-gray-100 p-2 px-4 rounded-2xl">Total Checkins: 50</span>
                    </div>
                </div>
            </Card>
            <Card classname="w-[48%] gap-6 bg-white">
                <div className="grid grid-cols-1">
                    <h3 className="font-semibold text-gray-900">LIBAI</h3>
                </div>
            </Card>
        </div>
        <Modal/>
        <RoomGrid mode="check-in"/>

      </div>
    );
}