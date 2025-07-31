'use client'

import { resortApi } from "@/lib/api";
import { ResortFormData } from "@/lib/types";
import { X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ResortFormProps {
    isOpen?: boolean;
    onClose?: () => void;
    onSuccess?: () => void;
    name?: string;
    location?: string;
}

export default function ResortForm({isOpen = false, onClose, onSuccess, name, location }: ResortFormProps) {
    const [formData, setFormData] = useState<ResortFormData>({
        name: name || "",
        location: location || ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); // Add error state

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(''); // Clear previous errors
        
        try {
            // Validate required fields
            if (!formData.name.trim() || !formData.location.trim()) {
                setError("Please fill in all required fields.");
                setLoading(false);
                return;
            }

            console.log("🏨 Creating resort:", formData);

            // Create resort payload (remove Rooms array as we fixed in backend)
            const resortPayload = {
                name: formData.name.trim(),
                location: formData.location.trim()
            };

            const response = await resortApi.createResort(resortPayload);
            
            console.log("📊 Resort creation response:", response);

            if (response && response.success) {
                // Success - clear form and close modal
                setFormData({ name: "", location: "" });
                setError('');
                
                // Show success message
                toast.success("Resort created successfully!");
                
                // Call callbacks
                onSuccess?.();
                onClose?.();
            } else {
                // Handle API error response
                const errorMessage = response?.message || "Failed to create resort. Please try again.";
                setError(errorMessage);
                console.error("❌ Resort creation failed:", response);
            }
        } catch (error: any) {
            console.error("💥 Error submitting resort form:", error);
            
            // Handle different types of errors
            if (error.response) {
                // API returned an error response
                const apiError = error.response.data;
                const errorMessage = apiError?.message || "Failed to create resort. Please try again.";
                setError(errorMessage);
            } else if (error.message) {
                // Network or other error
                setError(`Network error: ${error.message}`);
            } else {
                // Unknown error
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form and error when canceling
        setFormData({ name: "", location: "" });
        setError('');
        onClose?.();
    };

    // Clear error when user starts typing
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, name: e.target.value });
        if (error) setError(''); // Clear error when user types
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, location: e.target.value });
        if (error) setError(''); // Clear error when user types
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800/40 backdrop-blur-[2px] flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <h3 className="text-lg font-semibold">Add New Resort</h3>
                    </div>
                    <button 
                        onClick={handleCancel} 
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                        disabled={loading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Resort Name*
                        </label>
                        <input 
                            type="text" 
                            required 
                            value={formData.name} 
                            onChange={handleNameChange}
                            className={`w-full px-3 py-2 border rounded-md focus:ring-amber-500 focus:border-transparent ${
                                error && error.toLowerCase().includes('name') 
                                    ? 'border-red-300 bg-red-50' 
                                    : 'border-gray-300'
                            }`}
                            placeholder="e.g., Dhigurah Maldives Resort"
                            disabled={loading}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location*
                        </label>
                        <input 
                            type="text" 
                            required 
                            value={formData.location} 
                            onChange={handleLocationChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-transparent"
                            placeholder="e.g., Maldives, Indian Ocean"
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                        <button 
                            type="button" 
                            onClick={handleCancel} 
                            disabled={loading}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading || !formData.name.trim() || !formData.location.trim()} 
                            className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-amber-900 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Creating..." : "Create Resort"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}