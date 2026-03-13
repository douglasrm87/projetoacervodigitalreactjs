import { useEffect, useState } from 'react';
import { supabase } from '../../infra/supabase/supabaseClient'

function Estado() {
    
  console.log("URL do Supabase:", process.env.REACT_APP_SUPABASE_URL);

  const [dados, setDados] = useState([])
  useEffect(() => {
    async function fetchItems() {
      console.log ("Estrtura objeto Supabase: - ",supabase)
      const { data } = await supabase.from('Estado').select('*')
      console.log ("Dados tabela Estado - ",data,data.id, data.nome)
      setDados(data)

        const { data: Estado, error } = await supabase.from('Estado').select('*')
        if (error) {
          console.error('Erro ao buscar dados:', error)
        } else {
          console.log('Dados de Estado:', Estado)
        }
    }
    fetchItems()
  }, []) 
  return (
    <div>
      <h1>Estado</h1>    
        <p>Bem-vindo à página de estados! Aqui você pode encontrar informações sobre os diferentes estados disponíveis, seus dados, cidades e eventos relacionados. Explore as opções e descubra as oportunidades que cada estado oferece. Se você é um usuário, esta é a página ideal para conhecer mais sobre os estados e escolher o que melhor se encaixa em seus interesses e objetivos. Aproveite para explorar os recursos e informações disponíveis para cada estado!</p>

      <h2>Dados do Supabase:</h2>
      {dados.map(item => <p key={item.id}>{item.nome}</p>)}
    </div>
  )
}
export default Estado
