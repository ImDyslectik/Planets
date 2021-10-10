import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
 
// Debug
const gui = new dat.GUI()
const objects = [];

//afbeelding textures en texture lader
const textureLoader = new THREE.TextureLoader()
const sunNormal = textureLoader.load('/Textures/2k_sun.jpg')
const earthNormal = textureLoader.load('/Textures/NormalMapEarthNight.png')
const cross = textureLoader.load('/Textures/cross.png')
const jupNormal = textureLoader.load('/Textures/NormalMapJupiter.png')
const marsNormal = textureLoader.load('/Textures/NormalMapMars.png')
const moonNormal = textureLoader.load('/Textures/NormalMap.png')


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();
{
  const color = 0xbea7b2;  
  const near = 1;
  const far = 100;
  scene.fog = new THREE.Fog(color, near, far);
}


//maakt galaxy aan
const galaxySun = new THREE.PointsMaterial({
    size:0.005,
})
const galaxymat = new THREE.PointsMaterial({
    size:0.005,
    map:cross,
    transparent:true,
    color: 'cyan',
})
const galaxymat2 = new THREE.PointsMaterial({
    size:0.003,
    map:cross,
    transparent:true,
    color: 'violet',
})

// objecten
const sunGeo = new THREE.SphereBufferGeometry(.3,32,32)
const earthGeo = new THREE.SphereBufferGeometry(.1,32,32)
const moonGeo = new THREE.SphereBufferGeometry(.02,32,32)
const jupiterGeo = new THREE.SphereBufferGeometry(.3,32,32)
const marsGeo = new THREE.SphereBufferGeometry(.1,32,32)


const galaxyGeo = new THREE.SphereBufferGeometry(3.5,64,32)
const galaxyGeo2 = new THREE.SphereBufferGeometry(3.5,64,32)

const galaxyParticles = new THREE.BufferGeometry;
const galaxyParticles2 = new THREE.BufferGeometry;
const galaxyMesh = new THREE.Points(galaxyParticles,galaxymat)
const galaxyMesh2 = new THREE.Points(galaxyParticles2,galaxymat2)
const particlesCount = 100000;
const posArray = new Float32Array(particlesCount * 3);
for(let i = 0; i<particlesCount *3; i++){
    posArray[i] = (Math.random() - 0.5) * (Math.random() * 5)
}
galaxyParticles.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
galaxyParticles2.setAttribute('position', new THREE.BufferAttribute(posArray, 3))


// Materials
const sunMat = new THREE.MeshPhysicalMaterial({color : 'orange'})
const earthMat = new THREE.MeshStandardMaterial({color : 0x49ef4})
const moonMat = new THREE.MeshStandardMaterial({color : 'grey'})
const jupiterMat = new THREE.MeshStandardMaterial({color : 'brown'})
const marsMat = new THREE.MeshStandardMaterial({color : 0xbea7b2})
//galaxy background
const galaxy = new THREE.Points(galaxyGeo,galaxySun)
const galaxy2 = new THREE.Points(galaxyGeo2,galaxySun)



// Mesh
const Sun = new THREE.Mesh(sunGeo,sunMat)
const Earth = new THREE.Mesh(earthGeo,earthMat)
const Moon = new THREE.Mesh(moonGeo,moonMat)
const Jupiter = new THREE.Mesh(jupiterGeo,jupiterMat)
const Mars = new THREE.Mesh(marsGeo,marsMat)

//posities en voegt de afbeelding toe
Earth.position.x = 0.5,Earth.position.y = 0.5,Earth.position.z = 0.5;
Moon.position.x = 0.1,Moon.position.y = 0.1;
Jupiter.position.x = 1.5,Jupiter.position.y = -1.5
Mars.position.x = -1,Mars.position.y = 1
sunMat.roughness = 1;
sunMat.metalness = 0.5;
sunMat.normalMap = sunNormal;
earthMat.normalMap = earthNormal;
moonMat.normalMap = moonNormal;
jupiterMat.normalMap = jupNormal;
marsMat.normalMap = marsNormal;

//inladen van objecten
const loader = new OBJLoader();
loader.load('Objects/rock.obj',
	function ( object ) {
       object.position.x = 20
       object.position.y = 10
       object.scale.multiplyScalar(1/2)
       scene.add( object );
        render();
	},
    //laadbalk voor de console
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	function ( error ) {
		console.log( 'dit is niet goed' );
	}
);


//toevoegen aan scene 
scene.add(Sun)
scene.add(galaxy,galaxyMesh)
scene.add(galaxy2,galaxyMesh2)
Sun.add(Earth)
Sun.add(Jupiter)
Sun.add(Mars)
Earth.add(Moon)

//voegt alles objecten toe aan de lijst objects aangezien ik dan makkelijk de x y en z as kan zien
// objects.push(Earth)
// objects.push(Sun)
// objects.push(Moon)
// objects.push(Jupiter)
// objects.push(Mars)
// objects.forEach((node) => {
//     const axes = new THREE.AxesHelper();
//     axes.material.depthTest = false;
//     axes.renderOrder = 1;
//     node.add(axes);
//   });

//maakt mapjes aan voor de lichten om te debuggen en aan te passen voordat ik het hard code
const light1 = gui.addFolder('Light 1')
const light2 = gui.addFolder('Light 2')

const pointLight = new THREE.PointLight(0xff0000, 1,10)
pointLight.position.set(0,-5,0.5,1)
const pointLight2 = new THREE.PointLight(0xffffff, 1,21)
pointLight2.position.set(0,0,0,1.5)
//debug light dingen
light1.add(pointLight.position,'y').min(-5).max(5).step(0.01),light1.add(pointLight.position,'x').min(-5).max(5).step(0.01);
light1.add(pointLight.position,'z').min(-5).max(5).step(0.01),light1.add(pointLight,'intensity').min(0).max(10).step(0.01);
light2.add(pointLight2.position,'y').min(-5).max(5).step(0.01),light2.add(pointLight2.position,'x').min(-5).max(5).step(0.01);
light2.add(pointLight2.position,'z').min(-5).max(5).step(0.01),light2.add(pointLight2,'intensity').min(0).max(10).step(0.01);

const pojntlighthelper = new THREE.PointLightHelper(pointLight, 1)
scene.add(pojntlighthelper)
const pojntlighthelper2 = new THREE.PointLightHelper(pointLight2, 1)
scene.add(pojntlighthelper2)
//^^ is voor debuggen zodat ik wist dat het licht punt in de zon zat inplaats van erbuiten 

//maakt de ligchtbronnen aan
scene.add(pointLight)
scene.add(pointLight2)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// window.addEventListener('resize', () =>
// {
//     sizes.width = window.innerWidth
//     sizes.height = window.innerHeight
//     camera.aspect = sizes.width / sizes.height
//     camera.updateProjectionMatrix()
//     renderer.setSize(sizes.width, sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// })

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.05

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias:true,
    precision:true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#000000'),1)
document.addEventListener('mousemove', animteGalaxy)
let mouseY = 0
let mouseX = 0

function animteGalaxy(event){
    mouseX = event.clientX
    mouseY = event.clientY
}
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    Sun.rotation.z = .2 * elapsedTime
    Earth.rotation.x = 0.5 * elapsedTime
    Moon.rotation.x = 1 * elapsedTime
    Jupiter.rotation.y = -0.2 * elapsedTime
    Mars.rotation.y = 1 * elapsedTime
    galaxyMesh.rotation.y =  mouseX * (elapsedTime * 0.00004)
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()
