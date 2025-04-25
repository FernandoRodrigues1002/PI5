export default function Cadastro() {
    return (
        <div className="max-w-md mx-auto mt-8 p-4 border rounded-lg shadow-md bg-white">
            <form action="" method="POST" className="space-y-4">
                <div>
                    <label htmlFor="nome" className="block font-medium">Nome:</label>
                    <input type="text" id="nome" name="nome" required className="w-full border p-2 rounded" />
                </div>

                <div>
                    <label htmlFor="endereco" className="block font-medium">Endereço:</label>
                    <input type="text" id="endereco" name="endereco" className="w-full border p-2 rounded" />
                </div>

                <div>
                    <label htmlFor="cep_usuario" className="block font-medium">CEP:</label>
                    <input type="text" id="cep_usuario" name="cep_usuario" className="w-full border p-2 rounded" />
                </div>

                <div>
                    <label htmlFor="email" className="block font-medium">E-mail:</label>
                    <input type="email" id="email" name="email" required className="w-full border p-2 rounded" />
                </div>

                <div>
                    <label htmlFor="senha" className="block font-medium">Senha:</label>
                    <input type="password" id="senha" name="senha" required className="w-full border p-2 rounded" />
                </div>

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Cadastrar</button>
            </form>
        </div>
    );
}