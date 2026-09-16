import logging
from typing import List

logger = logging.getLogger("qpi.ocr")

class OCRService:
    @staticmethod
    def extract_text_with_ocr(file_bytes: bytes) -> str:
        """Fallback OCR extraction using pdf2image and pytesseract."""
        try:
            from pdf2image import convert_from_bytes
            import pytesseract
            
            logger.info("Triggering Tesseract OCR fallback for scanned PDF...")
            images = convert_from_bytes(file_bytes, dpi=300)
            ocr_text = []
            for i, img in enumerate(images):
                text = pytesseract.image_to_string(img)
                ocr_text.append(text)
            
            extracted = "\n".join(ocr_text).strip()
            logger.info(f"OCR Extraction completed. Yielded {len(extracted)} characters.")
            return extracted
        except Exception as e:
            logger.error(f"OCR Extraction failed: {e}. Returning raw text placeholder.", exc_info=True)
            return "Scanned Document (OCR Failed)"
