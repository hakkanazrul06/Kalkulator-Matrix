const matrixSizes = { A: [2, 2], B: [2, 2] };
const matrixData = { A: [], B: [] };

function renderMatrix(m) {
  const [rows, cols] = matrixSizes[m];
  const container = document.getElementById(`matrix${m}-input`);
  container.innerHTML = '';
  matrixData[m] = [];
  for (let i = 0; i < rows; i++) {
    const row = document.createElement('div');
    matrixData[m][i] = [];
    for (let j = 0; j < cols; j++) {
      const input = document.createElement('input');
      input.type = 'number';
      input.value = '0';
      input.className = 'form-control d-inline me-1';
      input.style.width = '60px';
      input.oninput = () => matrixData[m][i][j] = parseFloat(input.value);
      matrixData[m][i][j] = 0;
      row.appendChild(input);
    }
    container.appendChild(row);
  }
}

function setUniversalSize(size) {
  size = parseInt(size);
  matrixSizes.A = [size, size];
  matrixSizes.B = [size, size];
  renderMatrix('A');
  renderMatrix('B');
}

function insertToExpression(text) {
  const input = document.getElementById('expression');
  input.value += text;
}

function getMinorMatrix(inputMatrix) {
  const matrix = inputMatrix.toArray();
  return matrix.map((_, i) =>
    matrix.map((_, j) =>
      math.det(
        math.matrix(
          matrix
            .filter((_, r) => r !== i)
            .map(r => r.filter((_, c) => c !== j))
        )
      )
    )
  );
}

// Matrix Cofactor
function getCofactorMatrix(inputMatrix) {
  const matrix = inputMatrix.toArray();
  const minor = getMinorMatrix(math.matrix(matrix));
  return minor.map((row, i) =>
    row.map((val, j) => ((i + j) % 2 === 0 ? val : -val))
  );
}

function getAdjoinMatrix(inputMatrix) {
  const matrix = inputMatrix.toArray();
  return math.transpose(math.matrix(getCofactorMatrix(math.matrix(matrix)))).toArray();
}

function getOBE(inputMatrix) {
  const copy = inputMatrix.toArray();
  if (copy.length > 1) [copy[0], copy[1]] = [copy[1], copy[0]];
  return copy;
}

function getOKE(inputMatrix) {
  const copy = inputMatrix.toArray();
  if (copy[0].length > 1)
    for (let row of copy) [row[0], row[1]] = [row[1], row[0]];
  return copy;
}

function displayMatrixResult(matrix) {
  const resultDiv = document.getElementById('result');
  if (Array.isArray(matrix) && Array.isArray(matrix[0])) {
    let html = '<table class="table table-bordered table-sm" style="width:auto; margin:auto; border-color:#4dd0e1;">';
    matrix.forEach(row => {
      html += '<tr>';
      row.forEach(val => {
        html += `<td style="min-width:2.5em; text-align:center; background:#22313f; border-color:#4dd0e1; color:#4dd0e1;">${val}</td>`;
      });
      html += '</tr>';
    });
    html += '</table>';
    resultDiv.innerHTML = html;
  } else {
    resultDiv.innerHTML = `<span style="color:#4dd0e1;">${matrix}</span>`;
  }
}

function evaluateExpression() {
  const expr = document.getElementById('expression').value;
  const resultBox = document.getElementById('result');
  try {
    const scope = {
      A: math.matrix(matrixData['A']),
      B: math.matrix(matrixData['B']),
      det: math.det,
      inv: math.inv,
      trans: math.transpose,
      minor: getMinorMatrix,
      kof: getCofactorMatrix,
      kofaktor: getCofactorMatrix,
      adjoin: getAdjoinMatrix,
      OBE: getOBE,
      OKE: getOKE
    };

    let result = math.evaluate(expr, scope);

    if (result && result.isMatrix) {
      result = result.toArray();
    }

    displayMatrixResult(result);
  } catch (e) {
    resultBox.innerHTML = '<span style="color:#4dd0e1;">Ekspresi tidak valid atau belum didukung</span>';
  }
}

setUniversalSize(2);
