import { Suspense } from "react";
import TrackOrderClient from "./TrackOrderClient";

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="w-8 h-8 border-4 border-[#ff385c] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-500">Loading...</p>
        </div>
      }
    >
      <TrackOrderClient />
    </Suspense>
  );
}
