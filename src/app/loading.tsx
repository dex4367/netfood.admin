export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      <p className="text-gray-600 mt-4">Carregando...</p>
    </div>
  );
} 