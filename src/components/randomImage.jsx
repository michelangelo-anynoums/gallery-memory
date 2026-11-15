import "../styles/randomImage.css";
import images from "../../public/images.json";
import { useEffect, useRef, useState } from "react";

// Fisher-Yates shuffle algorithm
const shuffleImages = (array) => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

const RandomImage = () => {
  const [selectedImage, setImage] = useState(null);
  const [animationState, setAnimationState] = useState(false);

  const ref = useRef(null);
  const shuffledImages = useRef([]);
  const currentIndex = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        setAnimationState(false);
      }
    });

    const element = ref.current;

    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!animationState || images.length === 0) {
      return;
    }

    // Generate a new shuffled collection
    const changeImage = () => {
      // Start a new cycle when all images have been displayed
      if (currentIndex.current >= shuffledImages.current.length) {
        shuffledImages.current = shuffleImages(images);
        currentIndex.current = 0;
      }

      // Display the next image
      setImage(shuffledImages.current[currentIndex.current]);

      currentIndex.current++;
    };

    // First image immediately
    if (shuffledImages.current.length === 0) {
      shuffledImages.current = shuffleImages(images);
      currentIndex.current = 0;
    }

    changeImage();

    // Change image every 2 seconds
    const interval = setInterval(changeImage, 2000);

    return () => clearInterval(interval);
  }, [animationState]);

  return (
    <>
      <h1 style={{ margin: "0.5rem 0", marginTop: "3rem" }}>
        Найкращі моменти ✨
      </h1>

      <hr style={{ width: "80%", margin: "0 auto" }} />

      <div id="image-container" ref={ref}>
        <div id="image-item">
          {images.length > 0 && (
            <img
              src={selectedImage?.image || images[0].image}
              alt={selectedImage?.title || images[0].title}
              title={selectedImage?.title || images[0].title}
            />
          )}
        </div>
      </div>

      <div id="button-wrapper">
        <button
          style={{
            backgroundColor: animationState ? "#cd412a" : "",
          }}
          id="toggle-slide-show-button"
          onClick={() => setAnimationState((state) => !state)}>
          {animationState ? "⏹️ Зупинити слайд-шоу" : "▶️ Відновити слайд-шоу"}
        </button>
      </div>
    </>
  );
};

export default RandomImage;
