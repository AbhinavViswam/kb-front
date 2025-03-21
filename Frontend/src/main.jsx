import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import BoardProvider from './context/BoardContext.jsx'

createRoot(document.getElementById('root')).render(
    <BoardProvider>
      <App />
    </BoardProvider>
)