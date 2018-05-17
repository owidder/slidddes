import {slidarGlobal} from '../slides/slidAR/slidarGlobal';

const animate = (controls) => {
    requestAnimationFrame(() => {animate(controls)});
    controls.update();
}

export const initThree = (containerSelector) => {
    const THREE = slidarGlobal.THREE;
    const width = slidarGlobal.width;
    const height = slidarGlobal.height;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, .1, 100000);
    camera.position.z = 3000;

    const renderer = new THREE.CSS3DRenderer();
    renderer.setSize(width, height);
    renderer.domElement.style.position = 'absolute';
    document.querySelector(containerSelector).appendChild(renderer.domElement)

    const controls = new THREE.TrackballControls(camera, renderer.domElement)
    controls.addEventListener('change', () => {
        renderer.render(scene, camera)
    });
    animate(controls);

    return {scene, camera, renderer}
}

