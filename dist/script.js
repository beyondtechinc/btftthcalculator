/* DISEÑADO POR BEYONDTECH */
// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar los componentes de Materialize
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);

    var collapsibleElems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(collapsibleElems);
});

function calculateLoss() {
    // Paso 1: Distancia y Atenuación
    const cableDistance = parseFloat(document.getElementById('cableDistance').value);
    const distanceUnit = document.getElementById('distanceUnit').value;
    const attenuationPerUnit = parseFloat(document.getElementById('attenuationPerUnit').value);

    if (isNaN(cableDistance) || isNaN(attenuationPerUnit)) {
        M.toast({html: 'Por favor, completa todos los campos del Paso 1.', classes: 'red'});
        return;
    }

    let distanceInKm = cableDistance;
    if (distanceUnit === 'm') {
        distanceInKm = cableDistance / 1000;
    }

    const totalFiberLoss = distanceInKm * attenuationPerUnit;

    // Paso 2: Pérdidas por Conectores
    const connectorLoss = parseFloat(document.getElementById('connectorLoss').value);
    const numConnectorPairs = parseInt(document.getElementById('numConnectorPairs').value) || 0;
    const totalConnectorLoss = connectorLoss * numConnectorPairs;

    // Paso 3: Pérdidas por Empalmes
    const spliceLoss = parseFloat(document.getElementById('spliceLoss').value);
    const numSplices = parseInt(document.getElementById('numSplices').value) || 0;
    const totalSpliceLoss = spliceLoss * numSplices;

    // Paso 4: Pérdidas de Otros Componentes
    const switchLoss = parseFloat(document.getElementById('switchLoss').value) || 0;
    const splitterLoss = parseFloat(document.getElementById('splitterLoss').value) || 0;
    const otherLoss = parseFloat(document.getElementById('otherLoss').value) || 0;
    const totalOtherLoss = switchLoss + splitterLoss + otherLoss;

    // Paso 5: Especificaciones del Equipo Electrónico
    const transmitterPower = parseFloat(document.getElementById('transmitterPower').value);
    const receiverSensitivity = parseFloat(document.getElementById('receiverSensitivity').value);

    if (isNaN(transmitterPower) || isNaN(receiverSensitivity)) {
        M.toast({html: 'Por favor, completa todos los campos del Paso 5.', classes: 'red'});
        return;
    }

    const systemGain = transmitterPower - receiverSensitivity;

    // Paso 6: Penalizaciones de Potencia
    const powerPenalties = parseFloat(document.getElementById('powerPenalties').value) || 0;
    const repairMargin = parseFloat(document.getElementById('repairMargin').value) || 0;
    const totalPenalties = powerPenalties + repairMargin;

    // Paso 7: Cálculo del Presupuesto de Pérdidas y Margen del Sistema
    const totalLinkLossBudget = systemGain - totalPenalties;
    const totalCableAttenuation = totalFiberLoss + totalConnectorLoss + totalSpliceLoss + totalOtherLoss;
    const systemPerformanceMargin = totalLinkLossBudget - totalCableAttenuation;

    // Mostrar Resultados
    let resultMessage = '';
    let adviceMessage = '';

    if (systemPerformanceMargin >= 0) {
        resultMessage = `El margen de rendimiento del sistema es de ${systemPerformanceMargin.toFixed(2)} dB.`;
        adviceMessage = 'El sistema cumple con las pautas recomendadas.';
    } else {
        resultMessage = `El margen de rendimiento del sistema es de ${systemPerformanceMargin.toFixed(2)} dB.`;
        adviceMessage = 'El sistema NO cumple con las pautas recomendadas. Por favor, considera ajustar los parámetros.';
    }

    document.getElementById('result').textContent = resultMessage;
    document.getElementById('advice').textContent = adviceMessage;
}