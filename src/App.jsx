import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import FormPage from './components/FormPage'
import EventPage from './components/EventPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<FormPage />} />
        <Route path='/:slug' element={<EventPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
