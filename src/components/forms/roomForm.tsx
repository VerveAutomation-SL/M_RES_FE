'use client'

import { resortApi } from "@/lib/api";
import { Resort, Room } from "@/lib/types";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Select } from "../ui/select";

interface RoomFormProps {
    room? : Room;
    onSuccess?: (room: Room) => void;
    onCancel?: () => void;
}

export default function RoomForm({ room, onSuccess, onCancel }: RoomFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resorts, setResorts] = useState<Resort[]>([]); 
    const [resortLoading, setResortLoading] = useState(true);

    useEffect(() =>{
        const fetchResorts = async () =>{
            try{
                const response = await resortApi.getAll();
                setResorts(response.data.data || []);
            }catch (err) {
                console.error('Failed to fetch resorts',err);
            }finally {
                setResortLoading(false);
            }
        };
        fetchResorts();
    },[]);

    if(resortLoading){
        return <div className="text-center p-4">Loading resorts...</div>;
    }

    return (
        <form className="space-y-4">
            <Input 
                label="Room name"
                placeholder="Enter room name"
                error={error}
            />
            <Select
                label="Select a resort"
                options={[
                    {label: 'Select a resort', value: ''},
                    ...resorts.map((resort) => ({
                        label: resort.name,
                        value: resort.id.toString()
                    }))
                ]}
                error={error}
            />

        </form>

    );
}
