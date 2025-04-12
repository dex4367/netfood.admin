'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FaUserPlus, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';

interface Usuario {
  id: string;
  email: string;
  user_metadata: {
    nome?: string;
    nome_restaurante?: string;
  };
  created_at: string;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrandoFormNovoUsuario, setMostrandoFormNovoUsuario] = useState(false);
  
  // Form states
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nomeRestaurante, setNomeRestaurante] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Redirecionar se não estiver autenticado
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      carregarUsuarios();
    }
  }, [user, authLoading, router]);
  
  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setUsuarios(data.users as Usuario[]);
      }
    } catch (err: any) {
      console.error('Erro ao carregar usuários:', err.message);
      setError('Não foi possível carregar a lista de usuários. Você pode não ter permissões de administrador.');
    } finally {
      setLoading(false);
    }
  };
  
  const resetarFormulario = () => {
    setNome('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setNomeRestaurante('');
    setFormError('');
    setFormSuccess('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar senha
    if (password !== confirmPassword) {
      setFormError('As senhas não coincidem.');
      return;
    }
    
    if (password.length < 6) {
      setFormError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');

    try {
      // 1. Criar usuário no Authentication do Supabase
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          nome: nome,
          nome_restaurante: nomeRestaurante
        }
      });

      if (authError) {
        throw authError;
      }

      // 2. Criar configuração padrão para o restaurante
      if (authData.user) {
        const { error: configError } = await supabase
          .from('configuracao_loja')
          .insert([
            {
              id: authData.user.id,
              nome_loja: nomeRestaurante,
              descricao_loja: `Cardápio digital de ${nomeRestaurante}`,
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

      setFormSuccess('Usuário criado com sucesso!');
      
      // Limpar formulário
      resetarFormulario();
      
      // Atualizar lista de usuários
      await carregarUsuarios();
      
      // Fechar formulário após alguns segundos
      setTimeout(() => {
        setMostrandoFormNovoUsuario(false);
        setFormSuccess('');
      }, 3000);
      
    } catch (error: any) {
      console.error('Erro ao cadastrar usuário:', error.message);
      if (error.message.includes('already registered')) {
        setFormError('Este e-mail já está cadastrado.');
      } else {
        setFormError('Erro ao criar o usuário. Tente novamente.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const excluirUsuario = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) {
        throw error;
      }
      
      setUsuarios(usuarios.filter(u => u.id !== userId));
    } catch (err: any) {
      console.error('Erro ao excluir usuário:', err.message);
      alert('Não foi possível excluir o usuário.');
    } finally {
      setLoading(false);
    }
  };
  
  // Formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Será redirecionado pelo useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Usuários</h1>
          <Link href="/admin" className="flex items-center text-indigo-600 hover:text-indigo-800">
            <FaArrowLeft className="mr-2" /> Voltar para o Dashboard
          </Link>
        </div>
        
        {!mostrandoFormNovoUsuario && (
          <button 
            onClick={() => setMostrandoFormNovoUsuario(true)}
            className="mb-6 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
          >
            <FaUserPlus className="mr-2" /> Novo Usuário
          </button>
        )}
        
        {/* Formulário para adicionar novo usuário */}
        {mostrandoFormNovoUsuario && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Adicionar Novo Usuário</h2>
              <button 
                onClick={() => {
                  setMostrandoFormNovoUsuario(false);
                  resetarFormulario();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancelar
              </button>
            </div>
            
            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {formError}
              </div>
            )}
            
            {formSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {formSuccess}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do usuário
                </label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="nomeRestaurante" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do restaurante
                </label>
                <input
                  id="nomeRestaurante"
                  type="text"
                  value={nomeRestaurante}
                  onChange={(e) => setNomeRestaurante(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar senha
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-70"
              >
                {formLoading ? 'Processando...' : 'Criar Usuário'}
              </button>
            </form>
          </div>
        )}
        
        {/* Lista de usuários */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-700">Usuários do Sistema</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              <p className="mt-2 text-gray-500">Carregando usuários...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : usuarios.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nenhum usuário encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Restaurante
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Criação
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {usuario.user_metadata?.nome || 'Não informado'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{usuario.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {usuario.user_metadata?.nome_restaurante || 'Não informado'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatarData(usuario.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => excluirUsuario(usuario.id)}
                          className="text-red-600 hover:text-red-900 ml-4"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 