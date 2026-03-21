/* DiluteIt · translations (ES / EN) */
const I18N = {
  es: {
    subtitle: "Host Cell Lab Suite · Dilution Solver",
    btnDocs: "Repo",
    btnClear: "Limpiar",
    btnInstall: "Instalar",
    btnClose: "Cerrar",
    ios_install_hint: "Para instalar: toca <strong>Compartir</strong> → <strong>Añadir al inicio</strong>",

    tile_title: "Solver universal",
    tile_sub: "elige incógnita · resuelve C1V1 = C2V2",

    solverTitle: "Solver universal de dilución",
    solverHint: "Selecciona la incógnita y resuelve con C1V1 = C2V2",
    instruction: "Selecciona la variable a calcular",

    lblC1: "C1 (Stock)",
    lblV1: "V1 (Inóculo / Alícuota)",
    lblC2: "C2 (Final)",
    lblV2: "V2 (Volumen final)",

    noteCompat: "C1 y C2 deben estar en bases compatibles (molar con molar, % con %, etc.)",
    noteC1: "Base molar / mass/vol / % (no convierte química).",
    noteV: "V1 y V2 se convierten internamente a litros.",
    noteC2: "La ecuación conserva soluto; no cambia la base.",
    noteV2: "Tip: usa unidades \"cómodas\" (mL, μL) y ajusta después.",

    btnCalc: "Resolver incógnita",
    resultLabelDefault: "Resultado",
    resultSolved: "Variable resuelta",
    resultValue: "Valor",
    details: "Detalles y supuestos",

    resultMetaPrefix: "Variable resuelta",
    statusOk: "Cálculo completado.",
    statusError: "Verifica entradas y unidades.",

    targetPlaceholder: "RESULTADO",
    normalPlaceholder: "0.0",

    errGeneric: "ERR",
    errMissing: "Ingresa valores válidos (> 0) en las tres variables conocidas.",
    errZeroDivision: "No se puede dividir entre cero.",
    errKindMismatch: "C1 y C2 deben usar la misma base de concentración (molar / mg/mL / %).",

    resultLabel_v1: "V1 (Inóculo / Alícuota)",
    resultLabel_c1: "C1 (Stock)",
    resultLabel_c2: "C2 (Final)",
    resultLabel_v2: "V2 (Volumen final)",

    info_title: "Fundamentos y lógica de unidades",
    foundationTitle: "Fundamento de la técnica",
    foundationText1: "DiluteIt aplica la ecuación de dilución basada en conservación de la cantidad de soluto entre una solución stock y una solución final.",
    foundationText2: "La app puede resolver cualquiera de las cuatro variables (C1, V1, C2 o V2) si ingresas tres valores válidos y unidades compatibles.",

    limitsTitle: "Supuestos y uso correcto",
    limitsText1: "La ecuación funciona cuando C1 y C2 representan la misma base de concentración.",
    limit1: "✅ Válido: M ↔ mM ↔ μM (misma base molar)",
    limit2: "✅ Válido: mg/mL ↔ mg/mL",
    limit3: "✅ Válido: % ↔ % (misma convención)",
    limit4: "❌ No válido: M ↔ mg/mL o % sin MW/densidad",
    limitsText2: "Si necesitas convertir entre bases (molaridad a mg/mL, etc.), primero debes usar información adicional como peso molecular, densidad o pureza.",

    uiTipsTitle: "Tips prácticos",
    uiTipsText: "Si el resultado es impráctico para pipetear (por ejemplo, < 1 μL), considera una dilución intermedia o un esquema en serie.",

    author: "Autor: Emiliano Balderas Ramírez",
    authorBio: "Ingeniero en Biotecnología | Estudiante de Doctorado en Bioquímica, IBt-UNAM"
  },

  en: {
    subtitle: "Host Cell Lab Suite · Dilution Solver",
    btnDocs: "Repo",
    btnClear: "Clear",
    btnInstall: "Install",
    btnClose: "Close",
    ios_install_hint: "To install: tap <strong>Share</strong> → <strong>Add to Home Screen</strong>",

    tile_title: "Universal solver",
    tile_sub: "choose unknown · solve C1V1 = C2V2",

    solverTitle: "Universal dilution solver",
    solverHint: "Select the unknown and solve with C1V1 = C2V2",
    instruction: "Select the variable to calculate",

    lblC1: "C1 (Stock)",
    lblV1: "V1 (Inoculum / Aliquot)",
    lblC2: "C2 (Final)",
    lblV2: "V2 (Final volume)",

    noteCompat: "C1 and C2 must use compatible concentration bases (molar with molar, % with %, etc.)",
    noteC1: "Molar / mass/vol / % (no chemistry conversion).",
    noteV: "V1 and V2 are internally converted to liters.",
    noteC2: "The equation conserves solute; it does not change basis.",
    noteV2: "Tip: use convenient units (mL, μL) and adjust afterwards.",

    btnCalc: "Solve unknown",
    resultLabelDefault: "Result",
    resultSolved: "Solved variable",
    resultValue: "Value",
    details: "Details & assumptions",

    resultMetaPrefix: "Solved variable",
    statusOk: "Calculation completed.",
    statusError: "Check inputs and units.",

    targetPlaceholder: "RESULT",
    normalPlaceholder: "0.0",

    errGeneric: "ERR",
    errMissing: "Enter valid values (> 0) for the three known variables.",
    errZeroDivision: "Division by zero is not allowed.",
    errKindMismatch: "C1 and C2 must use the same concentration basis (molar / mg/mL / %).",

    resultLabel_v1: "V1 (Inoculum / Aliquot)",
    resultLabel_c1: "C1 (Stock)",
    resultLabel_c2: "C2 (Final)",
    resultLabel_v2: "V2 (Final volume)",

    info_title: "Scientific fundamentals & unit logic",
    foundationTitle: "Method foundation",
    foundationText1: "DiluteIt applies the dilution equation based on conservation of solute amount between a stock solution and a final solution.",
    foundationText2: "The app can solve any of the four variables (C1, V1, C2, or V2) as long as three valid values and compatible units are provided.",

    limitsTitle: "Assumptions and correct use",
    limitsText1: "The equation is valid when C1 and C2 represent the same concentration basis.",
    limit1: "✅ Valid: M ↔ mM ↔ μM (same molar basis)",
    limit2: "✅ Valid: mg/mL ↔ mg/mL",
    limit3: "✅ Valid: % ↔ % (same convention)",
    limit4: "❌ Not valid: M ↔ mg/mL or % without MW/density",
    limitsText2: "If you need cross-basis conversion (molarity to mg/mL, etc.), additional information is required, such as molecular weight, density, or purity.",

    uiTipsTitle: "Practical tips",
    uiTipsText: "If the result is impractical to pipette (e.g., < 1 μL), consider an intermediate dilution or a serial scheme.",

    author: "Author: Emiliano Balderas Ramírez",
    authorBio: "Biotechnology Engineer | PhD Student in Biochemistry, IBt-UNAM"
  }
};
