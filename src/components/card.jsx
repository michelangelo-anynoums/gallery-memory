import { useContext, useEffect, useState } from "react";
import { AnimationContext, ModelRendered } from "../App";
import { ErrorModel } from "../App";
import "../styles/card.css";

const petDetails = {
  name: "Джастін",
  age: "14",
  birthday: "14 січня 2013 року",
  deathDay: "17 вересня 2026 року",
  nationality: "України",
  breed: "Йоркширський тер'єр",
};

const choiceRandomName = () => {
  const namesList = [
    "Сонечко ☀️",
    "Найкращий ⭐",
    "Пухнастик 🧸",
    "Радість 🌈",
    "Зіронька ✨",
    "Миленький 💕",
    "Чарівник 🪄",
    "Крутий 🐱",
  ];
  return namesList[Math.floor(Math.random() * namesList.length)];
};

const choiceRandomPhrase = () => {
  const phrases = [
    "🐾 Покрути мене навколо!",
    "🔄 Зазирнути з усіх боків 🐾",
    "📸 Знайди свій найкращий ракурс",
    "🧸 Увімкнути режим «пухнастик»",
    "🔍 Роздивіться кожну детальку",
    "🌐 Обертай і досліджуй!",
    "🦁 Тваринка у форматі 360°",
    "✅ Готовий до обертання?",
    "🖱️ Покрутіть мишкою чи пальцем",
    "🖥️ Жива 3d-модель у вас на екрані",
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
};

const Card = () => {
  // Initialize state directly with random values to avoid extra re-renders on mount
  const [name, setName] = useState(choiceRandomName);
  const [phrase, setPhrase] = useState(choiceRandomPhrase);
  const { errorModel } = useContext(ErrorModel);

  const { animation3D, setAnimation3D } = useContext(AnimationContext);
  const { modelRendered } = useContext(ModelRendered);

  const toggleAnimation = () => {
    setAnimation3D((prev) => !prev);
  };

  return (
    <main id="card">
      <div id="description-container" className="container">
        <h1>{name} Джастін</h1>
        <br />
        Знайомтеся, це <b>{petDetails.name}</b>! 🐶❤️ <b>{petDetails.name}</b> —
        чарівний <b>{petDetails.age}-річний</b> <i>{petDetails.breed} </i> з{" "}
        <b>{petDetails.nationality}</b> 💙💛, який народився{" "}
        <i>{petDetails.birthday}</i>.
        <br />
        <br />
        🛡️ Він завжди був нашим вірним <b>захисником</b>, <b>відданим другом</b>{" "}
        і <b>невід'ємною частиною</b> нашої сім'ї. 🏡❤️ Його любов, відданість і
        турбота назавжди залишаться в наших серцях. 🌈🐾
        <br />
        <br />
        🕊️ Дата смерті: <i>{petDetails.deathDay}</i>.
      </div>

      <div
        id="canvas-wrapper"
        className="container"
        style={{ padding: animation3D ? "0" : "0 0.5rem" }}>
        <button
          id="small-button"
          onClick={toggleAnimation}
          style={{ backgroundColor: animation3D ? "#cd412a" : "" }}
          aria-label={animation3D ? "Зупинити анімацію" : "Відновити анімацію"}>
          {animation3D ? (
            <svg
              id="pause-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              height="24px"
              width="24px"
              fill="#e3e3e3">
              <path d="M13,19V5h6V19H13ZM5,19V5h6V19H5Zm10-2h2V7H15V17ZM7,17H9V7H7V17ZM7,7V17V7Zm8,0V17V7Z" />
            </svg>
          ) : (
            <svg
              id="play-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              height="24px"
              width="24px"
              fill="#e3e3e3">
              <path d="M8,19V5l11,7L8,19Zm2-7Zm0,3.35L15.25,12L10,8.65v6.7Z" />
            </svg>
          )}
        </button>

        <canvas
          style={{
            display: animation3D ? "block" : "none",
          }}
        />

        {!animation3D && (
          <>
            <h1>3D перегляд 🐕</h1>
            <h4 style={{ marginTop: "1rem" }}>{phrase}</h4>
          </>
        )}

        {animation3D && !modelRendered && !errorModel && (
          <h2 id="loading-text">📥 Завантаження...</h2>
        )}

        {errorModel && animation3D && <h2 id="loading-text">🚫 Помилка...</h2>}
      </div>

      <button
        id="big-button"
        onClick={toggleAnimation}
        style={{ backgroundColor: animation3D ? "#cd412a" : "" }}>
        {animation3D ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              height="24px"
              width="24px"
              fill="#e3e3e3">
              <path d="M13,19V5h6V19H13ZM5,19V5h6V19H5Zm10-2h2V7H15V17ZM7,17H9V7H7V17ZM7,7V17V7Zm8,0V17V7Z" />
            </svg>
            <h2>Зупинити анімацію</h2>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              height="24px"
              width="24px"
              fill="#e3e3e3">
              <path d="M8,19V5l11,7L8,19Zm2-7Zm0,3.35L15.25,12L10,8.65v6.7Z" />
            </svg>
            <h2>Відновити анімацію</h2>
          </>
        )}
      </button>
    </main>
  );
};

export default Card;
