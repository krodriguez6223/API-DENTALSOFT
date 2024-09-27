--ACTULIZACION DE LA BD DE CONTROLCNB





ALTER TABLE entidadbancaria
ADD COLUMN acronimo VARCHAR(10),
ADD COLUMN estado BOOLEAN;
ADD COLUMN comision FLOAT,
ADD COLUMN sobregiro FLOAT;

CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    cedula VARCHAR(20) UNIQUE,
    nombres VARCHAR(100),
    telefono VARCHAR(20)
);

CREATE TABLE afectacaja (
    id_afectacaja SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    valor FLOAT,
	estado BOOLEAN
	
);
CREATE TABLE afectacuenta (
    id_afectacuenta SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    valor FLOAT,
	estado BOOLEAN
);
CREATE TABLE tipotransaccion (
    id_tipotransaccion SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    id_afectacaja INT REFERENCES afectacaja(id_afectacaja),
    id_afectacuenta INT REFERENCES afectacuenta(id_afectacuenta)
);

ALTER TABLE entidadbancaria
RENAME COLUMN id TO id_entidadbancaria;


CREATE TABLE operaciones (
    id_operacion SERIAL PRIMARY KEY,
    id_entidadbancaria INT REFERENCES entidadbancaria(id_entidadbancaria),
    id_tipotransaccion INT REFERENCES tipotransaccion(id_tipotransaccion),
    id_cliente INT REFERENCES cliente(id_cliente),
    valor FLOAT,
    referencia VARCHAR(100),
    comentario VARCHAR(255)
);

--hasta aqui 21-02-2024

--PROCEDIMIETOS ALMACENADOS

Tabla "cliente" con los campos "id_cliente", "cedula", "nombres" y "telefono".
Tabla "operaciones" con los campos "id_operacion", "id_entidadbancaria", "id_tipotransaccion", "id_cliente", "valor", "referencia" y "comentario".
Aquí tienes un ejemplo de cómo podríamos escribir un procedimiento almacenado en PostgreSQL para recuperar las operaciones bancarias de un cliente específico:


CREATE OR REPLACE FUNCTION obtener_operaciones_cliente(cliente_id INT)
RETURNS TABLE (
    id_operacion INT,
    id_entidadbancaria INT,
    id_tipotransaccion INT,
    valor FLOAT,
    referencia VARCHAR(100),
    comentario VARCHAR(255)
) AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        op.id_operacion,
        op.id_entidadbancaria,
        op.id_tipotransaccion,
        op.valor,
        op.referencia,
        op.comentario
    FROM 
        operaciones op
    WHERE 
        op.id_cliente = cliente_id;
END;
$$ LANGUAGE plpgsql;

----------------------------------
SELECT * FROM obtener_operaciones_cliente(1); -- Reemplaza 1 con el ID del cliente que deseas consultar

Procedimiento para obtener información de un cliente por su cédula:

CREATE PROCEDURE ObtenerClientePorCedula (
    IN p_cedula VARCHAR(20)
)
BEGIN
    SELECT * FROM cliente WHERE cedula = p_cedula;
END;
Procedimiento para realizar una operación bancaria:
CREATE PROCEDURE RealizarOperacionBancaria (
    IN p_id_entidadbancaria INT,
    IN p_id_tipotransaccion INT,
    IN p_id_cliente INT,
    IN p_valor FLOAT,
    IN p_referencia VARCHAR(100),
    IN p_comentario VARCHAR(255)
)
BEGIN
    INSERT INTO operaciones (id_entidadbancaria, id_tipotransaccion, id_cliente, valor, referencia, comentario)
    VALUES (p_id_entidadbancaria, p_id_tipotransaccion, p_id_cliente, p_valor, p_referencia, p_comentario);
END;

------------25/02/2024
alter table operaciones add numtransaccion varchar(20) unique

ALTER TABLE entidadbancaria DROP COLUMN comision;

CREATE TABLE comision (
    id SERIAL PRIMARY KEY,
    valorcomision NUMERIC(10, 2),
    desde NUMERIC(10, 2),
    hasta NUMERIC(10, 2),
    entidadbancaria_id INT,
    tipotransaccion_id INT,
    estado BOOLEAN,
    FOREIGN KEY (entidadbancaria_id) REFERENCES entidadbancaria(id_entidadbancaria),
    FOREIGN KEY (tipotransaccion_id) REFERENCES tipotransaccion(id_tipotransaccion)
);

ALTER TABLE operaciones
ALTER COLUMN valor TYPE NUMERIC(10, 2);

ALTER TABLE comision
ALTER COLUMN valorcomision TYPE JSON USING 
  ('{"valorcomision": ' || valorcomision || ', "desde": "' || desde || '", "hasta": "' || hasta || '"}')::JSON;

  --inert a la tabla comision
  INSERT INTO comision (valorcomision, tipotransaccion_id, entidadbancaria_id, estado)
    VALUES (
    '{"valorcomision": 10.00, "desde": 100, "hasta": 200}', 2,  3,  true 
        );

--renombrar la clave primaria de la tabla comision
ALTER TABLE comision
RENAME COLUMN id TO id_comision;

ALTER TABLE comision
RENAME CONSTRAINT comision_pkey TO comision_id_comision_pk;

--relacioonar la tabla entidadbancaria con comision
ALTER TABLE entidadbancaria
ADD COLUMN comision_id INT;

ALTER TABLE entidadbancaria
ADD CONSTRAINT fk_comision_id
    FOREIGN KEY (comision_id)
    REFERENCES comision(id_comision);

--aañadir fecha de registro y actulizacion a las tablas necesarias(cliente, entidadbancaria, operaciones, persona, tipotransaccion)
ALTER TABLE entidadbancaria
ADD COLUMN fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

---creamos la tabla caja donde despues vamos a almcear el id del usuario
CREATE TABLE caja (
    id_caja SERIAL PRIMARY KEY,
    nombrecaja VARCHAR(100)
   
);
-- creamos la tabla saldos donde vamos a obtener los saldos tanto de la tabla caja como de la cuenta
CREATE TABLE saldos (
    id_saldo SERIAL PRIMARY KEY,
    saldocuenta NUMERIC(10,2),
    saldocaja NUMERIC(10,2),
    entidadbancaria_id INT,
    caja_id INT,
    FOREIGN KEY (entidadbancaria_id) REFERENCES entidadbancaria(id_entidadbancaria),
    FOREIGN KEY (caja_id) REFERENCES caja(id_caja)
);


--funcion coregida y renombrada
CREATE OR REPLACE FUNCTION agregaSaldo()
RETURNS TRIGGER AS
$$
DECLARE
    v_id_tipotransaccion INTEGER;
    v_valor NUMERIC(10,2);
    v_afectacaja_id INTEGER;
    v_afectacuenta_id INTEGER;
BEGIN
    -- Obtener el id_tipotransaccion y el valor de la inserción en la tabla operaciones
    v_id_tipotransaccion := NEW.id_tipotransaccion;
    v_valor := NEW.valor;

    -- Obtener los valores de afectacaja_id y afectacuenta_id de la tabla tipotransaccion
    SELECT afectacaja_id, afectacuenta_id INTO v_afectacaja_id, v_afectacuenta_id
    FROM tipotransaccion
    WHERE id_tipotransaccion = v_id_tipotransaccion;

    -- Validar si se pudo obtener el id_tipotransaccion y el valor
    IF v_id_tipotransaccion IS NULL OR v_valor IS NULL THEN
        RAISE NOTICE 'No se pudo obtener el id_tipotransaccion y el valor de la inserción en la tabla operaciones.';
        RETURN NULL;
    END IF;

    -- Realizar la inserción en la tabla saldos dependiendo de las condiciones
    CASE WHEN v_afectacaja_id = 1 AND v_afectacuenta_id = 2 THEN
        RAISE NOTICE 'El id_tipotransaccion % cumple con la condición: SUMA CAJA RESTA CUENTA.', v_id_tipotransaccion;
        INSERT INTO saldos (saldocaja, saldocuenta, entidadbancaria_id)
        VALUES (v_valor, -v_valor, NEW.id_entidadbancaria);

    WHEN v_afectacaja_id = 2 AND v_afectacuenta_id = 1 THEN
        RAISE NOTICE 'El id_tipotransaccion % cumple con la condición: RESTA CAJA SUMA CUENTA.', v_id_tipotransaccion;
        INSERT INTO saldos (saldocaja, saldocuenta, entidadbancaria_id)
        VALUES (-v_valor, v_valor, NEW.id_entidadbancaria);

    WHEN v_afectacaja_id = 1 AND v_afectacuenta_id = 3 THEN
        RAISE NOTICE 'El id_tipotransaccion % cumple con la condición: SUMA CAJA - NO AFECTA A CUENTA.', v_id_tipotransaccion;
        INSERT INTO saldos (saldocaja, saldocuenta, entidadbancaria_id)
        VALUES (v_valor, 0, NEW.id_entidadbancaria);

    WHEN v_afectacaja_id = 3 AND v_afectacuenta_id = 1 THEN
        RAISE NOTICE 'El id_tipotransaccion % cumple con la condición: NO AFECTA - SUMA A CUENTA.', v_id_tipotransaccion;
        INSERT INTO saldos (saldocaja, saldocuenta, entidadbancaria_id)
        VALUES (0, v_valor, NEW.id_entidadbancaria);

    WHEN v_afectacaja_id = 2 AND v_afectacuenta_id = 3 THEN
        RAISE NOTICE 'El id_tipotransaccion % cumple con la condición: RESTA CAJA  - NO AFECTA.', v_id_tipotransaccion;
        INSERT INTO saldos (saldocaja, saldocuenta, entidadbancaria_id)
        VALUES (-v_valor, 0, NEW.id_entidadbancaria);

    WHEN v_afectacaja_id = 3 AND v_afectacuenta_id = 2 THEN
        RAISE NOTICE 'El id_tipotransaccion % cumple con la condición: NO AFECTA CAJA  - RESTA CUENTA.', v_id_tipotransaccion;
        INSERT INTO saldos (saldocaja, saldocuenta, entidadbancaria_id)
        VALUES (0, -v_valor, NEW.id_entidadbancaria);

    ELSE
        RAISE NOTICE 'El id_tipotransaccion % no cumple con ninguna condición válida.', v_id_tipotransaccion;
    END CASE;

    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

 CREATE TRIGGER trigger_agregaSaldo
AFTER INSERT ON operaciones
FOR EACH ROW
EXECUTE FUNCTION agregaSaldo();


INSERT INTO public.operaciones (id_entidadbancaria, id_tipotransaccion, id_cliente, valor, referencia, comentario, numtransaccion)
VALUES (5, 2, 1, 100.00, 'es una prueba de pago', 'comentario', '44545236');
----29-02-2024 
alter table entidadbancaria drop column comision_id

---funcion para traer toda la necesaria de la tabla operaciones ya relacionadas
SELECT 
    e.entidad AS entidad,
    tt.nombre AS tipotransaccion,
    c.cedula AS cedula_cliente,
    c.nombres AS nombres_cliente,
    c.telefono AS telefono_cliente,
    o.valor AS valor_operacion,
    o.comentario AS comentario_operacion,
    o.numtransaccion AS num_transaccion,
    o.fecha_registro AS fecha_registro_operacion,
    o.fecha_actualizacion AS fecha_actualizacion_operacion,
    co.valorcomision AS valor_comision,
    ac.nombre AS afectacion_caja,
    au.nombre AS afectacion_cuenta
FROM 
    operaciones o
JOIN 
    entidadbancaria e ON o.id_entidadbancaria = e.id_entidadbancaria
JOIN 
    cliente c ON o.id_cliente = c.id_cliente
JOIN 
    tipotransaccion tt ON o.id_tipotransaccion = tt.id_tipotransaccion
LEFT JOIN
    comision co ON e.id_entidadbancaria = co.entidadbancaria_id
LEFT JOIN
    afectacaja ac ON tt.afectacaja_id = ac.id_afectacaja
LEFT JOIN
    afectacuenta au ON tt.afectacuenta_id = au.id_afectacuenta
ORDER BY 
    afectacion_caja,
    afectacion_cuenta;
--ejemplo de como llamrarlo en el modelo

async function getOperaciones() {
  const query = 'SELECT * FROM operaciones_view'; // Utiliza la vista en lugar de la tabla
  const { rows } = await pool.query(query);
  return rows;
}

module.exports = {
  getOperaciones
};
--fin de funcnion en el modelo

--- CONSULTA PARA FILTRAR LA INFORMACION DE OPERACIONES POR FECHAS INCLUYENDO LA HORA
SELECT 
    e.entidad AS entidad,
    tt.nombre AS tipotransaccion,
    c.cedula AS cedula_cliente,
    c.nombres AS nombres_cliente,
    c.telefono AS telefono_cliente,
    o.valor AS valor_operacion,
    o.comentario AS comentario_operacion,
    o.numtransaccion AS num_transaccion,
    o.fecha_registro AS fecha_registro_operacion,
    o.fecha_actualizacion AS fecha_actualizacion_operacion,
    co.valorcomision AS valor_comision,
    ac.nombre AS afectacion_caja,
    au.nombre AS afectacion_cuenta
FROM 
    operaciones o
JOIN 
    entidadbancaria e ON o.id_entidadbancaria = e.id_entidadbancaria
JOIN 
    cliente c ON o.id_cliente = c.id_cliente
JOIN 
    tipotransaccion tt ON o.id_tipotransaccion = tt.id_tipotransaccion
LEFT JOIN
    comision co ON e.id_entidadbancaria = co.entidadbancaria_id
LEFT JOIN
    afectacaja ac ON tt.afectacaja_id = ac.id_afectacaja
LEFT JOIN
    afectacuenta au ON tt.afectacuenta_id = au.id_afectacuenta
WHERE
    o.fecha_registro >= '2024-03-03 00:00:00' -- Fecha desde con hora inicial
    AND o.fecha_registro <= '2024-03-03 23:59:59' -- Fecha hasta con hora final
ORDER BY 
    afectacion_caja,
    afectacion_cuenta;

--- CONSULTA PARA FILTRAR LA INFORMACION DE OPERACIONES POR FECHAS Y NO LA HORA
SELECT 
    e.entidad AS entidad,
    tt.nombre AS tipotransaccion,
    c.cedula AS cedula_cliente,
    c.nombres AS nombres_cliente,
    c.telefono AS telefono_cliente,
    o.valor AS valor_operacion,
    o.comentario AS comentario_operacion,
    o.numtransaccion AS num_transaccion,
    o.fecha_registro AS fecha_registro_operacion,
    o.fecha_actualizacion AS fecha_actualizacion_operacion,
    co.valorcomision AS valor_comision,
    ac.nombre AS afectacion_caja,
    au.nombre AS afectacion_cuenta
FROM 
    operaciones o
JOIN 
    entidadbancaria e ON o.id_entidadbancaria = e.id_entidadbancaria
JOIN 
    cliente c ON o.id_cliente = c.id_cliente
JOIN 
    tipotransaccion tt ON o.id_tipotransaccion = tt.id_tipotransaccion
LEFT JOIN
    comision co ON e.id_entidadbancaria = co.entidadbancaria_id
LEFT JOIN
    afectacaja ac ON tt.afectacaja_id = ac.id_afectacaja
LEFT JOIN
    afectacuenta au ON tt.afectacuenta_id = au.id_afectacuenta
WHERE
    DATE(o.fecha_registro) >= '2024-03-03' -- Fecha desde
    AND DATE(o.fecha_registro) <= '2024-03-03' -- Fecha hasta
ORDER BY 
    afectacion_caja,
    afectacion_cuenta;

---consulta donde me traiga el valor total de todo lo recaudado sin validacion de algun campo
SELECT SUM(valor) AS total_valor_operaciones
FROM operaciones;
---en esta consulta mostrara el valor total de todas la entidades bancarias
SELECT 
    e.entidad AS entidad,
    SUM(o.valor) AS total_valor_operaciones
FROM 
    operaciones o
JOIN 
    entidadbancaria e ON o.id_entidadbancaria = e.id_entidadbancaria
GROUP BY 
    e.entidad;

---consulta del valor total de una entidad en especifico
SELECT 
    e.entidad AS entidad,
    SUM(o.valor) AS total_valor_operaciones
FROM 
    operaciones o
JOIN 
    entidadbancaria e ON o.id_entidadbancaria = e.id_entidadbancaria
WHERE 
    e.id_entidadbancaria = 5
GROUP BY 
    e.entidad;

    /********* 07/03/2024 **********/
    /* eliminar primero la tabla creada*/
    CREATE TABLE caja (
    id_caja SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    estado BOOLEAN,
    fechacreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechamodificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    ALTER TABLE public.usuario
    ADD COLUMN caja_id INTEGER,
    ADD CONSTRAINT usuario_caja_id_fkey FOREIGN KEY (caja_id) REFERENCES public.caja(id_caja);


    ALTER TABLE public.operaciones
    ADD COLUMN id_usuario integer,
    ADD CONSTRAINT operaciones_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


    ALTER TABLE public.operaciones
    ADD COLUMN saldocomision numeric(10,2);


----consulta para traer el saldo total de una entidad bancaria ubicando la entidad bancaria
    SELECT SUM(saldocuenta) AS total_saldocuenta
    FROM public.saldos
    WHERE entidadbancaria_id = 5;


----saldo caja general
   SELECT SUM(saldocaja) AS total_saldocaja
   FROM public.saldos;
---suma total por canda entidad bacanria
    SELECT entidadbancaria_id, SUM(saldocuenta) AS saldo_total_cuenta
    FROM public.saldos
    GROUP BY entidadbancaria_id;

    -----10/03/2024
    ALTER TABLE public.operaciones
    ADD COLUMN estado boolean;  

    ALTER TABLE public.tipotransaccion
    ADD COLUMN estado boolean;
--12/03/2024------
    ALTER TABLE public.comision
    DROP COLUMN desde, 
    DROP COLUMN hasta;
    ----16-03-2024----

    CREATE TABLE encabezadoarqueo (
            id_encabezadoarqueo SERIAL PRIMARY KEY,
            caja_id INT,
            usuario_id INT,
            comentario TEXT,
            estado BOOLEAN,
            entidadbancaria_id INT,
            fechacreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            fechamodificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            FOREIGN KEY (entidadbancaria_id) REFERENCES entidadbancaria(id_entidadbancaria)
    );
     CREATE TABLE detallearqueo (
            id_detalle_arqueo SERIAL PRIMARY KEY,
            tipodinero VARCHAR(50),
            valor numeric(10,2),
            cantidad integer,
            usuario_id INT,
            estado BOOLEAN,
            encabezadoarqueo_id int,            
            entidadbancaria_id INT,
            fechacreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            fechamodificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuario(id_usuario),
            FOREIGN KEY (encabezadoarqueo_id) REFERENCES encabezadoarqueo(id_encabezadoarqueo)
            FOREIGN KEY (entidadbancaria_id) REFERENCES entidadbancaria(id_entidadbancaria)
    );
    ------2024-03-21-----
    ALTER TABLE public.saldos
    ADD COLUMN operacion_id integer,
    ADD CONSTRAINT operacion_id_fkey FOREIGN KEY (operacion_id) REFERENCES public.operaciones(operacion_id);


ALTER TABLE public.operaciones
    ADD COLUMN id_usuario integer,
    ADD CONSTRAINT operaciones_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


-- 2024-03-21 TRIGE QUE ACTUALIZA SALDO--
--DROP TRIGGER IF EXISTS trigger_agregaSaldo ON operaciones;

CREATE OR REPLACE FUNCTION agregaSaldo()
RETURNS TRIGGER AS
$$
DECLARE
    v_id_tipotransaccion INTEGER;
    v_valor NUMERIC(10,2);
    v_afectacaja_id INTEGER;
    v_afectacuenta_id INTEGER;
    v_entidadbancaria_id INTEGER;
BEGIN
    -- Obtener el id_tipotransaccion, valor y entidadbancaria_id de la inserción en la tabla operaciones
    v_id_tipotransaccion := NEW.id_tipotransaccion;
    v_valor := NEW.valor;
    v_entidadbancaria_id := NEW.id_entidadbancaria;

    -- Obtener los valores de afectacaja_id y afectacuenta_id de la tabla tipotransaccion
    SELECT afectacaja_id, afectacuenta_id INTO v_afectacaja_id, v_afectacuenta_id
    FROM tipotransaccion
    WHERE id_tipotransaccion = v_id_tipotransaccion;

    -- Validar si se pudo obtener el id_tipotransaccion, valor y entidadbancaria_id
    IF v_id_tipotransaccion IS NULL OR v_valor IS NULL OR v_entidadbancaria_id IS NULL THEN
        RAISE NOTICE 'No se pudo obtener el id_tipotransaccion, el valor o la entidadbancaria_id de la inserción en la tabla operaciones.';
        RETURN NULL;
    END IF;

    -- Verificar si ya existe un registro en la tabla saldos para la entidad bancaria
    PERFORM 1 FROM saldos WHERE entidadbancaria_id = v_entidadbancaria_id LIMIT 1;

    -- Realizar la actualización o inserción en la tabla saldos dependiendo de si ya existe un registro para la entidad bancaria
    IF FOUND THEN
        -- Actualizar los valores de saldocuenta y saldocaja para la entidad bancaria existente
        UPDATE saldos
        SET saldocuenta = saldocuenta + CASE WHEN v_afectacuenta_id = 1 THEN v_valor ELSE -v_valor END,
            saldocaja = saldocaja + CASE WHEN v_afectacaja_id = 1 THEN v_valor ELSE -v_valor END
        WHERE entidadbancaria_id = v_entidadbancaria_id;
    ELSE
        -- Insertar un nuevo registro en la tabla saldos para la entidad bancaria
        INSERT INTO saldos (saldocuenta, saldocaja, entidadbancaria_id)
        VALUES (CASE WHEN v_afectacuenta_id = 1 THEN v_valor ELSE -v_valor END,
                CASE WHEN v_afectacaja_id = 1 THEN v_valor ELSE -v_valor END,
                v_entidadbancaria_id);
    END IF;

    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Reemplazar el trigger existente con el nuevo trigger modificado
DROP TRIGGER IF EXISTS trigger_agregaSaldo ON operaciones;

CREATE TRIGGER trigger_agregaSaldo
AFTER INSERT ON operaciones
FOR EACH ROW
EXECUTE FUNCTION agregaSaldo();


-----actualizacion 23/03/2024

ALTER TABLE entidadbancaria
ALTER COLUMN sobregiro TYPE numeric(10,2);

---------
CREATE TABLE IF NOT EXISTS public.permisos
(
    id_permiso SERIAL PRIMARY KEY,
    id_rol INTEGER,
    id_usuario INTEGER,
    entidad VARCHAR(255),
    accion VARCHAR(50),
    permitido BOOLEAN,
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);
