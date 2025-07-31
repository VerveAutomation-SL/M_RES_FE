'use client';

import { Restaurant } from "@/lib/types";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ResortOutletSelectorProps {
  resorts: { id: number; name: string; restaurants: Restaurant[] }[];
  onSelect: (resort: { id: number; name: string }, outlet: Restaurant) => void;
  onClose: () => void;
}

export default function ResortOutletSelector({ resorts, onSelect, onClose }: ResortOutletSelectorProps) {
  const [selectedResort, setSelectedResort] = useState<number | null>(null);
  const [outlets, setOutlets] = useState<Restaurant[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<number | null>(null);

  useEffect(() => {
    if (selectedResort) {
      const resort = resorts.find((r) => r.id === selectedResort);
      setOutlets(resort?.restaurants || []);
      setSelectedOutlet(null);
      // Debug
      console.log("Selected resort:", resort);
      console.log("Outlets for resort:", resort?.restaurants);
    }
  }, [selectedResort, resorts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedResort && selectedOutlet) {
      const resort = resorts.find((r) => r.id === selectedResort);
      const outlet = outlets.find((o) => o.id === selectedOutlet);
      if (resort && outlet) {
        onSelect(resort, outlet);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-50">
      <form
        className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6 border border-gray-100"
        onSubmit={handleSubmit}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="w-6 h-6 cursor-pointer" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Select Resort & Outlet
        </h2>
        <div>
          <label className="block text-base font-medium mb-2 text-gray-700">
            Resort
          </label>
          <select
            required
            value={selectedResort || ""}
            onChange={e => setSelectedResort(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none text-base bg-gray-50"
          >
            <option value="">Choose a resort</option>
            {resorts.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-base font-medium mb-2 text-gray-700">
            Outlet
          </label>
          <select
            required
            value={selectedOutlet || ""}
            onChange={e => setSelectedOutlet(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none text-base bg-gray-50"
            disabled={!selectedResort}
          >
            <option value="">Choose an outlet</option>
            {outlets.filter(o => o.status === "Open").map(o => (
              <option key={o.id} value={o.id}>{o.restaurantName}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-3 mt-2 bg-amber-900 hover:bg-amber-950 text-white font-semibold rounded-lg text-base shadow transition cursor-pointer"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
