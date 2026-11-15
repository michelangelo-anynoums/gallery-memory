import { createContext, useState } from "react";

import Navbar from "./components/navbar.jsx";
import Card from "./components/card.jsx";
import TreeScene from "./components/treeScene.jsx";
import Gallery from "./components/gallery.jsx";
import Footer from "./components/footer.jsx";
import RandomImage from "./components/randomImage.jsx";
import Completion from "./components/completion.jsx";
import VideoContainer from "./components/video.jsx";

export const AnimationContext = createContext(null);
export const ModelRendered = createContext(null);
export const ErrorModel = createContext(null);

function App() {
  const [animation3D, setAnimation3D] = useState(false);
  const [modelRendered, setModelState] = useState(false);
  const [errorModel, setError] = useState(false);

  return (
    <ErrorModel value={{ errorModel, setError }}>
      <ModelRendered.Provider value={{ modelRendered, setModelState }}>
        <AnimationContext.Provider value={{ animation3D, setAnimation3D }}>
          <Navbar />
          <Completion />
          <Card />

          {animation3D ? <TreeScene /> : ""}

          <Gallery />
          <RandomImage />
          <VideoContainer />
          <Footer />
        </AnimationContext.Provider>
      </ModelRendered.Provider>
    </ErrorModel>
  );
}

console.log("💙💛 Гав-гав! 🐕");
export default App;
