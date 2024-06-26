const vertexShaderTxt = `
precision mediump float;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProjection;

uniform vec3 lightInWorld;

attribute vec3 vertPosition;
attribute vec2 textureCoord;
attribute vec3 vertNormal;

varying vec2 fragTextureCoord;
varying vec3 fragNormal;

varying vec3 fragmentSurfaceLight;

void main() {
    fragTextureCoord = textureCoord;
    fragNormal = (mWorld * vec4(vertNormal, 0.0)).xyz;

    vec3 surfaceWorldPos = (mWorld * vec4(vertPosition, 1.0)).xyz;

    fragmentSurfaceLight = lightInWorld - surfaceWorldPos;
    gl_Position = mProjection * mView * mWorld * vec4(vertPosition, 1.0);
}
`
const fragmentShaderTxt = `
precision mediump float;

varying vec2 fragTextureCoord;
varying vec3 fragNormal;
varying vec3 fragmentSurfaceLight;

uniform vec3 ambientLight;
uniform vec3 lightDirection;
uniform vec3 lightColor;

uniform sampler2D sampler;

void main() {
    vec3 normLightDirection = normalize(lightDirection);
    vec3 normfragNormal = normalize(fragNormal);

    vec3 normFragmentSurfaceLight = normalize(fragmentSurfaceLight);

    vec4 tex = texture2D(sampler, fragTextureCoord);
    vec3 light = ambientLight +
        lightColor * max(dot(normfragNormal, normFragmentSurfaceLight), 0.0);

    gl_FragColor = vec4(tex.rgb * light, tex.a);
}
`

const mat4 = glMatrix.mat4;

let worldMatrix = mat4.create();
const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();

let translation = [0, 0, 0]; // Track the translation in x, y, z directions

function startDraw() {
    OBJ.downloadMeshes({
        'sphere': 'models/untitled.obj'
    }, Triangle);
}

const Triangle = function (meshes) {
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

    OBJ.initMeshBuffers(gl, meshes.sphere);

    gl.bindBuffer(gl.ARRAY_BUFFER, meshes.sphere.vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshes.sphere.indexBuffer);

    const posAttrLoc = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        posAttrLoc,
        meshes.sphere.vertexBuffer.itemSize,
        gl.FLOAT,
        gl.FALSE,
        0,
        0
    );
    
    gl.enableVertexAttribArray(posAttrLoc);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, meshes.sphere.textureBuffer);

    const textureAttrLoc = gl.getAttribLocation(program, 'textureCoord');
    gl.vertexAttribPointer(
        textureAttrLoc,
        meshes.sphere.textureBuffer.itemSize,
        gl.FLOAT,
        gl.FALSE,
        0,
        0
    );

    gl.enableVertexAttribArray(textureAttrLoc);

    gl.bindBuffer(gl.ARRAY_BUFFER, meshes.sphere.normalBuffer, gl.STATIC_DRAW);
    const normalAttrLoc = gl.getAttribLocation(program, 'vertNormal');
    gl.vertexAttribPointer(
        normalAttrLoc,
        meshes.sphere.normalBuffer.itemSize,
        gl.FLOAT,
        gl.TRUE,
        0,
        0
    );
    gl.enableVertexAttribArray(normalAttrLoc);

    const img = document.getElementById('img');
    const boxTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, boxTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
        gl.TEXTURE_2D, 
        0,      // level of detail
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        img
    );
    gl.bindTexture(gl.TEXTURE_2D, null);

    // render time

    gl.useProgram(program);

    const worldMatLoc = gl.getUniformLocation(program, 'mWorld');
    const viewMatLoc = gl.getUniformLocation(program, 'mView');
    const projMatLoc = gl.getUniformLocation(program, 'mProjection');

    mat4.lookAt(viewMatrix, [0, 0, -2], [0, 0, 0], [0, 1, 0]); // vectors are: position of the camera, which way they are looking, which way is up
    mat4.perspective(projectionMatrix, glMatrix.glMatrix.toRadian(110), 
                canvas.width / canvas.height, 0.1, 100.0);

    gl.uniformMatrix4fv(viewMatLoc, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(projMatLoc, gl.FALSE, projectionMatrix);

    let ambientUniformLoc = gl.getUniformLocation(program, 'ambientLight');
    let lightColorUniformLoc = gl.getUniformLocation(program, 'lightColor');
    let lightInWorldLocation = gl.getUniformLocation(program, 'lightInWorld');

    let ambient_light = [0.3, 0.3, 0.3];
    let light_color = [0.4, 0.9, 0.2];
    gl.uniform3f(ambientUniformLoc, ...ambient_light);
    gl.uniform3f(lightColorUniformLoc, ...light_color);
    gl.uniform3fv(lightInWorldLocation, [-1, 1, -1]);

    const identityMat = mat4.create();

    function updateWorldMatrix() {
        mat4.fromTranslation(worldMatrix, translation);
        mat4.rotate(worldMatrix, worldMatrix, Math.PI, [0, 1, 0]); // Rotate by 180 degrees around the Y axis
        gl.uniformMatrix4fv(worldMatLoc, gl.FALSE, worldMatrix);
    }

    const loop = function () {
        updateWorldMatrix();

        gl.clearColor(...canvasColor, 1.0);  // R,G,B, A 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        gl.bindTexture(gl.TEXTURE_2D, boxTexture);
        gl.activeTexture(gl.TEXTURE0);   

        gl.drawElements(gl.TRIANGLES, meshes.sphere.indexBuffer.numItems, 
                gl.UNSIGNED_SHORT, 0);

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

// Event listener for keydown events to handle arrow key presses
document.addEventListener('keydown', (event) => {
    const key = event.key;
    const moveStep = 0.1;

    switch (key) {
        case 'ArrowUp':
            translation[1] += moveStep;
            break;
        case 'ArrowDown':
            translation[1] -= moveStep;
            break;
        case 'ArrowRight':
            translation[0] -= moveStep;
            break;
        case 'ArrowLeft':
            translation[0] += moveStep;
            break;
    }
});

