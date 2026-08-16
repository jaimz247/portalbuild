// Client-side SVG to true PNG rasterizer & safe download utility

/**
 * Downloads raw SVG markup as a .svg file
 */
export function downloadSvg(svgString: string, filename: string): void {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Converts an SVG string to a true high-resolution PNG using HTML5 Canvas
 * and automatically triggers browser download
 */
export function downloadPngFromSvg(
  svgString: string,
  width: number,
  height: number,
  filename: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Ensure dimensions are specified in SVG
      let processedSvg = svgString;
      if (!processedSvg.includes('width=')) {
        processedSvg = processedSvg.replace('<svg', `<svg width="${width}" height="${height}"`);
      }

      const svgBlob = new Blob([processedSvg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Canvas 2D context not available'));
          return;
        }

        // Draw image onto canvas
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (!blob) {
              reject(new Error('Failed to generate PNG blob from canvas'));
              return;
            }

            const downloadUrl = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = downloadUrl;
            anchor.download = filename.endsWith('.png') ? filename : `${filename}.png`;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
            resolve();
          },
          'image/png',
          1.0
        );
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };

      img.src = url;
    } catch (err) {
      reject(err);
    }
  });
}
