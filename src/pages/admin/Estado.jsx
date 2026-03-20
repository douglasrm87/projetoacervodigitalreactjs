import { useEffect, useState } from 'react';
import { supabase } from '../../infra/supabase/supabaseClient'
// REACT_APP_SUPABASE_ANON_KEY
// REACT_APP_SUPABASE_URL
function Estado() {
    
  console.log("URL do Supabase:", process.env.REACT_APP_SUPABASE_URL);
  console.log("Ambiente de execução:", process.env.NODE_ENV);
  const [erroMensagem, setErroMensagem] = useState(null); // Estado para a mensagem de erro

  const [dados, setDados] = useState([])
  useEffect(() => {
    async function fetchItems() {

        try {
              console.log ("Estrtura objeto Supabase: - ",supabase)
              // Selecionar dados da tabela Estado criada no Supabase.
              const { data } = await supabase.from('Estado').select('*')
              console.log ("Dados tabela Estado - ",data,data.id, data.nome, data.capital)
              setDados(data)

                const { data: Estado, error } = await supabase.from('Estado').select('*')
                if (error) {
                  console.error('Erro ao buscar dados:', error)
                } else {
                  console.log('Dados de Estado:', Estado)
                }
        } catch (error) {
              setErroMensagem('Erro ao buscar dados (Estado.jsx): ' + error.message);
              console.error('Erro ao buscar dados:', error);
        }
    }

    fetchItems()
  }, []) 
  return (
    <div>
      <h1>Estado</h1>    
        <p>Bem-vindo à página de estados! Aqui você pode encontrar informações sobre os diferentes estados disponíveis, seus dados, cidades e eventos relacionados. Explore as opções e descubra as oportunidades que cada estado oferece. Se você é um usuário, esta é a página ideal para conhecer mais sobre os estados e escolher o que melhor se encaixa em seus interesses e objetivos. Aproveite para explorar os recursos e informações disponíveis para cada estado!</p>

        <h2>Dados do Banco de dados Relacional - Supabase:</h2>


        {/* Exibição da mensagem de erro em HTML caso exista */}
        {erroMensagem && (
          <div style={{ 
                backgroundColor: '#ffebee', 
                color: '#c62828', 
                padding: '15px', 
                borderRadius: '8px', 
                border: '1px solid #ef9a9a',
                marginBottom: '20px',
                fontWeight: 'bold'
              }
              }>
            ⚠️ Atenção: {erroMensagem}
          </div>
        )}

            {/* Renderização condicional do Mapa ou lista */}
            {
                !erroMensagem && dados.length === 0 ? (
                  <p>Carregando pontos do Hard Rock...</p>
                ) : (

                    <table style={{
                        width: "100%",
                        borderCollapse: "collapse", fontFamily: "Arial, sans-serif"   }}>
                        <thead>
                          <tr style={{ backgroundColor: "#f4f4f4" }}>
                            <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Nome</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Capital</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dados.map(item => (
                            <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                              <td style={{ padding: "10px" }}>{item.nome}</td>
                              <td style={{ padding: "10px" }}>{item.capital}</td>
                            </tr>
                          ))}
                        </tbody>
                    </table>                                  
                )
          }
    </div>
  )
}
export default Estado
