import { useState } from 'react'
import './App.css'
import logoImagen from './assets/logo.png'

/*ESTILO GLOBAL REUTILIZABLE*/
const estiloInputLimpio = 
{
  backgroundColor: '#ffffff',
  border: '1px solid #ccc',
  borderRadius: '4px',
  padding: '10px',
  fontSize: '1rem',
  color: '#333',
  textAlign: 'center',
  width: '100%'
};

/*TARJETA DE PRODUCTO Define la estructura visual de cada producto en el catálogo.*/
const TarjetaProducto = ({ prod }) => 
  (
  <div className="col-md-4 col-sm-6 mb-4">
    <div className="product-card">
      {/* Marcador de posición para la imagen con color dinámico basado en el ID */}
      <div className="product-image-placeholder" style={{ backgroundColor: `hsl(${(prod.id * 50) % 360}, 60%, 90%)` }}>
        Foto del producto
      </div>
      <div className="product-info-container">
        <div className="product-text-box">
          <h3 className="product-title">{prod.nombre}</h3>
          <p className="product-description">{prod.descripcion}</p>
        </div>

        <div className="product-footer">
          <span className="product-price">
            ${parseFloat(prod.precio).toLocaleString('es-CO')}
          </span>
          <button className="btn-order-whatsapp" onClick={() => alert('Simulando redirección a WhatsApp para comprar: ' + prod.nombre)}>
            Pedir
          </button>
        </div>
      </div>
    </div>
  </div>
);

/*VISTA DEL CATÁLOGO Página principal que ven los usuarios no logueados.*/
const VistaCatalogo = ({ productos }) => 
  (
  <div className="catalogo-page animacion-aparecer">
    {/* Banner promocional principal con degradado */}
    <div className="banner-promocional">
      <h2 className="banner-title">¡Bienvenido a Sporting!</h2>
      <p className="banner-text">Inscríbete con tu equipo y obtén un 20% de descuento en uniformes.</p>
    </div>

    <main className="main-container-publico">
      <h1 className="faded-title-dark">Equípate con la mejor calidad en productos deportivos</h1>
      <div className="container mt-4">
        <div className="row">
          {productos.length === 0 ? (
            <div className="catalogo-vacio-texto">Los productos se mostrarán aquí</div>
          ) : (
            productos.map(prod => <TarjetaProducto key={prod.id} prod={prod} />)
          )}
        </div>
      </div>
    </main>
  </div>
)

/*VISTA DE LOGIN Formulario simple para acceso de Entrenador y Estudiante.*/
const VistaLogin = ({ setVistaActual, manejarLogin }) => 
  {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="auth-page-container animacion-aparecer">
      <div className="auth-box">
        <h2 className="auth-title">Bienvenido</h2>
        <form onSubmit={(e) => manejarLogin(e, usuario, password)}>
          <div className="form-group">
            <input type="text" placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} required style={{...estiloInputLimpio}} />
          </div>
          <div className="form-group">
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{...estiloInputLimpio}} />
          </div>
          <button type="submit" className="btn-primary btn-block btn-login-submit">Iniciar sesión</button>
        </form>
        <hr className="divider" />
        <div className="auth-help-text">
          <p>¿No tienes cuenta? <a href="#" onClick={() => setVistaActual('registro')} className="text-link-bold">Regístrate aquí</a></p>
          <button onClick={() => setVistaActual('catalogo')} className="back-link-dark">Volver</button>
        </div>
      </div>
    </div>
  )
}

/*COMPONENTE: VISTA DE REGISTRO Formulario detallado para nuevos estudiantes. Incluye validación de contraseña.*/
const VistaRegistro = ({ setVistaActual }) => {
  const aniosDisponibles = ['2012', '2011', '2010', '2009', '2008', '2007'];

  return (
    <div className="auth-page-container animacion-aparecer vista-registro-layout">
      <div className="auth-box auth-box-registro">
        <h2 className="auth-title">Formulario de Registro</h2>
        <form onSubmit={(e) => { 
          e.preventDefault(); 
          
          const pass = e.target.password.value;
          const confirmPass = e.target.confirmPassword.value;

          if (pass !== confirmPass) {
            alert("Las contraseñas no coinciden. Por favor, verifícalas.");
            return;
          }

          alert("¡Registro Completado!"); 
          setVistaActual('login'); 
        }}>
          <div className="form-group"><input type="text" placeholder="Nombres *" required style={{...estiloInputLimpio}} /></div>
          <div className="form-group"><input type="text" placeholder="Apellidos *" required style={{...estiloInputLimpio}} /></div>
          <div className="form-group"><input type="text" placeholder="Documento de Identidad *" required style={{...estiloInputLimpio}} /></div>
          
          <div className="form-group">
            <input type="email" placeholder="Correo electrónico *" required style={{...estiloInputLimpio}} />
          </div>

          <div className="form-group">
            <label className="label-fecha-nacimiento">Fecha de nacimiento *</label>
            <div className="time-selectors-grid">
              <select style={{...estiloInputLimpio}} required><option value="">Día</option>{[...Array(31)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}</select>
              <select style={{...estiloInputLimpio}} required><option value="">Mes</option>{['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((mes, i) => <option key={i+1} value={i+1}>{mes}</option>)}</select>
              <select style={{...estiloInputLimpio}} required><option value="">Año</option>{aniosDisponibles.map(anio => <option key={anio} value={anio}>{anio}</option>)}</select>
            </div>
          </div>

          <div className="form-group">
            <input name="password" type="password" placeholder="Contraseña *" required style={{...estiloInputLimpio}} />
          </div>
          <div className="form-group">
            <input name="confirmPassword" type="password" placeholder="Confirmar contraseña *" required style={{...estiloInputLimpio}} />
          </div>

          <button type="submit" className="btn-primary btn-block btn-login-submit">Registrarse</button>
        </form>
        
        <hr className="divider" />
        
        <div className="auth-help-text">
          <p>¿Ya tienes cuenta? <a href="#" onClick={() => setVistaActual('login')} className="text-link-bold">Inicia sesión</a></p>
          <button onClick={() => setVistaActual('catalogo')} className="back-link-dark">Volver</button>
        </div>
      </div>
    </div>
  )
}

/*FOOTER Franja negra final con información institucional y legal.*/
const FooterGeneral = () => (
  <footer className="footer-principal">
    <div className="container footer-content">
      <div className="row">
        {/* Columna 1: Logo y Eslogan */}
        <div className="col-md-4 footer-col-logo">
          <img src={logoImagen} alt="Logo Sporting Footer" className="footer-logo-img" />
          <p className="footer-eslogan">Formando campeones para la vida.</p>
        </div>
        {/* Columna 2: Enlaces Rápidos */}
        <div className="col-md-4 footer-col-links">
          <h4>Enlaces Rápidos</h4>
          <ul>
            <li><a href="#">Sobre Nosotros</a></li>
            <li><a href="#">Categorías</a></li>
            <li><a href="#">Inscripciones</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
        </div>
        {/* Columna 3: Contacto y Redes */}
        <div className="col-md-4 footer-col-contacto">
          <h4>Contáctanos</h4>
          <p>📍 Calle 129 B #95 6 #123, Bogotá</p>
          <p>📞 +57 300 123 4567</p>
          <p>✉️ contacto@sporting.com</p>
        </div>
      </div>
      {/* Barra final de copyright */}
      <div className="footer-bottom">
        <p>&copy; 2024 Sporting Club Deportivo. Todos los derechos reservados. | Política de Privacidad</p>
      </div>
    </div>
  </footer>
);

/*COMPONENTE PRINCIPAL: APPManeja el estado global, la navegación entre vistas y los modales.*/
function App() {
  /*ESTADOS DE NAVEGACIÓN Y MENÚS*/
  const [vistaActual, setVistaActual] = useState('catalogo')
  const [menuEntrenador, setMenuEntrenador] = useState('horarios')
  const [menuEstudiante, setMenuEstudiante] = useState('horarios')

  /* --- DATOS CONFIGURABLES (Categorías) --- */
  const categoriasDisponibles = ['2007', '2008', '2009', '2010', '2011', '2012']

  /* --- ESTADOS DE DATOS (Simulación de Base de Datos) --- */
  const [horarios, setHorarios] = useState([
    { id: 101, desc: 'Entrenamiento Matutino', cat: '2009', hora: '8:00 AM' },
    { id: 102, desc: 'Fútbol Táctico', cat: '2009', hora: '4:00 PM' }
  ])
  
  const [estudiantes, setEstudiantes] = useState([
    { id: 1, nombres: 'Carlos', apellidos: 'Pérez', documento: '1112345678', categoria: '2009', nacimiento: '15/05/2009' },
    { id: 2, nombres: 'Andrés', apellidos: 'López', documento: '2225432456', categoria: '2009', nacimiento: '22/08/2009' },
    { id: 3, nombres: 'Juan', apellidos: 'Gómez', documento: '3332345667', categoria: '2009', nacimiento: '05/01/2009' },
    { id: 4, nombres: 'Mateo', apellidos: 'Díaz', documento: '4445218903', categoria: '2009', nacimiento: '30/11/2009' }
  ]) 

  const [equipos, setEquipos] = useState([
    { id: 1, nombre: 'Águilas FC', integrantes: [1, 2] },
    { id: 2, nombre: 'Leones de Oro', integrantes: [3, 4] }
  ])
  
  const [torneos, setTorneos] = useState([
    { id: 1, nombre: 'Copa Infantil de Verano', fecha: '15 de Mayo', estado: 'Inscripciones Abiertas', enfrentamientos: [{ eq1: 'Águilas FC', eq2: 'Leones de Oro' }] }
  ])

  const [productos, setProductos] = useState([
    { id: 1, nombre: 'Balón Profesional N°5', descripcion: 'Balón de alta resistencia para césped artificial.', precio: '120000' },
    { id: 2, nombre: 'Camiseta Oficial Local', descripcion: 'Tela transpirable con tecnología dry-fit.', precio: '85000' },
    { id: 3, nombre: 'Espinilleras Ergonómicas', descripcion: 'Protección ligera de alto impacto.', precio: '45000' },
    { id: 4, nombre: 'Guayos de Alta Tracción', descripcion: 'Suela para canchas sintéticas y mejor agarre.', precio: '180000' },
    { id: 5, nombre: 'Medias Largas Compresivas', descripcion: 'Medias que reducen la fatiga muscular.', precio: '25000' },
    { id: 6, nombre: 'Maletín Deportivo 30L', descripcion: 'Amplio espacio para tus implementos.', precio: '95000' }
  ]) 

  /* --- ESTADOS DE CONTROL DE INTERFAZ (Filtros, Modales, Confirmaciones) --- */
  const [categoriaFiltroHorario, setCategoriaFiltroHorario] = useState('') 
  const [categoriaFiltroEstudiante, setCategoriaFiltroEstudiante] = useState('')
  const [modalAbierto, setModalAbierto] = useState({ horario: false, estudiante: false, equipo: false, torneo: false, producto: false, perfilEstudiante: false })
  const [confirmacionBorrado, setConfirmacionBorrado] = useState({ mostrar: false, tipo: null, id: null })

  /* --- ESTADOS DE FORMULARIOS (Nuevos Registros) --- */
  const [nuevoHorario, setNuevoHorario] = useState({ desc: '', cat: '', dia: 'Lunes', horaIn: '8', minIn: '00', perIn: 'AM', horaFn: '10', minFn: '00', perFn: 'AM'})
  const [nuevoEstudiante, setNuevoEstudiante] = useState({ nombres: '', apellidos: '', documento: '', cat: '' })
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', descripcion: '', precio: '' })
  
  const [nuevoEquipo, setNuevoEquipo] = useState({ nombre: '', integrantes: [] })
  const [nuevoTorneos, setNuevoTorneo] = useState({ nombre: '', fecha: '', estado: 'Inscripciones Abiertas', e1: '', e2: '' })

  /* --- FUNCIONES DE LÓGICA DE NEGOCIO Y AUTENTICACIÓN --- */
  const manejarLogin = (e, usuario, password) => {
  e.preventDefault()
  if (usuario === 'Gregorio' && password === '1234') { 
    setVistaActual('panel-entrenador'); 
    setMenuEntrenador('horarios'); 
  }
  else if (usuario === 'Estudiante' && password === '4321') { 
    setModalAbierto({...modalAbierto, perfilEstudiante: false}); 
    setVistaActual('panel-estudiante'); 
    setMenuEstudiante('horarios'); 
  }
  else alert("Usuario o contraseña incorrectos.");
 }

  const cerrarSesion = () => { setVistaActual('catalogo'); setModalAbierto({...modalAbierto, perfilEstudiante: false}); }

  /* --- FUNCIONES DE PERSISTENCIA (GUARDADO) --- */
  const guardarHorario = (e) => {
    e.preventDefault();
    setHorarios([...horarios, { id: Date.now(), desc: nuevoHorario.desc, cat: nuevoHorario.cat, hora: `${nuevoHorario.hora}:${nuevoHorario.min} ${nuevoHorario.per}` }]);
    setNuevoHorario({ desc: '', cat: '', hora: '8', min: '00', per: 'AM' }); setModalAbierto({...modalAbierto, horario: false});
  }

  const guardarEstudiante = (e) => {
    e.preventDefault();
    setEstudiantes([...estudiantes, { id: Date.now(), ...nuevoEstudiante, categoria: nuevoEstudiante.cat, nacimiento: '01/01/2009' }]);
    setNuevoEstudiante({ nombres: '', apellidos: '', documento: '', cat: '' }); setModalAbierto({...modalAbierto, estudiante: false});
  }

  const guardarProducto = (e) => {
    e.preventDefault();
    setProductos([...productos, { id: Date.now(), ...nuevoProducto, precio: parseFloat(nuevoProducto.precio).toFixed(2) }]);
    setNuevoProducto({ nombre: '', descripcion: '', precio: '' }); setModalAbierto({...modalAbierto, producto: false});
  }

  const guardarEquipo = (e) => {
    e.preventDefault();
    if (nuevoEquipo.integrantes.length === 0) return;
    setEquipos([...equipos, { id: Date.now(), nombre: nuevoEquipo.nombre, integrantes: nuevoEquipo.integrantes }]);
    setNuevoEquipo({ nombre: '', integrantes: [] }); setModalAbierto({...modalAbierto, equipo: false});
  }

  const guardarTorneo = (e) => {
    e.preventDefault();
    const enfrentamientos = [];
    if (nuevoTorneos.e1 && nuevoTorneos.e2) {
      enfrentamientos.push({ eq1: nuevoTorneos.e1, eq2: nuevoTorneos.e2 });
    }
    setTorneos([...torneos, { id: Date.now(), nombre: nuevoTorneos.nombre, fecha: nuevoTorneos.fecha, estado: nuevoTorneos.estado, enfrentamientos }]);
    setNuevoTorneo({ nombre: '', fecha: '', estado: 'Inscripciones Abiertas', e1: '', e2: '' }); setModalAbierto({...modalAbierto, torneo: false});
  }

  /* --- FUNCIONES DE INTERACCIÓN (Equipos) --- */
  const toggleIntegrante = (id) => {
    setNuevoEquipo(prev => {
      const yaEsta = prev.integrantes.includes(id);
      if (!yaEsta && prev.integrantes.length >= 4) {
        alert("Los equipos no pueden superar el máximo de 4 jugadores.");
        return prev;
      }
      return { ...prev, integrantes: yaEsta ? prev.integrantes.filter(i => i !== id) : [...prev.integrantes, id] };
    });
  }

  /* --- FUNCIONES DE BORRADO --- */
  const confirmarBorradoFinal = () => {
    const { tipo, id } = confirmacionBorrado;
    if (tipo === 'horario') setHorarios(horarios.filter(h => h.id !== id));
    if (tipo === 'student') setEstudiantes(estudiantes.filter(e => e.id !== id));
    if (tipo === 'producto') setProductos(productos.filter(p => p.id !== id)); 
    if (tipo === 'torneo') setTorneos(torneos.filter(t => t.id !== id));
    if (tipo === 'equipo') setEquipos(equipos.filter(e => e.id !== id));
    setConfirmacionBorrado({ mostrar: false, tipo: null, id: null });
  }

  /* --- CÁLCULOS DE DERIVADOS (Filtros y Perfiles) --- */
  const horariosFiltrados = categoriaFiltroHorario ? horarios.filter(h => h.cat === categoriaFiltroHorario) : horarios;
  const estudiantesFiltrados = categoriaFiltroEstudiante ? estudiantes.filter(est => est.categoria === categoriaFiltroEstudiante) : estudiantes;
  
  // El estudiante Carlos Pérez que inicia sesión (Datos fijos para prototipo)
  const estudianteActualInfo = { nombres: 'Carlos', apellidos: 'Pérez', documento: '1027374823', categoria: '2009', nacimiento: '15/05/2009' };
  const equipoDelEstudiante = equipos.find(eq => eq.integrantes.includes(1));
  const horariosDelEstudiante = horarios.filter(h => h.cat === estudianteActualInfo.categoria);

  /*RENDERIZADO PRINCIPAL DE LA APLICACIÓN*/
  return (
    <div className="App">
      {/* HEADER Y NAVEGACIÓN (Oculto en Login/Registro) */}
      {vistaActual !== 'login' && vistaActual !== 'registro' && (
        <header>
          <nav className="navbar navbar-custom-layout">
            <div className="logo">
              <img src={logoImagen} alt="Logo del Club" className="logo-img-header" />
            </div>
            
            {/* Nav Links: PANEL ENTRENADOR */}
            {vistaActual === 'panel-entrenador' && (
              <ul className="nav-links panel-nav panel-nav-custom">
                <li><button onClick={() => setMenuEntrenador('horarios')} className={`nav-item ${menuEntrenador === 'horarios' ? 'active' : ''}`}>Horarios</button></li>
                <li><button onClick={() => setMenuEntrenador('catalogo-admin')} className={`nav-item ${menuEntrenador === 'catalogo-admin' ? 'active' : ''}`}>Mi Catálogo</button></li> 
                <li><button onClick={() => setMenuEntrenador('estudiantes')} className={`nav-item ${menuEntrenador === 'estudiantes' ? 'active' : ''}`}>Mis Estudiantes</button></li>
                <li><button onClick={() => setMenuEntrenador('torneos')} className={`nav-item ${menuEntrenador === 'torneos' ? 'active' : ''}`}>Torneos</button></li>
                <li className="profesor-info profesor-info-custom-layout">
                  <div className="avatar avatar-entrenador">G</div>
                  <span className="text-dark">Gregorio</span>
                  <button onClick={cerrarSesion} className="btn-salir-transparent text-dark">Salir</button>
                </li>
              </ul>
            )}

            {/* Nav Links: PANEL ESTUDIANTE */}
            {vistaActual === 'panel-estudiante' && (
              <ul className="nav-links panel-nav panel-nav-custom">
                <li><button onClick={() => setMenuEstudiante('horarios')} className={`nav-item ${menuEstudiante === 'horarios' ? 'active' : ''}`}>Mi Horario</button></li>
                <li><button onClick={() => setMenuEstudiante('torneos')} className={`nav-item ${menuEstudiante === 'torneos' ? 'active' : ''}`}>Torneos</button></li>
                <li><button onClick={() => setMenuEstudiante('catalogo')} className={`nav-item ${menuEstudiante === 'catalogo' ? 'active' : ''}`}>Catálogo</button></li>
                <li className="profesor-info profesor-info-clickable" onClick={() => setModalAbierto({...modalAbierto, perfilEstudiante: true})}>
                  <div className="avatar avatar-estudiante">E</div>
                  <span className="text-dark">Carlos Pérez</span>
                  <button onClick={cerrarSesion} className="btn-salir-transparent text-dark">Salir</button>
                </li>
              </ul>
            )}

            {/* Nav Links: CATÁLOGO PÚBLICO */}
            {vistaActual === 'catalogo' && (
              <ul className="nav-links nav-links-publico-layout">
                <li><button onClick={() => setVistaActual('login')} className="btn-login-nav text-dark">Iniciar Sesión</button></li>
                <li><button onClick={() => setVistaActual('registro')} className="btn-primary btn-registro-nav">Registrarse</button></li>
              </ul>
            )}
          </nav>
        </header>
      )}

      {/* RENDERIZADO CONDICIONAL DE VISTAS PRINCIPALES */}
      {vistaActual === 'catalogo' && <VistaCatalogo productos={productos} />}
      {vistaActual === 'login' && <VistaLogin setVistaActual={setVistaActual} manejarLogin={manejarLogin} />}
      {vistaActual === 'registro' && <VistaRegistro setVistaActual={setVistaActual} />}

      {/* VISTA: PANEL ENTRENADOR */}
      {vistaActual === 'panel-entrenador' && (
        <main className="main-content-panel animacion-aparecer">
          {/* Sub-menú: Horarios */}
          {menuEntrenador === 'horarios' && (
            <div className="horarios-container">
              <div className="horarios-grid-box">
                <div className="grid-row header-row text-center">
                  <span className="col-desc text-dark">Horario</span>
                  <span className="col-cat text-dark">Categoría</span>
                </div>
                {horariosFiltrados.length === 0 ? <div className="fila-vacia text-dark text-center">No hay horarios definidos.</div> :
                  horariosFiltrados.map((item) => (
                    <div key={item.id} className="grid-row content-row text-center align-center">
                      <div className="col-desc text-dark text-center">
                        <strong>{item.desc}</strong>
                        <p className="text-dark m-0">{item.hora}</p>
                      </div>
                      <div className="col-cat-container justify-center align-center">
                        <span className="col-cat text-dark text-center">{item.cat}</span>
                        <button className="btn-delete" onClick={() => setConfirmacionBorrado({ mostrar: true, tipo: 'horario', id: item.id })}>Borrar</button>
                      </div>
                    </div>
                  ))
                }
              </div>
              <div className="horarios-footer justify-center">
                <select className="select-categoria select-categoria-width" value={categoriaFiltroHorario} onChange={(e) => setCategoriaFiltroHorario(e.target.value)}>
                  <option value="">Todas las Categorías</option>
                  {categoriasDisponibles.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <button className="btn-icon btn-add-horario" onClick={() => setModalAbierto({...modalAbierto, horario: true})}>+</button>
              </div>
            </div>
          )}

          {/* Sub-menú: Catálogo Admin */}
          {menuEntrenador === 'catalogo-admin' && (
            <div className="horarios-container">
               <div className="horarios-grid-box">
                <div className="grid-row header-row text-center">
                  <span className="col-desc text-dark">Producto</span>
                  <span className="col-cat text-dark">Precio</span>
                </div>
                {productos.length === 0 ? <div className="fila-vacia text-dark text-center">No hay productos creados.</div> :
                  productos.map((item) => (
                    <div key={item.id} className="grid-row content-row text-center align-center">
                      <div className="col-desc text-dark text-center">
                        <strong>{item.nombre}</strong>
                        <p className="text-dark m-0">{item.descripcion}</p>
                      </div>
                      <div className="col-cat-container justify-center align-center">
                        <span className="col-cat text-dark text-center">${parseFloat(item.precio).toLocaleString('es-CO')}</span>
                        <button className="btn-delete" onClick={() => setConfirmacionBorrado({ mostrar: true, tipo: 'producto', id: item.id })}>Eliminar</button>
                      </div>
                    </div>
                  ))
                }
              </div>
              <div className="horarios-footer justify-center">
                <button className="btn-primary btn-crear-producto-submit" onClick={() => setModalAbierto({...modalAbierto, producto: true})}>
                  Crear Producto
                </button>
              </div>
            </div>
          )}

          {/* Sub-menú: Estudiantes */}
          {menuEntrenador === 'estudiantes' && (
            <div className="horarios-container">
              <div className="horarios-grid-box">
                <div className="grid-row header-row text-center">
                  <span className="col-desc text-dark">Estudiante</span>
                  <span className="col-cat text-dark">Categoría</span>
                </div>
                {estudiantesFiltrados.length === 0 ? <div className="fila-vacia text-dark text-center">No hay estudiantes registrados.</div> :
                  estudiantesFiltrados.map((item) => (
                    <div key={item.id} className="grid-row content-row text-center align-center">
                      <div className="col-desc text-dark text-center">
                        <strong>{item.nombres} {item.apellidos}</strong>
                        <p className="text-dark m-0">Doc: {item.documento}</p>
                      </div>
                      <div className="col-cat-container justify-center align-center">
                        <span className="col-cat text-dark text-center">{item.categoria}</span>
                        <button className="btn-delete" onClick={() => setConfirmacionBorrado({ mostrar: true, tipo: 'student', id: item.id })}>Borrar</button>
                      </div>
                    </div>
                  ))
                }
              </div>
              <div className="horarios-footer justify-center">
                <select className="select-categoria select-categoria-width" value={categoriaFiltroEstudiante} onChange={(e) => setCategoriaFiltroEstudiante(e.target.value)}>
                  <option value="">Todas las Categorías</option>
                  {categoriasDisponibles.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <button className="btn-icon btn-add-horario" onClick={() => setModalAbierto({...modalAbierto, estudiante: true})}>+</button>
              </div>
            </div>
          )}

          {/* Sub-menú: Torneos y Equipos */}
          {menuEntrenador === 'torneos' && (
            <div className="horarios-container">
              <h3 className="section-title-dark text-center">Gestión de Equipos</h3>
              <div className="horarios-grid-box mb-4">
                <div className="grid-row header-row text-center">
                  <span className="col-desc text-dark">Equipo</span>
                  <span className="col-cat text-dark">Miembros</span>
                </div>
                {equipos.length === 0 ? <div className="fila-vacia text-dark text-center">No hay equipos creados.</div> :
                  equipos.map((eq) => (
                    <div key={eq.id} className="grid-row content-row text-center align-center">
                      <div className="col-desc text-dark text-center"><strong>{eq.nombre}</strong></div>
                      <div className="col-cat-container justify-center align-center">
                        <span className="col-cat text-dark text-center">{eq.integrantes.length} / 4 Jugadores</span>
                        <button className="btn-delete" onClick={() => setConfirmacionBorrado({ mostrar: true, tipo: 'equipo', id: eq.id })}>Borrar</button>
                      </div>
                    </div>
                  ))
                }
              </div>
              <div className="justify-center mb-30">
                <button className="btn-primary btn-crear-equipo-submit" onClick={() => setModalAbierto({...modalAbierto, equipo: true})}>
                  Crear Equipo
                </button>
              </div>

              <h3 className="section-title-dark text-center">Organización de Torneos</h3>
              <div className="horarios-grid-box">
                <div className="grid-row header-row text-center">
                  <span className="col-desc text-dark">Torneo y Enfrentamientos</span>
                  <span className="col-cat text-dark">Estado</span>
                </div>
                {torneos.length === 0 ? <div className="fila-vacia text-dark text-center">No hay torneos creados.</div> :
                  torneos.map((item) => (
                    <div key={item.id} className="grid-row content-row height-auto p-torneo text-center align-center">
                      <div className="col-desc text-dark text-center">
                        <strong>{item.nombre}</strong>
                        <p className="text-dark m-0">Fecha: {item.fecha}</p>
                        {item.enfrentamientos.length > 0 && (
                          <div className="enfrentamiento-box">
                            <p className="m-0 f-sm fw-bold text-dark">{item.enfrentamientos[0].eq1} 🆚 {item.enfrentamientos[0].eq2}</p>
                          </div>
                        )}
                      </div>
                      <div className="col-cat-container justify-center align-center">
                        <span className="col-cat text-dark text-center">{item.estado}</span>
                        <button className="btn-delete" onClick={() => setConfirmacionBorrado({ mostrar: true, tipo: 'torneo', id: item.id })}>Borrar</button>
                      </div>
                    </div>
                  ))
                }
              </div>
              <div className="horarios-footer justify-center">
                <button className="btn-primary btn-crear-torneo-submit" onClick={() => setModalAbierto({...modalAbierto, torneo: true})}>
                  Crear Torneo
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* VISTA: PANEL ESTUDIANTE */}
      {vistaActual === 'panel-estudiante' && (
        <main className="main-content-panel animacion-aparecer">
          
          {/* Sub-menú: Mi Horario */}
          {menuEstudiante === 'horarios' && (
            <div className="horarios-container">
              <h2 className="panel-title-dark text-center">Mis Horarios Asignados</h2>
              <div className="horarios-grid-box">
                <div className="grid-row header-row text-center">
                  <span className="col-desc text-dark">Horario</span>
                  <span className="col-cat text-dark">Categoría</span>
                </div>
                {horariosDelEstudiante.length === 0 ? <div className="fila-vacia text-dark text-center">Aún no tienes horarios asignados para tu categoría.</div> :
                  horariosDelEstudiante.map((item) => (
                    <div key={item.id} className="grid-row content-row text-center align-center">
                      <div className="col-desc text-dark text-center"><strong>{item.desc}</strong><p className="text-dark m-0">{item.hora}</p></div>
                      <div className="col-cat-container justify-center">
                        <span className="col-cat text-dark text-center">{item.cat}</span>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* Sub-menú: Torneos */}
          {menuEstudiante === 'torneos' && (
            <div className="horarios-container">
              <h2 className="panel-title-dark text-center">Torneos y Mi Equipo</h2>
              
              {equipoDelEstudiante && (
                <div className="equipo-info-box-estudiante text-center">
                  <h3 className="text-dark m-0-b-5">Mi Equipo: {equipoDelEstudiante.nombre}</h3>
                  <p className="text-muted m-0 f-sm">Estás participando en este equipo.</p>
                </div>
              )}

              <div className="container">
                <div className="row">
                  {torneos.map((item) => (
                    <div key={item.id} className="col-md-6 mb-3">
                      <div className="torneo-card-estudiante text-center">
                        <h3 className="text-dark f-md m-0-b-5">{item.nombre}</h3>
                        <p className="text-dark f-sm m-0-b-10"><strong>Fecha:</strong> {item.fecha}</p>
                        {item.enfrentamientos.map((enf, idx) => (
                          <div key={idx} className="enfrentamiento-box-estudiante text-dark">
                            <strong>{enf.eq1}</strong> vs <strong>{enf.eq2}</strong>
                          </div>
                        ))}
                        <span className="badge-estado-torneo f-xs fw-bold">{item.estado}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sub-menú: Catálogo */}
          {menuEstudiante === 'catalogo' && (
            <div className="horarios-container p-10">
              <h2 className="panel-title-dark text-center">Catálogo de Productos</h2>
              <div className="container">
                <div className="row">
                  {productos.map(prod => <TarjetaProducto key={prod.id} prod={prod} />)}
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* RENDERIZADO DE MODALES */}

      {/* Modal: Perfil Estudiante */}
      {vistaActual === 'panel-estudiante' && modalAbierto.perfilEstudiante && (
        <div className="modal-overlay">
          <div className="modal-content animacion-aparecer modal-perfil-layout">
            <div className="modal-header">
              <h2 className="text-dark text-center">Mi Perfil</h2>
              <button className="btn-close text-dark" onClick={() => setModalAbierto({...modalAbierto, perfilEstudiante: false})}>X</button>
            </div>
            
            <div className="modal-body-perfil text-center text-dark">
              <div className="avatar avatar-perfil avatar-estudiante modal-avatar-layout fw-bold">E</div>
              
              <div className="info-perfil-grid text-center f-sm">
                <p className="m-0"><strong>Nombres:</strong> Carlos</p>
                <p className="m-0"><strong>Apellidos:</strong> Pérez</p>
                <p className="m-0"><strong>Documento:</strong> 1029384756</p>
                <p className="m-0"><strong>Fecha de Nacimiento:</strong> 15/05/2009</p>
              </div>

              <hr className="modal-divider-light" />
              <div className="badge-categoria-perfil fw-bold f-xs">Categoría 2009</div>
            </div>
            
            <button className="btn-primary btn-block btn-login-submit" onClick={() => setModalAbierto({...modalAbierto, perfilEstudiante: false})}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal: Crear Equipo */}
      {modalAbierto.equipo && (
        <div className="modal-overlay">
          <div className="modal-content animacion-aparecer modal-crear-equipo-layout">
            <div className="modal-header">
              <h2 className="text-dark text-center">Crear Nuevo Equipo</h2>
              <button className="btn-close text-dark" onClick={() => setModalAbierto({...modalAbierto, equipo: false})}>X</button>
            </div>
            
            <form onSubmit={guardarEquipo} className="modal-form">
              <div className="form-group-modal">
                <input type="text" placeholder="Nombre del Equipo *" value={nuevoEquipo.nombre} onChange={(e) => setNuevoEquipo({...nuevoEquipo, nombre: e.target.value})} required style={{...estiloInputLimpio}} />
              </div>
              
              <div className="form-group-modal">
                <label className="label-modal-check fw-bold text-dark text-center">Selecciona los Estudiantes (Máx. 4):</label>
                
                <div className="checkbox-list-container scroll-y">
                  {estudiantes.map(e => (
                    <div key={e.id} className="checkbox-item-layout align-center justify-center gap-10">
                      <input type="checkbox" checked={nuevoEquipo.integrantes.includes(e.id)} onChange={() => toggleIntegrante(e.id)} className="cursor-pointer" />    
                      <span className="text-dark f-sm ws-nowrap align-center inline-flex">
                        {e.nombres} {e.apellidos}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <button type="submit" className="btn-primary btn-block btn-login-submit mt-5">Guardar Equipo</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Crear Torneo */}
      {modalAbierto.torneo && (
        <div className="modal-overlay">
          <div className="modal-content animacion-aparecer">
            <div className="modal-header">
              <h2 className="text-dark text-center">Crear Nuevo Torneo</h2>
              <button className="btn-close text-dark" onClick={() => setModalAbierto({...modalAbierto, torneo: false})}>X</button>
            </div>
            <form onSubmit={guardarTorneo} className="modal-form">
              <div className="form-group-modal"><input type="text" placeholder="Nombre del Torneo *" value={nuevoTorneos.nombre} onChange={(e) => setNuevoTorneo({...nuevoTorneos, nombre: e.target.value})} required style={{...estiloInputLimpio}} /></div>
              <div className="form-group-modal"><input type="text" placeholder="Fecha (Ej: 15 de Mayo) *" value={nuevoTorneos.fecha} onChange={(e) => setNuevoTorneo({...nuevoTorneos, fecha: e.target.value})} required style={{...estiloInputLimpio}} /></div>
              
              {/* COMPONENTES CONCEPTUALES */}
              <div className="form-group-modal">
                <select style={{...estiloInputLimpio}}>
                  <option value="">Tipo de Sistema de Juego</option>
                  <option value="1">Eliminación directa</option>
                  <option value="2">Todos contra todos (Liga)</option>
                  <option value="3">Fase de grupos y playoff</option>
                </select>
              </div>
              <div className="form-group-modal"><input type="text" placeholder="Premio/Trofeo (Ej: Medallas y Trofeo)" style={{...estiloInputLimpio}} /></div>

              <div className="form-group-modal">
                <label className="label-modal-generic text-dark text-center">Enfrentamiento Inicial (Opcional):</label>
                <div className="enfrentamiento-selects-layout justify-center gap-10 mt-5">
                  <select value={nuevoTorneos.e1} onChange={(e) => setNuevoTorneo({...nuevoTorneos, e1: e.target.value})} style={{...estiloInputLimpio, flex: 1}}><option value="">Equipo 1</option>{equipos.map(eq => <option key={eq.id} value={eq.nombre}>{eq.nombre}</option>)}</select>
                  <span className="align-self-center text-dark">vs</span>
                  <select value={nuevoTorneos.e2} onChange={(e) => setNuevoTorneo({...nuevoTorneos, e2: e.target.value})} style={{...estiloInputLimpio, flex: 1}}><option value="">Equipo 2</option>{equipos.map(eq => <option key={eq.id} value={eq.nombre}>{eq.nombre}</option>)}</select>
                </div>
              </div>
              <button type="submit" className="btn-primary btn-block btn-login-submit">Guardar Torneo</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Registrar Estudiante */}
      {modalAbierto.estudiante && (
        <div className="modal-overlay">
          <div className="modal-content animacion-aparecer">
            <div className="modal-header">
              <h2 className="text-dark text-center">Registrar Estudiante</h2>
              <button className="btn-close text-dark" onClick={() => setModalAbierto({...modalAbierto, estudiante: false})}>X</button>
            </div>
            <form onSubmit={guardarEstudiante} className="modal-form">
              <div className="form-group-modal"><input type="text" placeholder="Nombres *" value={nuevoEstudiante.nombres} onChange={(e) => setNuevoEstudiante({...nuevoEstudiante, nombres: e.target.value})} required style={{...estiloInputLimpio}} /></div>
              <div className="form-group-modal"><input type="text" placeholder="Apellidos *" value={nuevoEstudiante.apellidos} onChange={(e) => setNuevoEstudiante({...nuevoEstudiante, apellidos: e.target.value})} required style={{...estiloInputLimpio}} /></div>
              <div className="form-group-modal"><input type="text" placeholder="Documento *" value={nuevoEstudiante.documento} onChange={(e) => setNuevoEstudiante({...nuevoEstudiante, documento: e.target.value})} required style={{...estiloInputLimpio}} /></div>
              <div className="form-group-modal">
                <select value={nuevoEstudiante.cat} onChange={(e) => setNuevoEstudiante({...nuevoEstudiante, cat: e.target.value})} required style={{...estiloInputLimpio}}>
                  <option value="">Seleccionar Categoría *</option>
                  {categoriasDisponibles.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              {/* COMPONENTES CONCEPTUALES */}
              <div className="form-group-modal"><input type="text" placeholder="EPS / Seguro Médico" style={{...estiloInputLimpio}} /></div>
              <div className="form-group-modal enfrentamiento-selects-layout gap-10">
                <select style={{...estiloInputLimpio, flex: 1}}><option value="">Tipo de Sangre (Rh)</option><option>O+</option><option>O-</option><option>A+</option><option>A-</option></select>
                <input type="text" placeholder="Nombre Acudiente" style={{...estiloInputLimpio, flex: 2}} />
              </div>

              <button type="submit" className="btn-primary btn-block btn-login-submit">Guardar</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Crear Horario */}
      {modalAbierto.horario && (
        <div className="modal-overlay">
          <div className="modal-content animacion-aparecer">
            <div className="modal-header">
              <h2 className="text-dark text-center">Crear Horario</h2>
              <button className="btn-close text-dark" onClick={() => setModalAbierto({...modalAbierto, horario: false})}>X</button>
            </div>
            
            <form onSubmit={guardarHorario} className="modal-form">
              <div className="form-group-modal"><input type="text" placeholder="Descripción de la sesión *" value={nuevoHorario.desc} onChange={(e) => setNuevoHorario({...nuevoHorario, desc: e.target.value})} required style={{...estiloInputLimpio}} /></div>
              <div className="form-group-modal">
                <select value={nuevoHorario.cat} onChange={(e) => setNuevoHorario({...nuevoHorario, cat: e.target.value})} required style={{...estiloInputLimpio}}>
                  <option value="">Categoría asignada *</option>
                  {categoriasDisponibles.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="form-group-modal">
                <select style={{...estiloInputLimpio}}>
                  <option value="">Día de la semana</option>
                  <option>Lunes</option><option>Martes</option><option>Miércoles</option><option>Jueves</option><option>Viernes</option><option>Sábado</option>
                </select>
              </div>

              <div className="form-group-modal">
                <label className="label-modal- generic text-dark text-center">Hora de entrenamiento *</label>
                <div className="time-selectors-grid mt-5">
                  <select value={nuevoHorario.horaIn} onChange={(e) => setNuevoHorario({...nuevoHorario, horaIn: e.target.value})} style={{...estiloInputLimpio}} required>
                    {[...Array(12)].map((_, i) => <option key={i} value={i+1}>{i+1}</option>)}
                  </select>
                  <select value={nuevoHorario.minIn} onChange={(e) => setNuevoHorario({...nuevoHorario, minIn: e.target.value})} style={{...estiloInputLimpio}} required>
                    <option value="00">00</option><option value="15">15</option><option value="30">30</option><option value="45">45</option>
                  </select>
                  <select value={nuevoHorario.perIn} onChange={(e) => setNuevoHorario({...nuevoHorario, perIn: e.target.value})} style={{...estiloInputLimpio}} required>
                    <option value="AM">AM</option><option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary btn-block btn-login-submit">Guardar</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Crear Producto */}
      {modalAbierto.producto && (
        <div className="modal-overlay">
          <div className="modal-content animacion-aparecer">
            <div className="modal-header">
              <h2 className="text-dark text-center">Crear Producto</h2>
              <button className="btn-close text-dark" onClick={() => setModalAbierto({...modalAbierto, producto: false})}>X</button>
            </div>
            <form onSubmit={guardarProducto} className="modal-form">
              <div className="form-group-modal"><input type="text" placeholder="Nombre del Producto *" value={nuevoProducto.nombre} onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} required style={{...estiloInputLimpio}} /></div>
              <div className="form-group-modal"><textarea placeholder="Descripción *" value={nuevoProducto.descripcion} onChange={(e) => setNuevoProducto({...nuevoProducto, descripcion: e.target.value})} required style={{...estiloInputLimpio, height: '60px'}} /></div>
              <div className="form-group-modal"><input type="text" placeholder="Precio ($) *" value={nuevoProducto.precio} onChange={(e) => setNuevoProducto({...nuevoProducto, precio: e.target.value})} required style={{...estiloInputLimpio}} /></div>
              
              {/* COMPONENTES CONCEPTUALES */}
              <div className="form-group-modal enfrentamiento-selects-layout gap-10">
                <select style={{...estiloInputLimpio, flex: 1}}><option>Disponible</option><option>Agotado</option></select>
                <input type="text" placeholder="Marca / Proveedor" style={{...estiloInputLimpio, flex: 2}} />
              </div>
              
              <div className="form-group-modal">
                <label className="label-modal- generic text-dark text-center">Subir Imagen del Producto (Opcional):</label>
                <div className="upload-placeholder-box cursor-pointer text-center" onClick={() => alert('¡Lógica de subida simulada!')}>
                  <span className="f-sm text-muted">Haz clic para buscar archivo...</span>
                </div>
              </div>

              <button type="submit" className="btn-primary btn-block btn-login-submit">Guardar</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmación de Borrado */}
      {confirmacionBorrado.mostrar && (
        <div className="modal-overlay modal-overlay-borrado">
          <div className="modal-content animacion-aparecer dialog-confirm text-center">
            <h3 className="text-dark">¿Estás seguro?</h3>
            <p className="text-dark">Esta acción eliminará el elemento seleccionado de forma permanente.</p>
            <div className="dialog-actions justify-center gap-10">
              <button className="btn-primary btn-borrar-confirmar" onClick={confirmarBorradoFinal}>Borrar</button>
              <button className="btn-cancelar-confirmar" onClick={() => setConfirmacionBorrado({ mostrar: false, tipo: null, id: null })}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER GENERAL */}
      {vistaActual === 'catalogo' && <FooterGeneral />}
    </div>
  )
}

export default App