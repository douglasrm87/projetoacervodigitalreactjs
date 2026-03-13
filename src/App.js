import { Outlet } from 'react-router-dom';
import NavBar from './componentes/NavBar';
import './App.css';


function App() {

  
  return (
    <>
      <h1>Acervo Digital</h1>
      {/* A NavBar é necessária para que a barra de navegação seja exibida em todas as páginas da aplicação, permitindo que os usuários naveguem facilmente entre as diferentes seções do site. */}
      {/* Sem a NavBar, os usuários teriam dificuldade em acessar outras páginas da aplicação, o que poderia resultar em uma experiência de usuário ruim e dificultar a navegação. */}
      {/* A NavBar é uma parte fundamental do layout da aplicação, proporcionando uma maneira intuitiva e acessível para os usuários explorarem o conteúdo do site. */}
      <NavBar />
      {/* Resto do conteúdo da página */}
      {/* O Outlet é onde os componentes filhos serão renderizados */}
      {/* Ele é necessário para que as rotas filhas sejam exibidas dentro do layout do App */}
      {/* Sem o Outlet, as rotas filhas não seriam renderizadas, e você não veria o conteúdo das páginas correspondentes às rotas */}
      {/* O Outlet é uma parte fundamental do sistema de roteamento do React Router, permitindo que você crie layouts reutilizáveis e organize suas rotas de forma hierárquica */}
      {/* Ele é especialmente útil quando você tem um layout comum para várias páginas, como um cabeçalho ou uma barra de navegação, e deseja renderizar o conteúdo específico de cada página dentro desse layout */}
      {/* Em resumo, o Outlet é essencial para que as rotas filhas sejam renderizadas corretamente dentro do layout do App, garantindo que o conteúdo das páginas seja exibido conforme esperado. */}
      <Outlet />
      {/* Exemplo de exibição dos dados obtidos do Supabase */}

      
    </>
  );
}
export default App;
