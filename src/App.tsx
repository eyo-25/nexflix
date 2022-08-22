import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './Components/Header';
import { Home } from './Routes/Home';
import Search from './Routes/Search';
import { Tv } from './Routes/Tv';

function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
          <Route path="/" element={<Home/>}>
              <Route path="/movies/:types/:movieId" element={<Home/>}/>
          </Route>
          <Route path="/tvs" element={<Tv/>}>
              <Route path="/tvs/:types/:tvId" element={<Tv/>}/>
          </Route>
          <Route path="/Search" element={<Search/>}>
            <Route path="/Search/:types/:tvId" element={<Search/>}/>
            <Route path="/Search/:types/:tvId" element={<Search/>}/>
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
