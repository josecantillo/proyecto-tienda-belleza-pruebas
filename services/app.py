from flask import Flask, request, jsonify
import sqlite3
import bcrypt

app = Flask(__name__)

# Función para conectar a la base de datos
def conectar_db():
    conn = sqlite3.connect('usuarios.db')  # Nombre del archivo de base de datos
    return conn

# Ruta para registrar usuarios
@app.route('/registro', methods=['POST'])
def registro():
    data = request.get_json()
    nombre = data.get('nombre')
    correo = data.get('correo')
    contraseña = data.get('contraseña')

    # Validaciones
    if not nombre or not correo or not contraseña:
        return jsonify({"error": "Todos los campos son requeridos"}), 400

    conn = conectar_db()
    cursor = conn.cursor()

    # Verificar si el correo ya está registrado
    cursor.execute("SELECT * FROM usuarios WHERE correo = ?", (correo,))
    if cursor.fetchone():
        return jsonify({"error": "El correo ya está registrado"}), 400

    # Hashear la contraseña antes de guardarla en la base de datos
    contraseña_hasheada = bcrypt.hashpw(contraseña.encode('utf-8'), bcrypt.gensalt())

    # Insertar nuevo usuario con la contraseña hasheada
    cursor.execute("INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)", 
                   (nombre, correo, contraseña_hasheada))
    conn.commit()
    conn.close()

    return jsonify({"mensaje": "Usuario registrado exitosamente"}), 201

# Ruta para iniciar sesión
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    correo = data.get('correo')
    contraseña = data.get('contraseña')

    if not correo or not contraseña:
        return jsonify({"error": "Correo y contraseña son requeridos"}), 400

    conn = conectar_db()
    cursor = conn.cursor()

    # Verificar si el usuario existe
    cursor.execute("SELECT * FROM usuarios WHERE correo = ?", (correo,))
    usuario = cursor.fetchone()
    conn.close()

    if not usuario:
        return jsonify({"error": "Correo no registrado"}), 401

    # Verificar la contraseña hasheada
    contraseña_correcta = bcrypt.checkpw(contraseña.encode('utf-8'), usuario[3])

    if not contraseña_correcta:
        return jsonify({"error": "Contraseña incorrecta"}), 401

    return jsonify({"mensaje": f"Bienvenido {usuario[1]}"}), 200

if __name__ == '__main__':
    app.run(debug=True)