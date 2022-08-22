import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './Components/Header';
import { Home } from './Routes/Home';
import { Search } from './Routes/Search';
import { Tv } from './Routes/Tv';

function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
          <Route path="/" element={<Home/>}>
            <Route path="/movies/:movieId" element={<Home/>}/>
          </Route>
      </Routes>
      <Routes>
          <Route path="/tv" element={<Tv/>}/>
      </Routes>
      <Routes>
          <Route path="/Search" element={<Search/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
