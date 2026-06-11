import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext'
import 'leaflet/dist/leaflet.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  /*  O React.StrictMode é necessário para ativar verificações adicionais e avisos durante o desenvolvimento, ajudando a identificar problemas potenciais no código e garantindo que a aplicação siga as melhores práticas do React. 
  Ele é uma ferramenta útil para melhorar a qualidade do código e evitar bugs, mas não afeta o comportamento da aplicação em produção. 
  Sem o React.StrictMode, essas verificações adicionais não seriam realizadas, o que poderia resultar em um código menos robusto e mais propenso a erros. */  
  
  <React.StrictMode>
      {/* O RouterProvider é necessário para que as rotas sejam renderizadas corretamente,
        Ele é responsável por fornecer o contexto de roteamento para toda a aplicação, permitindo que as rotas sejam definidas e renderizadas conforme
        especificado no arquivo routes.jsx. Sem o RouterProvider, as rotas não seriam renderizadas, e você não veria o conteúdo das páginas correspondentes às rotas.
        O RouterProvider é uma parte fundamental do sistema de roteamento do React Router, garantindo que as rotas sejam processadas e exibidas corretamente em toda a aplicação.
      */}
      {/* AuthProvider     - Aula 03
        O AuthProvider é responsável por fornecer o contexto de autenticação para toda a aplicação.
        Ele gerencia o estado de autenticação do usuário, permitindo que componentes filhos acessem informações
        de login e autenticação sem necessidade de prop drilling. Sem o AuthProvider, os componentes não teriam
        acesso aos dados de autenticação e não poderiam verificar se o usuário está logado ou acessar seu perfil. */}
       
      <AuthProvider>  
        <RouterProvider router={router} />
      </AuthProvider> 
  </React.StrictMode>
);