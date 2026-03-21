import { Link } from "react-router-dom";
import "../style/about.css";

export default function About() {
  return (
    <div className="About">
      <Link to={"/"} className="About-link">
        Dashboard
      </Link>
      <h1>About this web</h1>
      <p>
        This is my personal project, I built this website with the purpose of
        recording my expenses and income.
      </p>
    </div>
  );
}
