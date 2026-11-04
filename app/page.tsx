"use client";

import { useState, useRef } from "react";
import { MetaballsCanvas } from "@/components/MetaballsCanvas";
import { UploadZone } from "@/components/UploadZone";
import { ImagePreview } from "@/components/ImagePreview";
import { ClearButton } from "@/components/ClearButton";
import AlgorithmForm from "@/components/AlgorithmForm";
import { LSBEncodeResult } from "@/lib/stego/lsb";

interface ImageState {
  file: File | null;
  preview: string | null;
  fileName: string;
  fileSizeBytes: number;
  imageDimensions: { width: number; height: number } | null;
  error: string | null;
  isLoading: boolean;
}

export default function Home() {
  const [imageState, setImageState] = useState<ImageState>({
    file: null,
    preview: null,
    fileName: "",
    fileSizeBytes: 0,
    imageDimensions: null,
    error: null,
    isLoading: false,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isAlgorithmFormVisible, setIsAlgorithmFormVisible] = useState(false);
  const [encodeResult, setEncodeResult] = useState<LSBEncodeResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const SUPPORTED_FORMATS = [
    "image/png",
    "image/jpeg",
    "image/bmp",
    "image/tiff",
    "image/gif",
  ];
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB in bytes

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    console.log("[VALIDATE] Checking file:", file.name);

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const errorMsg = "File must be smaller than 20 MB.";
      console.warn("[VALIDATE] Size check failed:", errorMsg);
      return { valid: false, error: errorMsg };
    }

    // Check MIME type
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      const errorMsg =
        "Format not supported. Use PNG, JPEG, BMP, TIFF, or GIF.";
      console.warn("[VALIDATE] Format check failed:", errorMsg);
      return { valid: false, error: errorMsg };
    }

    console.log("[VALIDATE] File passed validation");
    return { valid: true };
  };

  const createImagePreview = (
    file: File,
  ): Promise<{
    preview: string;
    dimensions: { width: number; height: number };
  }> => {
    return new Promise((resolve, reject) => {
      console.log("[PREVIEW] Creating preview for:", file.name);

      const reader = new FileReader();

      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        console.log("[PREVIEW] Data URL created");

        const img = new Image();

        img.onload = () => {
          const dimensions = {
            width: img.naturalWidth,
            height: img.naturalHeight,
          };
          console.log("[PREVIEW] Image dimensions:", dimensions);
          resolve({ preview: dataUrl, dimensions });
        };

        img.onerror = () => {
          const errorMsg = "Failed to load image. Please try another file.";
          console.error("[PREVIEW] Image load failed:", errorMsg);
          reject(new Error(errorMsg));
        };

        img.src = dataUrl;
      };

      reader.onerror = () => {
        const errorMsg = "Failed to read file. Please try again.";
        console.error("[PREVIEW] FileReader error:", errorMsg);
        reject(new Error(errorMsg));
      };

      reader.readAsDataURL(file);
    });
  };

  // Log state changes for verification
  const logState = (label: string) => {
    console.log(`[${label}] imageState:`, {
      file: imageState.file?.name || "null",
      preview: imageState.preview ? "DataURL present" : "null",
      fileName: imageState.fileName,
      fileSizeBytes: imageState.fileSizeBytes,
      imageDimensions: imageState.imageDimensions,
      error: imageState.error,
      isLoading: imageState.isLoading,
    });
  };

  // Initial state log
  if (typeof window !== "undefined") {
    logState("INIT");
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    console.log("[DROP] Drag event detected");

    const files = e.dataTransfer.files;
    if (files.length === 0) {
      console.warn("[DROP] No files detected");
      return;
    }

    const file = files[0];
    console.log("[DROP] File extracted:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const validation = validateFile(file);
    if (!validation.valid) {
      setImageState((prev) => ({
        ...prev,
        error: validation.error || "Validation failed",
        file: null,
      }));
      logState("DROP_ERROR");
      return;
    }

    setImageState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    try {
      const { preview, dimensions } = await createImagePreview(file);
      setImageState((prev) => ({
        ...prev,
        file,
        fileName: file.name,
        fileSizeBytes: file.size,
        preview,
        imageDimensions: dimensions,
        error: null,
        isLoading: false,
      }));
      setIsAlgorithmFormVisible(true);
      logState("DROP");
    } catch (error) {
      setImageState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Failed to process image",
        file: null,
        isLoading: false,
      }));
      logState("DROP_PREVIEW_ERROR");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      console.warn("[INPUT] No files selected");
      return;
    }

    const file = files[0];
    console.log("[INPUT] File selected:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const validation = validateFile(file);
    if (!validation.valid) {
      setImageState((prev) => ({
        ...prev,
        error: validation.error || "Validation failed",
        file: null,
      }));
      logState("INPUT_ERROR");
      return;
    }

    setImageState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    try {
      const { preview, dimensions } = await createImagePreview(file);
      setImageState((prev) => ({
        ...prev,
        file,
        fileName: file.name,
        fileSizeBytes: file.size,
        preview,
        imageDimensions: dimensions,
        error: null,
        isLoading: false,
      }));
      setIsAlgorithmFormVisible(true);
      logState("INPUT");
    } catch (error) {
      setImageState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Failed to process image",
        file: null,
        isLoading: false,
      }));
      logState("INPUT_PREVIEW_ERROR");
    }
  };

  const handleClickZone = () => {
    console.log("[CLICK] Zone clicked, triggering file input");
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    console.log("[CLEAR] Resetting image state");
    setImageState({
      file: null,
      preview: null,
      fileName: "",
      fileSizeBytes: 0,
      imageDimensions: null,
      error: null,
      isLoading: false,
    });
    setIsAlgorithmFormVisible(false);
    setEncodeResult(null);
    logState("CLEAR");
  };

  const handleAlgorithmFormClose = () => {
    console.log("[ALGORITHM_FORM] Form closed");
    setIsAlgorithmFormVisible(false);
  };

  const handleApplyAlgorithm = (payload: {
    algorithm: string;
    fieldValues: Record<string, any>;
    message: string;
    result: LSBEncodeResult | null;
  }) => {
    console.log("[ALGORITHM_FORM] Apply clicked with payload:", payload);
    setEncodeResult(payload.result);
  };

  const handleSaveAlgorithm = (payload: {
    algorithm: string;
    fieldValues: Record<string, any>;
    message: string;
  }) => {
    console.log("[ALGORITHM_FORM] Save clicked with payload:", payload);
    // Implementation will be added in future specs
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 w-full flex justify-between items-center px-6 py-6 z-10">
        <div className="w-10 h-10" />
        {imageState.file !== null && <ClearButton onClick={handleClear} />}
      </header>

      {imageState.file === null ? (
        <>
          <MetaballsCanvas primaryColor="#0052CC" opacity={0.12} />
          <UploadZone
            isDragging={isDragging}
            onClickZone={handleClickZone}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            error={imageState.error}
          />
        </>
      ) : (
        imageState.preview && (
          <>
            <ImagePreview
              preview={imageState.preview}
              fileName={imageState.fileName}
              fileSizeBytes={imageState.fileSizeBytes}
              imageDimensions={imageState.imageDimensions}
              resultDataUrl={encodeResult?.dataUrl ?? null}
            />
            {imageState.file && isAlgorithmFormVisible && (
              <AlgorithmForm
                imageFormat={imageState.file.type}
                imageDimensions={imageState.imageDimensions}
                imagePreview={imageState.preview}
                fileName={imageState.fileName}
                onApply={handleApplyAlgorithm}
                onSave={handleSaveAlgorithm}
                onClose={handleAlgorithmFormClose}
              />
            )}
          </>
        )
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        aria-label="Select image file"
      />

      <div className="fixed bottom-0 left-0 right-0 w-full h-12" />
    </div>
  );
}
