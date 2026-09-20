// Client-side image compression helper.
// Resizes images to max 800px wide and JPEG quality 0.7 before base64 encoding.
// Keeps DB rows small (~50-150KB per image instead of multi-MB).

export async function compressImage(file: File, maxDim = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("File must be an image (PNG or JPEG)."));
      return;
    }
    if (file.size > 5_000_000) {
      reject(new Error("Image too large. Please use one under 5MB."));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions (preserve aspect ratio)
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context."));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Try JPEG first (much smaller than PNG for photos)
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Could not load image."));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

/** Validate that a base64 data URL is a valid image under the size cap. */
export function isValidImageDataUrl(dataUrl: string, maxSize = 200_000): boolean {
  if (!dataUrl.startsWith("data:image/")) return false;
  if (dataUrl.length > maxSize) return false;
  return true;
}
