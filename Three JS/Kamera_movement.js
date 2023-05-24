var params = {
    tiltAmount: 0,
    panAmount: 0,
    zoomAmount: 0,
    pedestalAmount: 0,
    dollyAmount: 0,
    truckAmount: 0
  };
  
  var gui = new dat.GUI();
  gui.add( params, 'tiltAmount', -2, 2 );
  gui.add( params, 'panAmount', -2, 2 );
  gui.add( params, 'zoomAmount', 0, 100 );
  gui.add( params, 'pedestalAmount', -1000, 1000 );
  gui.add( params, 'dollyAmount', -1000, 1000 );
  gui.add( params, 'truckAmount', -1000, 1000 );
  gui.open();
  
  windowWidth  = window.innerWidth;
  var windowHeight = window.innerHeight;
  
  var views = [
    {
      left: 0,
      bottom: 0,
      width: 0.5,
      height: 0.5,
      eye: [ 0, 100, 200 ],
      direction: [ 0, 1, 0 ]
    },
    {
      left: 0.5,
      bottom: 0,
      width: 0.5,
      height: 0.5,
      eye: [ 0, 0, 200 ],
      direction: [ -1, 0, 0 ]
    }
  ];
  
  for ( ii =  0; ii < views.length; ++ii ) {
    var view = views[ii];
    orthoCam = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -500, 10000 );
    view.orthoCam = orthoCam;
  }
  
  var scene = new THREE.Scene();
  
  var light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 1, 1, 0.5 ).normalize();
  scene.add( light );
  
  var startFov = 30.0;
  var startPosition = new THREE.Vector3( 0, 20, 500 );
  var startRotation = new THREE.Vector3( 0, 0, 0 );
  
  var camera = new THREE.PerspectiveCamera( startFov, window.innerWidth/window.innerHeight, 0.1, 10000 );
  
  var cameraHelper = new THREE.CameraHelper( camera );
  scene.add( cameraHelper );
  
  var renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  var container = document.getElementById( 'container' );
  container.appendChild( renderer.domElement );
  
  // Object
  
  var geometry = new THREE.BoxGeometry( 20, 20, 20 );
  
  for ( var i = 0; i < 200; i ++ ) {
  
    var color = new THREE.Color();
    color.setHSL( 0.55, 0.5, Math.random() * 0.5 + 0.5 );
    var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: color } ) );
  
    object.scale.x = Math.random() + 0.5;
    object.scale.y = (Math.random() + 0.5) * 6.0;
    object.scale.z = Math.random() + 0.5;
  
    object.position.x = Math.random() * 400 - 200;
    object.position.x += object.position.x > 0 ? 40 : -40;
    object.position.y = 10 * object.scale.y;
    object.position.z = Math.random() * 3000 - 2600;

    scene.add( object );
  
  }
  
  // GROUND
  
  var geometry = new THREE.PlaneBufferGeometry( 100, 100 );
  var planeMaterial = new THREE.MeshBasicMaterial( { color: 0x222222 } );
  planeMaterial.ambient = planeMaterial.color;

  var ground = new THREE.Mesh( geometry, planeMaterial );

  ground.position.set( 0, 0, 0 );
  ground.rotation.x = - Math.PI / 2;
  ground.scale.set( 100, 100, 100 );

  scene.add( ground );
  
  var render = function () {
  
    requestAnimationFrame(render);
  
    camera.position.set( startPosition.x + params.truckAmount, startPosition.y + params.pedestalAmount, startPosition.z + params.dollyAmount );
    camera.rotation.set( startRotation.x + params.tiltAmount, startRotation.y + params.panAmount, startRotation.z );
    camera.fov = startFov + params.zoomAmount;
  
    var left   = Math.floor( windowWidth  * 0.0 );
    var bottom = Math.floor( windowHeight * 0.5 );
    var width  = Math.floor( windowWidth  * 1.0 );
    var height = Math.floor( windowHeight * 0.5 );
    renderer.setViewport( left, bottom, width, height );
    renderer.setScissor( left, bottom, width, height );
    renderer.enableScissorTest ( true );
  
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  
    cameraHelper.update();
    cameraHelper.visible = false;
  
    renderer.render(scene, camera);
  
    cameraHelper.visible = true;
    for ( var ii = 0; ii < views.length; ++ii ) {
  
      view = views[ii];
      orthoCam = view.orthoCam;
  
      orthoCam.left = windowWidth / - 2;
      orthoCam.right = windowWidth / 2;    
      orthoCam.top = windowHeight / 2;
      orthoCam.bottom = windowHeight / - 2;
      orthoCam.position.x = view.eye[ 0 ];
      orthoCam.position.y = view.eye[ 1 ];
      orthoCam.position.z = view.eye[ 2 ];
      orthoCam.rotation.x = view.direction[ 0 ] * Math.PI * 0.5;
      orthoCam.rotation.y = view.direction[ 1 ] * Math.PI * 0.5;
      orthoCam.rotation.z = view.direction[ 2 ] * Math.PI * 0.5;
      orthoCam.updateProjectionMatrix();
  
      var left   = Math.floor( windowWidth  * view.left );
      var bottom = Math.floor( windowHeight * view.bottom );
      var width  = Math.floor( windowWidth  * view.width );
      var height = Math.floor( windowHeight * view.height );
      renderer.setViewport( left, bottom, width, height );
      renderer.setScissor( left, bottom, width, height );
      renderer.enableScissorTest ( true );
  
      renderer.render( scene, orthoCam );
    }
  
  };
  
  render();
  