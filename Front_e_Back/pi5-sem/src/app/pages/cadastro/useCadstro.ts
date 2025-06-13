interface Usuario {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  endereco: string;
  cep_usuario: string;
}

export enum TipoErroCadastro {
  CPF_INVALIDO = 'CPF_INVALIDO',
  CPF_JA_UTILIZADO = 'CPF_JA_UTILIZADO',
  CEP_INVALIDO = 'CEP_INVALIDO',
  EMAIL_JA_UTILIZADO = 'EMAIL_JA_UTILIZADO',
  USUARIO_JA_LOGADO = 'USUARIO_JA_LOGADO',
  ERRO_SERVIDOR = 'ERRO_SERVIDOR',
  ERRO_REDE = 'ERRO_REDE'
}

export class ErroCadastro extends Error {
  tipo: TipoErroCadastro;
  
  constructor(message: string, tipo: TipoErroCadastro) {
    super(message);
    this.name = 'ErroCadastro';
    this.tipo = tipo;
  }
}

function validarCPF(cpf: string): boolean {
  const cpfLimpo = cpf.replace(/[^\d]/g, '');
  
  if (cpfLimpo.length !== 11) return false;
  if (/^(.)\1{10}$/.test(cpfLimpo)) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(10))) return false;
  
  return true;
}

function validarCEP(cep: string): boolean {
  const cepLimpo = cep.replace(/[^\d]/g, '');
  return cepLimpo.length === 8;
}

function verificarUsuarioLogado(): boolean {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const usuario = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
  
  return !!(token && usuario);
}

function redirecionarParaHome(): void {
  if (typeof window !== 'undefined') {
    window.location.href = '/home';
  }
}

export async function cadastrarUsuario(usuario: Usuario) {
  try {
    if (verificarUsuarioLogado()) {
      redirecionarParaHome();
      throw new ErroCadastro(
        'Usuário já está logado. Redirecionando para a home...',
        TipoErroCadastro.USUARIO_JA_LOGADO
      );
    }

    if (!validarCPF(usuario.cpf)) {
      throw new ErroCadastro(
        'CPF informado é inválido. Verifique os números e tente novamente.',
        TipoErroCadastro.CPF_INVALIDO
      );
    }

    if (!validarCEP(usuario.cep_usuario)) {
      throw new ErroCadastro(
        'CEP informado é inválido. Deve conter 8 dígitos.',
        TipoErroCadastro.CEP_INVALIDO
      );
    }

    const response = await fetch('https://api-login-wpoo.onrender.com/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        cpf: usuario.cpf,
        endereco: usuario.endereco,
        cep_usuario: usuario.cep_usuario,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const mensagemErro = data.erro || data.message || 'Erro desconhecido ao cadastrar usuário.';
      
      if (mensagemErro.toLowerCase().includes('cpf já cadastrado') || 
          mensagemErro.toLowerCase().includes('cpf já utilizado')) {
        throw new ErroCadastro(
          'Este CPF já está cadastrado no sistema.',
          TipoErroCadastro.CPF_JA_UTILIZADO
        );
      }
      
      if (mensagemErro.toLowerCase().includes('email já cadastrado') || 
          mensagemErro.toLowerCase().includes('email já utilizado')) {
        throw new ErroCadastro(
          'Este email já está cadastrado no sistema.',
          TipoErroCadastro.EMAIL_JA_UTILIZADO
        );
      }
      
      if (mensagemErro.toLowerCase().includes('cep inválido') || 
          mensagemErro.toLowerCase().includes('cep não encontrado')) {
        throw new ErroCadastro(
          'CEP não encontrado. Verifique se o CEP está correto.',
          TipoErroCadastro.CEP_INVALIDO
        );
      }

      throw new ErroCadastro(
        mensagemErro,
        TipoErroCadastro.ERRO_SERVIDOR
      );
    }

    return data;

  } catch (error) {
    if (error instanceof ErroCadastro) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ErroCadastro(
        'Erro de conexão. Verifique sua internet e tente novamente.',
        TipoErroCadastro.ERRO_REDE
      );
    }

    throw new ErroCadastro(
      'Erro inesperado ao cadastrar usuário. Tente novamente.',
      TipoErroCadastro.ERRO_SERVIDOR
    );
  }
}