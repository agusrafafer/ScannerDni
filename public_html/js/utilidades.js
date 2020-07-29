function stringToDate(fechaString, formato) {
    if (fechaString !== null && typeof (fechaString) !== "undefined") {
        var fechaDate;
        var vecFecha = fechaString.split('/');
        switch (formato) {
            case "dd/mm/yyyy":
                fechaDate = new Date(vecFecha[2], vecFecha[1] - 1, vecFecha[0]);
                break;
            case "mm/dd/yyyy":
                fechaDate = new Date(vecFecha[2], vecFecha[0] - 1, vecFecha[1]);
                break;
            case "yyyy/mm/dd":
                fechaDate = new Date(vecFecha[0], vecFecha[1] - 1, vecFecha[2]);
                break;
            case "yyyy/dd/mm":
                fechaDate = new Date(vecFecha[0], vecFecha[2] - 1, vecFecha[1]);
                break;
            default:
                fechaDate = new Date();
        }
        return fechaDate;
    } else {
        fechaString = null;
    }
    return fechaString;
}

function dateToString(fechaDate, formato) {
    if (fechaDate instanceof Date) {
        var fechaString = "";
        var mes = (fechaDate.getMonth() + 1) + "";
        if (mes.length === 1) {
            mes = "0" + mes;
        }
        var dia = fechaDate.getDate() + "";
        if (dia.length === 1) {
            dia = "0" + dia;
        }


        switch (formato) {
            case "dd/mm/yyyy":
                fechaString = dia + "/" + mes + "/" + fechaDate.getFullYear();
                break;
            case "mm/dd/yyyy":
                fechaString = mes + "/" + dia + "/" + fechaDate.getFullYear();
                break;
            case "yyyy/mm/dd":
                fechaString = fechaDate.getFullYear() + "/" + mes + "/" + dia;
                break;
            case "yyyy/dd/mm":
                fechaString = fechaDate.getFullYear() + "/" + dia + "/" + mes;
                break;
            default:
                fechaString = dia + "/" + mes + "/" + fechaDate.getFullYear();
        }
        return fechaString;
    } else if (typeof (fechaDate) === "undefined") {
        fechaDate = null;
    }
    return fechaDate;
}

function validarFecha(valor) {
    return moment(valor, 'DD/MM/YYYY', true).isValid();
}

function validarHora(valor) {
    return moment(valor, 'HH:mm', true).isValid();
}

function checkRefresh() {
    if (document.refreshForm.visited.value === "") {
        // Una nueva pagina sin haber sido refrescada
        document.refreshForm.visited.value = "1";
    }
    else {
        //Sí se refersca la pagina
        window.location.href = "index.html";
        
    }
}

function checkNumDeci(e, campo, precision) {
    const key = e.keyCode ? e.keyCode : e.which;
    // backspace
    if (key === 8 || key === 9) return true;
    // 0-9
    if ((key > 47 && key < 58) || (key > 95 && key < 106)) {
        if (campo.value === "") return true;
        if (isNaN(e.key)) return false;
        //regexp = /.[0-9]{4}$/
        var regexp = new RegExp('.[0-9]{' + precision + '}$');
        return !(regexp.test(campo.value));
    }
    // .
    if (key === 190 || key === 110) {
        if (campo.value === "") return false;
        regexp = /^-?\d+(?:.\d+)?$/;
        ////^[0-9]+$/
        if (regexp.test(campo.value)) {
            return true;
        } else {
            return false;
        }
    }
    return false;

}

function cambiarPtoPorComa(campo) {
    let valor = campo.value;
    valor = valor.replace(".", ",");
    const cantStringSepComas = valor.split(",");
    if (cantStringSepComas.length > 2) {
        valor = valor.substring(0, valor.length - 1);
    }
    campo.value = valor;
}

function cambiarComaPorPtoValor(valor) {
    valor = valor.replace(",", ".");
    const cantStringSepComas = valor.split(".");
    if (cantStringSepComas.length > 2) {
        valor = valor.substring(0, valor.length - 1);
    }
    return valor;
}

function cambiarPtoPorComaValor(valor) {
    valor = valor.replace(".", ",");
    const cantStringSepComas = valor.split(",");
    if (cantStringSepComas.length > 2) {
        valor = valor.substring(0, valor.length - 1);
    }
    return valor;
}

function checkSoloNum(e, campo, largo) {
    const key = e.keyCode ? e.keyCode : e.which;
    // backspace
    if (key === 8 || key === 9) return true;
    // 0-9
    if ((key > 47 && key < 58) || (key > 95 && key < 106)) {
        if (campo.value === "") return true;
        if (campo.value.length === largo) return false;
        if (isNaN(e.key)) return false;
        //regexp = /.[0-9]{4}$/
        var regexp = new RegExp('([0-9])\d{1,8}$');
        return !(regexp.test(campo.value));
    }
    return false;

}

function B64D(en) {
    const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    do {
        enc1 = keyStr.indexOf(en.charAt(i++));
        enc2 = keyStr.indexOf(en.charAt(i++));
        enc3 = keyStr.indexOf(en.charAt(i++));
        enc4 = keyStr.indexOf(en.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3);
        }
    } while (i < en.length);

    return output;
}

function checkEmail(e, campo) {
    campo = e.target;
    //valido = document.getElementById('emailOK');
    const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (emailRegex.test(campo.value)) {
        // valido.innerText = "Válido";
        true;
    } else {
        //valido.innerText = "Incorrecto";
        false;
    }
}

/**
 * Método que devuelve el primer o último día del mes anterior
 * @param {any} nroDia 1=primer día del mes anterior y 0=último día del mes anterior
 * @returns {devuelve el primer o último día del mes anterior} 
 */
function fechaMesAnterior(nroDia) {
    const now = new Date();
    let prevMonthDate;
    if (nroDia === 0) {
        prevMonthDate = new Date(now.getFullYear(), now.getMonth(), nroDia);
    } else {
        prevMonthDate = new Date(now.getFullYear() - (now.getMonth() > 0 ? 0 : 1), (now.getMonth() - 1 + 12) % 12, nroDia);
    }

    return dateToString(prevMonthDate, 'dd/mm/yyyy');
}