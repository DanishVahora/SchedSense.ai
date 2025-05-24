import { useState } from 'react'
import LandingPage from './pages/LandingPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LandingPage></LandingPage>
    </>
  )
}

export default App
