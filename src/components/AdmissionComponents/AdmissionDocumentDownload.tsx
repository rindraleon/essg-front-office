import { Download } from 'lucide-react';
import { ADMISSION_DOCUMENT } from '@/config';

const AdmissionDocumentDownload = () => {
  const { url, fileName, label } = ADMISSION_DOCUMENT;
  if (!url?.trim()) return null;

  return (
    <a
      href={url}
      download={fileName}
      rel="noopener"
      className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-small font-semibold text-white shadow-lg transition-[background-color,transform] duration-(--duration-hover) hover:bg-brand-500 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300 motion-reduce:transform-none"
    >
      <Download className="size-4" aria-hidden="true" />
      {label}
    </a>
  );
};

export default AdmissionDocumentDownload;
