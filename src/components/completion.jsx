import { useEffect, useState, useRef } from "react";
import "../styles/completion.css";
import confetti from "@hiseb/confetti";

const Completion = () => {
  const [completion, setCompletion] = useState(0);
  const [completed, setAsCompleted] = useState(false);

  const hasCelebrated = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY;

      const scrollableHeight = documentHeight - windowHeight;

      const percentage =
        scrollableHeight > 0 ? (scrollPosition / scrollableHeight) * 100 : 100;

      setCompletion(percentage);

      if (percentage >= 99) {
        if (!hasCelebrated.current) {
          hasCelebrated.current = true;
          confetti();
        }

        setAsCompleted(true);
      } else {
        setAsCompleted(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav id="wrapper">
      <div
        id="complete"
        style={{
          width: `${completion}%`,
          backgroundColor: completed ? "green" : "#4a403a",
        }}
      />
    </nav>
  );
};

export default Completion;
