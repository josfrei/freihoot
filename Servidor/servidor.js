const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc, getDocs, getDoc, setDoc, updateDoc, arrayUnion, query, where, addDoc } = require("firebase/firestore/lite");
const app = express()
app.use(cors())
const puerto = 4000
app.use(express.json())

const db = mysql.createConnection({
    host: "***********",
    port: 1234,
    user: "***********",
    password: "***********",
    database: "***********",
});


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "***********",
    authDomain: "***********",
    projectId: "***********",
    storageBucket: "***********",
    messagingSenderId: "***********",
    appId: "***********",
};

// Initialize Firebase
const appFireBase = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const dbFireBase = getFirestore(appFireBase);


//aquí creamos un json de prueba
app.get("/", (req, res) => {
    res.json({ "Hola": "Saludo" })
})

/**
 * *******************************************
 * *******************************************
 * **** AHORA VAMOS CON LOS CUESTIONARIOS ****
 * *******************************************
 * *******************************************
 */

//esto es para seleccionar el cuestionario por id
app.get("/cuestionario/:id", (req, res) => {
    const sql = "select * from cuestionarios where idCuestionario=?"
    const valores = [
        req.params.id
    ]

    db.query(sql, valores, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

// Esto es para mostrar los cuestionarios
app.get("/cuestionarios", (req, res) => {
    const sql = "select * from cuestionarios"

    db.query(sql, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

//esto es para insertar cuestionario
app.post("/cuestionarios", (req, res) => {
    const sql = "insert into cuestionarios set tituloCuestionario =? , creador_id = ?"

    const valores = [
        req.body.tituloCuestionario,
        req.body.creador_id
    ]

    db.query(sql, valores, (err, data) => {
        if (err) return res.json(err)
        return res.json({ "status": "oki doki" })
    })
})

//esto es para modificar cuestionario
app.put("/cuestionarios/:id", (req, res) => {
    const sql = "update cuestionarios set tituloCuestionario =? , creador_id = ? where idCuestionario=?"

    const valores = [
        req.body.tituloCuestionario,
        req.body.creador_id,
        req.params.id
    ]

    db.query(sql, valores, (err, data) => {
        if (err) return res.json(err)
        return res.json({ "status": "oki doki en el update" })
    })
})

//esto es para borrar cuestionario
app.delete("/cuestionarios/:id", (req, res) => {
    const sql = "delete from cuestionarios where idCuestionario=?"

    const valores = [
        req.params.id
    ]

    db.query(sql, valores, (err, data) => {
        if (err) return res.json(err)
        return res.json({ "status": "oki doki en el delete" })
    })
})

//esto lo usamos (de primeras) para el select a la hora de crear usuarios.
app.get("/usuarios", (req, res) => {
    const sql = "select * from usuarios order by nombreUsuario"

    db.query(sql, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

/**
 * ***************************************
 * ***************************************
 * **** AHORA VAMOS CON LAS PREGUNTAS ****
 * ***************************************
 * ***************************************
 */

// Esto es para mostrar los preguntas
app.get("/preguntas/:id", (req, res) => {
    const sql = "select * from preguntas where cuestionario_id = ?"

    const valores = [
        req.params.id
    ]

    db.query(sql, valores, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

//esto es para insertar preguntas
app.post("/preguntas/:id", (req, res) => {
    const sql = "insert into preguntas set texto =? , tiempo_respuesta = ?, cuestionario_id=?"

    const valores = [
        req.body.texto,
        req.body.tiempo_respuesta,
        req.params.id
    ]

    db.query(sql, valores, (err, data) => {
        if (err) return res.json(err)
        return res.json({ "status": "oki doki, pregunta insertada" })
    })
})

//esto es para borrar pregunta
app.delete("/preguntas/:id", (req, res) => {
    const sql = "delete from preguntas where idPreguntas=?"

    const valores = [
        req.params.id
    ]

    db.query(sql, valores, (err, data) => {
        if (err) return res.json(err)
        return res.json({ "status": "oki doki en el delete preguntas" })
    })
})

//esto es para modificar preguntas
app.put("/preguntas/:id", (req, res) => {
    const sql = "update preguntas set texto =? , tiempo_respuesta = ? where idPreguntas=?"

    const valores = [
        req.body.texto,
        req.body.tiempo_respuesta,
        req.params.id
    ]

    db.query(sql, valores, (err, data) => {
        if (err) return res.json(err)
        return res.json({ "status": "oki doki en el update" })
    })
})

//esto es para seleccionar la pregunta por id, se usa en editar
app.get("/pregunta/:id", (req, res) => {
    const sql = "select * from preguntas where idPreguntas=?"
    const valores = [
        req.params.id
    ]

    db.query(sql, valores, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

/**
 * ****************************************
 * ****************************************
 * ****  AHORA VAMOS CON LAS OPCIONES  ****
 * ****************************************
 * ****************************************
 */

// Esto es para mostrar las opciones
app.get("/opciones/:id", (req, res) => {
    const sql = "select * from opciones where pregunta_id = ?"

    const valores = [
        req.params.id
    ]

    db.query(sql, valores, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

//esto es para insertar preguntas
app.post("/opciones/:id", (req, res) => {
    const sql = "insert into opciones set texto =? , es_correcta = ?, pregunta_id=?"

    const valores = [
        req.body.texto,
        req.body.es_correcta,
        req.params.id
    ]

    db.query(sql, valores, (err, data) => {
        if (err) return res.json(err)
        return res.json({ "status": "oki doki, opción insertada" })
    })
})


//esto es para modificar opciones
app.put("/opciones/:id", (req, res) => {
    const sql = "update opciones set texto =? , es_correcta = ? where idOpciones=?"

    const valores = [
        req.body.texto,
        req.body.es_correcta,
        req.params.id
    ]

    db.query(sql, valores, (err, data) => {
        if (err) return res.json(err)
        return res.json({ "status": "oki doki en el update de opciones" })
    })
})

//esto es para seleccionar la opción por id, se usa en editar
app.get("/opcion/:id", (req, res) => {
    const sql = "select * from opciones where idOpciones=?"
    const valores = [
        req.params.id
    ]

    db.query(sql, valores, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

//esto es para borrar opción
app.delete("/opciones/:id", (req, res) => {
    const sql = "delete from opciones where idOpciones=?"

    const valores = [
        req.params.id
    ]

    db.query(sql, valores, (err, data) => {
        if (err) return res.json(err)
        return res.json({ "status": "oki doki en el delete opciones" })
    })
})

/**
 * *********************************************************
 * *********************************************************
 * ****  DESCARGAMOS TODAS LAS PREGUNTAS Y SUS OPCIONES ****
 * *********************************************************
 * *********************************************************
 */

app.get("/preguntasJuego/:id", (req, res) => {
    const sql = "SELECT p.idPreguntas,p.texto AS pregunta, o.idOpciones, o.texto AS opcion, o.es_correcta FROM preguntas p LEFT JOIN opciones o ON p.idPreguntas = o.pregunta_id WHERE p.cuestionario_id = ? AND o.es_correcta = 1;"

    const valores = [
        req.params.id
    ]

    db.query(sql, valores, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

/**
 * *****************************************************************************************************************************************************************
 * *****************************************************************************************************************************************************************
 * ****************                                                FIREBASE                                                                         ****************
 * *****************************************************************************************************************************************************************
 *  * **************************************************************************************************************************************************************
 */

/**
 * creamos sala con los datos de id de la pregunta, nombre de la sala y el pin
 */
app.post("/sala", async (req, res) => {
    try {
        const { PIN, Cuestionario, nombreSala, pregunta_actual } = req.body
        //console.log("Datos recibidos para insertar:", req.body);

        const nuevaSala = req.body
        const resultado = await addDoc(collection(dbFireBase, "Partidas"), nuevaSala);
        //   console.log("Documento insertado con ID:", resultado.id);
        res.json({ id: resultado.id });
    } catch (ex) {
        console.error("Error al insertar en Firestore:", ex.message);
        res.status(500).json({ error: ex.message });
    }
})
/**
 * inserto el jugador en la sala del PIN, en caso de que no exista esa sala manda error,
 *  y también en caso de que ya exista el nick en la sala
 */
app.post("/jugador", async (req, res) => {
    const { nombreJugador, puntuacion, PIN } = req.body;

    if (!nombreJugador || !PIN) {
        return res.status(401).json({ error: "El PIN es obligatorio." });
    }

    // console.log("Pin recibido en servidor: " + PIN)
    const refPartidas = collection(dbFireBase, 'Partidas');
    const consulta = query(refPartidas, where('PIN', '==', Number(PIN)));

    try {
        // Obtenemos los documentos de la colección
        const snapshot = await getDocs(consulta);

        if (snapshot.empty) {
            return res.status(404).json({ error: `No existe una partida con el PIN: ${PIN}` });
        }

        // Obtenemos los datos del primer documento (solo debería haber uno por PIN)
        const partidaDoc = snapshot.docs[0];
        const datosPartida = partidaDoc.data();

        //Verificamos si ya está iniciada
        if (datosPartida.pregunta_actual === 1) {
            return res.status(403).json({ error: "No puedes unirte a la partida porque ya comenzó la partida." });
        }

        // Verificamos si el jugador ya existe en la lista de jugadores. si es el primer jugador
        // y no tiene qué comparar no hace la comparación
        const jugadorExiste = datosPartida.jugadores?.some(jugador => jugador.nombre === nombreJugador) || false;

        if (jugadorExiste) {
            return res.status(400).json({ error: `El jugador ${nombreJugador} ya existe en esta partida.` });
        }

        // Si el jugador no existe, procedemos a agregarlo
        const nuevoJugador = {
            nombre: nombreJugador,
            puntuacion: puntuacion || 0
        };

        // Actualizamos el documento para agregar el nuevo jugador
        await updateDoc(partidaDoc.ref, {
            jugadores: arrayUnion(nuevoJugador)
        });

        return res.status(200).json({ message: "Jugador añadido correctamente." });
    } catch (error) {
        console.error("Error al agregar el jugador:", error.message);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
});

//---------------- ELIMINAR JUGADOR ----------------//

/**
 * borro el jugador en la sala del PIN, en caso de que no
 * exista esa sala manda error
 */
app.delete("/jugador", async (req, res) => {
    const { nombreJugador, PIN } = req.body;

    if (!nombreJugador || !PIN) {
        return res.status(400).json({ error: "El nombre del jugador y el PIN son obligatorios." });
    }
    //console.log("Pin recibido en servidor: " + PIN)
    const refPartidas = collection(dbFireBase, 'Partidas');
    const consulta = query(refPartidas, where('PIN', '==', Number(PIN)));

    try {
        // Obtenemos los documentos de la colección
        const snapshot = await getDocs(consulta);

        if (snapshot.empty) {
            return res.status(404).json({ error: `No existe una partida con el PIN: ${PIN}` });
        }

        // Obtenemos los datos del primer documento (solo debería haber uno por PIN)
        const partidaDoc = snapshot.docs[0];
        const datosPartida = partidaDoc.data();

        // Verificamos si el jugador ya existe en la lista de jugadores. si es el primer jugador
        // y no tiene qué comparar no hace la comparación
        const jugadorExiste = datosPartida.jugadores?.some((jugador) => jugador.nombre === nombreJugador) || false;

        if (!jugadorExiste) {
            return res.status(400).json({ error: `El jugador ${nombreJugador} no existe en esta partida.` });
        }

        // Filtrar jugadores para excluir al jugador que se eliminará
        const jugadoresActualizados = datosPartida.jugadores.filter(
            (jugador) => jugador.nombre !== nombreJugador
        );

        // Actualizamos el documento para agregar el nuevo jugador
        await updateDoc(partidaDoc.ref, {
            jugadores: jugadoresActualizados
        });

        return res.status(200).json({ message: "Jugador eliminado correctamente." });
    } catch (error) {
        console.error("Error al elimijar el jugador:", error.message);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
});
/**
 * busco los jugadres que hay en la partida
 */
app.get("/jugador/:id", async (req, res) => {

    try {
        const { id } = req.params;
        //    console.log("ID recibido en el servidor:", id);
        if (!id) {
            return res.status(400).json({ error: "Se requiere el PIN" });
        }
        const salasRef = collection(dbFireBase, "Partidas"); // Referencia a la colección "salas"
        const querySnapshot = await getDocs(query(salasRef, where("PIN", "==", parseInt(id)))); // Buscamos el documento con el PIN

        if (querySnapshot.empty) {
            return res.status(404).json({ error: "Sala no encontrada con el PIN especificado" });
        }

        // Firestore devuelve una lista de documentos; tomamos el primero
        const salaData = querySnapshot.docs[0].data(); // Obtenemos los datos de la sala
        const nombresJugadores = salaData.jugadores.map((jugador) => jugador.nombre); // Extraemos los nombres de los jugadores

        return res.status(200).json({ jugadores: nombresJugadores });
    } catch (error) {
        console.error("Error al obtener los nombres de los jugadores:", error.message);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});

/**
 * Endpoint para ver la información de hay en firestore
 */
app.get("/partida/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Verificamos si el PIN está presente
        if (!id) {
            return res.status(400).json({ error: "Se requiere el PIN" });
        }

        // Referencia a la colección "Partidas"
        const salasRef = collection(dbFireBase, "Partidas");

        // Buscamos la partida que tenga el PIN especificado
        const querySnapshot = await getDocs(query(salasRef, where("PIN", "==", parseInt(id))));

        // Si no se encuentra la partida
        if (querySnapshot.empty) {
            return res.status(404).json({ error: "Sala no encontrada con el PIN especificado" });
        }

        // Obtenemos los datos de la sala (todo el documento)
        const salaData = querySnapshot.docs[0].data();

        // Devolvemos toda la información de la partida tal como está en Firestore
        return res.status(200).json(salaData);
    } catch (error) {
        console.error("Error al obtener los datos de la partida:", error.message);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});

//----------------- INICIO PARTIDA ----------------//
/**
 * Cambiamos el estado de la partida, pasando de -1 ( no iniciada) a 1 (iniciada)
 */
app.post("/iniciarPartida", async (req, res) => {
    try {
        // Extraer los datos necesarios del cuerpo de la solicitud
        const { pin } = req.body; // Solo necesitamos el PIN para identificar la sala

        // Validar que se haya proporcionado el PIN
        if (!pin) {
            return res.status(400).json({ error: "Se requiere el PIN" });
        }

        // Referencia a la colección "Partidas"
        const salasRef = collection(dbFireBase, "Partidas");

        // Buscar la sala con el PIN proporcionado
        const querySnapshot = await getDocs(query(salasRef, where("PIN", "==", parseInt(pin))));

        // Si no se encuentra la sala, retornar un error
        if (querySnapshot.empty) {
            return res.status(404).json({ error: "Sala no encontrada con el PIN especificado" });
        }

        // Obtener los datos de la sala
        const salaData = querySnapshot.docs[0];

        // Actualizar el campo "pregunta_actual" de la sala a 1
        await updateDoc(salaData.ref, { pregunta_actual: 1 });

        // Responder con éxito
        return res.status(200).json({ mensaje: "Pregunta actualizada correctamente", pregunta_actual: 1 });
    } catch (error) {
        console.error("Error al actualizar la pregunta:", error.message);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});


/**
 * inserto las respuestas de cada pregunta por parte de los jugadores.
 * si responde fuera de tiempo lo puntúa como 0
 */
app.post("/respuestas", async (req, res) => {
    try {
        let { pin, jugadorNick, preguntaNumero, puntuacion } = req.body;

        // Validación de los parámetros
        if (!pin || !jugadorNick || preguntaNumero === undefined || puntuacion === undefined) {
            return res.status(400).json({ error: "Se requieren todos los parámetros: pin, jugadorNick, preguntaNumero, puntuacion" });
        }

        const salasRef = collection(dbFireBase, "Partidas");
        const querySnapshot = await getDocs(query(salasRef, where("PIN", "==", parseInt(pin))));
        if (querySnapshot.empty) {
            return res.status(404).json({ error: "Sala no encontrada con el PIN especificado" });
        }

        const salaData = querySnapshot.docs[0];
        const preguntaIndex = preguntaNumero;
        if (preguntaIndex < 0) {
            return res.status(400).json({ error: "El número de pregunta no es válido." });
        }
        let resultados = salaData.data().resultados || [];

        if (resultados[preguntaIndex] === undefined) {
            resultados[preguntaIndex] = {}; // Creamos un nuevo array para esta pregunta si no existe
        }

        if (puntuacion == null) {
            puntuacion = 0; // Asignamos puntuación 0 si es null o undefined
        }

        resultados[preguntaIndex][jugadorNick] = puntuacion;

        await updateDoc(salaData.ref, { resultados: resultados });

        return res.status(200).json({ mensaje: "Puntuación actualizada correctamente", resultados: resultados });
    } catch (error) {
        console.error("Error al actualizar los resultados de la partida:", error.message);
        return res.status(500).json({ error: "Error interno del servidor" });
    }

});
//------------------------ FIN PARTIDA -----------------------------//
/**
 * Hace un sumatorio de los puntos para mostrar en los resultados
 */
app.get("/resultados/:pin", async (req, res) => {
    const { pin } = req.params;

    if (!pin) {
        return res.status(400).json({ error: "El PIN es obligatorio." });
    }

    try {
        const refPartidas = collection(dbFireBase, 'Partidas');
        const consulta = query(refPartidas, where('PIN', '==', Number(pin)));

        const snapshot = await getDocs(consulta);

        if (snapshot.empty) {
            return res.status(404).json({ error: `No existe una partida con el PIN: ${pin}` });
        }

        const partidaDoc = snapshot.docs[0];
        const datosPartida = partidaDoc.data();
        const resultados = datosPartida.resultados || [];

        // Crear un objeto para almacenar el total de puntos por jugador
        const totalPuntos = {};

        // Recorrer todos los resultados por pregunta y sumar los puntos
        resultados.forEach((preguntaResultado) => {
            Object.keys(preguntaResultado).forEach((jugador) => {
                if (!totalPuntos[jugador]) {
                    totalPuntos[jugador] = 0;
                }
                totalPuntos[jugador] += preguntaResultado[jugador] || 0; // Sumar los puntos
            });
        });

        // Ordenar los resultados de mayor a menor y convertir a array de objetos
        const resultadosOrdenados = Object.entries(totalPuntos)
            .sort(([, puntosA], [, puntosB]) => puntosB - puntosA)
            .map(([jugador, puntos]) => ({ jugador, puntos }));

        return res.status(200).json({ resultadosTotales: resultadosOrdenados });

    } catch (error) {
        console.error("Error al obtener los resultados:", error.message);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});



app.listen(puerto, () => {
    const ahora = new Date();
    const horaActual = ahora.toLocaleTimeString();
    console.log(`Bienvenido otro día más al puerto del Reackt ${puerto}. - - - - - - > ${horaActual}`);
});

/**
 * *****************************************************************************************************************************************************************
 * *****************************************************************************************************************************************************************
 * ****************                                                SOCKETS                                                                          ****************
 * *****************************************************************************************************************************************************************
 *  * **************************************************************************************************************************************************************
 */

const http = require('http');
const express2 = require('express')
const { Server } = require('socket.io');

const app2 = express2()
const puerto2 = 4001
const server2 = http.createServer(app2);

const io = new Server(server2, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.get("/", (req, res) => {
    res.json({ "Hola": "Saludo" });
});

io.on('connection', (socket) => {

    //socket para cuando se une alguien
    socket.on('entrarEnSala', (data) => {
        const { pin, nickUsuario } = data;
        socket.join(pin) //nos unimos a la sala por el pin
        //    console.log(nickUsuario, ' se unió a la sala ', pin)

        //notificamos a todos los de esa sala
        io.to(pin).emit('avisoConexionNuevo', { mensaje: nickUsuario + ' se ha unido a la sala' })
    })

    //socket para cuando se va alguien
    socket.on('salirDeSala', (data) => {
        const { pin, nickUsuario } = data;
        socket.leave(pin); // Sale de la sala
        //  console.log(nickUsuario, ` salió de la sala `, pin);

        io.to(pin).emit('avisoJugadorSeVa', { mensaje: nickUsuario + ' ha salido de la sala' });
    });

    //socket para cuando se va el admin
    socket.on('adminSeVa', (data) => {
        const { pin } = data
        socket.leave(pin) //admin sale de la sala
        //    console.log('admin sale de la sala')

        io.to(pin).emit('avisoAdminSeVa', { mensaje: 'El administrador salió de la partida. Se cancela el juego' })
    })

    //socket para cuando el admin inicia partida
    socket.on('iniciarPartida', (data) => {
        const { pin, nickUsuario } = data;
        //   console.log(` Iniciamos partida `, pin);
        io.to(pin).emit('avisoInicioPartida', {
        });
    });

    //recibo pregunta desde el admin
    socket.on('pasoPreguntaAServidor', (data) => {
        const { pin, pregunta, tiempo, idPreguntas, nPregunta } = data;
        const cuentaAtras = temporizador(tiempo, pin)
        // console.log(` Recibo pregunta `, pregunta.texto);
        //console.log("recibo el id de la pegunta: " + idPreguntas + " y el n de la pregunta " + nPregunta)

        io.to(pin).emit('pasoPreguntaAJugadores', {
            mensaje: pregunta.texto,
            idPreg: idPreguntas,
            nPreg:nPregunta, 
        });
    });

    //recibo pregunta desde el jugador que respondió
    socket.on('respuestaJugador', (data) => {
        const { pin, nickUsuario, idpregunta, nOpcion, puntuacion } = data;
        console.log("El juagador: " + nickUsuario + " ha respondido a la pregunta " + idpregunta + " la opción " + nOpcion + " y la puntuación es " + puntuacion)

    });

    //socket para cuando el admin finaliza partida
    socket.on('finalizarPartida', (data) => {
        const { pin, nickUsuario } = data;
        //    console.log(` Finalizamos partida `, pin);

        io.to(pin).emit('avisoFinPartida', {
            //Redirigimos a puntuaciones globales
        });
    });

    // Socket que envía el pin desde el servidor
    socket.on('solicitudPin', async () => {
        const pinAleatorio = await crearPin();

        //   console.log(`El PIN creado por el servidor es:`, pinAleatorio);

        // aviso del nuevo pin
        socket.emit('nuevoPinServidor', { pinAleatorio });
    });
});

const pinesCreados = []
const numerosMaximos = 10000

/*
* Función para crear un pin aleatorio
*/
const crearPin = async () => {
    let pinAleatorio = 0

    if (pinesCreados.length < numerosMaximos) {
        do {
            pinAleatorio = Math.floor(Math.random() * numerosMaximos);
        } while (pinesCreados.includes(pinAleatorio))
        pinesCreados.push(pinAleatorio)
    } else {
        alert("No se pueden crear más salas")
    }

    //   console.log(pinAleatorio)
    return pinAleatorio
}

const temporizador = async (tiempoPartida, pin) => {

    let tiempo = tiempoPartida
    const cuentaAtras = setInterval(() => {
        if (tiempo < 0) {
            clearInterval(cuentaAtras)
            console.log("Finalizó el tiempo")
            io.to(pin).emit('actualizarTemporizador', {
                mensaje: "Finalizó el tiempo",
            });
            io.to(pin).emit('mostrarBotonSiguiente');
        } else {
            io.to(pin).emit('actualizarTemporizador', {
                mensaje: tiempo,
                tiempo_restante: tiempo,
            });
            console.log("Tiempo restante: " + tiempo + " segundos")
            tiempo--
        }
    }, 1000);
}


//************************************* */
server2.listen(puerto2, () => {
    const ahora = new Date();
    const horaActual = ahora.toLocaleTimeString();
    console.log(`Bienvenido otro día más al puerto del Socket ${puerto2}. - - - - - - > ${horaActual}`);
})