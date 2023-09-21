import "bootstrap/dist/css/bootstrap.min.css"
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import {Routes, Route, Navigate} from "react-router-dom"
import { Home } from "./Home"
import "./styles/style.css"
import "./styles/canvasStyle.css"


function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
