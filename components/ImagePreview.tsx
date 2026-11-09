interface ImagePreviewProps {
  preview: string;
  fileName: string;
  fileSizeBytes: number;
  imageDimensions: { width: number; height: number } | null;
  resultDataUrl?: string | null;
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
  resultDataUrl,
}: ImagePreviewProps) {
  return (
    <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-8">
      <div
        className={`flex max-w-full w-full justify-center ${
          resultDataUrl
            ? "flex-col sm:flex-row items-center gap-6 sm:gap-10"
            : "flex-col items-center gap-6 max-w-2xl"
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          {resultDataUrl && (
            <span className="font-mono text-xs uppercase tracking-wide text-[#666]">
              Original
            </span>
          )}
          <img
            src={preview}
            alt="Preview"
            className="max-h-96 max-w-full object-contain rounded-lg shadow-md"
          />
        </div>

        {resultDataUrl && (
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wide text-[#666]">
              Image with hidden message
            </span>
            <img
              src={resultDataUrl}
              alt="Image with hidden message"
              className="max-h-96 max-w-full object-contain rounded-lg shadow-md"
            />
          </div>
        )}
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
