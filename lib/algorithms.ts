// Algorithm configuration and types for steganography algorithms

export type FieldType = "text" | "number" | "select" | "textarea";

export interface AlgorithmField {
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  maxLength?: number;
  required: boolean;
}

export interface Algorithm {
  name: string;
  category: "spacial_domain" | "frequency_domain" | "palette_domain" | "file_structure";
  compatibleFormats: string[];
  fields: AlgorithmField[];
}

export interface FormState {
  isVisible: boolean;
  selectedAlgorithm: string | null;
  fieldValues: Record<string, any>;
  message: string;
  errors: Record<string, string>;
  isValidating: boolean;
}

export const algorithmConfig: Record<string, Algorithm> = {
  LSB: {
    name: "LSB (Least Significant Bit)",
    category: "spacial_domain",
    compatibleFormats: ["PNG", "BMP", "TIFF"],
    fields: [
      { id: "bitDepth", label: "Bit Depth (1-3)", type: "number", min: 1, max: 3, required: true },
      { id: "channels", label: "Channels (R, G, B, A)", type: "select", options: ["R", "G", "B", "A", "RGB", "RGBA"], required: true },
      { id: "seed", label: "Seed (Optional)", type: "number", min: 0, required: false },
    ],
  },
  MATRIX_EMBEDDING: {
    name: "Matrix Embedding (F5 Spatial)",
    category: "spacial_domain",
    compatibleFormats: ["PNG", "BMP"],
    fields: [
      { id: "hammingK", label: "Hamming Parameter k", type: "number", min: 1, max: 16, required: true },
      { id: "hammingN", label: "Hamming Parameter n", type: "number", min: 1, max: 31, required: true },
      { id: "seed", label: "Dispersion Seed (Optional)", type: "number", min: 0, required: false },
    ],
  },
  PVD: {
    name: "PVD (Pixel Value Differencing)",
    category: "spacial_domain",
    compatibleFormats: ["PNG", "BMP", "TIFF"],
    fields: [
      { id: "direction", label: "Pair Direction", type: "select", options: ["Horizontal", "Vertical", "Diagonal"], required: true },
      { id: "rangeTable", label: "Range Table", type: "textarea", placeholder: "Define intervals...", required: false },
    ],
  },
  ADAPTIVE: {
    name: "Adaptive (S-UNIWARD, WOW, HILL)",
    category: "spacial_domain",
    compatibleFormats: ["PNG", "BMP"],
    fields: [
      { id: "method", label: "Method", type: "select", options: ["S-UNIWARD", "WOW", "HILL"], required: true },
      { id: "payload", label: "Payload (bpp)", type: "number", min: 0.01, max: 1, step: 0.01, required: true },
      { id: "filter", label: "Filter", type: "select", options: ["High Pass", "Low Pass", "Wavelet"], required: false },
    ],
  },
  J_STEG: {
    name: "J-Steg",
    category: "frequency_domain",
    compatibleFormats: ["JPEG"],
    fields: [
      { id: "jpegQuality", label: "JPEG Quality", type: "number", min: 1, max: 100, required: true },
      { id: "quantTable", label: "Quantization Table", type: "textarea", placeholder: "Optional...", required: false },
    ],
  },
  OUTGUESS: {
    name: "OutGuess",
    category: "frequency_domain",
    compatibleFormats: ["JPEG"],
    fields: [
      { id: "seed", label: "Stego Key", type: "number", min: 0, required: true },
      { id: "preservedCoefficients", label: "Preserved Coefficients (Optional)", type: "textarea", required: false },
    ],
  },
  F5: {
    name: "F5 (Westfeld)",
    category: "frequency_domain",
    compatibleFormats: ["JPEG"],
    fields: [
      { id: "seed", label: "Stego Key", type: "number", min: 0, required: true },
      { id: "jpegQuality", label: "JPEG Quality", type: "number", min: 1, max: 100, required: true },
    ],
  },
  J_UNIWARD: {
    name: "J-UNIWARD",
    category: "frequency_domain",
    compatibleFormats: ["JPEG"],
    fields: [
      { id: "payload", label: "Payload (bpp over nzAC)", type: "number", min: 0.01, max: 1, step: 0.01, required: true },
      { id: "bsplineParams", label: "B-Spline Parameters (Optional)", type: "textarea", required: false },
    ],
  },
  DWT: {
    name: "DWT (Discrete Wavelet Transform)",
    category: "frequency_domain",
    compatibleFormats: ["JPEG2000", "PNG"],
    fields: [
      { id: "level", label: "Decomposition Level", type: "number", min: 1, max: 5, required: true },
      { id: "subband", label: "Target Subband", type: "select", options: ["LH", "HL", "HH", "LL"], required: true },
      { id: "alpha", label: "Gain Factor (α)", type: "number", min: 0.01, max: 2, step: 0.1, required: true },
    ],
  },
  EZSTEGO: {
    name: "EzStego (Palette Modification)",
    category: "palette_domain",
    compatibleFormats: ["GIF", "PNG-8"],
    fields: [
      { id: "sortCriteria", label: "Sort Criteria", type: "select", options: ["Luminance", "Frequency"], required: true },
    ],
  },
  PALETTE_PARITY: {
    name: "Color Parity",
    category: "palette_domain",
    compatibleFormats: ["GIF", "PNG-8"],
    fields: [
      { id: "parityFunction", label: "Parity Function", type: "select", options: ["R+G+B mod 2", "R mod 2", "G mod 2", "B mod 2"], required: true },
    ],
  },
  EOF: {
    name: "EOF (End of File Injection)",
    category: "file_structure",
    compatibleFormats: ["JPEG", "PNG", "GIF", "BMP"],
    fields: [
      { id: "delimiter", label: "Hex Delimiter", type: "text", placeholder: "e.g.: FF D9", required: true },
    ],
  },
  EXIF: {
    name: "EXIF / Metadata",
    category: "file_structure",
    compatibleFormats: ["JPEG", "PNG", "TIFF"],
    fields: [
      { id: "targetField", label: "Target EXIF Field", type: "select", options: ["UserComment", "Artist", "Software", "ImageDescription", "Other"], required: true },
      { id: "customField", label: "Custom Field", type: "text", placeholder: "If selected Other", required: false },
    ],
  },
  CHUNK_INJECTION: {
    name: "Chunk Injection",
    category: "file_structure",
    compatibleFormats: ["PNG"],
    fields: [
      { id: "chunkName", label: "Chunk Name (4 characters)", type: "text", placeholder: "e.g.: zTxt, meSg", maxLength: 4, required: true },
      { id: "crc32", label: "CRC32 (Optional)", type: "text", placeholder: "Auto-calculated", required: false },
    ],
  },
};
