<template>
  <div>
    <div id="container"></div>
    <div class="theButton">
      <base-button
        type="info"
        @click="toPagePhoto"
        style="margin-right: 17px; font-size: 17px"
        >返回上级</base-button
      >
      <base-button type="info" @click="download" style="font-size: 17px"
        >保存模型</base-button
      >
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { Loading } from "element-ui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import BaseButton from "../components/BaseButton.vue";
import { Doughnut } from "vue-chartjs";
import Swal from 'sweetalert2';

export default {
  components: { BaseButton },
  data() {
    return {
      mesh: null,
      camera: null,
      scene: null,
      renderer: null,
      controls: null,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      let loading = null;
      loading = Loading.service({
        lock: true,
        text: "模型加载中",
        background: "rgba(40,44,52,.7)",
        target: document.getElementById("container"),
      });

      this.createScene(); // 创建场景
      this.loadOBJ(); // 加载OBJ模型
      this.createLight(); // 创建光源
      this.createCamera(); // 创建相机
      this.createRender(); // 创建渲染器
      this.createControls(); // 创建控件对象
      setTimeout(() => {
        loading.close();
      }, 10000);
      this.render(); // 渲染
    },
    // 创建场景
    createScene() {
      this.scene = new THREE.Scene();
    },
    // test mid
    setModelPosition(obj) {
      const boxHelper = new THREE.BoxHelper(obj);
      boxHelper.geometry.computeBoundingBox();
      const box = boxHelper.geometry.boundingBox;
      const maxDiameter = Math.max(
        box.max.x - box.min.x,
        box.max.y - box.min.y,
        box.max.z - box.min.z
      );
      const scaleValue = this.camera.position.z / maxDiameter;
      obj.scale.set(scaleValue, scaleValue, scaleValue);
    },

    // 加载OBJ模型
    loadOBJ() {
      const loader = new OBJLoader();
      const mtlLoader = new MTLLoader();

      mtlLoader.load("staic/objs/Adam.mtl", (material) => {
        material.preload();
        loader.setMaterials(material);
        loader.load("static/objs/Adam.obj", (model) => {
          this.setModelPosition(model);
          model.rotation.x = THREE.Math.degToRad(90);
          model.children[0].geometry.center();
          this.scene.add(model);
        });
      });
    },
    openFullScreen1() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 2000);
    },
    // 创建光源
    createLight() {
      //平行光
      var pointColor = "#FFFFFF";
      var directionalLight = new THREE.DirectionalLight(pointColor);
      directionalLight.position.set(-40, 60, -10);
      directionalLight.castShadow = true;
      directionalLight.distance = 0;
      directionalLight.intensity = 1.5; // 光强度，默认为1
      directionalLight.shadowMapHeight = 1024; // 阴影图尺寸
      directionalLight.shadowMapWidth = 1024;
      this.scene.add(directionalLight);
      ///
      var directionalLight1 = new THREE.DirectionalLight(pointColor);
      directionalLight1.position.set(40, -60, 10);
      directionalLight1.castShadow = true;
      directionalLight1.distance = 0;
      directionalLight1.intensity = 1.5; // 光强度，默认为1
      directionalLight1.shadowMapHeight = 1024; // 阴影图尺寸
      directionalLight1.shadowMapWidth = 1024;
      this.scene.add(directionalLight1);
    },
    // 创建相机
    createCamera() {
      const element = document.getElementById("container");
      const width = element.clientWidth; // 窗口宽度
      const height = element.clientHeight; // 窗口高度
      const k = width / height; // 窗口宽高比
      this.camera = new THREE.PerspectiveCamera(50, k, 1, 1000);
      this.camera.position.set(-400, 200, -400); // 设置相机位置
      this.scene.add(this.camera);
    },
    // 创建渲染器
    createRender() {
      const element = document.getElementById("container");
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(element.clientWidth, element.clientHeight); // 设置渲染区域尺寸
      this.renderer.shadowMap.enabled = true; // 显示阴影
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      element.appendChild(this.renderer.domElement);
    },
    //渲染
    render() {
      if (this.mesh) {
        this.mesh.rotation.z += 0.006;
      }
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.render);
    },

    // 创建控件对象
    createControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    },
    toPagePhoto() {
      this.$router.push("/photo");
    },
    download() {
      var a = document.createElement("a"); //创建一个<a></a>标签
      a.href = "/static/objs/CHEN_WU_XIAN.obj"; // 给a标签的href属性值加上地址，注意，这里是绝对路径，不用加 点.
      a.download = "model.obj"; //设置下载文件文件名，这里加上.xlsx指定文件类型，pdf文件就指定.fpd即可
      a.style.display = "none"; // 障眼法藏起来a标签
      document.body.appendChild(a); // 将a标签追加到文档对象中
      a.click(); // 模拟点击了a标签，会触发a标签的href的读取，浏览器就会自动下载了
      a.remove(); // 一次性的，用完就删除a标签
       Swal.fire({
         title:"模型保存成功",
         icon:"success",
          confirmButtonColor: "#237ff7",
       })
    },
  },
};
</script>
<style>
#container {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #1a395fbf;
  background-image: linear-gradient(0deg, #08182b 0%, #373f53 100%);
}
.theButton {
  position: absolute;
  bottom: 25px;
  left: 40%;
}
</style>
