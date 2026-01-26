import { Link } from "react-router-dom";

import styles from "@/Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <Link to="/" aria-label="Go to home">
        <img src="/logo.webp" alt="Logo" className={styles.logo} />
      </Link>
    </header>
  );
}
