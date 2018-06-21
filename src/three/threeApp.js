import {slidarGlobal} from '../slides/slidddes/slidarGlobal';

const animate = (controls, render) => {
    const TWEEN = slidarGlobal.TWEEN;

    requestAnimationFrame(() => {animate(controls, render)});
    controls.update();
    TWEEN.update();
    render();
}

export const initThree = (containerSelector) => {
    const THREE = slidarGlobal.THREE;
    const width = slidarGlobal.width;
    const height = slidarGlobal.height;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, .1, 100000);
    scene.add(camera);

    const renderer = new THREE.CSS3DRenderer();
    renderer.setSize(width, height);
    renderer.domElement.style.position = 'absolute';
    document.querySelector(containerSelector).appendChild(renderer.domElement)

    const controls = new THREE.TrackballControls(camera, renderer.domElement)
    controls.noRotate = true;
    controls.addEventListener('change', () => {
        renderer.render(scene, camera)
    });
    animate(controls, () => {
        renderer.render(scene, camera);
    });

    return {scene, camera, renderer, controls}
}

