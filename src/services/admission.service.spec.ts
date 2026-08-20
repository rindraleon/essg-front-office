import { describe, expect, it } from 'vitest';
import { formatFileSize, isProofFileValid } from './admission.service';

describe('admission.service helpers', () => {
  describe('isProofFileValid', () => {
    it('accepts pdf, jpg and png', () => {
      expect(isProofFileValid(new File(['x'], 'a.pdf', { type: 'application/pdf' })).ok).toBe(true);
      expect(isProofFileValid(new File(['x'], 'a.jpg', { type: 'image/jpeg' })).ok).toBe(true);
      expect(isProofFileValid(new File(['x'], 'a.png', { type: 'image/png' })).ok).toBe(true);
    });

    it('rejects other formats', () => {
      const result = isProofFileValid(
        new File(['x'], 'a.docx', {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        })
      );
      expect(result.ok).toBe(false);
      expect(result.error).toContain('Format non autorisé');
    });

    it('rejects files larger than 10 Mo', () => {
      const big = new File([new Uint8Array(11 * 1024 * 1024)], 'a.pdf', {
        type: 'application/pdf',
      });
      const result = isProofFileValid(big);
      expect(result.ok).toBe(false);
      expect(result.error).toContain('10 Mo');
    });
  });

  describe('formatFileSize', () => {
    it('formats bytes, KB and MB', () => {
      expect(formatFileSize(512)).toBe('512 o');
      expect(formatFileSize(2048)).toBe('2 Ko');
      expect(formatFileSize(3 * 1024 * 1024)).toBe('3.0 Mo');
    });
  });
});
