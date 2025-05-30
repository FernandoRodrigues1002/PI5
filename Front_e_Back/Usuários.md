# API de Usuários

Base URL: `http://<host>:<port>/`

## Endpoints

### 1. `POST /usuarios`
**Descrição:** Cria um novo usuário.

**Corpo da Requisição (JSON):**
```json
{
  "nome": "João da Silva",
  "endereco": "Rua Exemplo, 123",
  "cep_usuario": "12345-678",
  "email": "joao@email.com",
  "senha": "senha123",
  "cpf": "12345678901"
}
```
**Respostas:**
- `201 Created`: Usuário criado com sucesso.
- `400 Bad Request`: Dados inválidos, email já cadastrado ou CPF inválido.

---

### 2. `POST /login`
**Descrição:** Realiza login de usuário.

**Corpo da Requisição (JSON):**
```json
{
  "email": "joao@email.com",
  "senha": "senha123"
}
```
**Respostas:**
- `200 OK`: Login bem-sucedido, retorna token simples e dados do usuário.
- `400 Bad Request`: Email e senha obrigatórios.
- `401 Unauthorized`: Email ou senha inválidos.

---

### 3. `GET /usuarios`
**Descrição:** Lista todos os usuários cadastrados.

**Respostas:**
- `200 OK`: Lista de usuários.

---

### 4. `DELETE /usuarios/<id>`
**Descrição:** Remove um usuário pelo ID.

**Respostas:**
- `204 No Content`: Usuário removido com sucesso.
- `404 Not Found`: Usuário não encontrado.

---

## Observações

- O campo `cpf` deve conter 11 dígitos numéricos.
- O campo `senha` é armazenado de forma segura (hash).
- O campo `cep_usuario` deve estar no formato `12345-678` ou `12345678`.
- O token retornado no login é apenas ilustrativo (não JWT).

---

**Modelos e Schemas:**  
- Veja os arquivos models.py e schemas.py para detalhes dos campos.

Se precisar de exemplos de requisição ou mais detalhes, só avisar!