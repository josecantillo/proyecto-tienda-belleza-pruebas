from flask import Flask, request, jsonify
from flask import Flask, render_template
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

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/registro')
def registro_html():
    return render_template('registro.html')

@app.route('/inicio-sesion')
def inicio_sesion_html():
    return render_template('inicio-sesion.html')

@app.route('/cuidado-de-la-piel')
def cuidado_de_la_piel_html():
    return render_template('cuidado-de-la-piel.html')

@app.route('/brochas')
def brochas_html():
    return render_template('brochas.html')

@app.route('/labios')
def labios_html():
    return render_template('labios.html')

@app.route('/ojos')
def ojos_html():
    return render_template('ojos.html')

@app.route('/accesorios')
def accesorios_html():
    return render_template('accesorios.html')

@app.route('/carrito')
def carrito_html():
    return render_template('carrito.html')

if __name__ == '__main__':
    app.run(debug=True)