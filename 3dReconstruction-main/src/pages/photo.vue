<template>
  <div>
    <div class="card1 col-12">
      <card>
        <div class="row col-12" style="padding-top: 5px">
          <p class="ml-3" style="font-size: 19px">窗位:</p>
          <div class="col-4">
            <slider
              vertical
              class="mt-3"
              type="info"
              value="number"
              :options="{ step: 1 }"
              v-model="tmpvalue1"
              :range="{ min: 0, max: 1000 }"
            ></slider>

            <div class="mt-3">{{ sliderValue1 }}</div>
          </div>
          <p style="margin-left: 29px; font-size: 19px">窗宽:</p>
          <div class="col-4">
            <slider
              class="mt-3"
              type="info"
              value="number"
              :options="{ step: 1 }"
              v-model="tmpvalue2"
              :range="{ min: 0, max: 1000 }"
            ></slider>

            <div class="mt-3">{{ sliderValue2 }}</div>
          </div>
          <div>
            <base-button
              type="info"
              class="animation-on-hover"
              @click.prevent="reBuild"
              style="width: 90px; height: 35px"
              ><h4
                style="
                  margin-top: 10px;
                  writing-mode: vertical-lr;
                  color: #fffffb;
                  justify-content: center;
                "
              >
                重设
              </h4></base-button
            >
            <base-button
              type="info"
              class="animation-on-hover ml-3"
              @click="submit"
              style="width: 90px; height: 35px"
              ><h4
                style="
                  margin-top: 10px;
                  writing-mode: vertical-lr;
                  color: #fffffb;
                  justify-content: center;
                "
              >
                生成
              </h4></base-button
            >
                <!-- <base-button
              type="info"
              class="animation-on-hover ml-3"
              @click="generate"
              style="width: 90px; height: 35px"
              ><h4
                style="
                  margin-top: 10px;
                  writing-mode: vertical-lr;
                  color: #fffffb;
                  justify-content: center;
                "
              >
                生成模型
              </h4></base-button
            > -->
          </div>
        </div>
      </card>
    </div>
    <div class="card2">
      <div class="row">
        <card class="photo ml-5">
          <img v-bind:src="pathOrigin" />
          <p class="card-text" style="font-size: 20px; text-align: center">
            原图
          </p>
        </card>
        <card class="photo ml-3">
          <img v-bind:src="pathAfter" />
          <p class="card-text" style="font-size: 20px; text-align: center">
            窗位处理效果
          </p>
        </card>
      </div>
    </div>
    <div class="photoSlider">
      <slider
        class="mt-3"
        type="info"
        value="number"
        :options="{ step: 1 }"
        v-model="photoSliderValue"
        :range="{ min: this.photoSliderMin, max: this.photoSliderMax }"
      >
      </slider>
      <div class="photoword mt-3">
        <h3>当前为第{{ SliderValue3 }}张图片</h3>
      </div>
    </div>
  </div>
</template>

<script>
import request from "../util/request";
import BaseButton from "../components/BaseButton.vue";
import Slider from "../components/Slider.vue";
import Swal from "sweetalert2";
export default {
  components: {
    BaseButton,
    Slider,
  },
  data() {
    return {
      requestBody: {},
      modelState: false,
      photoNum: "",
      photoPath: "",
      window_level: "",
      window_width: "",
      tmpvalue1: "280",
      tmpvalue2: "400",
      photoSliderValue: 1,
      photoSliderMax: 2,
      photoSliderMin: 1,
      folderName: "",
      testNumber: 123,
    };
  },
  computed: {
    sliderValue1() {
      let ans = Math.trunc(this.tmpvalue1);
      return ans;
    },
    sliderValue2() {
      let ans = Math.trunc(this.tmpvalue2);
      return ans;
    },
    pathOrigin() {
      const thepath =
        "/static/jpgs/" +
        this.folderName +
        "/origin_" +
        this.SliderValue3 +
        ".jpg";
      return thepath;
    },
    pathAfter() {
      const thepath =
        "/static/jpgs/" +
        this.folderName +
        "/after_" +
        this.SliderValue3 +
        ".jpg";

      return thepath;
    },
    SliderValue3() {
      let ans = Math.trunc(this.photoSliderValue);
      return ans;
    },
  },
  methods: {
    submit() {
      this.requestBody.window_level = this.sliderValue1;
      this.requestBody.window_width = this.sliderValue2;
      this.requestBody.offset = 0;
      (this.requestBody.folderName = sessionStorage.getItem("folderName")),
        (this.requestBody.dicom_folder =
          sessionStorage.getItem("dicom_folder"));
      console.log(this.requestBody);
      let timerInterval;
      Swal.fire({
        title: "模型生成中",
        timer: 70000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
        willClose: () => {
          Swal.fire({
            title: "生成模型成功，是否查看模型",
            icon: "success",
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            confirmButtonColor: "#237ff7",
            cancelButtonColor: "#d33",
          }).then((res) => {
            if (res.isConfirmed) {
              this.$router.push("model");
            } else {
            }
          });
          clearInterval(timerInterval);
        },
      });
      request
        .post("http://localhost:5000/confirm", this.requestBody)
        .then((res) => {
          sessionStorage.setItem("objName", res.obj_name);
          sessionStorage.setItem("size", res.size);
          sessionStorage.setItem("savePath", res.savePath);
          console.log(res);
          this.modelState = true;
        });
    },
    reBuild() {
      sessionStorage.setItem("window_level", this.sliderValue1);
      sessionStorage.setItem("window_width", this.sliderValue2);
      let body = {
        window_level: this.sliderValue1,
        window_width: this.sliderValue2,
        dicom_folder: sessionStorage.getItem("dicom_folder"),
        folderName: sessionStorage.getItem("folderName"),
      };
      request.post("http://localhost:5000/reset", body).then((res) => {
        console.log(res);
        Swal.fire({
          title: "重设成功",
          icon: "success",
          showConfirmButton: true,
          confirmButtonText: "确定",
          confirmButtonColor: "#237ff7",
        });
      });
    },
    generate(){
       request.post("http://localhost:5000/generateModel", body).then
    }
    // routerToModel() {
    //   if (this.modelState) {
    //     this.$router.push("model");
    //   } else {
    //     Swal.fire({
    //       title: "模型尚未正常生成",
    //       icon: "error",
    //     });
    //   }
    // },
  },
  created() {
    this.photoNum = sessionStorage.getItem("photoNum");
    this.folderName = sessionStorage.getItem("folderName");
    this.photoSliderMax = parseInt(this.photoNum);
    this.tmpvalue1 = sessionStorage.getItem("window_level");
    this.tmpvalue2 = sessionStorage.getItem("window_width");
    // this.sliderValue1 = sessionStorage.getItem("window_level");
    // this.sliderValue2 = sessionStorage.getItem("window_width");

  },
  mounted() {
  },
};
</script>

<style>
.card1 {
  margin: auto;
  margin-top: 60px;
  width: 1070px;
}
.card2 {
  margin: 0 auto;
  width: 1100px;
}
.photo {
  height: 550px;
  width: 512px;
  border-radius: 14px;
}
.card-body {
  padding: 5px;
  border-radius: 3px;
}
.photoSlider {
  width: 1000px;
  margin: 0 auto;
}
.photoword {
  text-align: center;
}
.card {
  border-radius: 14px;
  background: rgba(235, 238, 241, 0.01);
  border-radius: 15px;
}
</style>
