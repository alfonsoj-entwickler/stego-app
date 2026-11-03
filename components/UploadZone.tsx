interface UploadZoneProps {
  isDragging: boolean;
  onClickZone: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  error: string | null;
}

export function UploadZone({
  isDragging,
  onClickZone,
  onDrop,
  onDragOver,
  onDragLeave,
  error,
}: UploadZoneProps) {
  return (
    <main
      className={`flex-1 flex flex-col items-center justify-center px-6 py-8 transition-colors duration-200 ${
        isDragging ? "bg-[#F0F0F0]" : ""
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <div className="flex flex-col items-center gap-8 max-w-md w-full">
        <div
          onClick={onClickZone}
          className={`w-64 h-64 rounded-full bg-[#0052CC]/70 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "shadow-2xl scale-105 bg-[#1E40AF]"
              : "shadow-lg hover:shadow-xl"
          }`}
        >
          <svg
            className="w-16 h-16 text-white mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>

          <div className="text-center">
            <p className="text-white font-bold text-lg">Drop image</p>
            <p className="text-white text-sm mt-1">or click to browse</p>
          </div>
        </div>

        <p className="text-[#1a1a1a] text-sm text-center">
          Formats: PNG, JPEG, BMP, TIFF, GIF. Max 20 MB.
        </p>

        {error && (
          <div className="w-full bg-[#E0E9FF] border border-[#0052CC] rounded-lg p-4">
            <p className="text-[#0052CC] text-sm text-center font-medium">
              {error}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
