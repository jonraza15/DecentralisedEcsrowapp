import DApp from './pages/DApp';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import {Routes, Route} from 'react-router-dom';

function App() {

  return (<>
          <Header />
          <div className='app-body'>
          <Routes>
            <Route path='/' element={<DApp />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
          </div>
        </>
  );
}

export default App;
