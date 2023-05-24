// Import Three.js and dat.GUI libraries
import * as THREE from 'three';
import * as dat from 'dat.gui';

// Create a Three.js scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a cube and add it to the scene
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Create orbit controls and fly controls
const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
const flyControls = new THREE.FlyControls(camera, renderer.domElement);

// Create a dat.GUI instance and add controls for switching between orbit and fly controls
const gui = new dat.GUI();
const controls = {
  orbit: function() {
    orbitControls.enabled = true;
    flyControls.enabled = false;
  },
  fly: function() {
    orbitControls.enabled = false;
    flyControls.enabled = true;
  }
};
gui.add(controls, 'orbit');
gui.add(controls, 'fly');

// Set the initial camera position and update the controls
camera.position.z = 5;
orbitControls.update();
flyControls.update();

// Create an animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Update the controls
  orbitControls.update();
  flyControls.update();

  // Render the scene
  renderer.render(scene, camera);
}
animate();
