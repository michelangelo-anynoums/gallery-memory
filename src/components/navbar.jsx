import "../styles/navbar.css";
import confetti from "@hiseb/confetti";

const Navbar = () => {
  return (
    <nav id="navbar">
      <h1>
        <span
          onClick={() => confetti()}
          role="button"
          tabIndex={0}
          aria-label="Trigger confetti">
          🐾
        </span>
        Джастін
      </h1>
    </nav>
  );
};

export default Navbar;
