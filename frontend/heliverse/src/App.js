import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Group from './pages/Group';


function App() {
  return (
    <Router>
   <Navbar />
      <Routes>
        <Route path='/' element = { <Home />} />
        <Route path='/group' element = { <Group />} />
      </Routes>
    </Router>
  );
}

export default App;
