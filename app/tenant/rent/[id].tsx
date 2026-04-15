"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RentPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  useEffect(() => {
    // You can fetch property details here using params.id
    // For now, just show a placeholder
  }, [params.id]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-2xl font-bold mb-4">Rent Property</h1>
      <p className="mb-2">Property ID: <span className="font-mono">{params.id}</span></p>
      <p className="text-muted-foreground">This is a placeholder page for renting a property. Implement your rent logic here.</p>
      <button className="mt-6 px-4 py-2 bg-primary text-white rounded" onClick={() => router.back()}>Go Back</button>
    </div>
  );
}
