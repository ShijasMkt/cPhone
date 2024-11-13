
  
  /**
   * Function to draw cropped image on canvas
   * @param {HTMLImageElement} image
   * @param {HTMLCanvasElement} canvas
   * @param {import('react-image-crop').PixelCrop} crop
   * @returns void
   */
  export function drawImageOnCanvas(image, canvas, crop) {
    if (!crop || !canvas || !image) {
      return;
    }
  
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;
  
    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;
  
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';
  
    // Apply circular mask
    const centerX = crop.width * scaleX / 2;
    const centerY = crop.height * scaleY / 2;
    const radius = Math.min(crop.width * scaleX, crop.height * scaleY) / 2;
  
    // Start clipping the image in a circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
  
    // Draw the image inside the circle
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
  }
  