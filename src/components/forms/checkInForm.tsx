"use client";

import { mealPlans, mealTypes } from "@/lib/data";
import { CheckInFormData } from "@/lib/types";
import { Clock, User, X } from "lucide-react";
import { useEffect, useState } from "react";

interface CheckInFormProps {
    isOpen?: boolean;
    onClose?: () => void;
    selectedRoom?: string;
    onCheckInSuccess?: (roomNumber: string) => void;
}

export default function CheckInForm({ isOpen = false, onClose, selectedRoom, onCheckInSuccess }: CheckInFormProps) {
    const [loading, setLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [formData, setFormData] = useState<CheckInFormData>({
        resort_name: '',
        room_number: '',
        outlet_name: '',
        meal_type: '',
        meal_plan: '',
        table_number: '',
        resort_id: 0,
    });

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
        setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (selectedRoom) {
            // Determine resort based on room number range
            const roomNum = parseInt(selectedRoom);
            let resortName = "";
            let resortId = 0;
            
            if ((roomNum >= 600 && roomNum <= 693) || 
                (roomNum >= 800 && roomNum <= 820) || 
                (roomNum >= 840 && roomNum <= 897)) {
              resortName = "Dhigurah Island";
              resortId = 1;
            } else if ((roomNum >= 100 && roomNum <= 130) || 
                       (roomNum >= 200 && roomNum <= 218) || 
                       (roomNum >= 300 && roomNum <= 343)) {
              resortName = "Falhumaafushi Island";
              resortId = 2;
            }
            
            // Set the resort name, resort id, and room number
            setFormData(prev => ({
              ...prev,
              resort_name: resortName,
              resort_id: resortId,
              room_number: selectedRoom
            }));
          }
    }, [selectedRoom]);

    const handleSubmit = async () =>{
        setLoading(true);
        try{
            const timeOnly = currentTime.toTimeString().split(' ')[0]; // Get time in HH:MM:SS format
            const response = await fetch('/api/check-in',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    check_in_time: timeOnly,}),
            });

            const data = await response.json();

            if(data.success){
                onCheckInSuccess?.(formData.room_number);
                alert("Check-in successful!");
                onClose?.();
            } else {
                alert(data.message || "Check-in failed. Please try again.");
            }
        } catch (error) {
            alert("An error occurred while checking in. Please try again.");
            console.error("Check-in error:", error);
        } finally {
            setLoading(false);
        }
    }

    if(!isOpen) {
        return null;
    }

    return(
        <div className="fixed inset-0 bg-gray-800/40 backdrop-blur-[2px] flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-2" />
                        <h3 className="text-lg font-semibold">Check-in Room {selectedRoom}</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Resort Name*
                        </label>
                        <input type="text" required value={formData.resort_name} 
                        onChange={(e) => setFormData({ ...formData, resort_name: e.target.value })} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-transparent"
                        placeholder="John Doe"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Room Number*
                        </label>
                        <input type="text" required value={formData.room_number} 
                        onChange={(e) => setFormData({ ...formData, room_number: e.target.value })} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-transparent"
                        placeholder="600"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Outlet*
                        </label>
                        <input type="text" required value={formData.outlet_name} 
                        onChange={(e) => setFormData({ ...formData, outlet_name: e.target.value })} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-transparent"
                        placeholder="LIBAI"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Table Number*
                        </label>
                        <input type="text" required value={formData.table_number} 
                        onChange={(e) => setFormData({ ...formData, table_number: e.target.value })} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-transparent"
                        placeholder="012"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meal Type*
                        </label>
                        <select required value={formData.meal_type} 
                        onChange={(e) => setFormData({ ...formData, meal_type: e.target.value })} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-transparent">
                        <option value="">Select meal type</option>
                        {mealTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                            {type.label}
                            </option>
                        ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meal Plan*
                        </label>
                        <select required value={formData.meal_plan} 
                        onChange={(e) => setFormData({ ...formData, meal_plan: e.target.value })} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-transparent">
                        <option value="">Select meal plan</option>
                        {mealPlans.map((plan) => (
                            <option key={plan.value} value={plan.value}>
                            {plan.label}
                            </option>
                        ))}
                        </select>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Check-in time: {currentTime.toLocaleTimeString()}</span>
                    </div>
                    <div className="flex space-x-3 pt-4">
                        <button type="button" 
                        onClick={onClose} 
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" 
                        onClick={handleSubmit} 
                        disabled={loading} 
                        className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-amber-900 disabled:opacity-50 cursor-pointer">
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
}