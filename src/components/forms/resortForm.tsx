'use client'

import { ResortFormData } from "@/lib/types";
import { X } from "lucide-react";
import { useState } from "react";

interface ResortFormProps {
    isOpen?: boolean;
    onClose: () => void;
}

export default function ResortForm({isOpen = false, onClose }: ResortFormProps) {
    const [formData, setFormData] = useState<ResortFormData>({
        name: "",
        totalRooms: 0,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log("Form submitted:", formData);
            onClose?.();
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800/40 backdrop-blur-[2px] flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <h3 className="text-lg font-semibold">Add New Resort</h3>
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
                        <input type="text" required value={formData.name} 
                        onChange={(e) => setFormData({ ...formData,name: e.target.value })} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-transparent"
                        placeholder="John Doe"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total Rooms*
                        </label>
                        <input type="text" required value={formData.totalRooms} 
                        onChange={(e) => setFormData({ ...formData, totalRooms: Number(e.target.value) })} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-transparent"
                        placeholder="600"/>
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