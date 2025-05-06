interface Usuario {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  endereco: string;
  cep_usuario: string;
}

export async function cadastrarUsuario(usuario: Usuario) {
    const response = await fetch('http://localhost:5000/usuarios', {
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
      throw new Error(data.erro || 'Erro desconhecido ao cadastrar usuário.');
    }
  
    return data;
  }
  