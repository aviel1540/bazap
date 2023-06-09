import { Card } from 'react-bootstrap';
import Home from './components/Home/Home';
import Header from './components/layout/Header/Header'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import ProjectsList from './components/Projects/ProjectList/ProjectsList';
import { ProjectPage } from './components/Projects/ProjectList/Project/ProjectPage';

function App() {
  return (
    <>
      <Provider store={store}>
        <Router>
          <Header />
          <Card className='m-5 mt-2 bg-transparent border-0'>
            <Card.Body>
              <Routes>
                <Route path='' exact Component={Home} />
                <Route path='/' exact Component={Home} />
                <Route path='/ProjectsList' Component={ProjectsList} />
                <Route path="/project/:id" exact Component={ProjectPage} />
              </Routes>
            </Card.Body>
          </Card>
        </Router>
      </Provider>
    </>
  )
}

export default App
