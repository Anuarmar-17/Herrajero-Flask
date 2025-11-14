# Archivo principal Flask

from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_mysqldb import MySQL
import config

app = Flask(__name__)
app.secret_key = 'admin'

# Configuración de base de datos
app.config['MYSQL_HOST'] = config.DATABASE['host']
app.config['MYSQL_USER'] = config.DATABASE['user']
app.config['MYSQL_PASSWORD'] = config.DATABASE['password']
app.config['MYSQL_DB'] = config.DATABASE['db']

mysql = MySQL(app)

@app.route('/')
def index():
    return redirect(url_for('inicio'))


# Codigo para registrar un usuario
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        nombre = request.form['nombre']
        apellido = request.form['apellido']
        direccion = request.form['direccion']
        telefono = request.form['telefono']
        fecha_nacimiento = request.form['fecha_nacimiento']
        email = request.form['email']
        clave = request.form['password']
        id_rol = 2

        cur = mysql.connection.cursor()
        cur.execute("""INSERT INTO usuario 
                       (nombre, apellido, direccion, telefono, fecha_nacimiento, email, password, id_rol)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                    (nombre, apellido, direccion, telefono, fecha_nacimiento, email, clave, id_rol))
        mysql.connection.commit()
        cur.close()

        flash('Usuario registrado correctamente')
        return redirect(url_for('login'))
    
    return render_template('formulario.html')

# Codigo para iniciar sesión
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        clave = request.form['clave']

        cur = mysql.connection.cursor()
        cur.execute("SELECT id_usuario, nombre, email FROM usuario WHERE email = %s AND password = %s",
                    (email, clave))
        usuario = cur.fetchone()
        cur.close()

        if usuario:
            session['usuario_id'] = usuario[0]
            session['nombre'] = usuario[1]
            session['email'] = usuario[2]

            flash('Inicio de sesión exitoso')
            return redirect(url_for('cliente'))
        else:
            flash('Credenciales incorrectas')
            return render_template('ingreso.html')

    return render_template('Ingreso.html')


# Código para la página del cliente
@app.route('/cliente')
def cliente():
    if 'usuario_id' not in session:
        flash("Debes iniciar sesión para acceder al carrito")
        return redirect(url_for('login'))
    return render_template('cliente.html', nombre=session.get('nombre'))



# Código para cerrar sesión
@app.route('/logout')
def logout():
    session.clear()
    flash('Sesión cerrada correctamente')
    return redirect(url_for('login'))


@app.route('/productos')
def productos():
    return render_template('productos.html')

@app.route('/inicio')
def inicio():
    return render_template('inicio.html')

@app.route('/construccion')
def construccion():
    return render_template('construccion.html')

@app.route('/electricidad')
def electricidad():
    return render_template('electricidad.html')



#Codigo que ejecuta el servidor Flask
if __name__ == '__main__':
    app.run(debug=True)
