import React from 'react';
import './App.css';
import TextArea from './component/TextArea/TextArea';
import Header from './component/Header/Header';

const App = () => (
  <div className="App">
    <header className="App-header">
      <Header />
      <TextArea />
    </header>
  </div>
);

export default App;
