import { supabase } from './supabase';

export async function initializeDatabase() {
  console.log('Iniciando verificação e inicialização de tabelas do banco de dados...');
  
  try {
    // Verificar se a tabela configuracao_loja existe
    const { error: queryError } = await supabase
      .from('configuracao_loja')
      .select('count')
      .limit(1);
    
    // Se a tabela não existe, tentamos criar
    if (queryError && queryError.code === '42P01') {
      console.log('Tabela configuracao_loja não existe. Tentando criar...');
      
      // Configuração padrão para inserir
      const configPadrao = {
        id: '1',
        nome_loja: 'NetFood',
        descricao_loja: 'Seu cardápio digital completo',
        logo_url: null,
        cor_primaria: '#16a34a',
        cor_secundaria: '#15803d',
        created_at: new Date().toISOString(),
        
        // Informações da loja
        endereco: 'Rua Exemplo, 123 - Centro',
        cnpj: '12.345.678/0001-90',
        horario_funcionamento: '09:00 às 22:00',
        dias_funcionamento: 'Segunda a Domingo',
        mostrar_endereco: true,
        mostrar_cnpj: true,
        mostrar_horario: true,
        mostrar_dias: true,
        
        // Opções de pagamento
        pagamento_carteira: true,
        pagamento_credito_mastercard: true,
        pagamento_credito_visa: true,
        pagamento_credito_elo: true,
        pagamento_credito_amex: false,
        pagamento_credito_hipercard: false,
        pagamento_debito_mastercard: true,
        pagamento_debito_visa: true,
        pagamento_debito_elo: true,
        pagamento_pix: true,
        pagamento_dinheiro: true
      };
      
      // Tentar inserir os dados
      const { error: insertError } = await supabase
        .from('configuracao_loja')
        .insert([configPadrao]);
      
      if (insertError) {
        console.error('Erro ao criar configuração padrão:', insertError);
      } else {
        console.log('Configuração padrão criada com sucesso!');
      }
    } else {
      console.log('Tabela configuracao_loja já existe.');
      
      // Verificar se as configurações têm os dados que queremos
      const { data: configData, error: selectError } = await supabase
        .from('configuracao_loja')
        .select('*')
        .limit(1);
        
      if (!selectError && configData && configData.length > 0) {
        const config = configData[0];
        
        // Verificar se precisa atualizar algum campo (se nenhuma informação da loja está ativa)
        const temInfoAtiva = config.mostrar_endereco || config.mostrar_cnpj || 
                           config.mostrar_horario || config.mostrar_dias;
        
        const temPagamentoAtivo = config.pagamento_carteira || config.pagamento_credito_mastercard || 
                                config.pagamento_credito_visa || config.pagamento_credito_elo || 
                                config.pagamento_credito_amex || config.pagamento_credito_hipercard || 
                                config.pagamento_debito_mastercard || config.pagamento_debito_visa || 
                                config.pagamento_debito_elo || config.pagamento_pix || 
                                config.pagamento_dinheiro;
        
        // Se não tiver nenhuma informação da loja ativada ou nenhum método de pagamento ativo
        if (!temInfoAtiva || !temPagamentoAtivo) {
          console.log('Atualizando configurações padrão para ativar informações da loja...');
          
          const atualizacoes: Record<string, any> = {};
          
          // Se não tiver informações da loja ativadas
          if (!temInfoAtiva) {
            atualizacoes.endereco = config.endereco || 'Rua Exemplo, 123 - Centro';
            atualizacoes.cnpj = config.cnpj || '12.345.678/0001-90';
            atualizacoes.horario_funcionamento = config.horario_funcionamento || '09:00 às 22:00';
            atualizacoes.dias_funcionamento = config.dias_funcionamento || 'Segunda a Domingo';
            atualizacoes.mostrar_endereco = true;
            atualizacoes.mostrar_cnpj = true;
            atualizacoes.mostrar_horario = true;
            atualizacoes.mostrar_dias = true;
          }
          
          // Se não tiver métodos de pagamento ativos
          if (!temPagamentoAtivo) {
            atualizacoes.pagamento_carteira = true;
            atualizacoes.pagamento_credito_mastercard = true;
            atualizacoes.pagamento_credito_visa = true;
            atualizacoes.pagamento_credito_elo = true;
            atualizacoes.pagamento_pix = true;
            atualizacoes.pagamento_dinheiro = true;
          }
          
          // Atualizar configurações
          const { error: updateError } = await supabase
            .from('configuracao_loja')
            .update(atualizacoes)
            .eq('id', config.id);
            
          if (updateError) {
            console.error('Erro ao atualizar configurações padrão:', updateError);
          } else {
            console.log('Configurações padrão atualizadas com sucesso!');
          }
        }
      }
    }
    
    console.log('Verificação e inicialização concluídas com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  }
}

// Exportar funções úteis
export default {
  initializeDatabase,
}; 
 