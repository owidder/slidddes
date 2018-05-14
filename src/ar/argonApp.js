import {Argon} from './argonHelper';
import * as hudUtil from './hudUtil';
import {slidarGlobal} from '../slides/slidAR/slidarGlobal';

export const init = () => {
    const THREE = slidarGlobal.THREE;

    const app = Argon.init();
    app.view.element.style.zIndex = 0;

    const renderer = new THREE.CSS3DArgonRenderer();
    const hud = new THREE.CSS3DArgonHUD();

    app.view.element.appendChild(renderer.domElement);
    app.view.element.appendChild(hud.domElement);

    const camera = new THREE.PerspectiveCamera();
    const scene = new THREE.Scene();

    const root = new THREE.Object3D();
    const userLocation = new THREE.Object3D();
    userLocation.add(root);

    scene.add(userLocation);
    scene.add(camera);

    app.context.setDefaultReferenceFrame(app.context.localOriginEastUpSouth);

    app.renderEvent.addEventListener(() => {
        const viewport = app.view.getViewport();
        const subViews = app.view.getSubviews();
        window.requestAnimationFrame(() => {
            renderFunc(app, viewport, subViews, hud, camera, renderer, scene);
        });
    });

    hudUtil.init("#_hud", hud);

    return {root, app};
}

const setViewPort = (subview, renderer, hud, i) => {
    const x = subview.viewport.x;
    const y = subview.viewport.y;
    const width = subview.viewport.width;
    const height = subview.viewport.height;

    renderer.setViewport(x, y, width, height, i);
    hud.setViewport(x, y, width, height, i);
}

const renderFunc = (app, viewport, subViews, hud, camera, renderer, scene) => {
    const THREE = slidarGlobal.THREE;

    renderer.setSize(viewport.width, viewport.height);
    hud.setSize(viewport.width, viewport.height);

    if (subViews.length > 1 || !app.focus.hasFocus) {
        hud.domElement.style.display = 'none';
    } else {
        hud.domElement.style.display = 'block';
    }

    for (let _i = 0; _i < subViews.length; _i++) {
        const subview = subViews[_i];
        const frustum = subview.frustum;

        camera.position.copy(subview.pose.position);
        camera.quaternion.copy(subview.pose.orientation);
        camera.projectionMatrix.fromArray(subview.frustum.projectionMatrix);
        camera.fov = THREE.Math.radToDeg(frustum.fovy);

        setViewPort(subview, renderer, hud, _i);

        renderer.render(scene, camera, _i);
        hud.render(_i);
    }
}
