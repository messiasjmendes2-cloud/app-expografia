const fs = require('fs');

const fullHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculadora Expográfica 2.0 - Pequeno Mundo</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <style>
        /* Estilos Internos do SVG */
        .parede-fundo { fill: #ececec; }
        .chao { stroke: #666; stroke-width: 4; }
        .eixo { stroke: #ff4757; stroke-width: 1; stroke-dasharray: 10 5; }
        .quadro { fill: #333; stroke: #000; stroke-width: 2; }
        .texto-quadro { font-family: sans-serif; font-size: 12px; fill: #fff; text-anchor: middle; font-weight: bold;}
        .medida-texto { font-family: monospace; font-size: 10px; fill: #d35400; text-anchor: middle; font-weight: bold;}
        .medida-linha { stroke: #d35400; stroke-width: 1; }
    </style>
</head>
<body class="bg-gray-900 text-gray-200 font-sans m-0 p-5 flex flex-col md:flex-row gap-5 h-screen box-border">

    <div class="bg-gray-800 p-5 rounded-lg w-full md:w-[380px] shadow-md overflow-y-auto shrink-0 flex flex-col">
        <h2 class="mt-0 text-xl border-b border-gray-600 pb-2 mb-4 font-semibold">Paredes</h2>
        <div class="flex flex-col gap-2 mb-6">
            <button id="tab-0" onclick="switchTab(0)" class="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-colors text-sm text-left">Parede de Entrada</button>
            <button id="tab-1" onclick="switchTab(1)" class="w-full p-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded transition-colors text-sm text-left">Parede Central</button>
            <button id="tab-2" onclick="switchTab(2)" class="w-full p-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded transition-colors text-sm text-left">Parede de Saída</button>
        </div>

        <h2 class="mt-0 text-xl border-b border-gray-600 pb-2 mb-4 font-semibold">Parâmetros (cm)</h2>
        <div class="mb-3">
            <label class="block mb-1 text-sm text-gray-400">Largura da Parede</label>
            <input type="number" id="paredeL" value="1164" class="w-full p-2 border border-gray-600 bg-gray-900 text-white rounded font-mono box-border">
        </div>
        <div class="mb-3">
            <label class="block mb-1 text-sm text-gray-400">Altura da Parede (Teto)</label>
            <input type="number" id="paredeA" value="400" class="w-full p-2 border border-gray-600 bg-gray-900 text-white rounded font-mono box-border">
        </div>
        <div class="mb-3">
            <label class="block mb-1 text-sm text-gray-400">Altura do Eixo Central (do chão)</label>
            <input type="number" id="eixoH" value="150" class="w-full p-2 border border-gray-600 bg-gray-900 text-white rounded font-mono box-border">
        </div>

        <h2 class="mt-5 text-xl border-b border-gray-600 pb-2 mb-4 font-semibold">Molduras (cm)</h2>
        <div class="mb-3">
            <label class="block mb-1 text-sm text-gray-400">Medidas Horizontal (Largura x Altura)</label>
            <div class="flex gap-2">
                <input type="number" id="wH" value="61" title="Largura" class="w-full p-2 border border-gray-600 bg-gray-900 text-white rounded font-mono box-border">
                <input type="number" id="hH" value="41" title="Altura" class="w-full p-2 border border-gray-600 bg-gray-900 text-white rounded font-mono box-border">
            </div>
        </div>
        <div class="mb-3">
            <label class="block mb-1 text-sm text-gray-400">Medidas Vertical (Largura x Altura)</label>
            <div class="flex gap-2">
                <input type="number" id="wV" value="41" title="Largura" class="w-full p-2 border border-gray-600 bg-gray-900 text-white rounded font-mono box-border">
                <input type="number" id="hV" value="61" title="Altura" class="w-full p-2 border border-gray-600 bg-gray-900 text-white rounded font-mono box-border">
            </div>
        </div>
        <div class="mb-3">
            <label class="block mb-1 text-sm text-gray-400">Adesivo 'A' (Largura x Altura)</label>
            <div class="flex gap-2">
                <input type="number" id="wA" value="100" title="Largura" class="w-full p-2 border border-gray-600 bg-gray-900 text-white rounded font-mono box-border">
                <input type="number" id="hA" value="120" title="Altura" class="w-full p-2 border border-gray-600 bg-gray-900 text-white rounded font-mono box-border">
            </div>
        </div>
        <div class="mb-3">
            <label class="block mb-1 text-sm text-gray-400">Margem nos Cantos</label>
            <input type="number" id="margem" value="23.5" step="0.1" class="w-full p-2 border border-gray-600 bg-gray-900 text-white rounded font-mono box-border">
        </div>

        <h2 class="mt-5 text-xl border-b border-gray-600 pb-2 mb-4 font-semibold">Ordem Curatorial</h2>
        <div class="mb-3 flex items-center">
            <input type="checkbox" id="incluirAdesivo" class="mr-2 h-4 w-4">
            <label for="incluirAdesivo" class="text-sm text-gray-400 cursor-pointer">Incluir Adesivo (A) na Parede</label>
        </div>
        <div class="mb-3">
            <label class="block mb-1 text-sm text-gray-400">Sequência (Use H e V separados por vírgula)</label>
            <input type="text" id="sequencia" value="H, V, H, V, H, V, H, V, H" style="text-transform: uppercase;" class="w-full p-2 border border-gray-600 bg-gray-900 text-white rounded font-mono box-border uppercase">
        </div>

        <button onclick="calcularEDesenhar()" class="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-colors text-base mt-2">Atualizar Planta</button>
        <button id="exportPdfBtn" onclick="exportarPDF()" class="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded transition-colors text-base mt-2">Exportar PDF</button>

        <div id="output" class="mt-4 p-4 bg-gray-900 border-l-4 border-blue-600 rounded font-mono text-sm leading-relaxed text-gray-300 break-words"></div>
    </div>

    <div class="flex-grow bg-gray-800 rounded-lg p-5 flex flex-col shadow-md overflow-hidden">
        <h2 class="mt-0 text-xl border-b border-gray-600 pb-2 mb-4 font-semibold">Planta Baixa Frontal (Proporção Exata)</h2>
        <div class="flex-grow bg-gray-100 rounded overflow-hidden flex justify-center items-center relative w-full h-full">
            <svg id="paredeSvg"></svg>
        </div>
    </div>

    <script>
        // Configuração de estado das 3 paredes
        const defaultWallsConfig = [
            { id: 0, nome: "Parede de Entrada", paredeL: 385, paredeA: 400, eixoH: 150, wH: 61, hH: 41, wV: 41, hV: 61, wA: 100, hA: 120, incluirAdesivo: false, margem: 23.5, sequencia: "H, V, H" },
            { id: 1, nome: "Parede Central", paredeL: 1164, paredeA: 400, eixoH: 150, wH: 61, hH: 41, wV: 41, hV: 61, wA: 100, hA: 120, incluirAdesivo: false, margem: 23.5, sequencia: "H, V, H, V, H, V, H, V, H" },
            { id: 2, nome: "Parede de Saída", paredeL: 392, paredeA: 400, eixoH: 150, wH: 61, hH: 41, wV: 41, hV: 61, wA: 100, hA: 120, incluirAdesivo: false, margem: 23.5, sequencia: "H, V, H" }
        ];

        let wallsConfig = JSON.parse(localStorage.getItem('wallsConfig')) || JSON.parse(JSON.stringify(defaultWallsConfig));
        let currentTab = parseInt(localStorage.getItem('currentTab')) || 0;

        function loadState() {
            wallsConfig = JSON.parse(localStorage.getItem('wallsConfig')) || JSON.parse(JSON.stringify(defaultWallsConfig));
            currentTab = parseInt(localStorage.getItem('currentTab')) || 0;

            // Set initial tab without overwriting it (so we use flag)
            let isInitializing = true;
            switchTab(currentTab, isInitializing);

            // Adiciona listener para salvar o estado a cada mudança de input
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('change', () => {
                    saveCurrentTabState();
                    calcularEDesenhar();
                });
            });
        }

        function saveCurrentTabState() {
            wallsConfig[currentTab] = {
                id: currentTab,
                nome: defaultWallsConfig[currentTab].nome,
                paredeL: parseFloat(document.getElementById('paredeL').value) || 0,
                paredeA: parseFloat(document.getElementById('paredeA').value) || 0,
                eixoH: parseFloat(document.getElementById('eixoH').value) || 0,
                wH: parseFloat(document.getElementById('wH').value) || 0,
                hH: parseFloat(document.getElementById('hH').value) || 0,
                wV: parseFloat(document.getElementById('wV').value) || 0,
                hV: parseFloat(document.getElementById('hV').value) || 0,
                wA: parseFloat(document.getElementById('wA').value) || 0,
                hA: parseFloat(document.getElementById('hA').value) || 0,
                incluirAdesivo: document.getElementById('incluirAdesivo').checked,
                margem: parseFloat(document.getElementById('margem').value) || 0,
                sequencia: document.getElementById('sequencia').value
            };
            localStorage.setItem('wallsConfig', JSON.stringify(wallsConfig));
            localStorage.setItem('currentTab', currentTab);
        }

        function switchTab(tabIndex, isInitializing = false) {
            if (!isInitializing) {
                saveCurrentTabState(); // Salva estado atual antes de trocar
            }
            currentTab = tabIndex;
            const config = wallsConfig[tabIndex];

            // Atualiza inputs com dados da aba
            document.getElementById('paredeL').value = config.paredeL;
            document.getElementById('paredeA').value = config.paredeA;
            document.getElementById('eixoH').value = config.eixoH;
            document.getElementById('wH').value = config.wH;
            document.getElementById('hH').value = config.hH;
            document.getElementById('wV').value = config.wV;
            document.getElementById('hV').value = config.hV;
            document.getElementById('wA').value = config.wA !== undefined ? config.wA : 100;
            document.getElementById('hA').value = config.hA !== undefined ? config.hA : 120;
            document.getElementById('incluirAdesivo').checked = !!config.incluirAdesivo;
            document.getElementById('margem').value = config.margem;
            document.getElementById('sequencia').value = config.sequencia;

            // Atualiza botões
            [0, 1, 2].forEach(i => {
                const btn = document.getElementById('tab-' + i);
                if (i === currentTab) {
                    btn.classList.replace('bg-gray-700', 'bg-blue-600');
                    btn.classList.replace('hover:bg-gray-600', 'hover:bg-blue-700');
                } else {
                    btn.classList.replace('bg-blue-600', 'bg-gray-700');
                    btn.classList.replace('hover:bg-blue-700', 'hover:bg-gray-600');
                }
            });

            localStorage.setItem('currentTab', currentTab);
            calcularEDesenhar();
        }

        function exportarPDF() {
            const element = document.querySelector('.canvas-container');

            const printContainer = document.createElement('div');
            printContainer.style.padding = '20px';
            printContainer.style.background = '#fff';
            printContainer.style.color = '#000';

            const title = document.createElement('h1');
            title.textContent = wallsConfig[currentTab].nome + " - Calculadora Expográfica";
            title.style.marginBottom = '20px';

            const report = document.createElement('div');
            report.innerHTML = document.getElementById('output').innerHTML;
            report.style.marginBottom = '20px';
            report.style.fontFamily = 'monospace';

            const svgClone = document.querySelector('.svg-wrapper').cloneNode(true);
            svgClone.style.width = '100%';

            printContainer.appendChild(title);
            printContainer.appendChild(report);
            printContainer.appendChild(svgClone);

            const opt = {
                margin:       10,
                filename:     'planta_baixa_' + wallsConfig[currentTab].nome.replace(/\s+/g, '_').toLowerCase() + '.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
            };

            html2pdf().set(opt).from(printContainer).save();
        }

        function desenharCotaH(svg, x1, x2, y, texto) {
            svg.innerHTML += \`<line class="medida-linha" x1="\${x1}" y1="\${y}" x2="\${x2}" y2="\${y}" />\`;
            svg.innerHTML += \`<line class="medida-linha" x1="\${x1}" y1="\${y-3}" x2="\${x1}" y2="\${y+3}" />\`;
            svg.innerHTML += \`<line class="medida-linha" x1="\${x2}" y1="\${y-3}" x2="\${x2}" y2="\${y+3}" />\`;
            svg.innerHTML += \`<text class="medida-texto" x="\${(x1+x2)/2}" y="\${y-5}">\${texto}</text>\`;
        }

        function desenharCotaV(svg, x, y1, y2, texto) {
            svg.innerHTML += \`<line class="medida-linha" x1="\${x}" y1="\${y1}" x2="\${x}" y2="\${y2}" />\`;
            svg.innerHTML += \`<line class="medida-linha" x1="\${x-3}" y1="\${y1}" x2="\${x+3}" y1="\${y1}" />\`;
            svg.innerHTML += \`<line class="medida-linha" x1="\${x-3}" y1="\${y2}" x2="\${x+3}" y1="\${y2}" />\`;
            // Texto rotacionado para cota vertical
            svg.innerHTML += \`<text class="medida-texto" x="\${x-5}" y="\${(y1+y2)/2}" transform="rotate(-90, \${x-5}, \${(y1+y2)/2})">\${texto}</text>\`;
        }

        function calcularEDesenhar() {
            // Capturar dados
            const paredeL = parseFloat(document.getElementById('paredeL').value);
            const paredeA = parseFloat(document.getElementById('paredeA').value);
            const eixoH = parseFloat(document.getElementById('eixoH').value);
            const wH = parseFloat(document.getElementById('wH').value);
            const hH = parseFloat(document.getElementById('hH').value);
            const wV = parseFloat(document.getElementById('wV').value);
            const hV = parseFloat(document.getElementById('hV').value);
            const wA = parseFloat(document.getElementById('wA').value);
            const hA = parseFloat(document.getElementById('hA').value);
            const incluirAdesivo = document.getElementById('incluirAdesivo').checked;
            const margem = parseFloat(document.getElementById('margem').value);

            const seqInput = document.getElementById('sequencia').value.toUpperCase();
            // Transforma a string "H, V, H" em um array ['H', 'V', 'H'] limpando espaços
            const seqArray = seqInput.split(',').map(item => item.trim()).filter(item => item === 'H' || item === 'V' || (incluirAdesivo && item === 'A'));

            // Cálculos
            let espacoOcupado = 0;
            seqArray.forEach(tipo => {
                let w = tipo === 'H' ? wH : (tipo === 'V' ? wV : wA);
                espacoOcupado += w;
            });

            const espacoLivre = paredeL - espacoOcupado;
            const espacoParaVaos = espacoLivre - (margem * 2);
            const qtdQuatros = seqArray.length;

            let vao = 0;
            if (qtdQuatros > 1) {
                vao = espacoParaVaos / (qtdQuatros - 1);
            }

            // Validar Erros
            const output = document.getElementById('output');
            if (espacoParaVaos < 0) {
                output.innerHTML = \`<span class="text-red-500 font-bold">ERRO: As obras não cabem na parede! Faltam \${Math.abs(espacoParaVaos).toFixed(1)} cm.</span>\`;
                document.getElementById('paredeSvg').innerHTML = '';
                return;
            }

            // Exibir Resultados de Texto
            output.innerHTML = \`
                Obras Totais: \${qtdQuatros}<br>
                Margens nos Cantos: \${margem.toFixed(1)} cm<br>
                Vão entre quadros: <strong>\${vao.toFixed(2)} cm</strong><br>
                Ocupação das Obras: \${espacoOcupado.toFixed(1)} cm
            \`;

            // Desenhar o SVG
            const svg = document.getElementById('paredeSvg');
            // O ViewBox garante a proporção exata da sua parede real
            svg.setAttribute('viewBox', \`0 0 \${paredeL} \${paredeA}\`);
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

            // Fundo e Chão
            svg.innerHTML = \`<rect width="\${paredeL}" height="\${paredeA}" class="parede-fundo" />\`;
            svg.innerHTML += \`<line x1="0" y1="\${paredeA}" x2="\${paredeL}" y2="\${paredeA}" class="chao" />\`;

            // O Eixo Y no SVG inverte (0 é no teto, ParedeA é no chão)
            const yEixo = paredeA - eixoH;

            // Linha do Eixo de 1.50m
            svg.innerHTML += \`<line x1="0" y1="\${yEixo}" x2="\${paredeL}" y2="\${yEixo}" class="eixo" />\`;
            svg.innerHTML += \`<text x="10" y="\${yEixo - 5}" font-family="sans-serif" font-size="12" fill="#ff4757">Eixo \${eixoH}cm</text>\`;

            let currentX = margem;

            // Desenhar Cota da Margem Esquerda
            desenharCotaH(svg, 0, margem, paredeA - 10, margem.toFixed(1));

            // Loop para criar os quadros conforme a sequência
            seqArray.forEach((tipo, index) => {
                let w = tipo === 'H' ? wH : (tipo === 'V' ? wV : wA);
                let h = tipo === 'H' ? hH : (tipo === 'V' ? hV : hA);

                // Centraliza o quadro no eixo Y
                let yQuadro = yEixo - (h / 2);

                // Desenha o Quadro
                let extraStyles = tipo === 'A' ? 'style="fill: rgba(255, 165, 0, 0.5); stroke: #ff9800; stroke-dasharray: 4;"' : '';
                svg.innerHTML += \`<rect x="\${currentX}" y="\${yQuadro}" width="\${w}" height="\${h}" class="quadro" \${extraStyles} />\`;

                // Texto dentro (H ou V ou A e medidas)
                svg.innerHTML += \`<text x="\${currentX + w/2}" y="\${yQuadro + h/2 - 2}" class="texto-quadro">\${tipo}</text>\`;
                svg.innerHTML += \`<text x="\${currentX + w/2}" y="\${yQuadro + h/2 + 12}" font-family="sans-serif" font-size="9" fill="#ccc" text-anchor="middle">\${w}x\${h}</text>\`;

                // Cota de altura do quadro em relação ao chão (para o primeiro quadro apenas, para não poluir)
                if (index === 0) {
                    desenharCotaV(svg, currentX - 15, yQuadro + h, paredeA, (eixoH - h/2).toFixed(1));
                }

                currentX += w;

                // Desenhar Vão (se não for o último)
                if (index < seqArray.length - 1) {
                    let yOffset = (index % 2 === 0) ? 20 : 40;
                    desenharCotaH(svg, currentX, currentX + vao, yEixo + (hV/2) + yOffset, vao.toFixed(1));
                    currentX += vao;
                }
            });

            // Desenhar Cota da Margem Direita
            desenharCotaH(svg, currentX, paredeL, paredeA - 10, margem.toFixed(1));
        }

        window.onload = loadState;
    </script>
</body>
</html>`;
fs.writeFileSync('index.html', fullHTML, 'utf8');
