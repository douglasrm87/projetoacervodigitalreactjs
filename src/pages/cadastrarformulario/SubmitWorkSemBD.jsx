import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SubmitWork.module.css';
import ProgressBar from './ProgressBar';
 

const SubmitWork = () => {

  console.log("URL do Supabase:", process.env.REACT_APP_SUPABASE_URL);
  console.log("Ambiente de execução:", process.env.NODE_ENV);
  const [erroMensagem, setErroMensagem] = useState(null); // Estado para a mensagem de erro

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nucleo: '',
    nome: '',
    matricula: '',
    regional: '',
    unidade: '',
    cursos: [],
    eixo: '',
    periodo: '',
    atividade: '',
    realizou: ''
  });

  const regionaisData = {
    Sudeste: ['Angra dos Reis', 'Bangu', 'Brooklin', 'Cabo Frio'],
    Nordeste: ['Alagoinhas', 'Aracaju', 'Canindé', 'Costa Azul'],
    "Norte-Sul": ['Curitiba', 'Cristo Rei', 'Cuiabá', 'Dourados'],
    Wyden: ['Adrianópolis I', 'Boa vista - Wyden', 'Dunas-CE', 'Rio Vermelho']
  };

  const handleCheckbox = (curso) => {
    const updated = formData.cursos.includes(curso)
      ? formData.cursos.filter(c => c !== curso)
      : [...formData.cursos, curso];
    setFormData({ ...formData, cursos: updated });
  };

  const handleAvançar = () => {
    navigate('/SubmitWorkTela02', { state: { data: formData } });
  };



  return (
    <div className={styles.container}>
      <ProgressBar currentStep={1} />
      <header className={styles.header}>
        <h2>Envio de Evidências {formData.nucleo === 'LTD/NID' && '- LTD/NID 2026.1'}</h2>
      </header>

      <div className={styles.mainMessage}>
        Olá, <strong>Douglas</strong>. Quando você enviar este formulário, o proprietário verá seu nome e endereço de e-mail.
      </div>

      <p className={styles.tip}><span className={styles.required}>*</span> Obrigatória</p>

      {/* Escolha do Núcleo */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Escolha o núcleo de extensão <span className={styles.required}>*</span></label>
        <select 
          className={styles.select}
          onChange={(e) => setFormData({...formData, nucleo: e.target.value})}
        >
          <option value="">Selecione...</option>
          <option value="LTD-NID">LTD/NID - Laboratório de Transformação Digital</option>
          <option value="NAC">NAC - Núcleo de apoio a Carreiras</option>
          <option value="LPG">LPG</option>
          <option value="NAF">NAF - Núcleo de apoio Financeiro</option>
          <option value="Engenharia">Engenharia</option>
        </select>
      </div>

      {formData.nucleo === 'LTD/NID' && (
        <div className={styles.section}>
          <h3>Laboratório de Transformação Digital</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>1. Informe seu nome: <span className={styles.required}>*</span></label>
            <input 
              type="text" 
              placeholder="Insira sua resposta" 
              className={styles.input}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
            />
            <span className={styles.tip}>Esta pergunta é obrigatória.</span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>2. Matrícula Docente: <span className={styles.required}>*</span></label>
            <input 
              type="text" 
              placeholder="Insira sua resposta" 
              className={styles.input}
              onChange={(e) => setFormData({...formData, matricula: e.target.value})}
            />
            <span className={styles.tip}>Esta pergunta é obrigatória.</span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>3. Selecione sua Regional <span className={styles.required}>*</span></label>
            <select 
              className={styles.select}
              onChange={(e) => setFormData({...formData, regional: e.target.value})}
            >
              <option value="">Selecionar sua resposta</option>
              {Object.keys(regionaisData).map(reg => <option key={reg} value={reg}>{reg}</option>)}
            </select>
            <span className={styles.tip}>Esta pergunta é obrigatória.</span>
          </div>

          {formData.regional && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>4. Unidade alocada no LTD/NID: <span className={styles.required}>*</span></label>
                <select 
                  className={styles.select}
                  onChange={(e) => setFormData({...formData, unidade: e.target.value})}
                >
                  <option value="">Selecionar sua resposta</option>
                  {regionaisData[formData.regional].map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>

              {formData.unidade && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>5. Selecione o(s) curso(s): <span className={styles.required}>*</span></label>
                    <div className={styles.checkboxGroup}>
                      {["Análise e Desenvolvimento de Sistemas", "Ciência da Computação", "DEVOPS", "Engenharia de Computação", "Gestão da TI", "Jogos Digitais", "Redes", "Sistemas de Informação", "Sistemas para Internet"].map(curso => (
                        <label key={curso} className={styles.option}>
                          <input type="checkbox" onChange={() => handleCheckbox(curso)} /> {curso}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>6. Eixo de atuação: <span className={styles.required}>*</span></label>
                    <select className={styles.select} onChange={(e) => setFormData({...formData, eixo: e.target.value})}>
                      <option value="">Selecionar...</option>
                      <option>LTD - Desenvolvimento de Software</option>
                      <option>LTD - Gestão da Tecnologia da Informação</option>
                      <option>LTD - Infraestrutura</option>
                      <option>NID - Núcleo de Inclusão Digital</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>7. Período: <span className={styles.required}>*</span></label>
                    <select className={styles.select} onChange={(e) => setFormData({...formData, periodo: e.target.value})}>
                      <option value="">Selecionar...</option>
                      <option>Março/2026</option>
                      <option>Abril/2026</option>
                      <option>Maio/2026</option>
                      <option>Junho/2026</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>8. Atividade prevista: <span className={styles.required}>*</span></label>
                    <select className={styles.select} onChange={(e) => setFormData({...formData, atividade: e.target.value})}>
                      <option value="">Selecionar...</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i} value={`Atividade ${i+1}`}>Atividade {String(i+1).padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>9. Realizou a atividade? <span className={styles.required}>*</span></label>
                    <div className={styles.radioGroup}>
                      <label className={styles.option}><input type="radio" name="realizou" value="Sim" onChange={(e) => setFormData({...formData, realizou: e.target.value})} /> Sim</label>
                      <label className={styles.option}><input type="radio" name="realizou" value="Não" onChange={(e) => setFormData({...formData, realizou: e.target.value})} /> Não</label>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      <button className={styles.buttonNext} onClick={handleAvançar}>Avançar</button>
    </div>
  );
};

export default SubmitWork;

/*
O que foi implementado:
Persistência de Dados: Os dados da Tela 01 são passados para a Tela 02 via location.state. Na Tela 02, eles são mesclados (...dadosAnteriores) com os novos campos e enviados para a Tela 03.

Validação de Negócio: O campo de texto tem limite de 1000 caracteres e o input de arquivo valida o tamanho (10MB) e extensões permitidas.

Layout Organizado: Os radiobuttons na Tela 02 seguem o padrão de alinhamento à esquerda solicitado anteriormente.

*/