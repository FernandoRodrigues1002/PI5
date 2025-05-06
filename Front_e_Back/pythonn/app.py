from flask import Flask, request, jsonify
from marshmallow import ValidationError
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from models import db, Usuario
from schemas import UsuarioSchema
import re

app = Flask(__name__)
app.config.from_object('config')
db.init_app(app)

usuario_schema = UsuarioSchema()
usuarios_schema = UsuarioSchema(many=True)

def validar_cpf(cpf: str) -> bool:
    return bool(re.fullmatch(r'\d{11}', cpf))  # Simples validação de formato: 11 dígitos

@app.route('/usuarios', methods=['POST'])
def criar_usuario():
    try:
        json_data = request.get_json(force=True)
    except Exception:
        return jsonify({"erro": "Requisição malformada. Envie dados em formato JSON."}), 400

    # Validação básica de CPF
    if 'cpf' in json_data and not validar_cpf(json_data['cpf']):
        return jsonify({"erro": "CPF inválido. Use 11 dígitos numéricos."}), 400

    # Validação de email já existente
    if 'email' in json_data:
        existente = Usuario.query.filter_by(email=json_data['email']).first()
        if existente:
            return jsonify({"erro": "Email já cadastrado."}), 400

    # Tenta carregar com o schema (outras validações)
    try:
        dados = usuario_schema.load(json_data)
    except ValidationError as err:
        return jsonify(err.messages), 400

    novo_usuario = Usuario(**dados)
    db.session.add(novo_usuario)
    db.session.commit()
    return jsonify(usuario_schema.dump(novo_usuario)), 201

@app.route('/usuarios', methods=['GET'])
def listar_usuarios():
    usuarios = Usuario.query.all()
    return jsonify(usuarios_schema.dump(usuarios))

@app.route('/usuarios/<int:id>', methods=['GET'])
def obter_usuario(id):
    usuario = Usuario.query.get(id)
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado."}), 404
    return jsonify(usuario_schema.dump(usuario)), 200

@app.route('/usuarios/<int:id>', methods=['PUT'])
def atualizar_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    try:
        dados = usuario_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    for campo, valor in dados.items():
        setattr(usuario, campo, valor)

    db.session.commit()
    return jsonify(usuario_schema.dump(usuario)), 200


@app.route('/usuarios/<int:id>', methods=['DELETE'])
def deletar_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    db.session.delete(usuario)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
