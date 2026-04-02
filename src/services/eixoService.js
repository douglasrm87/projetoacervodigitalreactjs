import { supabase } from '../infra/supabase/supabaseClient';

/**
 * Busca os eixos vinculados a um núcleo de extensão específico.
 * @param {number|string} idNucleo 
 * @returns {Promise<Array>} Lista de eixos
 */
export const fetchEixosPorNucleo = async (idNucleo) => {
  // Proteção extra contra valores nulos, undefined ou strings vazias
  //alert ("idNucleo: "+idNucleo)
  if (!idNucleo || idNucleo === "undefined") 
    return [];

  const { data, error } = await supabase
    .from('Eixo_Nucleo')
    .select('id_eixo_nucleo, nome_eixo')
    // Se o seu banco for integer, use Number(idNucleo)
    .eq('id_nucleo_extensao', Number(idNucleo)); 

  if (error) throw new Error(error.message);
  return data || [];
};