import { useEffect, useState } from 'react';
import ProgressBar from './ProgressBar';
import { supabase } from '../../infra/supabase/supabaseClient';

const SubmitWork = () => {
  const [erroMensagem, setErroMensagem] = useState(null);
  const [dadosRegional, setDadosRegional] = useState([]);
  const [dadosUnidadeRegional, setUnidadeRegional] = useState([]);
  
  const [formData, setFormData] = useState({
    nucleo: '', // Armazena o ID do núcleo de extensão selecionado
    nome: '',
    matricula: '',
    regional: '', // Armazena o ID da regional selecionada
    unidade: '', // Armazena o código da unidade selecionada
    cursos: [],
    eixo: '',
    periodo: '',
    atividade: '',
    realizou: ''
  });

  // 1. Busca as Regionais iniciais
  useEffect(() => {
    async function fetchItems() {
      try {
        const { data, error } = await supabase.from('Regional').select('*');
        if (error) throw error;
        setDadosRegional(data);
      } catch (error) {
        setErroMensagem('Erro ao buscar regionais: ' + error.message);
      }
    }
    fetchItems();
  }, []);

  // 2. Busca as Unidades quando uma Regional é selecionada
  useEffect(() => {
    async function fetchUnidades() {
      if (!formData.regional) {
        setUnidadeRegional([]);
        return;
      }

      try {
        // ALTERAÇÃO: Simplifiquei a query. 
        // Se a tabela 'Unidades_Regional' tem a coluna 'id_regional', 
        // basta filtrar diretamente nela sem tentar fazer o inner join complexo que causava o erro de recurso.
        const { data, error } = await supabase
          .from('Unidades_Regional')
          .select('id_regional, codigo_unidade, nome_unidade')
          .eq('id_regional', formData.regional);

        if (error) throw error;
        setUnidadeRegional(data);
      } catch (error) {
        console.error('Erro ao buscar unidades:', error.message);
        setErroMensagem('Erro ao buscar unidades da regional.');
      }
    }

    fetchUnidades();
  }, [formData.regional]);

  return (
    <div>
      <ProgressBar currentStep={1} />
      <header>
        <h2>Envio de Evidências {formData.nucleo === 'LTD/NID' && '- LTD/NID 2026.1'}</h2>
      </header>

      {erroMensagem && (
        <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          ⚠️ {erroMensagem}
        </div>
      )}

      {!erroMensagem && dadosRegional.length !== 0 ? (
        <div>
          <p>Olá, <strong>Douglas</strong>. Preencha os campos abaixo:</p>
          
          <label>3. Selecione sua Regional *</label>
          <br />
          <select 
            value={formData.regional}
            onChange={(e) => {
              const valor = e.target.value;
              setFormData({ ...formData, regional: valor, unidade: '' }); // Limpa a unidade ao trocar regional
            }}
          >
            <option value="">Selecione uma Regional</option>
            {dadosRegional.map((reg) => (
              <option key={reg.id_regional} value={reg.id_regional}>
                {reg.nome_regional}
              </option>
            ))}
          </select>

          {/* ALTERAÇÃO: Renderização Condicional. 
            O segundo select só aparece se formData.regional tiver um valor (não for string vazia).
          */}
          {formData.regional && (
            <div style={{ marginTop: '20px' }}>
              <label>4. Selecione sua Unidade *</label>
              <br />
              <select 
                value={formData.unidade}
                onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
              >
                <option value="">Selecione a unidade</option>
                {dadosUnidadeRegional.map((unid) => (
                  <option key={unid.codigo_unidade} value={unid.codigo_unidade}>
                    {unid.nome_unidade}
                  </option>
                ))}
              </select>
            </div>
          )}
          {formData.unidade && (
            <div style={{ marginTop: '20px' }}>
              <label>5. Selecione seu Núcelo de Extensão *</label>
              <br />
              <select 
                value={formData.nucleo}
                onChange={(e) => setFormData({ ...formData, nucleo: e.target.value })}
              >
                <option value="">Selecione o Núcleo</option>
                <option value="LTD/NID">LTD/NID</option>
                
              </select>
            </div>
          )}
        </div>
      ) : (
        !erroMensagem && <p>Carregando dados...</p>
      )}
    </div>
  );
};

export default SubmitWork;