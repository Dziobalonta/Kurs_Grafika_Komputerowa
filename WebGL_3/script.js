const vertexShaderTxt = `
precision mediump float;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProjection;

attribute vec3 vertPosition;
attribute vec3 vertColor;

varying vec3 fragColor;

void main() {
    fragColor = vertColor;
    gl_Position = mProjection * mView * mWorld * vec4(vertPosition, 1.0);
}
`
const fragmentShaderTxt = `
precision mediump float;

varying vec3 fragColor;

void main() {
    gl_FragColor = vec4(fragColor, 1.0);
}
`

const mat4 = glMatrix.mat4;

const Box = function () {
    const canvas = document.getElementById('main-canvas');
    const gl = canvas.getContext('webgl');
    let canvasColor = [0.2, 0.7, 0.5];

    checkGl(gl);

    gl.clearColor(...canvasColor, 1.0);  // R,G,B, A 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);

    gl.validateProgram(program);

    const boxVertices = 
	[ // X, Y, Z         
		// Top
		-1.0, 1.0, -1.0,    
		-1.0, 1.0, 1.0,     
		1.0, 1.0, 1.0,      
		1.0, 1.0, -1.0,     

		// Left
		-1.0, 1.0, 1.0,     
		-1.0, -1.0, 1.0,    
		-1.0, -1.0, -1.0,   
		-1.0, 1.0, -1.0,    

		// Right
		1.0, 1.0, 1.0,      
		1.0, -1.0, 1.0,     
		1.0, -1.0, -1.0,    
		1.0, 1.0, -1.0,     

		// Front
		1.0, 1.0, 1.0,      
		1.0, -1.0, 1.0,     
		-1.0, -1.0, 1.0,    
		-1.0, 1.0, 1.0,     

		// Back
		1.0, 1.0, -1.0,     
		1.0, -1.0, -1.0,    
		-1.0, -1.0, -1.0,   
		-1.0, 1.0, -1.0,    

		// Bottom
		-1.0, -1.0, -1.0,   
		-1.0, -1.0, 1.0,    
		1.0, -1.0, 1.0,     
		1.0, -1.0, -1.0,    
	];

    const boxVertices2 = 
	[ // X, Y, Z         
		// Top
		-1.0, 1.0, -1.0,    
		-1.0, 1.0, 1.0,     
		1.0, 1.0, 1.0,      
		1.0, 1.0, -1.0,     

		// Left
		-1.0, 1.0, 1.0,     
		-1.0, -1.0, 1.0,    
		-1.0, -1.0, -1.0,   
		-1.0, 1.0, -1.0,    

		// Right
		1.0, 1.0, 1.0,      
		1.0, -1.0, 1.0,     
		1.0, -1.0, -1.0,    
		1.0, 1.0, -1.0,     

		// Front
		1.0, 1.0, 1.0,      
		1.0, -1.0, 1.0,     
		-1.0, -1.0, 1.0,    
		-1.0, 1.0, 1.0,     

		// Back
		1.0, 1.0, -1.0,     
		1.0, -1.0, -1.0,    
		-1.0, -1.0, -1.0,   
		-1.0, 1.0, -1.0,    

		// Bottom
		-1.0, -1.0, -1.0,   
		-1.0, -1.0, 1.0,    
		1.0, -1.0, 1.0,     
		1.0, -1.0, -1.0,    
	];

	const boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23,
	];

    const boxIndices2 =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23,
	];

    let colors = [
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 1.0, 0.0,

        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 1.0, 0.0,

        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 1.0, 0.0,

        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 1.0, 0.0,

        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 1.0, 0.0,

        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 1.0, 0.0,
    ]

    const boxVertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    const boxIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

     // Create buffers for the second cube
     const boxVertBuffer2 = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, boxVertBuffer2);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices2), gl.STATIC_DRAW);
 
     const boxIndexBuffer2 = gl.createBuffer();
     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBuffer2);
     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices2), gl.STATIC_DRAW);
    
    const posAttrLoc = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        posAttrLoc,
        3,
        gl.FLOAT,
        gl.FALSE,
        3 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    
    gl.enableVertexAttribArray(posAttrLoc);

    // Set up attribute pointers for the second cube
    gl.vertexAttribPointer(
        posAttrLoc,
        3,
        gl.FLOAT,
        gl.FALSE,
        3 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.enableVertexAttribArray(posAttrLoc);
    
    const triangleColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    const colorAttrLoc = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        colorAttrLoc,
        3,
        gl.FLOAT,
        gl.FALSE,
        3 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.enableVertexAttribArray(colorAttrLoc);

    // render time

    gl.useProgram(program);

    const worldMatLoc = gl.getUniformLocation(program, 'mWorld');
    const viewMatLoc = gl.getUniformLocation(program, 'mView');
    const projMatLoc = gl.getUniformLocation(program, 'mProjection');

    const worldMatrix  = mat4.create();
    const viewMatrix  = mat4.create();
    mat4.lookAt(viewMatrix, [0,0,-4], [0,0,0], [0,1,0]); // vectors are: position of the camera, which way they are looking, which way is up
    const projectionMatrix  = mat4.create();
    mat4.perspective(projectionMatrix, glMatrix.glMatrix.toRadian(90), 
                canvas.width / canvas.height, 0.1, 1000.0);

    gl.uniformMatrix4fv(worldMatLoc, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(viewMatLoc, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(projMatLoc, gl.FALSE, projectionMatrix);

    const identityMat = mat4.create();
    const loop = function () 
{
    gl.clearColor(...canvasColor, 1.0);  // R,G,B, A 
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    
    angle = performance.now() / 1000 / 5 * 12 * Math.PI;
    
    // Obrót pierwszego sześcianu
    mat4.rotate(worldMatrix, identityMat, angle, [0,1,0]);
    
    // Save the state of the world matrix
    let firstCubeMatrix = mat4.clone(worldMatrix);
    
    // Rysowanie pierwszego sześcianu
    gl.uniformMatrix4fv(worldMatLoc, gl.FALSE, worldMatrix);
    gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

    // Przesunięcie i obrót drugiego sześcianu względem pierwszego
    const translationVec = [3, 2, 4]; // Przesunięcie względem pierwszego sześcianu
    mat4.translate(worldMatrix, firstCubeMatrix, translationVec);
    mat4.rotate(worldMatrix, worldMatrix, angle, [1,1,2]); // Obrót względem osi y
    gl.uniformMatrix4fv(worldMatLoc, gl.FALSE, worldMatrix);
    gl.drawElements(gl.TRIANGLES, boxIndices2.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(loop);
}



    requestAnimationFrame(loop);
}

function checkGl(gl) {
    if (!gl) {console.log('WebGL not supported, use another browser');}
}

function checkShaderCompile(gl, shader) {
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('shader not compiled', gl.getShaderInfoLog(shader));
    }
}

function checkLink(gl, program) {
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
    }
}