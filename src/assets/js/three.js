import * as THREE from 'three';
/* eslint-disable import/extensions, import/no-unresolved */
import { TrackballControls } from 'three/trackballControls';
import { OrbitControls } from 'three/orbitControls';
/* eslint-enable */

THREE.TrackballControls = TrackballControls;
THREE.OrbitControls = OrbitControls;

const customThree = {
  // scene
  createScene(...objects) {
    const scene = new THREE.Scene();
    const objectLength = objects.length;
    if (objects.length > 0) {
      for (let objIndex = 0; objIndex < objectLength; objIndex += 1) {
        scene.add(objects[objIndex]);
      }
    }
    scene.add(this.createGridHelper(300, 10, 0x8800FF));
    scene.add(this.createAxesHelper(300));
    return scene;
  },
  // renderer
  createWebGLRenderer(params) {
    return new THREE.WebGLRenderer(params);
  },
  // camera
  createPerspectiveCamera(fov = 50, aspectRatio = 1, near = 0.1, far = 2000) {
    return new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
  },
  // light
  createDirectionalLight(color = 0xffffff, intensity = 1) {
    return new THREE.DirectionalLight(color, intensity);
  },
  createPointLight(color = 0xFFFFFF, intensity = 1, distance = 0, decay = 1) {
    return new THREE.PointLight(color, intensity, distance, decay);
  },
  // geometry
  createPlaneGeometry(width = 1, height = 1, widthSegaments = 1, heightSegments = 1) {
    return new THREE.PlaneGeometry(width, height, widthSegaments, heightSegments);
  },
  createBoxGeometry(width = 1, height = 1, depth = 1) {
    return new THREE.BoxGeometry(width, height, depth);
  },
  createSphereGeometory(radius = 1, widthSegments = 8, heightSegments = 6) {
    return new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  },
  // material
  createMeshStandardMaterial() {
    const material = new THREE.MeshStandardMaterial();
    return material;
  },
  // mesh
  createMeshObj(geometry, material) {
    return new THREE.Mesh(geometry, material);
  },
  // object
  createPlane(width = 1, height = 1, widthSegaments = 1, heightSegments = 1) {
    const planeGeometry = this.createPlaneGeometry(width, height, widthSegaments, heightSegments);
    const meshStandardMaterial = this.createMeshStandardMaterial();
    return this.createMeshObj(planeGeometry, meshStandardMaterial);
  },
  createCube(width = 1, height = 1, depth = 1) {
    const boxGeometry = this.createBoxGeometry(width, height, depth);
    const meshStandardMaterial = this.createMeshStandardMaterial();
    return this.createMeshObj(boxGeometry, meshStandardMaterial);
  },
  createBall({
    radius = 1, widthSegments = 100, heightSegments = 100, color = 0xFFFFFF,
  }) {
    const ballGeometry = this.createSphereGeometory(radius, widthSegments, heightSegments);
    const meshStandardMaterial = this.createMeshStandardMaterial();
    meshStandardMaterial.setValues({ color });
    return this.createMeshObj(ballGeometry, meshStandardMaterial);
  },
  createRoom(width = 1, height = 1, depth = 1) {
    // 地面を作成
    const groundMesh = this.createPlane(width, depth);
    this.setPosition(groundMesh, { y: 0 });
    this.setRotation(groundMesh, { x: Math.PI / -2 });
    groundMesh.material.color = new THREE.Color(0x886622);
    // 天井を作成
    const ceilingMesh = this.createPlane(width, depth);
    this.setPosition(ceilingMesh, { y: height });
    this.setRotation(ceilingMesh, { x: Math.PI / -2 });
    ceilingMesh.material.color = new THREE.Color(0x2211FF);
    // 正面の壁を作成
    const frontWallMesh = this.createPlane(width, height);
    this.setPosition(frontWallMesh, { y: height / 2, z: depth / -2 });
    frontWallMesh.material.color = new THREE.Color(0x221111);
    // 背後の壁を作成
    const backWallMesh = this.createPlane(width, height);
    this.setPosition(backWallMesh, { y: height / 2, z: depth / 2 });
    this.setPosition(backWallMesh, { z: depth / 2 });
    backWallMesh.material.color = new THREE.Color(0x2211FF);
    // 左の壁を作成
    const leftWallMesh = this.createPlane(depth, height);
    this.setPosition(leftWallMesh, { x: width / -2, y: height / 2 });
    this.setRotation(leftWallMesh, { y: Math.PI / 2 });
    leftWallMesh.material.color = new THREE.Color(0x221111);
    // 右の壁を作成
    const rightWallMesh = this.createPlane(depth, height);
    this.setPosition(rightWallMesh, { x: width / 2, y: height / 2 });
    this.setRotation(rightWallMesh, { y: Math.PI / -2 });
    rightWallMesh.material.color = new THREE.Color(0x221111);
    // グループ化
    const roomGroup = new THREE.Group();
    roomGroup.add(
      groundMesh,
      ceilingMesh,
      frontWallMesh,
      backWallMesh,
      leftWallMesh,
      rightWallMesh,
    );
    return roomGroup;
    // TODO: 1つのgeometryにしても、それぞれ任意の面を任意のカラーにする方法を模索する
    // const roomGeometry = new THREE.Geometry();
    // const meshItems = [
    //   groundMesh,
    //   ceilingMesh,
    //   frontWallMesh,
    //   backWallMesh,
    //   leftWallMesh,
    //   rightWallMesh,
    // ];
    // for (let meshItemIndex = 0; meshItemIndex < meshItems.length; meshItemIndex += 1) {
    //   roomGeometry.mergeMesh(meshItems[meshItemIndex]);
    // }
    // const meshStandardMaterial = this.createMeshStandardMaterial();
    // const room = this.createMeshObj(roomGeometry, meshStandardMaterial);
    // room.material.color = new THREE.Color(0xFF0000);
    // return room;
  },
  // createHelpers
  createCameraHelper(camera) {
    return new THREE.CameraHelper(camera);
  },
  createDirectionalRightHelper(light, size = 1) {
    return new THREE.DirectionalLightHelper(light, size);
  },
  createPointLightHelper(light, sphereSize = 1) {
    return new THREE.PointLightHelper(light, sphereSize);
  },
  createAxesHelper(size) {
    return new THREE.AxesHelper(size);
  },
  createGridHelper(size = 10, divisions = 10, colorCenterLine = 0x444444, colorGrid = 0x888888) {
    return new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid);
  },
  // controls
  createTrackballControls(camera, domElement) {
    return new THREE.TrackballControls(camera, domElement);
  },
  createOrbitControls(camera, domElement) {
    return new THREE.OrbitControls(camera, domElement);
  },
  // methods
  setPosition(obj, { x = null, y = null, z = null }) {
    obj.position.set(x || obj.position.x, y || obj.position.y, z || obj.position.z);
  },
  setRotation(obj, { x = null, y = null, z = null }) {
    obj.rotation.set(x || obj.rotation.x, y || obj.rotation.y, z || obj.rotation.z);
  },
};

export {
  THREE,
  customThree,
};
