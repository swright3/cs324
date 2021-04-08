
//Webgl boilerplate code that creates a shader
function createShader(gl, shaderType, source) {
    const newShader = gl.createShader(shaderType);
    gl.shaderSource(newShader, source);
    gl.compileShader(newShader);
    return newShader;
}

//Boilerplate function that attaches the vertex and fragment shaders to the program
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    return program
}

//Reusable function for getting a transformation matrix
//Combines translation, scaling and rotating
function getTransformationMatrix(mat4, matrix, translate, translation, scale, scaling, rotateX, rotationX, rotateY, rotationY, rotateZ, rotationZ) {
    if(translate) {
        mat4.translate(matrix, matrix, translation);
    }
    if(scale) {
        mat4.scale(matrix, matrix, scaling);
    }
    if (rotateX) {
        mat4.rotateX(matrix, matrix, rotationX);
    }
    if (rotateY) {
        mat4.rotateY(matrix, matrix, rotationY);
    }
    if (rotateZ) {
        mat4.rotateZ(matrix, matrix, rotationZ);
    }
    return matrix
}

//Creates the projection matrix that sets the users view settings
//Sets field of view, aspect ratio, near cull distance and far cull distance
function getProjectionMatrix(mat4, canvas) {
    var projectionMatrix = mat4.create();
    var fov = 70;
    if(view == 2) {
        fov = 100;
    }
    mat4.perspective(projectionMatrix, 
        fov * Math.PI/180,
        canvas.width/canvas.height,
        0.0001,
        1000,
    );
    return projectionMatrix
}

//Creates the matrix that places the user's camera in the environment
//Transforms all vertices to create illusion of moving the camera
function getViewMatrix(mat4, canvas) {
    var viewMatrix = mat4.create();
    if(view == 0) {
        mat4.translate(viewMatrix, viewMatrix, [0,0,0.1]);
    }
    if(view == 1) {
        mat4.translate(viewMatrix, viewMatrix, [0,-1,-0.5]);
        mat4.rotateX(viewMatrix, viewMatrix, 70*Math.PI/180);
    }
    if(view == 2) {
        mat4.translate(viewMatrix, viewMatrix, [0,0,0.05]);
        mat4.translate(viewMatrix, viewMatrix, trackMiddleData[frame+135]);
        mat4.rotateZ(viewMatrix, viewMatrix, ((frame/2)+67.5)*Math.PI/180);
        mat4.rotateX(viewMatrix, viewMatrix, 90*Math.PI/180);
    }
    if(view == 3) {
        mat4.rotateZ(viewMatrix, viewMatrix, 270*Math.PI/180);
        mat4.translate(viewMatrix, viewMatrix, [0,-1,-0.5]);
        
        mat4.rotateX(viewMatrix, viewMatrix, 70*Math.PI/180);
    }
    return viewMatrix;
}

//The next lot of functions draw all the shapes
//The general order is that they create the vertex data and feed it into the positionBuffer
//Then set the colour data in the colorBuffer
//Then create the model, view and projection matrices
function drawTracks(gl, mat4, canvas, positionBuffer, colorBuffer, uniformLocations, normalBuffer) {
    const circleData = [];

    for(angle=0;angle<360;angle++){
        var heading = angle * Math.PI/180;
        circleData.push(Math.cos(heading)*0.55, Math.sin(heading)*0.55, -0.995);
    }

    const circle2Data = [];

    for(angle=0;angle<360;angle++){
        var heading = angle * Math.PI/180;
        circle2Data.push(Math.cos(heading)*0.46, Math.sin(heading)*0.46, -0.995);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleData), gl.STATIC_DRAW);

    var primitiveType = gl.LINE_LOOP;
    var offset = 0;
    var count = 360;

    var modelMatrix = mat4.create();
    var viewMatrix = getViewMatrix(mat4, canvas);
    var modelViewMatrix = mat4.create();
    var modelViewProjectionMatrix = mat4.create();
    var projectionMatrix = getProjectionMatrix(mat4, canvas);
    mat4.invert(viewMatrix, viewMatrix);
    var modelViewMatrix = mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
    var modelViewProjectionMatrix = mat4.multiply(modelViewProjectionMatrix, projectionMatrix, modelViewMatrix);
    gl.uniformMatrix4fv(uniformLocations.transformation, false, modelViewProjectionMatrix);
    gl.drawArrays(primitiveType, offset, count);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circle2Data), gl.STATIC_DRAW);
    var modelMatrix = mat4.create();
    var viewMatrix = getViewMatrix(mat4, canvas);
    var modelViewMatrix = mat4.create();
    var modelViewProjectionMatrix = mat4.create();
    mat4.invert(viewMatrix, viewMatrix);
    var modelViewMatrix = mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
    var modelViewProjectionMatrix = mat4.multiply(modelViewProjectionMatrix, projectionMatrix, modelViewMatrix);
    gl.uniformMatrix4fv(uniformLocations.transformation, false, modelViewProjectionMatrix);
    gl.drawArrays(primitiveType, offset, count);
}

function drawSleepers(gl, mat4, canvas, positionBuffer, colorBuffer, uniformLocations, normalBuffer) {

    const vertexData = [

        // Front
        .68, 0.1, .09,
        .68, -.1, .09,
        -.58, 0.1, .09,
        -.58, 0.1, .09,
        .68, -.1, .09,
        -.58, -.1, .09,
    
        // Left
        -.58, 0.1, .09,
        -.58, -.1, .09,
        -.58, 0.1, -.05,
        -.58, 0.1, -.05,
        -.58, -.1, .09,
        -.58, -.1, -.05,
    
        // Back
        -.58, 0.1, -.05,
        -.58, -.1, -.05,
        .68, 0.1, -.05,
        .68, 0.1, -.05,
        -.58, -.1, -.05,
        .68, -.1, -.05,
    
        // Right
        .68, 0.1, -.05,
        .68, -.1, -.05,
        .68, 0.1, .09,
        .68, 0.1, .09,
        .68, -.1, .09,
        .68, -.1, -.05,
    
        // Top
        .68, 0.1, .09,
        .68, 0.1, -.05,
        -.58, 0.1, .09,
        -.58, 0.1, .09,
        .68, 0.1, -.05,
        -.58, 0.1, -.05,
    
        // Bottom
        .68, -.1, .09,
        .68, -.1, -.05,
        -.58, -.1, .09,
        -.58, -.1, .09,
        .68, -.1, -.05,
        -.58, -.1, -.05,
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    let colorData = [];
    for (let face = 0; face < 6; face++) {
        let faceColor = [1,1,0.5];
        for (let vertex = 0; vertex < 6; vertex++) {
            colorData.push(...faceColor);
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 12;

    for(let sleeper = 0; sleeper<45; sleeper++) {
        var modelMatrix = mat4.create();
        var viewMatrix = getViewMatrix(mat4, canvas);
        var modelViewMatrix = mat4.create();
        var modelViewProjectionMatrix = mat4.create();
        var normalMatrix = mat4.create();
        var projectionMatrix = getProjectionMatrix(mat4, canvas);
        modelMatrix = getTransformationMatrix(mat4, modelMatrix, true, trackMiddleData[sleeper*16], true, [0.1,0.1,0.1], false, 0, false, 0, true, (sleeper*8)*Math.PI/180);
        mat4.translate(modelMatrix, modelMatrix, [0,0,-0.83]);
        mat4.invert(viewMatrix, viewMatrix);
        var modelViewMatrix = mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
        var modelViewProjectionMatrix = mat4.multiply(modelViewProjectionMatrix, projectionMatrix, modelViewMatrix);

        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix4fv(uniformLocations.normalMatrix, false, normalMatrix);

        gl.uniformMatrix4fv(uniformLocations.transformation, false, modelViewProjectionMatrix);
        gl.drawArrays(primitiveType, offset, vertexData.length/3);
    }
}

function drawFloor(gl, mat4, canvas, positionBuffer, colorBuffer, uniformLocations, normalBuffer) {
    const vertexData = [
        -.5, 0.5, -.5,
        -.5, -.5, -.5,
        0.5, 0.5, -.5,
        0.5, 0.5, -.5,
        -.5, -.5, -.5,
        0.5, -.5, -.5,
    ]

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    let colorData = [];
    for (let face = 0; face < 20; face++) {
        let faceColor = [0,1,0];
        for (let vertex = 0; vertex < 6; vertex++) {
            colorData.push(...faceColor);
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = vertexData.length/3;

    var modelMatrix = mat4.create();
    var viewMatrix = getViewMatrix(mat4, canvas);
    var modelViewMatrix = mat4.create();
    var modelViewProjectionMatrix = mat4.create();
    var normalMatrix = mat4.create();
    var projectionMatrix = getProjectionMatrix(mat4, canvas);
    modelMatrix = getTransformationMatrix(mat4, modelMatrix, true, [0,0,-0.5], true, [10,10,1], false, 0, false, 0, false, 0);
    mat4.invert(viewMatrix, viewMatrix);
    var modelViewMatrix = mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
    var modelViewProjectionMatrix = mat4.multiply(modelViewProjectionMatrix, projectionMatrix, modelViewMatrix);

    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
    gl.uniformMatrix4fv(uniformLocations.normalMatrix, false, normalMatrix);

    gl.uniformMatrix4fv(uniformLocations.transformation, false, modelViewProjectionMatrix);
    gl.drawArrays(primitiveType, offset, vertexData.length/3);
}

function drawEngine(gl, mat4, canvas, positionBuffer, colorBuffer, uniformLocations, frame, normalBuffer) {

    const vertexData = [

        // Front
        0.5, 0.8, 0,
        0.5, -.8, 0,
        -.5, 0.8, 0,
        -.5, 0.8, 0,
        0.5, -.8, 0,
        -.5, -.8, 0,
    
        // Left
        -.5, 0.8, 0,
        -.5, -.8, 0,
        -.5, 0.8, -.5,
        -.5, 0.8, -.5,
        -.5, -.8, 0,
        -.5, -.8, -.5,
    
        // Back
        -.5, 0.8, -.5,
        -.5, -.8, -.5,
        0.5, 0.8, -.5,
        0.5, 0.8, -.5,
        -.5, -.8, -.5,
        0.5, -.8, -.5,
    
        // Right
        0.5, 0.8, -.5,
        0.5, -.8, -.5,
        0.5, 0.8, 0,
        0.5, 0.8, 0,
        0.5, -.8, 0,
        0.5, -.8, -.5,
    
        // Top
        0.5, 0.8, 0,
        0.5, 0.8, -.5,
        -.5, 0.8, 0,
        -.5, 0.8, 0,
        0.5, 0.8, -.5,
        -.5, 0.8, -.5,
    
        // Bottom
        0.5, -.8, 0,
        0.5, -.8, -.5,
        -.5, -.8, 0,
        -.5, -.8, 0,
        0.5, -.8, -.5,
        -.5, -.8, -.5,
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    let colorData = [];
    for (let face = 0; face < vertexData.length/6; face++) {
        let faceColor = [54/255, 117/255, 48/255];
        for (let vertex = 0; vertex < 6; vertex++) {
            colorData.push(...faceColor);
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = vertexData.length/3;

    var modelMatrix = mat4.create();
    var viewMatrix = getViewMatrix(mat4, canvas);
    var modelViewMatrix = mat4.create();
    var modelViewProjectionMatrix = mat4.create();
    var normalMatrix = mat4.create();
    var projectionMatrix = getProjectionMatrix(mat4, canvas);
    modelMatrix = getTransformationMatrix(mat4, modelMatrix, true, trackMiddleData[frame+135], true, [0.1,0.1,0.1], false, 0, false, 0, true, ((frame/2)+67.5)*Math.PI/180);
    mat4.invert(viewMatrix, viewMatrix);
    var modelViewMatrix = mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
    var modelViewProjectionMatrix = mat4.multiply(modelViewProjectionMatrix, projectionMatrix, modelViewMatrix);

    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
    gl.uniformMatrix4fv(uniformLocations.normalMatrix, false, normalMatrix);

    gl.uniformMatrix4fv(uniformLocations.transformation, false, modelViewProjectionMatrix);
    gl.drawArrays(primitiveType, offset, vertexData.length/3);
}

function drawCabin(gl, mat4, canvas, positionBuffer, colorBuffer, uniformLocations, frame, normalBuffer) {

    const vertexData = [

        // Front
        0.45, 0, 0.5,
        0.45, -.7, 0.5,
        -.45, 0, 0.5,
        -.45, 0, 0.5,
        0.45, -.7, 0.5,
        -.45, -.7, 0.5,
    
        // Left
        -.45, 0, 0.5,
        -.45, -.7, 0.5,
        -.45, 0, 0,
        -.45, 0, 0,
        -.45, -.7, 0.5,
        -.45, -.7, 0,
    
        // Back
        -.45, 0, 0,
        -.45, -.7, 0,
        0.45, 0, 0,
        0.45, 0, 0,
        -.45, -.7, 0,
        0.45, -.7, 0,
    
        // Right
        0.45, 0, 0,
        0.45, -.7, 0,
        0.45, 0, 0.5,
        0.45, 0, 0.5,
        0.45, -.7, 0.5,
        0.45, -.7, 0,
    
        // Top
        0.45, 0, 0.5,
        0.45, 0, 0,
        -.45, 0, 0.5,
        -.45, 0, 0.5,
        0.45, 0, 0,
        -.45, 0, 0,
    
        // Bottom
        0.45, -.7, 0.5,
        0.45, -.7, 0,
        -.45, -.7, 0.5,
        -.45, -.7, 0.5,
        0.45, -.7, 0,
        -.45, -.7, 0,
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    let colorData = [
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        105/255, 247/255, 255/255,
        105/255, 247/255, 255/255,
        105/255, 247/255, 255/255,
        105/255, 247/255, 255/255,
        105/255, 247/255, 255/255,
        105/255, 247/255, 255/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = vertexData.length/3;

    var modelMatrix = mat4.create();
    var viewMatrix = getViewMatrix(mat4, canvas);
    var modelViewMatrix = mat4.create();
    var modelViewProjectionMatrix = mat4.create();
    var normalMatrix = mat4.create();
    var projectionMatrix = getProjectionMatrix(mat4, canvas);
    modelMatrix = getTransformationMatrix(mat4, modelMatrix, true, trackMiddleData[frame+135], true, [0.1,0.1,0.1], false, 0, false, 0, true, ((frame/2)+67.5)*Math.PI/180);
    mat4.invert(viewMatrix, viewMatrix);
    var modelViewMatrix = mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
    var modelViewProjectionMatrix = mat4.multiply(modelViewProjectionMatrix, projectionMatrix, modelViewMatrix);

    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
    gl.uniformMatrix4fv(uniformLocations.normalMatrix, false, normalMatrix);

    gl.uniformMatrix4fv(uniformLocations.transformation, false, modelViewProjectionMatrix);
    gl.drawArrays(primitiveType, offset, vertexData.length/3);
}

function drawChimney(gl, mat4, canvas, positionBuffer, colorBuffer, uniformLocations, frame, normalBuffer) {

    const vertexData = [

        // Front
        0.1, .6, .35,
        0.1, .4, .35,
        -.1, .6, .35,
        -.1, .6, .35,
        0.1, .4, .35,
        -.1, .4, .35,
    
        // Left
        -.1, .6, .35,
        -.1, .4, .35,
        -.1, .6, 0,
        -.1, .6, 0,
        -.1, .4, .35,
        -.1, .4, 0,
    
        // Back
        -.1, .6, 0,
        -.1, .4, 0,
        0.1, .6, 0,
        0.1, .6, 0,
        -.1, .4, 0,
        0.1, .4, 0,
    
        // Right
        0.1, .6, 0,
        0.1, .4, 0,
        0.1, .6, .35,
        0.1, .6, .35,
        0.1, .4, .35,
        0.1, .4, 0,
    
        // Top
        0.1, .6, .35,
        0.1, .6, 0,
        -.1, .6, .35,
        -.1, .6, .35,
        0.1, .6, 0,
        -.1, .6, 0,
    
        // Bottom
        0.1, .4, .35,
        0.1, .4, 0,
        -.1, .4, .35,
        -.1, .4, .35,
        0.1, .4, 0,
        -.1, .4, 0,
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    let colorData = [
        0,0,0,
        0,0,0,
        0,0,0,
        0,0,0,
        0,0,0,
        0,0,0,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
        54/255, 117/255, 48/255,
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = vertexData.length/3;

    var modelMatrix = mat4.create();
    var viewMatrix = getViewMatrix(mat4, canvas);
    var modelViewMatrix = mat4.create();
    var modelViewProjectionMatrix = mat4.create();
    var normalMatrix = mat4.create();
    var projectionMatrix = getProjectionMatrix(mat4, canvas);
    modelMatrix = getTransformationMatrix(mat4, modelMatrix, true, trackMiddleData[frame+135], true, [0.1,0.1,0.1], false, 0, false, 0, true, ((frame/2)+67.5)*Math.PI/180);
    mat4.invert(viewMatrix, viewMatrix);
    var modelViewMatrix = mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
    var modelViewProjectionMatrix = mat4.multiply(modelViewProjectionMatrix, projectionMatrix, modelViewMatrix);

    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
    gl.uniformMatrix4fv(uniformLocations.normalMatrix, false, normalMatrix);

    gl.uniformMatrix4fv(uniformLocations.transformation, false, modelViewProjectionMatrix);
    gl.drawArrays(primitiveType, offset, vertexData.length/3);
}

function drawCarriage(gl, mat4, canvas, positionBuffer, colorBuffer, uniformLocations, frame, normalBuffer) {

    const vertexData = [

        // Front
        0.5, 0.8, 0.5,
        0.5, -.8, 0.5,
        -.5, 0.8, 0.5,
        -.5, 0.8, 0.5,
        0.5, -.8, 0.5,
        -.5, -.8, 0.5,
    
        // Left
        -.5, 0.8, 0.5,
        -.5, -.8, 0.5,
        -.5, 0.8, -.5,
        -.5, 0.8, -.5,
        -.5, -.8, 0.5,
        -.5, -.8, -.5,
    
        // Back
        -.5, 0.8, -.5,
        -.5, -.8, -.5,
        0.5, 0.8, -.5,
        0.5, 0.8, -.5,
        -.5, -.8, -.5,
        0.5, -.8, -.5,
    
        // Right
        0.5, 0.8, -.5,
        0.5, -.8, -.5,
        0.5, 0.8, 0.5,
        0.5, 0.8, 0.5,
        0.5, -.8, 0.5,
        0.5, -.8, -.5,
    
        // Top
        0.5, 0.8, 0.5,
        0.5, 0.8, -.5,
        -.5, 0.8, 0.5,
        -.5, 0.8, 0.5,
        0.5, 0.8, -.5,
        -.5, 0.8, -.5,
    
        // Bottom
        0.5, -.8, 0.5,
        0.5, -.8, -.5,
        -.5, -.8, 0.5,
        -.5, -.8, 0.5,
        0.5, -.8, -.5,
        -.5, -.8, -.5,
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    let colorData = [];
    for (let face = 0; face < 6; face++) {
        let faceColor = [255/255, 155/255, 153/255,];
        for (let vertex = 0; vertex < 6; vertex++) {
            colorData.push(...faceColor);
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 12;

    for(let carriage = 0; carriage<3; carriage++){
        var modelMatrix = mat4.create();
        var viewMatrix = getViewMatrix(mat4, canvas);
        var modelViewMatrix = mat4.create();
        var modelViewProjectionMatrix = mat4.create();
        var normalMatrix = mat4.create();
        var projectionMatrix = getProjectionMatrix(mat4, canvas);
        modelMatrix = getTransformationMatrix(mat4, modelMatrix, true, trackMiddleData[frame+(carriage*45)], true, [0.1,0.1,0.1], false, 0, false, 0, true, ((frame/2)+(carriage*22.5))*Math.PI/180);
        mat4.invert(viewMatrix, viewMatrix);
        var modelViewMatrix = mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
        var modelViewProjectionMatrix = mat4.multiply(modelViewProjectionMatrix, projectionMatrix, modelViewMatrix);

        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix4fv(uniformLocations.normalMatrix, false, normalMatrix);

        gl.uniformMatrix4fv(uniformLocations.transformation, false, modelViewProjectionMatrix);
        gl.drawArrays(primitiveType, offset, vertexData.length/3);
    }
}

function drawCouplings(gl, mat4, canvas, positionBuffer, colorBuffer, uniformLocations, frame, normalBuffer) {

    const vertexData = [

        // Front
        0.5, 1, 0.2,
        0.5, -1, 0.2,
        -.5, 1, 0.2,
        -.5, 1, 0.2,
        0.5, -1, 0.2,
        -.5, -1, 0.2,
    
        // Left
        -.5, 1, 0.2,
        -.5, -1, 0.2,
        -.5, 1, -.8,
        -.5, 1, -.8,
        -.5, -1, 0.2,
        -.5, -1, -.8,
    
        // Back
        -.5, 1, -.8,
        -.5, -1, -.8,
        0.5, 1, -.8,
        0.5, 1, -.8,
        -.5, -1, -.8,
        0.5, -1, -.8,
    
        // Right
        0.5, 1, -.8,
        0.5, -1, -.8,
        0.5, 1, 0.2,
        0.5, 1, 0.2,
        0.5, -1, 0.2,
        0.5, -1, -.8,
    
        // Top
        0.5, 1, 0.2,
        0.5, 1, -.8,
        -.5, 1, 0.2,
        -.5, 1, 0.2,
        0.5, 1, -.8,
        -.5, 1, -.8,
    
        // Bottom
        0.5, -1, 0.2,
        0.5, -1, -.8,
        -.5, -1, 0.2,
        -.5, -1, 0.2,
        0.5, -1, -.8,
        -.5, -1, -.8,
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    let colorData = [];
    for (let face = 0; face < 6; face++) {
        let faceColor = [105/255, 247/255, 255/255];
        for (let vertex = 0; vertex < 6; vertex++) {
            colorData.push(...faceColor);
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 12;

    for(let coupling = 0; coupling<3; coupling++){
        var modelMatrix = mat4.create();
        var viewMatrix = getViewMatrix(mat4, canvas);
        var modelViewMatrix = mat4.create();
        var modelViewProjectionMatrix = mat4.create();
        var normalMatrix = mat4.create();
        var projectionMatrix = getProjectionMatrix(mat4, canvas);
        modelMatrix = getTransformationMatrix(mat4, modelMatrix, true, trackMiddleData[frame+(coupling*45)+22], true, [0.02,0.02,0.02], false, 0, false, 0, true, ((frame/2)+(coupling*22.5+11.25))*Math.PI/180);
        mat4.invert(viewMatrix, viewMatrix);
        var modelViewMatrix = mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
        var modelViewProjectionMatrix = mat4.multiply(modelViewProjectionMatrix, projectionMatrix, modelViewMatrix);

        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix4fv(uniformLocations.normalMatrix, false, normalMatrix);

        gl.uniformMatrix4fv(uniformLocations.transformation, false, modelViewProjectionMatrix);
        gl.drawArrays(primitiveType, offset, vertexData.length/3);
    }
}

function drawWheels(gl, mat4, canvas, positionBuffer, colorBuffer, uniformLocations, frame, normalBuffer) {

    const circleData = [];

    for(angle=0;angle<=360;angle+=4){
        var heading = angle * Math.PI/180;
        circleData.push(-1, Math.sin(heading)*0.3, Math.cos(heading)*0.3);
    }

    for(angle=0;angle<=360;angle+=4){
        var heading = angle * Math.PI/180;
        circleData.push(-1, Math.sin(heading)*0.3, Math.cos(heading)*0.3);
    }

    var vertexData = []
    for(var point = 0;point<circleData.length/2;point+=3) {
        vertexData.push(circleData[point],circleData[point+1],circleData[point+2],//left circle
                        circleData[point+3],circleData[point+4],circleData[point+5],
                        -1,0,0,
        )
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = vertexData.length/3;

    let colorData = [];
    let faceColor = [1,1,1];
    for (let face = 0; face < vertexData.length/3; face++) {
        if(face % 10 == 3 || face % 10 == 4 || face % 10 == 5 || face % 10 == 2 || face % 10 == 1) {
            faceColor = [94/255, 94/255, 94/255];
        } else {
            faceColor = [0,0,0];
        }
        for (let vertex = 0; vertex < 3; vertex++) {
            colorData.push(...faceColor);
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    for(let leftWheel = 0; leftWheel < 4; leftWheel++) {
        var modelMatrix = mat4.create();
        var viewMatrix = getViewMatrix(mat4, canvas);
        var modelViewMatrix = mat4.create();
        var modelViewProjectionMatrix = mat4.create();
        var normalMatrix = mat4.create();
        var projectionMatrix = getProjectionMatrix(mat4, canvas);
        var x = trackMiddleData[frame+(leftWheel*45)][0];
        var y = trackMiddleData[frame+(leftWheel*45)][1];
        var z = trackMiddleData[frame+(leftWheel*45)][2];
        x*=1.09;
        y*=1.09;
        z*=1.05;
        mat4.translate(modelMatrix, modelMatrix, [x,y,z]);
        mat4.rotateZ(modelMatrix, modelMatrix, ((frame/2)+(leftWheel*22.5))*Math.PI/180);
        mat4.rotateX(modelMatrix, modelMatrix, ((720-frame)*3.14)*Math.PI/180);
        modelMatrix = getTransformationMatrix(mat4, modelMatrix, false, 0, true, [0.1,0.1,0.1], false, 0, false, 0, false, 0);
        mat4.invert(viewMatrix, viewMatrix);
        var modelViewMatrix = mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
        var modelViewProjectionMatrix = mat4.multiply(modelViewProjectionMatrix, projectionMatrix, modelViewMatrix);

        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix4fv(uniformLocations.normalMatrix, false, normalMatrix);

        gl.uniformMatrix4fv(uniformLocations.transformation, false, modelViewProjectionMatrix);
        gl.drawArrays(primitiveType, offset, count);
    }

    for(let rightWheel = 0; rightWheel < 4; rightWheel++) {
        var modelMatrix = mat4.create();
        var viewMatrix = getViewMatrix(mat4, canvas);
        var modelViewMatrix = mat4.create();
        var modelViewProjectionMatrix = mat4.create();
        var normalMatrix = mat4.create();
        var projectionMatrix = getProjectionMatrix(mat4, canvas);
        var x = trackMiddleData[frame+(rightWheel*45)][0];
        var y = trackMiddleData[frame+(rightWheel*45)][1];
        var z = trackMiddleData[frame+(rightWheel*45)][2];
        x*=1.31;
        y*=1.31;
        z*=1.05;
        mat4.translate(modelMatrix, modelMatrix, [x,y,z]);
        mat4.rotateZ(modelMatrix, modelMatrix, ((frame/2)+(rightWheel*22.5))*Math.PI/180);
        mat4.rotateX(modelMatrix, modelMatrix, ((720-frame)*3.14)*Math.PI/180);
        modelMatrix = getTransformationMatrix(mat4, modelMatrix, false, 0, true, [0.1,0.1,0.1], false, 0, false, 0, false, 0);
        mat4.invert(viewMatrix, viewMatrix);
        var modelViewMatrix = mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
        var modelViewProjectionMatrix = mat4.multiply(modelViewProjectionMatrix, projectionMatrix, modelViewMatrix);

        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix4fv(uniformLocations.normalMatrix, false, normalMatrix);

        gl.uniformMatrix4fv(uniformLocations.transformation, false, modelViewProjectionMatrix);
        gl.drawArrays(primitiveType, offset, count);
    }
}

function drawTrees(gl, mat4, canvas, positionBuffer, colorBuffer, uniformLocations, normalBuffer) {
    
    const vertexData = [
        .25,1,0,
        .25,0,0,
        -.25,1,0,
        -.25,1,0,
        .25,0,0,
        -.25,0,0,

        0,4,0,
        0,1,0,
        -1,1,0,
        0,4,0,
        0,1,0,
        1,1,0,
    ]

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    let colorData = [
        84/255, 50/255, 0,
        84/255, 50/255, 0,
        84/255, 50/255, 0,
        84/255, 50/255, 0,
        84/255, 50/255, 0,
        84/255, 50/255, 0,
        30/255, 199/255, 0,
        30/255, 199/255, 0,
        30/255, 199/255, 0,
        30/255, 199/255, 0,
        30/255, 199/255, 0,
        30/255, 199/255, 0,
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = vertexData.length/3;

    const trees = [[2,0,90],[3,1,120],[1.5,0.4,140],[-2,1,120],[3,-4,10],[-3,1.5,110],[4,-3,90]];

    for(tree in trees) {
        var modelMatrix = mat4.create();
        var viewMatrix = getViewMatrix(mat4, canvas);
        var modelViewMatrix = mat4.create();
        var modelViewProjectionMatrix = mat4.create();
        var normalMatrix = mat4.create();
        var projectionMatrix = getProjectionMatrix(mat4, canvas);
        mat4.translate(modelMatrix, modelMatrix, [trees[tree][0],trees[tree][1],-1]);
        mat4.rotateZ(modelMatrix, modelMatrix, trees[tree][2]*Math.PI/180);
        mat4.rotateX(modelMatrix, modelMatrix, 90*Math.PI/180);
        modelMatrix = getTransformationMatrix(mat4, modelMatrix, false, [3,0,-2], true, [0.2,0.2,1], false, 90*Math.PI/180, false, 0, false, 0);
        mat4.invert(viewMatrix, viewMatrix);
        var modelViewMatrix = mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
        var modelViewProjectionMatrix = mat4.multiply(modelViewProjectionMatrix, projectionMatrix, modelViewMatrix);

        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix4fv(uniformLocations.normalMatrix, false, normalMatrix);

        gl.uniformMatrix4fv(uniformLocations.transformation, false, modelViewProjectionMatrix);
        gl.drawArrays(primitiveType, offset, vertexData.length/3);
    }
}

//Takes an array and repeats it count times
function repeat(count, pattern) {
    return [...Array(count)].reduce(sum => sum.concat(pattern), []);
}

//Event handler that senses for when the user presses certain keys
//. increases velocity in forward direction and , increases velocity in the backwards direction
//There are 4 camera options changed by pressing 1, 2, 3, or 4
function onKeyPress(event) {
    if(event.key == '.') {
        if(rate == 0) {
            direction = 1;
            rate++;
        } else if(direction == -1) {
            rate--;
        } else if(direction == 1 && rate<3) {
            rate++;
        }
    }
    if(event.key == ',') {
        if(rate == 0) {
            direction = -1;
            rate++;
        } else if(direction == -1 && rate<3) {
            rate++;
        } else if(direction == 1) {
            rate--;
        }
    }
    if(event.key == '1') {
        view = 0;
    }
    if(event.key == '2') {
        view = 1;
    }
    if(event.key == '3') {
        view = 2;
    }
    if(event.key == '4') {
        view = 3;
    }
}

//Webgl setup
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');
var mat4 = glMatrix.mat4;
document.addEventListener('keyup', onKeyPress, false);

if (!gl) {
    throw new Error('webgl not supported')
}

var frame = 0; //Tick counter
var rate = 1; //Controls tick speed
var direction = 1; //Direction of the train's movement (1=forward, -1=backwards)
var view = 0; //Tracks the current camera view

//Creates data for the circle following the middle of the track
const trackMiddleData = [];
for(angle=0;angle<720;angle+=0.5){
    var heading = angle * Math.PI/180;
    trackMiddleData.push([Math.cos(heading)*0.5, Math.sin(heading)*0.5, -0.92]);
}

//The program that defines the vertex shader
const vertexShaderSource = `
precision mediump float;
attribute vec3 position;
uniform mat4 transformation;

attribute vec3 color;
varying vec3 vColor;

const vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
const float ambient = 0.3;

attribute vec3 normal;

varying float vBrightness;

uniform mat4 normalMatrix;

void main() {
    vColor = color;
    vec3 worldNormal = (normalMatrix * vec4(normal, 1)).xyz;
    float diffuse = max(0.0, dot(worldNormal, lightDirection))/10.0;

    vBrightness = ambient + diffuse;
    gl_Position = transformation * vec4(position, 1);
}
`;

//The program that defines the fragment shader
const fragmentShaderSource = `
precision mediump float;
varying vec3 vColor;
varying float vBrightness;

void main() {
    vec4 color = vec4(vColor,1);
    color.xyz *= vBrightness;
    gl_FragColor = color;
}
`;

function main() {

    //Creates the normal vectors
    const normalData = [
        ...repeat(6, [0,0,1]),
        ...repeat(6, [-1,0,0]),
        ...repeat(6, [0,0,-1]),
        ...repeat(6, [1,0,0]),
        ...repeat(6, [0,1,0]),
        ...repeat(6, [0,-1,0]),
    ]

    var positionBuffer = gl.createBuffer();

    var colorBuffer = gl.createBuffer();

    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    var program = createProgram(gl, vertexShader, fragmentShader);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    //Here all the relevant attributes are located and enabled: position, color and normal
    var positionLocation = gl.getAttribLocation(program, `position`);
    gl.enableVertexAttribArray(positionLocation);
    var size = 3;
    var type = gl.FLOAT;
    var normalise = false;
    var stride = 0;
    var offset = 0;

    var uniformLocations = {
        transformation: gl.getUniformLocation(program, 'transformation'),
        normalMatrix: gl.getUniformLocation(program, 'normalMatrix')
    };

    gl.vertexAttribPointer(positionLocation, size, type, normalise, stride, offset);

    const colorLocation = gl.getAttribLocation(program, `color`);
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    const normalLocation = gl.getAttribLocation(program, `normal`);
    gl.enableVertexAttribArray(normalLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);

    //The main loop of the program
    requestAnimationFrame(main);
    frame += rate*direction;
    if(frame > 719) {
        frame = frame - 720;
    }
    if(frame < 0) {
        frame = frame + 720
    }
    if(direction == 1) {
        angle = 0;
    }
    if(direction == -1) {
        angle = 720;
    }
    drawTracks(gl, mat4, canvas, positionBuffer, colorBuffer, uniformLocations, normalBuffer);
    drawEngine(gl, mat4, canvas, positionBuffer, colorBuffer, uniformLocations, frame, normalBuffer);
    drawCarriage(gl, mat4, canvas, positionBuffer, colorBuffer, uniformLocations, frame, normalBuffer);
    drawWheels(gl, mat4, canvas, positionBuffer, colorBuffer, uniformLocations, frame, normalBuffer);
    drawFloor(gl, mat4, canvas, positionBuffer, colorBuffer, uniformLocations, normalBuffer);
    drawSleepers(gl, mat4, canvas, positionBuffer, colorBuffer, uniformLocations, normalBuffer);
    drawCouplings(gl, mat4, canvas, positionBuffer, colorBuffer, uniformLocations, frame, normalBuffer);
    drawTrees(gl, mat4, canvas, positionBuffer, colorBuffer, uniformLocations, normalBuffer);
    drawCabin(gl, mat4, canvas, positionBuffer, colorBuffer, uniformLocations, frame, normalBuffer);
    drawChimney(gl, mat4, canvas, positionBuffer, colorBuffer, uniformLocations, frame, normalBuffer);
}

main();