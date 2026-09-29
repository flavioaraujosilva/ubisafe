import styles from './App.module.css';
import { Header } from './components/Header/Header';

export function App() {
  return (
    <div className={styles.page}>
      <Header title="User Management" />
      <main className={styles.content} />
    </div>
  );
}
