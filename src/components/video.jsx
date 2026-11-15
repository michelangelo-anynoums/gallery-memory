import videos from "../../public/videos.json";
import "../styles/video.css";
import { useEffect, useRef, useState } from "react";

const VideoItem = ({ video }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="video" ref={ref}>
      {visible ? (
        <video
          src={video.path}
          controls
          preload="metadata"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <div className="video-placeholder" />
      )}
    </div>
  );
};

const VideoContainer = () => {
  return (
    <>
      <h1>Відео 📷</h1>
      <hr />

      <div id="video-container">
        {videos.map((video, index) => (
          <VideoItem video={video} key={index} />
        ))}
      </div>
    </>
  );
};

export default VideoContainer;
