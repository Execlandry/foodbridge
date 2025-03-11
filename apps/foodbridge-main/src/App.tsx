import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import Home from './routes/home';
import Header from './components/nav';
import SignIn from './routes/signin';
import SignUp from './routes/signup';

import './styles/index.css';
import './styles/tailwind.css';
import { UserContext } from './hooks/user-context';
import FetchUser from './hooks/fetch-user';

function Layout() {
  return (
    <>
      <Header/>
      <Outlet />
    </>
  );
}

const App = () => {
  const {user,
  setUser,
  isLoading} = FetchUser();
  return (
    <BrowserRouter>
    <UserContext.Provider value={{user,
      setUser,
      isLoading}}>

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

        </Route>
      </Routes>
    </UserContext.Provider>
    </BrowserRouter>

  )
}

export default App
