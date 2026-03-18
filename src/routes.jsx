// O arquivo src/routes.jsx é responsável por definir as rotas da aplicação utilizando a biblioteca react-router-dom. Ele importa os componentes necessários, como Login, App e FirstAccess, e utiliza a função createBrowserRouter para criar um roteador que mapeia as URLs para os componentes correspondentes. As rotas definidas incluem a rota de login (/login) que renderiza o componente Login, e a rota raiz (/) que renderiza o componente App, com uma rota filha (/first-access) que renderiza o componente FirstAccess. Este arquivo é essencial para a navegação da aplicação, permitindo que os usuários acessem diferentes páginas com base nas URLs.
// Ele é necessário para organizar a estrutura de navegação da aplicação e garantir que os componentes corretos sejam renderizados quando os usuários acessarem as diferentes rotas. Sem este arquivo, a aplicação não teria uma estrutura de navegação clara, o que dificultaria a experiência do usuário e a organização do código.
// Importação da função createBrowserRouter do react-router-dom para criar o roteador da aplicação
import { createBrowserRouter } from 'react-router-dom';
// Importação dos componentes de página que serão renderizados nas rotas correspondentes
import Login from './pages/Login';
// Importação do componente App, que serve como o layout principal da aplicação, onde as rotas filhas serão renderizadas
import App from './App';
// Importação do componente FirstAccess, que é a página de primeiro acesso onde os usuários definem suas senhas pela primeira vez
import FirstAccess from './pages/FirstAccess';
import SubmitWork from './pages/SubmitWork';
import ReviewQueue from './pages/ReviewQueue';
import Certificate from './pages/Certificate';
import Dashboard from './pages/Dashboard';
import Faculties from './pages/admin/Faculties';
import Estado from './pages/admin/Estado';
import MapPage from './mapabrasil/MapPage';
import DetailsPage from './mapabrasil/DetailsPage';
import MapPageBD from './mapabrasilargentinabd/MapPageBD';
import DetailsPageBD from './mapabrasilargentinabd/DetailsPageBD';

// Definição das rotas da aplicação utilizando createBrowserRouter.
// A rota '/login' renderiza o componente Login, que é a página de login da aplicação.
// A rota raiz '/' renderiza o componente App, que é o layout principal da aplicação. Dentro do App, há uma rota filha '/first-access' que renderiza o componente FirstAccess, a página de primeiro acesso.     
// O router é exportado para ser utilizado no arquivo principal da aplicação, onde será passado para o componente RouterProvider para habilitar a navegação entre as rotas definidas. Ele é necessário para que a aplicação possa navegar entre as diferentes páginas com base nas URLs, proporcionando uma experiência de usuário fluida e organizada. Sem o router, a aplicação não teria uma estrutura de navegação clara, o que dificultaria a experiência do usuário e a organização do código.
// Em resumo, o arquivo src/routes.jsx é fundamental para a definição das rotas da aplicação, permitindo que os usuários acessem diferentes páginas com base nas URLs e garantindo uma estrutura de navegação clara e organizada.

// index: Define a rota raiz como a página de primeiro acesso. Isso significa que quando os usuários acessarem a URL raiz ("/"), eles serão redirecionados automaticamente para a página de primeiro acesso, onde poderão definir suas senhas pela primeira vez. Essa configuração é útil para garantir que os usuários sejam direcionados para a página correta ao acessar a aplicação pela primeira vez, proporcionando uma experiência de usuário mais intuitiva e eficiente. Sem essa configuração, os usuários poderiam acessar a URL raiz sem serem redirecionados para a página de primeiro acesso, o que poderia resultar em confusão e dificultar o processo de definição de senha para novos usuários.
export const router = createBrowserRouter([
  { path: '/login', element: <Login/> },
  {
    path: '/', element: <App/>, children: [
      { index: true, element: <Dashboard/> },

      { path: 'first-access', element:  <FirstAccess/> },
      { path: 'submit', element: <SubmitWork/> },
      { path: 'review', element: <ReviewQueue/> },
      { path: 'certificate', element: <Certificate/> },

      { path: 'admin/faculties', element:  <Faculties/> },
      { path: 'admin/estado', element:  <Estado/> },

      { path: 'mapabrasil', element:  <MapPage/> },
      { path: "/details/:id", element: <DetailsPage />},
      { path: 'mapabrasilbd', element:  <MapPageBD/> },
      { path: "/detailsbd/:id", element: <DetailsPageBD />},

    ]
  }
]);
