import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './Layout'
import Trends from './pages/Trends'
import Economy from './pages/Economy'
import FedData from './pages/FedData'
import Startups from './pages/Startups'
import Community from './pages/Community'
import Ideas from './pages/Ideas'
import Sources from './pages/Sources'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/ideas" replace />} />
        <Route path="ideas" element={<Ideas />} />
        <Route path="trends" element={<Trends />} />
        <Route path="economy" element={<Economy />} />
        <Route path="fed" element={<FedData />} />
        <Route path="startups" element={<Startups />} />
        <Route path="community" element={<Community />} />
        <Route path="sources" element={<Sources />} />
      </Route>
    </Routes>
  )
}

export default App
