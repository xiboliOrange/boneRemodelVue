<template>
  <div>
    <card class="uploadcard">
      <div class="cardtop">
        <Upload
          action="http://127.0.0.1:5000/load"
          accept=".zip , .tar"
          :before-upload="beforeUploadFile"
          :on-success="handleSuccess"
          :on-error="handleerror"
          :limit="1"
        >
          <base-button size="lg" type="info" class="mb-3">
            <i class="tim-icons icon-cloud-upload-94"></i>导入</base-button
          >
          <!-- 这里放提示语 -->
          <h5>请上传.zip与.tar的文件，文件大小不超过500MB</h5>
        </Upload>
      </div>
    </card>
  </div>
</template>

<script>
import { Upload } from "element-ui";
import BaseButton from "../components/BaseButton.vue";
import swal from "sweetalert2";
import Card from "../components/Cards/Card.vue";
export default {
  components: {
    Upload,
    BaseButton,
    Card,
  },
  methods: {
    handleSuccess(res, file, fileList) {
      sessionStorage.setItem("photoNum", res.num);
      sessionStorage.setItem("folderName", res.folder_name);
      sessionStorage.setItem("dicom_folder", res.dicom_folder);
      sessionStorage.setItem("window_level", res.window_level);
      sessionStorage.setItem("window_width", res.window_width);
      swal
        .fire({
          title: "文件上传成功",
          icon: "success",
          confirmButtonColor: "#237ff7",
          confirmButtonText: "确定",
        })
        .then((res) => {
          if (res.isConfirmed) {
            this.$router.push("photo");
          }
        });
    },
    handleerror(res, file, fileList) {
      swal.fire({
        title: "文件上传失败",
        icon: "error",
        confirmButtonColor: "#237ff7",
        confirmButtonText: "确定",
      });
    },

    beforeUploadFile(file) {
      //限制文件类型
      const isRightType =
        file.name.endsWith(".zip") || file.name.endsWith("tar");

      //限制文件大小
      const isLt2M = file.size / 1024 / 1024 < 500;

      //错误提示
      if (!isRightType) {
        swal.fire({
          title: "文件类型错误",
          text: "只支持.zip和.tar类型文件",
          icon: "error",
          confirmButtonText: "取消  ",
          confirmButtonColor: "#237ff7",
        });
      }
      if (!isLt2M) {
        swal.fire({
          title: "文件大小过大",
          text: "只支持500MB以内的",
          icon: "error",
          confirmButtonText: "确定",
          confirmButtonColor: "#237ff7",
        });
      }
      return isRightType && isLt2M;
    },
  },
  mounted() {},
};
</script>

<style>
.uploadcard {
  background: rgba(235, 238, 241, 0.1);
  border-radius: 15px;
  box-sizing: border-box;
  width: 500px;
  height: 280px;
  text-align: center;
  position: relative;
  margin: 320px auto;
}
.cardtop {
  margin-top: 80px;
}
</style>
