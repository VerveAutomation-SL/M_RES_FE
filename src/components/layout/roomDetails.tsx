import React, { useEffect } from "react";
import { useState } from "react";
import { Edit3, Save, Trash2, X, XCircle } from "lucide-react";
import { Resort, Room } from "@/lib/types";
import { resortApi, roomApi } from "@/lib/api";

interface ViewDetailsProps {
  isOpen?: boolean;
  onClose: () => void;
  room?: Room;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const RoomDetails = ({ isOpen = false, onClose, room, onUpdate, onDelete }: ViewDetailsProps) => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRoomNumber, setEditRoomNumber] = useState("");
  const [resort, setResort] = useState<Resort | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResortDetails = async () => {
      if(room?.resort_id && isOpen){
        try{
          console.log("Fetching resort details for room:", room.room_number);
          const response = await resortApi.getResortById(room.resort_id);

          if(response?.success && response.data){
            setResort(response.data);
          }else{
            console.warn("No resort found for this room");
            setResort(null);
          }
        }catch(error){
          console.error("Error fetching resort details:", error);
          setResort(null);
        }
      }
    };
    fetchResortDetails();
  }, [isOpen, room])

  useEffect(() => {
    if(isEditing && room){
      setEditRoomNumber(room.room_number);
      setError("");
    }
  },[isEditing, room]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError("");
    if(!isEditing && room){
      setEditRoomNumber(room.room_number);
    }
  };

  const handleSaveEdit = async () => {
    if(!room || !editRoomNumber.trim()){
      setError("Room number cannot be empty");
      return;
    }

    if(editRoomNumber.trim() === room.room_number){
      setIsEditing(false);
      setError("Duplicate room number, no changes made");
      return;
    }

    setLoading(true);
    setError("");

    try{
      console.log("Updating room:", room.room_number, "to", editRoomNumber);
      const response = await roomApi.updateRoom(room.id, { room_number: editRoomNumber.trim(), resort_id: resort?.id });
      
      if(response?.success && response.data){
        console.log("Room updated successfully:", response.data);
        Object.assign(room,{room_number : editRoomNumber.trim()});
        setIsEditing(false);
        setError("");
        alert(`Room updated successfully, ${room.room_number} to ${editRoomNumber.trim()}`);
        onUpdate?.();
      }else{
        console.error("Failed to update room:", response);
        setError("Failed to update room");
      }
    } catch (error: any) {
    console.error("💥 Error updating room:", error);
    
    if (error.response?.data?.message) {
      setError(error.response.data.message);
    } else {
      setError("Error updating room. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

  const handleDeleteClick = async () => {
    setDeleteConfirm(true);
    setError("");
  }

  const handleDeleteConfirm = async () => {
    if(!room) return;

    setLoading(true);
    setError("");

    try{
      console.log("Deleting room:", room.room_number);
      const response = await roomApi.deleteRoom(room.id);

      if(response?.success){
        console.log("Room deleted successfully");
        onDelete?.();
        onClose();
      }else{
        console.error("Failed to delete room:", response);
        setError("Failed to delete room");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      setError("Error deleting room");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(false);
    setError("");
  };

  const handleClose = () => {
    setIsEditing(false);
    setError("");
    setEditRoomNumber("");
    onClose();
  }

  if (!isOpen || !room) return null;
  return (
    <div className="fixed inset-0 bg-gray-800/40 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b-2 border-gray-200 pb-4">
          <h3 className="text-xl font-semibold text-gray-900">Room Details</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Room Information */}
          <div className="space-y-6">
            {/* Room Number section */}
            <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Room Information</h4>
              <div className="flex space-x-2">
                {!deleteConfirm && (
                  <>
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          disabled={loading || !editRoomNumber.trim()}
                          className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={handleEditToggle}
                          disabled={loading}
                          className="flex items-center px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleEditToggle}
                          disabled={loading}
                          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={handleDeleteClick}
                          disabled={loading}
                          className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Room Number */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Room Number
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editRoomNumber}
                onChange={(e) => {
                  setEditRoomNumber(e.target.value);
                  if (error) setError("");
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Enter room number"
                disabled={loading}
                autoFocus
              />
            ) : (
              <p className="text-gray-900 text-sm">{room.room_number}</p>
            )}
          </div>

          {/* Resort Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Resort Name
            </label>
            <p className="text-gray-900 font-semibold text-lg">{resort?.name || "Unknown Resort"}</p>
          </div>

          {/* Timestamps */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 mb-3">System Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Created At
                </label>
                <p className="text-sm text-gray-900">
                  {new Date(room.createdAt).toLocaleDateString()} {new Date(room.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Last Updated
                </label>
                <p className="text-sm text-gray-900">
                  {new Date(room.updatedAt).toLocaleDateString()} {new Date(room.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* Delete Confirmation */}
          {deleteConfirm && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-lg font-medium text-red-900 mb-2">Confirm Deletion</h4>
              <p className="text-red-700 mb-4">
                Are you sure you want to delete room <strong>{room.room_number}</strong>? 
                This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteConfirm}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  onClick={handleDeleteCancel}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Close Button */}
          {!deleteConfirm && !isEditing && (
            <div className="mt-6 pt-4 border-t">
              <button
                onClick={handleClose}
                disabled={loading}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
