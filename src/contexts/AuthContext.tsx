'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    success: boolean;
  }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, userData: {
    nome: string;
    nome_restaurante: string;
  }) => Promise<{
    error: any | null;
    success: boolean;
    user: User | null;
  }>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obter sessão inicial
    const getInitialSession = async () => {
      setLoading(true);

      const { data: { session }, error } = await supabase.auth.getSession();

      if (!error && session) {
        setSession(session);
        setUser(session.user);
      }

      setLoading(false);
    };

    getInitialSession();

    // Configurar listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Cleanup no unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Função de login
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro de login:', error.message);
        
        // Melhor tratamento de erros específicos
        if (error.message.includes('Invalid login credentials')) {
          return {
            error: { message: 'Email ou senha inválidos. Verifique suas credenciais.' },
            success: false,
          };
        }
        
        if (error.message.includes('Email not confirmed')) {
          return {
            error: { message: 'Por favor, confirme seu email antes de fazer login.' },
            success: false,
          };
        }
        
        return {
          error,
          success: false,
        };
      }

      return {
        error: null,
        success: true,
      };
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      return {
        error: { message: 'Ocorreu um erro ao tentar fazer login. Tente novamente.' },
        success: false,
      };
    } finally {
      setLoading(false);
    }
  };

  // Função de cadastro
  const signUp = async (email: string, password: string, userData: { nome: string; nome_restaurante: string }) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        return {
          error,
          success: false,
          user: null
        };
      }

      // Criar configuração padrão para o restaurante
      if (data.user) {
        const { error: configError } = await supabase
          .from('configuracao_loja')
          .insert([
            {
              id: data.user.id,
              nome_loja: userData.nome_restaurante,
              descricao_loja: `Cardápio digital de ${userData.nome_restaurante}`,
              cor_primaria: '#16a34a',
              cor_secundaria: '#15803d',
              created_at: new Date().toISOString(),
              endereco: null,
              cnpj: null,
              horario_funcionamento: null,
              dias_funcionamento: null,
              mostrar_endereco: false,
              mostrar_cnpj: false,
              mostrar_horario: false,
              mostrar_dias: false,
              pagamento_carteira: false,
              pagamento_credito_mastercard: false,
              pagamento_credito_visa: false,
              pagamento_credito_elo: false,
              pagamento_credito_amex: false,
              pagamento_credito_hipercard: false,
              pagamento_debito_mastercard: false,
              pagamento_debito_visa: false,
              pagamento_debito_elo: false,
              pagamento_pix: false,
              pagamento_dinheiro: false
            }
          ]);

        if (configError) {
          console.error('Erro ao criar configuração:', configError);
          // Não interrompemos o cadastro se apenas a configuração falhar
        }
      }

      return {
        error: null,
        success: true,
        user: data.user
      };
    } catch (error) {
      return {
        error,
        success: false,
        user: null
      };
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 