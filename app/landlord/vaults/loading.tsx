export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      <span className="ml-4 text-lg font-semibold text-blue-700">Loading Vaults...</span>
    </div>
  );
}