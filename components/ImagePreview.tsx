interface ImagePreviewProps {
  preview: string;
  fileName: string;
  fileSizeBytes: number;
  imageDimensions: { width: number; height: number } | null;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = (bytes / Math.pow(k, i)).toFixed(2);
  return `${value} ${sizes[i]}`;
}

export function ImagePreview({
  preview,
  fileName,
  fileSizeBytes,
  imageDimensions,
}: ImagePreviewProps) {
  return (
    <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-8">
      <div className="flex flex-col items-center gap-6 max-w-2xl w-full">
        <div className="flex justify-center">
          <img
            src={preview}
            alt="Preview"
            className="max-h-96 max-w-full object-contain rounded-lg shadow-md"
          />
        </div>
      </div>
      <div className="absolute bottom-6 left-6 w-auto bg-white border border-[#E5E5E5] rounded-lg p-6 space-y-3">
        <div className="flex flex-col gap-2 font-mono text-sm text-[#1a1a1a]">
          <div className="flex justify-between space-x-6">
            <span className="text-[#666]">Filename</span>
            <span className="font-semibold">{fileName}</span>
          </div>
          <div className="flex justify-between space-x-6">
            <span className="text-[#666]">File size</span>
            <span className="font-semibold">
              {formatFileSize(fileSizeBytes)}
            </span>
          </div>
          {imageDimensions && (
            <div className="flex justify-between space-x-6">
              <span className="text-[#666]">Dimensions</span>
              <span className="font-semibold">
                {imageDimensions.width} × {imageDimensions.height}
              </span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
