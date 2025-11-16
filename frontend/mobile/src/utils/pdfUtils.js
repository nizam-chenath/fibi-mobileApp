// utils/pdfUtils.js
// Requires 'pdf-lib' to be installed in the project dependencies.
// Usage:
//   const { embedSignatureOnPdf } = require('./pdfUtils');
//   const resultBase64 = await embedSignatureOnPdf({ pdfBase64, signatureBase64Png, pageIndex, x, y, width });
// Returns a base64-encoded PDF string ('data:application/pdf;base64,....' not included).
import { PDFDocument } from 'pdf-lib';

export async function embedSignatureOnPdf({
  pdfBase64,
  signatureBase64Png,
  pageIndex = 0,
  x = 50,
  y = 50,
  width = 150,
}) {
  if (!pdfBase64) {
    throw new Error('pdfBase64 is required');
  }
  if (!signatureBase64Png) {
    throw new Error('signatureBase64Png is required');
  }
  // Strip possible data URL prefix
  const cleanPdfBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
  const cleanSigBase64 = signatureBase64Png.replace(/^data:image\/png;base64,/, '');
  const pdfBytes = base64ToUint8Array(cleanPdfBase64);
  const sigBytes = base64ToUint8Array(cleanSigBase64);

  const doc = await PDFDocument.load(pdfBytes);
  const pngImage = await doc.embedPng(sigBytes);
  const pngDims = pngImage.scale(1);
  const targetWidth = width;
  const scale = targetWidth / pngDims.width;
  const targetHeight = pngDims.height * scale;

  const pages = doc.getPages();
  const page = pages[Math.max(0, Math.min(pageIndex, pages.length - 1))];
  // Note: PDF y-origin is bottom
  page.drawImage(pngImage, {
    x,
    y,
    width: targetWidth,
    height: targetHeight,
  });

  const modifiedPdf = await doc.save();
  return uint8ArrayToBase64(modifiedPdf);
}

function base64ToUint8Array(base64) {
  const binaryString = global.atob ? global.atob(base64) : Buffer.from(base64, 'base64').toString('binary');
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function uint8ArrayToBase64(bytes) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return global.btoa ? global.btoa(binary) : Buffer.from(binary, 'binary').toString('base64');
}


