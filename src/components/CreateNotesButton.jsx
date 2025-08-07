'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CreateNotesButton() {
    const router = useRouter()
    return (
        <Button onClick={() => router.push("/notes/create")} size="icon" className="rounded-full bg-gray-900 hover:bg-gray-800">
          <Plus className="w-4 h-4" />
        </Button>
    )
}