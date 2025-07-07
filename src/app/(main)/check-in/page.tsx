import Card from "@/components/ui/card";
import Modal from "@/components/ui/modal";

export default function CheckInPage() {
  return (
    <div className="space-y-6 ">
        <h1 className="text-2xl font-bold">Dining Check-Ins</h1>

        <div className="flex flex-wrap gap-6">
          {/* Resort*/}
        <Card classname="w-[48%]">
          <div className="grid grid-cols-1 gap-6">
            <h3 className="font-semibold text-gray-900">Diguraha Island</h3>
            <p className="text-sm text-gray-600">Maldives</p>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-green-600 bg-green-100">Available: 50 </span>
              <span className="text-sm text-red-600 bg-red-100">Checked In: 0</span>
              <span className="text-sm text-gray-600 bg-gray-100">Total Checkins: 50</span>

            </div>
          </div>
        </Card>

        <Card classname="w-[48%]">
          <div className="grid grid-cols-1 gap-6">
            <h3 className="font-semibold text-gray-900">LIBAI</h3>
            
          </div>
        </Card>
        </div>

        <Modal/>
        


    </div>
  );
}