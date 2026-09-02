import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import GithubAnalyzer from './pages/GithubAnalyzer'
import Progress from './pages/Progress'
import Roadmap from './pages/Roadmap'
import SkillAnalysis from './pages/SkillAnalysis'
import Footer from './components/Footer'
import Quiz from './pages/Quiz'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>

          <Route path='/' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
          <Route path='/analysis' element={<ProtectedRoute><SkillAnalysis/></ProtectedRoute>}/>
          <Route path='/progress' element={<ProtectedRoute><Progress/></ProtectedRoute>}/>
          <Route path='/roadmap' element={<ProtectedRoute><Roadmap/></ProtectedRoute>}/>
          <Route path='/github' element={<ProtectedRoute><GithubAnalyzer/></ProtectedRoute>}/>
          <Route path='/quiz' element={<ProtectedRoute><Quiz/></ProtectedRoute>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
