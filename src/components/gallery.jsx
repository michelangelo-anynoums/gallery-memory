import "../styles/gallery.css";
import images from "../../public/images.json";
import { useContext, useEffect, useRef, useState } from "react";
import { AnimationContext } from "../App";

const GalleryItem = ({ image, onSelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin: "400px 0px",
        threshold: 0,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="gallery-item">
      {isVisible ? (
        <>
          <img
            onClick={() =>
              onSelect({
                image: image.image,
                title: image.title,
              })
            }
            src={image.image}
            alt={image.title}
            title={image.title}
            loading="lazy"
            decoding="async"
          />

          <details>
            <summary>{image.title}</summary>
            <p>{image.description}</p>
          </details>
        </>
      ) : (
        <div className="image-placeholder" />
      )}
    </div>
  );
};

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { setAnimation3D } = useContext(AnimationContext);

  // Handle body overflow when lightbox is open
  useEffect(() => {
    document.body.style.overflow = selectedImage ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedImage]);

  // Stop 3D animation when canvas leaves viewport
  useEffect(() => {
    const canvas = document.getElementById("canvas-wrapper");
    if (!canvas) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        setAnimation3D(false);
      }
    });

    observer.observe(canvas);

    return () => observer.disconnect();
  }, [setAnimation3D]);

  return (
    <>
      <h1>Галерея 🔭</h1>
      <hr />

      {/* Gallery container */}
      <div id="gallery-container">
        {images.map((image) => (
          <GalleryItem
            key={image.image}
            image={image}
            onSelect={setSelectedImage}
          />
        ))}
      </div>

      {/* Lightbox container */}
      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <div id="lightbox-image-wrapper">
            <img
              id="main-image"
              decoding="async"
              src={selectedImage.image}
              alt={selectedImage.title}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
