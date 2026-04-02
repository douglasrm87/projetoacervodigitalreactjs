import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProgressBar from './ProgressBar';
import { supabase } from '../../infra/supabase/supabaseClient';
import styles from './SubmitWork.module.css';
import { fetchEixosPorNucleo } from '../../services/eixoService';


const SubmitWork = () => {
  const [erroMensagem, setErroMensagem] = useState(null);
  const [dadosRegional, setDadosRegional] = useState([]);
  const [dadosUnidadeRegional, setUnidadeRegional] = useState([]);
  const [dadosNucleosExtensao, setNucleosExtensao] = useState([]);
  const [dadosCursosNucleo, setCursosNucleo] = useState([]);
  const [dadosEixoNucleo, setEixoNucleo] = useState([]);
  const navigate = useNavigate();
 

  const [formData, setFormData] = useState({
    codigo_nucleo: '', // Armazena o ID do núcleo de extensão selecionado
    id_nucleo_extensao: '', // Armazena o ID do núcleo de extensão selecionado
    nome: '',
    matricula: '',
    regional: '', // Armazena o ID da regional selecionada
    unidade: '', // Armazenará o id da unidade selecionada para ser usado na pesquisa aos núcleos
    cursos: [],
    eixo: '',
    periodo: '',
    atividade: '',
    realizou: ''
  });

  const handleAvançar = () => {
    navigate('/SubmitWorkTela02', { state: { data: formData } });
  };

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
          .select('id_unidade_regional, codigo_unidade, nome_unidade')
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

// 3. Busca os Nucleos de extensão quando uma Unidade é selecionada
  useEffect(() => {
    async function fetchNucleosExtensao() {
      if (!formData.unidade) {
        setNucleosExtensao([]);
        return;
      }
      //alert ("formData.unidade: " + formData.unidade)

      try {
        const { data, error } = await supabase
          .from('Nucleo_Extensao')
          .select('id_nucleo_extensao, codigo_nucleo, nome_nucleo')
          .eq('id_unidade_regional', formData.unidade);

        if (error) throw error;
           setNucleosExtensao(data);
      } catch (error) {
        console.error('Erro ao buscar núcleos de extensão:', error.message);
        setErroMensagem('Erro ao buscar núcleos de extensão.');
      } 
    }

    fetchNucleosExtensao();
  }, [formData.unidade]);

// 4. Busca os Cursos do Nucleo de extensão
  useEffect(() => {
    async function fetchCursosNucleoExtensao() {
      if (!formData.id_nucleo_extensao) {
        setNucleosExtensao([]);
        return;
      }
      //alert ("formData.id_nucleo_extensao: " + formData.id_nucleo_extensao)
      try {
        const { data, error } = await supabase
          .from('Cursos_Nucleo_Extensao')
          .select('id_curso_nucleo, nome_curso_nucleo')
          .eq('id_nucleo_extensao', formData.id_nucleo_extensao);

        if (error) throw error;
           setCursosNucleo(data);
      } catch (error) {
        console.error('Erro ao buscar cursos do núcleo de extensão:', error.message);
        setErroMensagem('Erro ao buscar cursos do núcleo de extensão.');
      } 
    }

    fetchCursosNucleoExtensao();
  }, [formData.id_nucleo_extensao]);

  useEffect(() => {
  // 1. Defesa: Verifica se o valor existe e não é uma string vazia ou nula
  const idAtual = formData.id_nucleo_extensao;

  if (!idAtual) {
    setEixoNucleo([]);
    return;
  }
  //alert ("formData.id_nucleo_extensao: " + formData.id_nucleo_extensao)
  const carregarEixos = async () => {
    try {
      // 2. Forçamos a conversão para Number aqui para garantir que o serviço receba o tipo correto
      const data = await fetchEixosPorNucleo(Number(idAtual));
      setEixoNucleo(data);
    } catch (error) {
      console.error("Erro no carregamento de eixos:", error);
      setErroMensagem('Erro ao carregar eixos.');
    }
  };

  carregarEixos();
}, [formData.id_nucleo_extensao]); // O efeito observa exatamente esta mudança

  return (
    <div className={styles.container}>
      <ProgressBar currentStep={1} />
      <header  className={styles.header}>
        <h2>Envio de Evidências </h2>
      </header>

      {erroMensagem && (
        <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          ⚠️ {erroMensagem}
        </div>
      )}

      {!erroMensagem && dadosRegional.length !== 0 ? (
        <div className={styles.formGroup}>
          <p>Olá, <strong>Douglas</strong>. Preencha os campos abaixo:</p>
          <p className={styles.tip}><span className={styles.required}>*</span> Obrigatória</p>
          <label className={styles.label}>1. Selecione sua Regional  <span className={styles.required}>*</span></label>
          <select className={styles.select}
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

          {/*  Selecionar Unidades - Renderização Condicional. 
            O segundo select só aparece se formData.regional tiver um valor (não for string vazia).
          */}
          {formData.regional && (
              <div className={styles.formGroup}>
                <label className={styles.label}>2. Selecione sua Unidade  <span className={styles.required}>*</span></label>
                <select className={styles.select}
                  /* Adicionamos o 'value' aqui para o componente ficar "controlado" */
                  value={formData.unidade || ""} 
                  onChange={(e) => {
                    // Convertemos para Number para evitar conflitos de tipos (string vs integer) no banco
                    const valorSelecionado = e.target.value ? Number(e.target.value) : "";
                    setFormData({ ...formData, unidade: valorSelecionado });
                  }}
                >
                  <option value="">Selecione a unidade</option>
                  {dadosUnidadeRegional.map((unid) => (
                    <option 
                      key={unid.id_unidade_regional} // Use o ID como chave única no React
                      value={unid.id_unidade_regional} // O que vai para o banco de dados
                    >
                      {unid.nome_unidade} {/* O que o usuário enxerga */}
                    </option>
                  ))}
                </select>
              </div>
            )}
          {/* Selecionar Nucleos de extensão - Renderização Condicional. */}
          {formData.unidade && (
              <div className={styles.formGroup}>
                <label>3. Selecione seu Núcelo de Extensão  <span className={styles.required}>*</span></label>
                <select 
                  className={styles.select}
                  value={formData.id_nucleo_extensao || ""} 
                  onChange={(e) => {
                    // IMPORTANTE: Pegamos o valor diretamente do evento para evitar atrasos do estado
                    const novoId = e.target.value; 
                    setFormData({ 
                      ...formData, 
                      id_nucleo_extensao: novoId,
                      eixo: '' // Limpa o eixo anterior ao trocar de núcleo
                    });
                  }}
                >
                  <option value="">Selecione o Núcleo</option>
                  {dadosNucleosExtensao.map((nuc) => (
                    <option key={nuc.id_nucleo_extensao} value={nuc.id_nucleo_extensao}>
                      {nuc.nome_nucleo}
                    </option>
                  ))}
                </select>
              </div>
          )}
           {/* Selecionar os Cursos do Nucleo de extensão - Renderização Condicional. dadosCursosNucleo*/}
  
          {formData.id_nucleo_extensao && (
            
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <strong>5. Selecione os Cursos vinculados ao Núcleo <span className={styles.required}>*</span></strong>
              </label>
              
              {/* Este é o container principal da lista */}
              <div className={styles.checkboxContainer}>
                {
                  dadosCursosNucleo.length > 0 ? (
                  dadosCursosNucleo.map((curso) => (
                    /* Este container garante que o input e o label fiquem na mesma linha */
                    <div key={curso.id_curso_nucleo} className={styles.checkboxItem}>
                      <label htmlFor={`curso.${curso.id_curso_nucleo}`} 
                            className={styles.checkboxLabel}>
                        {curso.nome_curso_nucleo}
                      </label>
                      <input
                        type="checkbox"
                        id={`curso.${curso.id_curso_nucleo}`}
                        className={styles.checkboxInput}
                        value={curso.id_curso_nucleo} 
                        checked={formData.cursos.includes(Number(curso.id_curso_nucleo))}
                        onChange={(e) => {
                          const cursoId = Number(e.target.value);
                          let novosCursos = [...formData.cursos];
                          if (e.target.checked) {
                            if (!novosCursos.includes(cursoId)) novosCursos.push(cursoId);
                          } else {
                            novosCursos = novosCursos.filter(id => id !== cursoId);
                          }
                          setFormData({ ...formData, cursos: novosCursos });
                          
                        }}
                        
                      />
                    </div>
                  ))
                ) : (
                  <p className={styles.tip}>Nenhum curso disponível.</p>
                )}
              </div>
            </div>
          )}

          
          {/* Selecionar Nucleos de extensão - Renderização Condicional. */}
          {formData.id_nucleo_extensao && (
              <div className={styles.formGroup}>
                <label>6. Selecione Eixo do Núcelo de Extensão  <span className={styles.required}>*</span></label>
                <select className={styles.select}
                  value={formData.eixo}
                  onChange={(e) => setFormData({ ...formData, id_eixo_nucleo: e.target.value })}  >
                  <option value="">Selecione o Eixo no Núcleo</option>
                  {dadosEixoNucleo.map((nuc) => (
                    <option key={nuc.id_eixo_nucleo} value={nuc.id_eixo_nucleo}>
                      {nuc.nome_eixo}
                    </option>
                  ))}
                </select>
              </div>
          )}

          {/* Preencher demais dados */}
          {formData.cursos.length !== 0 && (
             <div className={styles.formGroup}>
                <label className={styles.label}>Informe seu nome: <span className={styles.required}>*</span></label>
                <input 
                  type="text" 
                  placeholder="Insira sua resposta" 
                  className={styles.input}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                />
                <span className={styles.tip}>Esta pergunta é obrigatória.</span>

                <label className={styles.label}>Matrícula Docente: <span className={styles.required}>*</span></label>
                <input 
                  type="number" 
                  placeholder="Insira sua resposta" 
                  className={styles.input}
                  onChange={(e) => setFormData({...formData, matricula: e.target.value})}
                />
                <span className={styles.tip}>Esta pergunta é obrigatória.</span>

                <label className={styles.label}>7. Período: <span className={styles.required}>*</span></label>
                    <select className={styles.select} onChange={(e) => setFormData({...formData, periodo: e.target.value})}>
                      <option value="">Selecionar...</option>
                      <option>Março/2026</option>
                      <option>Abril/2026</option>
                      <option>Maio/2026</option>
                      <option>Junho/2026</option>
                    </select>

                <label className={styles.label}>8. Atividade prevista: <span className={styles.required}>*</span></label>
                <select className={styles.select} onChange={(e) => setFormData({...formData, atividade: e.target.value})}>
                  <option value="">Selecionar...</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={`Atividade ${i+1}`}>Atividade {String(i+1).padStart(2, '0')}</option>
                  ))}
                </select>

                <label className={styles.label}>9. Realizou a atividade? <span className={styles.required}>*</span></label>
                  <div className={styles.radioGroup}>
                      <label className={styles.option}><input type="radio" name="realizou" value="Sim" onChange={(e) => setFormData({...formData, realizou: e.target.value})} /> Sim</label>
                      <label className={styles.option}><input type="radio" name="realizou" value="Não" onChange={(e) => setFormData({...formData, realizou: e.target.value})} /> Não</label>
                  </div>
              </div>   
              
              
          )}
          <button className={styles.buttonNext} onClick={handleAvançar}>Avançar</button>
        </div>
      ) : (
        !erroMensagem && <p>Carregando dados...</p>
      )}
    </div>
  );
};

export default SubmitWork;