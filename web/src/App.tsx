import styles from './App.module.css';
import { Header } from './components/Header/Header';
import { CharacterList } from './components/CharacterList/CharacterList';

export function App() {
  return (
    <div className={styles.page}>
      <Header title="User Management" />
      <main className={styles.content}>
        <CharacterList />
      </main>
    </div>
  );
}
