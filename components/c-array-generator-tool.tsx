"use client";

import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { bytesToCArray, convertImageDataToMonochromeBytes, type BitmapPackingMode } from "@/lib/embedded-advanced";

type GeneratorMode = "text" | "image";
type ImageFitMode = "contain" | "cover" | "stretch";

type ProcessedImage = {
  bytes: number[];
  previewUrl: string;
  litPixels: number;
  sourceWidth: number;
  sourceHeight: number;
  targetWidth: number;
  targetHeight: number;
};

export function CArrayGeneratorTool() {
  const packingOptions: { value: BitmapPackingMode; label: string; note: string }[] = [
    { value: "ssd1309-page", label: "SSD1309 pages", note: "8 vertical pixels per byte, page-major order." },
    { value: "horizontal-msb", label: "Horizontal rows", note: "8 horizontal pixels per byte, MSB is leftmost." },
  ];
  const fitOptions: { value: ImageFitMode; label: string }[] = [
    { value: "contain", label: "Contain" },
    { value: "cover", label: "Cover" },
    { value: "stretch", label: "Stretch" },
  ];

  const [mode, setMode] = useState<GeneratorMode>("text");
  const [text, setText] = useState("devtoolsforme");
  const [name, setName] = useState("payload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [threshold, setThreshold] = useState(160);
  const [invert, setInvert] = useState(false);
  const [packingMode, setPackingMode] = useState<BitmapPackingMode>("ssd1309-page");
  const [fitMode, setFitMode] = useState<ImageFitMode>("contain");
  const [targetWidth, setTargetWidth] = useState("128");
  const [targetHeight, setTargetHeight] = useState("64");
  const [imageError, setImageError] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);

  const textOutput = useMemo(() => {
    const bytes = Array.from(new TextEncoder().encode(text));
    return bytesToCArray(name, bytes);
  }, [name, text]);

  const imageOutput = useMemo(() => {
    if (!processedImage) return "";
    return bytesToCArray(name, processedImage.bytes);
  }, [name, processedImage]);

  useEffect(() => {
    if (!imageFile) {
      setProcessedImage(null);
      setImageError(null);
      return;
    }

    const width = Number(targetWidth);
    const height = Number(targetHeight);
    if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0 || width > 512 || height > 512) {
      setProcessedImage(null);
      setImageError("Enter a valid target size between 1 and 512 pixels.");
      return;
    }

    let revoked = false;
    const objectUrl = URL.createObjectURL(imageFile);
    const image = new Image();

    image.onload = () => {
      if (revoked) return;

      const sourceCanvas = document.createElement("canvas");
      sourceCanvas.width = width;
      sourceCanvas.height = height;
      const sourceContext = sourceCanvas.getContext("2d");
      if (!sourceContext) {
        setProcessedImage(null);
        setImageError("Your browser did not provide a 2D canvas context.");
        URL.revokeObjectURL(objectUrl);
        return;
      }

      sourceContext.fillStyle = "#ffffff";
      sourceContext.fillRect(0, 0, width, height);

      let drawWidth = width;
      let drawHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (fitMode !== "stretch") {
        const scale = fitMode === "cover"
          ? Math.max(width / image.naturalWidth, height / image.naturalHeight)
          : Math.min(width / image.naturalWidth, height / image.naturalHeight);
        drawWidth = Math.max(1, Math.round(image.naturalWidth * scale));
        drawHeight = Math.max(1, Math.round(image.naturalHeight * scale));
        offsetX = Math.floor((width - drawWidth) / 2);
        offsetY = Math.floor((height - drawHeight) / 2);
      }

      sourceContext.imageSmoothingEnabled = true;
      sourceContext.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

      const imageData = sourceContext.getImageData(0, 0, width, height);
      const converted = convertImageDataToMonochromeBytes(imageData.data, width, height, threshold, invert, packingMode);

      const previewData = sourceContext.createImageData(width, height);
      let litPixels = 0;
      for (let index = 0; index < converted.pixels.length; index += 1) {
        const on = converted.pixels[index] === 1;
        if (on) litPixels += 1;
        const offset = index * 4;
        previewData.data[offset] = on ? 245 : 10;
        previewData.data[offset + 1] = on ? 248 : 22;
        previewData.data[offset + 2] = on ? 255 : 33;
        previewData.data[offset + 3] = 255;
      }

      const previewCanvas = document.createElement("canvas");
      previewCanvas.width = width;
      previewCanvas.height = height;
      const previewContext = previewCanvas.getContext("2d");
      if (!previewContext) {
        setProcessedImage(null);
        setImageError("Your browser did not provide a preview canvas context.");
        URL.revokeObjectURL(objectUrl);
        return;
      }

      previewContext.putImageData(previewData, 0, 0);

      setProcessedImage({
        bytes: converted.bytes,
        previewUrl: previewCanvas.toDataURL("image/png"),
        litPixels,
        sourceWidth: image.naturalWidth,
        sourceHeight: image.naturalHeight,
        targetWidth: width,
        targetHeight: height,
      });
      setImageError(null);
      URL.revokeObjectURL(objectUrl);
    };

    image.onerror = () => {
      if (revoked) return;
      setProcessedImage(null);
      setImageError("The selected image could not be decoded.");
      URL.revokeObjectURL(objectUrl);
    };

    image.src = objectUrl;

    return () => {
      revoked = true;
      URL.revokeObjectURL(objectUrl);
    };
  }, [fitMode, imageFile, invert, packingMode, targetHeight, targetWidth, threshold]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {[
          { value: "text", label: "Text bytes" },
          { value: "image", label: "SSD1309 image" },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setMode(option.value as GeneratorMode)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${mode === option.value ? "bg-ink text-white" : "border border-ink/10 bg-white text-ink hover:bg-canvas"}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <label className="block space-y-2 text-sm font-semibold text-ink/80">Array name<input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-accent" /></label>

      {mode === "text" ? (
        <label className="block space-y-2 text-sm font-semibold text-ink/80">Input text<textarea value={text} onChange={(event) => setText(event.target.value)} rows={5} className="min-h-[120px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 text-sm outline-none transition focus:border-accent" /></label>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <label className="block space-y-2 text-sm font-semibold text-ink/80">
              Upload image
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/bmp,image/gif"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2 text-sm font-semibold text-ink/80">
                Target width
                <input value={targetWidth} onChange={(event) => setTargetWidth(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" />
              </label>
              <label className="block space-y-2 text-sm font-semibold text-ink/80">
                Target height
                <input value={targetHeight} onChange={(event) => setTargetHeight(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" />
              </label>
            </div>

            <label className="block space-y-2 text-sm font-semibold text-ink/80">
              Threshold: <span className="font-mono">{threshold}</span>
              <input type="range" min="0" max="255" step="1" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} className="w-full accent-accent" />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2 text-sm font-semibold text-ink/80">
                Packing mode
                <select value={packingMode} onChange={(event) => setPackingMode(event.target.value as BitmapPackingMode)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-accent">
                  {packingOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label className="block space-y-2 text-sm font-semibold text-ink/80">
                Fit mode
                <select value={fitMode} onChange={(event) => setFitMode(event.target.value as ImageFitMode)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-accent">
                  {fitOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-sm font-semibold text-ink/80">
              <input type="checkbox" checked={invert} onChange={(event) => setInvert(event.target.checked)} className="h-4 w-4 accent-accent" />
              Invert monochrome result
            </label>

            <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4 text-sm text-ink/75">
              The uploaded image is rendered into the target canvas using the selected fit mode, thresholded to 1-bit pixels, then packed using the selected byte layout for your display driver.
            </div>

            <div className="rounded-[1.4rem] border border-ink/10 bg-canvas p-4 text-sm text-ink/75">
              <p className="font-semibold text-ink">Packing reference</p>
              <p className="mt-1">{packingOptions.find((option) => option.value === packingMode)?.note}</p>
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Preview</p>
            {!imageFile ? (
              <p className="mt-3 rounded-2xl bg-canvas px-4 py-3 text-sm text-ink/70">Select a PNG, JPEG, WebP, BMP, or GIF to generate a monochrome bitmap.</p>
            ) : imageError ? (
              <p className="mt-3 rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">{imageError}</p>
            ) : processedImage ? (
              <div className="mt-3 space-y-3">
                <div className="overflow-hidden rounded-2xl border border-ink/10 bg-[#07131b] p-3">
                  <img src={processedImage.previewUrl} alt="Thresholded monochrome preview" className="mx-auto w-full max-w-full rounded-lg object-contain [image-rendering:pixelated]" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-canvas px-4 py-3 text-sm text-ink">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">Image</p>
                    <p className="mt-1 font-mono">{processedImage.sourceWidth} x {processedImage.sourceHeight}</p>
                    <p className="mt-1 text-ink/70">Scaled into {processedImage.targetWidth} x {processedImage.targetHeight}</p>
                  </div>
                  <div className="rounded-2xl bg-canvas px-4 py-3 text-sm text-ink">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">Output</p>
                    <p className="mt-1 font-mono">{processedImage.bytes.length} bytes</p>
                    <p className="mt-1 text-ink/70">Lit pixels: {processedImage.litPixels}</p>
                    <p className="mt-1 text-ink/70">{packingOptions.find((option) => option.value === packingMode)?.label} with {fitMode} fit</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-3 rounded-2xl bg-canvas px-4 py-3 text-sm text-ink/70">Processing image...</p>
            )}
          </div>
        </div>
      )}

      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
        <div className="mb-2 flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Generated array</p><CopyButton value={mode === "text" ? textOutput : imageOutput} /></div>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm text-ink">{mode === "text" ? textOutput : imageOutput || "Upload an image to generate an SSD1309-ready bitmap array."}</pre>
      </div>
    </div>
  );
}
