import './App.css'
import AppRoute from './routes/AppRoute'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      <AppRoute />
      <Toaster />
    </BrowserRouter>
  )
}

export default App
