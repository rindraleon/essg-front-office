import ImageGallery from '../common/ImageGallery';

interface ProjetGalleryProps {
  images: string[];
  alt?: string;
}

const ProjetGallery = ({ images, alt = 'Image du projet' }: ProjetGalleryProps) => {
  return <ImageGallery images={images} alt={alt} title="Galerie du projet" />;
};

export default ProjetGallery;
