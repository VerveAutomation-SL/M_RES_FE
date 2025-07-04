'use client'

import { Resort } from "@/lib/types";
import { Input } from "../ui/input";
import Button from "../ui/button";
import { error } from "console";

interface ResortFormProps {
    resort? : Resort;
    onSuccess?: (resort: Resort) => void;
    onCancel?: () => void;
}

export default function ResortForm({ resort, onSuccess, onCancel }: ResortFormProps) {
    return (
        <form className="space-y-4">
            <Input 
                label="Resort name"
                placeholder="Enter resort name"
            />

            <Input
                label="Location"
                placeholder="Enter resort location"
            />

            <div className="flex justify-end space-x-3 pt-2">
                {onCancel && (
                    <Button 
                        type="button" 
                        variant="secondary"
                        onClick={onCancel}>
                            Cancel
                    </Button>

                )}
                <Button type="submit" >
                    {resort ? "Update Resort" : "Create Resort"}
                </Button>
            </div>

        </form>
    );
}