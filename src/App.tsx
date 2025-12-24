import { Link } from 'react-router-dom'
import { Header } from '@/Header'

function App() {
  return (
    <>
      <Header />
      <h1>Vite + React</h1>
      <div>
        <p>
          <Link to="/health">/health</Link>
        </p>
      </div>
    </>
  )
}

export default App
