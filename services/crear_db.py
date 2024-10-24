import sqlite3

# Conectar a la base de datos (se creará si no existe)
conn = sqlite3.connect('usuarios.db')

# Crear un cursor para ejecutar comandos SQL
cursor = conn.cursor()

# Crear la tabla de usuarios si no existe
cursor.execute('''
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    contraseña TEXT NOT NULL
)
''')

# Guardar los cambios y cerrar la conexión
conn.commit()
conn.close()

print("Base de datos y tabla 'usuarios' creadas con éxito.")