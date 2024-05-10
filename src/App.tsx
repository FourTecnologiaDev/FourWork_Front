import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import TicketTable from './pages/Table/Table';
import Cadastro from './pages/Cadastro/Table';
import RAT from './pages/RAT/table';
import RatTable from './pages/RATS/table';
import Apontamento from './pages/cadastro2/Apontamento';

function App() {
  const { pathname } = useLocation();
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    // Recuperar o e-mail do usuário do localStorage após o login bem-sucedido
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  return (
    <Routes>
      <Route
        index
        element={
          <>
            <PageTitle title="Four Work - Gestão de atividades e faturamento" />
            <SignIn />
          </>
        }
      />

      <Route
        path="/cadastro/Table"
        element={
          <>
          <PageTitle title="Four Work - Gestão de atividades e faturamento" />
          <Apontamento loggedInEmail={userEmail}/>
          </> 
        }
      />

      <Route
        path="/cadastro2/Apontamento"
        element={
          <>
          <PageTitle title="Four Work - Gestão de atividades e faturamento" />
          <Cadastro loggedInEmail={userEmail}/>
          </> 
        }
      />

      <Route
        path="/RATS/Table"
        element={
          <>
          <PageTitle title="Four Work - Gestão de atividades e faturamento" />
          <RatTable/>
          </> 
        }
      />



      <Route
        path="/rat/Table"
        element={
          <>
          <PageTitle title="Four Work - Gestão de atividades e faturamento" />
          <RAT/>
          </> 
        }
      />
      
      <Route
        path="/Table/Table"
        element={
          <>
            <PageTitle title="Four Work - Gestão de atividades e faturamento" />
            <TicketTable loggedInEmail={userEmail} />
          </>
        }
      />

      <Route
        path="/login"
        element={
          <>
            <PageTitle title="Four Work - Gestão de atividades e faturamento" />
            <SignIn />
          </>
        }
      />

    </Routes>
  );
}

export default App;
