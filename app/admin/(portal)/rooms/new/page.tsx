import Link from "next/link";

import { RoomForm } from "@/components/admin/RoomForm";

import { saveRoomAction } from "../actions";

export default function AdminNewRoomPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/rooms"
          className="text-sm font-medium text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
        >
          ← Rooms
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">New room</h1>
      </div>
      <RoomForm action={saveRoomAction} />
    </div>
  );
}
