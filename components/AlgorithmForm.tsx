"use client";

import { useState, useMemo } from "react";
import { algorithmConfig, FormState } from "@/lib/algorithms";

interface AlgorithmFormProps {
  imageFormat: string;
  onApply: (payload: {
    algorithm: string;
    fieldValues: Record<string, any>;
    message: string;
  }) => void;
  onSave: (payload: {
    algorithm: string;
    fieldValues: Record<string, any>;
    message: string;
  }) => void;
  onClose: () => void;
}

const formatMimeToKey: Record<string, string> = {
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/gif": "GIF",
  "image/bmp": "BMP",
  "image/tiff": "TIFF",
  "image/jp2": "JPEG2000",
};

export default function AlgorithmForm({
  imageFormat,
  onApply,
  onSave,
  onClose,
}: AlgorithmFormProps) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Extract format key from MIME type (e.g., "image/jpeg" → "JPEG")
  const formatKey = useMemo(() => {
    return formatMimeToKey[imageFormat.toLowerCase()] || null;
  }, [imageFormat]);

  // Filter algorithms by compatible format
  const compatibleAlgorithms = useMemo(() => {
    if (!formatKey) return [];
    return Object.entries(algorithmConfig)
      .filter(([_, algo]) => algo.compatibleFormats.includes(formatKey))
      .map(([id, algo]) => ({ id, name: algo.name }));
  }, [formatKey]);

  const handleAlgorithmChange = (algorithmId: string) => {
    setSelectedAlgorithm(algorithmId);
    setFieldValues({});
    setErrors({});
  };

  const validateField = (
    fieldId: string,
    value: any,
    algorithmId: string
  ): { valid: boolean; error?: string } => {
    if (!algorithmId || !algorithmConfig[algorithmId]) {
      return { valid: true };
    }

    const algorithm = algorithmConfig[algorithmId];
    const field = algorithm.fields.find((f) => f.id === fieldId);

    if (!field) {
      return { valid: true };
    }

    // Check if required field is empty
    if (field.required && (value === "" || value === null || value === undefined)) {
      return {
        valid: false,
        error: `${field.label} is required`,
      };
    }

    // Skip validation for optional empty fields
    if (!field.required && (value === "" || value === null || value === undefined)) {
      return { valid: true };
    }

    // Validate number fields
    if (field.type === "number") {
      const numValue = parseFloat(value);

      if (isNaN(numValue)) {
        return {
          valid: false,
          error: `${field.label} must be a valid number`,
        };
      }

      if (field.min !== undefined && numValue < field.min) {
        return {
          valid: false,
          error: `${field.label} must be at least ${field.min}`,
        };
      }

      if (field.max !== undefined && numValue > field.max) {
        return {
          valid: false,
          error: `${field.label} must be at most ${field.max}`,
        };
      }
    }

    // Validate text fields length
    if (field.type === "text" && field.maxLength && value.length > field.maxLength) {
      return {
        valid: false,
        error: `${field.label} must be at most ${field.maxLength} characters`,
      };
    }

    return { valid: true };
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFieldValues({ ...fieldValues, [fieldId]: value });

    // Real-time validation
    if (selectedAlgorithm) {
      const validation = validateField(fieldId, value, selectedAlgorithm);
      if (validation.valid) {
        const newErrors = { ...errors };
        delete newErrors[fieldId];
        setErrors(newErrors);
      } else {
        setErrors({
          ...errors,
          [fieldId]: validation.error || "Invalid value",
        });
      }
    }
  };

  const handleApply = async () => {
    // Prevent double-click/rapid submissions
    if (isApplying) return;

    // Validate that all required fields are filled
    if (!selectedAlgorithm || Object.keys(errors).length > 0 || !message) {
      return;
    }

    setIsApplying(true);

    try {
      // Collect payload with algorithm configuration
      const payload = {
        algorithm: selectedAlgorithm,
        fieldValues,
        message,
      };

      // Invoke the parent callback
      onApply(payload);
    } finally {
      setIsApplying(false);
    }
  };

  const handleSave = async () => {
    // Prevent double-click/rapid submissions
    if (isSaving) return;

    // Validate that all required fields are filled
    if (!selectedAlgorithm || Object.keys(errors).length > 0 || !message) {
      return;
    }

    setIsSaving(true);

    try {
      // Collect payload with algorithm configuration
      const payload = {
        algorithm: selectedAlgorithm,
        fieldValues,
        message,
      };

      // Invoke the parent callback
      onSave(payload);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-4 z-50">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        ✕
      </button>

      <h2 className="text-lg font-semibold mb-4 pr-6 text-gray-900 dark:text-white">
        Algorithm Selection
      </h2>

      {/* Algorithm dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Algorithm
        </label>
        <select
          value={selectedAlgorithm || ""}
          onChange={(e) => handleAlgorithmChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
        >
          <option value="">-- Choose an algorithm --</option>
          {compatibleAlgorithms.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
        {formatKey && compatibleAlgorithms.length === 0 && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            No compatible algorithms for {formatKey} format
          </p>
        )}
      </div>

      {/* Algorithm-specific fields */}
      {selectedAlgorithm && algorithmConfig[selectedAlgorithm] && (
        <div className="mb-4 space-y-3">
          {algorithmConfig[selectedAlgorithm].fields.map((field) => (
            <div key={field.id} className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === "text" && (
                <input
                  type="text"
                  value={fieldValues[field.id] || ""}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  className={`px-3 py-2 text-sm border rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                    errors[field.id]
                      ? "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                      : "border-gray-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                  }`}
                />
              )}

              {field.type === "number" && (
                <input
                  type="number"
                  value={fieldValues[field.id] ?? ""}
                  onChange={(e) =>
                    handleFieldChange(field.id, e.target.value ? parseFloat(e.target.value) : "")
                  }
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  placeholder={field.placeholder}
                  className={`px-3 py-2 text-sm border rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                    errors[field.id]
                      ? "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                      : "border-gray-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                  }`}
                />
              )}

              {field.type === "select" && (
                <select
                  value={fieldValues[field.id] || ""}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className={`px-3 py-2 text-sm border rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-colors cursor-pointer ${
                    errors[field.id]
                      ? "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                      : "border-gray-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                  }`}
                >
                  <option value="">-- Select --</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "textarea" && (
                <textarea
                  value={fieldValues[field.id] || ""}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className={`px-3 py-2 text-sm border rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors resize-none ${
                    errors[field.id]
                      ? "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                      : "border-gray-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                  }`}
                  rows={2}
                />
              )}

              {errors[field.id] && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                  {errors[field.id]}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Message textarea - always visible */}
      <div className="mb-4 flex flex-col">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Message to Hide
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            // Validate message field
            const messageError = !e.target.value ? "Message is required" : "";
            if (messageError) {
              setErrors({ ...errors, message: messageError });
            } else {
              const newErrors = { ...errors };
              delete newErrors["message"];
              setErrors(newErrors);
            }
          }}
          placeholder="Enter the message or data to hide"
          className={`px-3 py-2 text-sm border rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors resize-none ${
            errors["message"]
              ? "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
              : "border-gray-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-blue-400"
          }`}
          rows={3}
        />
        {errors["message"] && (
          <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {errors["message"]}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleApply}
          disabled={!selectedAlgorithm || Object.keys(errors).length > 0 || !message || isApplying}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-md font-medium transition-colors disabled:cursor-not-allowed"
        >
          {isApplying ? "Applying..." : "Apply"}
        </button>
        <button
          onClick={handleSave}
          disabled={!selectedAlgorithm || Object.keys(errors).length > 0 || !message || isSaving}
          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-md font-medium transition-colors disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
