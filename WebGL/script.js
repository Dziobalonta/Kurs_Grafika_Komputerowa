console.log('works');

vertexShaderTxt = `
precision mediump float;

attribute vec2 vertPosition;
attribute vec3 vertColor;

varying vec3 fragColor;

void main() {
    fragColor = vertColor;
    gl_Position = vec4(vertPosition, 0.0, 1.0);
}
`
const fragmentShaderTxt = `
precision mediump float;

varying vec3 fragColor;

void main() {
    gl_FragColor = vec4(fragColor, 1.0);
}
`

const Triangle = function() {
    const canvas = document.getElementById('Triangle-canvas');
    const gl = canvas.getContext('webgl');
    let canvasColor = [0.5, 0.5, 0.5];

    checkGL(gl);

    gl.clearColor(...canvasColor, 1.0); // R, G, B, A
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  
    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    // checkShaderCompile(gl, vertexShader);
    // checkShaderCompile(gl, fragmentShader);

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);

    gl.validateProgram(program);

    let triangleVerts = [
    //    X,  Y
        0.0, 0.5,       0.65, 0.1, 0.89,
        -0.5, -0.5,     0.43, 0.90, 0.2,
        0.5, -0.5,      0.93, 0.45, 0.05
    ]

    let colors = [
        [1.0, 0.0, 0.0], // Red
        [0.0, 1.0, 0.0], // Green
        [0.0, 0.0, 1.0], // Blue
    ];
    let colorIndex_1 = 0, colorIndex_2 = 1, colorIndex_3 = 2;
    
    const changeColorButton = document.createElement('button');
    changeColorButton.innerText = 'Zmień kolor trójkąta';
    changeColorButton.addEventListener('click', function() {
        colorIndex_1 = (colorIndex_1 + 1) % colors.length;
        colorIndex_2 = (colorIndex_2 + 1) % colors.length;
        colorIndex_3 = (colorIndex_3 + 1) % colors.length;
        triangleVerts = [
            0.0, 0.5,       ...colors[colorIndex_1],
            -0.5, -0.5,     ...colors[colorIndex_2],
            0.5, -0.5,      ...colors[colorIndex_3]
        ]
        canvasColor = [0.5, 0.5, 0.5];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVerts), gl.STATIC_DRAW);
        gl.clear(gl.COLOR_BUFFER_BIT); // zachowuje kolor tla
        gl.drawArrays(gl.TRIANGLES, 0, 3); // Kazde kolejne narysowanie
    });
    document.body.appendChild(changeColorButton);
    

    const traingleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, traingleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVerts), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttributeLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.enableVertexAttribArray(positionAttributeLocation);

    const colorAttribLoc = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        colorAttribLoc,
        3,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(colorAttribLoc);

    // render time

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3); // Pierwsze narysowanie
}

const Square = function() {
    const canvas = document.getElementById('Square-canvas');
    const gl = canvas.getContext('webgl');
    let canvasColor = [0.5, 0.5, 0.5];

    checkGL(gl);

    gl.clearColor(...canvasColor, 1.0); // R, G, B, A
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  
    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    // checkShaderCompile(gl, vertexShader);
    // checkShaderCompile(gl, fragmentShader);

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);

    gl.validateProgram(program);

    let SquareVerts = [
    //    X,  Y
        -0.5,  0.5,  1.0, 0.0, 0.0, // Wierzchołek 1
        -0.5, -0.5,  0.0, 1.0, 0.0, // Wierzchołek 2
        0.5,   0.5,  0.0, 0.0, 1.0,// Wierzchołek 3
        0.5,  -0.5,  1.0, 1.0, 1.0 // Wierzchołek 4
    ]

    const SquareBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, SquareBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(SquareVerts), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttributeLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.enableVertexAttribArray(positionAttributeLocation);

    const colorAttribLoc = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        colorAttribLoc,
        3,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(colorAttribLoc);

    // render time

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function checkGL(gl){
    if (!gl) {
        console.log('WebGL nie wspierany, uzyj innej przegladarki!');
    }
}

function checkShaderCompile(gl, shader){
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('shader sie nie skompilowal!',gl.getShaderInfoLog(shader));
    }
}

function checkLink(gl, program){
    if (!gl.getProgramParameter(shader, gl.LINK_STATUS)) {
        console.error('Problem z linkowaniem programu!',gl.getProgramInfoLog(program));
    }
}
