import styles from "@/Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <img src="/logo.webp" alt="Logo" className={styles.logo} />
    </header>
  );
}
