import React from 'react';
import './App.css';
import Footer from './components/Footer';
import Person from './components/Person';

function App() {
  return (
    <div className="App">
      <Footer />
      <Person memberName={'Andrew Song'} team={'Website Redesign Team'} role={'Developer'} pronouns={'he/him'} />
    </div>
  );
}

export default App;
