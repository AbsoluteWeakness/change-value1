import React from 'react';

import './App.css';
import Converter from './components/valueConverter/Converter';
import NewsFeed from './components/news/newsFeed/newsFeed';

const App: React.FC = () => {
  return (

    <div className="App">

      <Converter />
      <NewsFeed></NewsFeed>
    </div>
  );
}

export default App;
