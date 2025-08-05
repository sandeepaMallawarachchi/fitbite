export const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const diameter = Math.min(pixelCrop.width, pixelCrop.height);
  canvas.width = diameter;
  canvas.height = diameter;

  if (!ctx) throw new Error("Canvas context is null");

  ctx.beginPath();
  ctx.arc(diameter / 2, diameter / 2, diameter / 2, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    diameter,
    diameter,
    0,
    0,
    diameter,
    diameter
  );

  return canvas.toDataURL("image/png");
};
