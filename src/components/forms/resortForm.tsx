'use client'

import { Resort } from "@/lib/types";

interface ResortFormProps {
    resort? : Resort;
    onSuccess?: (resort: Resort) => void;
}