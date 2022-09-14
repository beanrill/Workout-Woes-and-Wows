import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddExercisePage from './pages/AddExercisePage';
import EditExercisePage from './pages/EditExercisePage';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [exerciseToEdit, setExerciseToEdit] = useState();

  return (
    <body>
      <div className="App">
        <h1 className='App-name'>Workout Woes and Wows</h1>
        <p className='App-tagline'>Don't fret if you forget! Record your daily/weekly/monthly achievements below and celebrate that pump!</p>
        <Router>
          <nav>
            <Link className='App-link' to="/">Home</Link>
            <Link className='App-link' to="/add-exercise">Add New Exercise</Link>
          </nav>
          <div className="App-header">
            <Route path="/" exact>
              <HomePage setExerciseToEdit={setExerciseToEdit} />
            </Route>
            <Route path="/add-exercise">
              <AddExercisePage />
            </Route>
            <Route path="/edit-exercise">
              <EditExercisePage exerciseToEdit={exerciseToEdit} />
            </Route>
            </div>
        </Router>
        <footer>&copy; 2022 Bianca Davies</footer>
      </div>
    </body>
  );
}

export default App;