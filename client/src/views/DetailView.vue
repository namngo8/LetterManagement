<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      letter: {
        id: '',
        gov_agency: '',
        letter_no: '',
        source: '',
        receive_at: '',
        sender_type: '',
        sender: {
          quantity: 1,
          owner: '',
          organ: '',
          position: '',
          Id_card: '',
          Id_card_created_at: null,
          Id_card_created_in: '',
          gender: '',
          ethnic: '',
          nationality: '',
          address: {
            province: '',
            district: '',
            commune: '',
            specified_address: '',
          },
        },
        is_eligible: false,
        times_case: '',
        pre_status: '',
        status: '',
      },
      cases: {
        type: 1,
        field: '',
        content: '',
      },
      files: [],
    }
  },
  methods: {
    async getLetter() {
      try {
        const response = await axios.get('http://localhost:3000/letter/getLetterById', {
          params: { id: this.$route.params.id },
        })

        if (response.data.letter.file.length > 0) {
          response.data.letter.file.forEach((f) => {
            this.files.push(new File([], f.filename, { type: f.contentType }))
            console.log(this.files)
          })
        }

        this.letter.id = response.data.letter._id
        this.letter.gov_agency = response.data.letter.gov_agency
        this.letter.letter_no = response.data.letter.letter_no
        this.letter.source = response.data.letter.source == 1 ? 'Bưu điện' : 'Khác'
        this.letter.receive_at = this.formattedDate(response.data.letter.receive_at)
        this.letter.sender_type = response.data.letter.sender_type
        this.letter.sender.quantity = response.data.letter.sender[0].quantity
        this.letter.sender.owner = response.data.letter.sender[0].owner
        this.letter.sender.organ = response.data.letter.sender[0].organ
        this.letter.sender.position = response.data.letter.sender[0].position
        this.letter.sender.Id_card = response.data.letter.sender[0].Id_card
        this.letter.sender.Id_card_created_at = this.formattedDate(
          response.data.letter.sender[0].Id_card_created_at,
        )
        this.letter.sender.Id_card_created_in = response.data.letter.sender[0].Id_card_created_in
        this.letter.sender.gender = response.data.letter.sender[0].gender == 1 ? 'Nam' : 'Nữ'
        this.letter.sender.ethnic = response.data.letter.sender[0].ethnic == 1 ? 'Kinh' : ''
        this.letter.sender.nationality = 'Việt Nam'
        this.letter.sender.address.province = response.data.province
        this.letter.sender.address.district = response.data.district
        this.letter.sender.address.commune = response.data.commune
        this.letter.sender.address.specified_address =
          response.data.letter.sender[0].address[0].specified_address
        this.letter.is_eligible = response.data.letter.is_eligible
        this.letter.status = response.data.letter.status
        this.letter.times_case =
          response.data.letter.times_case == 1 ? 'Tiếp nhận lần đầu' : 'Tiếp nhận nhiều lần'
        if (response.data.ltcase.case_type == 1) {
          this.cases.type = 'Khiếu nại'
        } else if (response.data.ltcase.case_type == 2) {
          this.cases.type = 'Tố cáo'
        } else if (response.data.ltcase.case_type == 3) {
          this.cases.type = 'Tranh chấp'
        } else if (response.data.ltcase.case_type == 4) {
          this.cases.type = 'Kiến nghị, phản ánh'
        }

        if (response.data.ltcase.field == 1) {
          this.cases.field = 'Lĩnh vực khiếu nại A'
        } else if (response.data.ltcase.field == 2) {
          this.cases.field = 'Lĩnh vực khiếu nại B'
        } else if (response.data.ltcase.field == 3) {
          this.cases.field = 'Lĩnh vực tố cáo A'
        } else if (response.data.ltcase.field == 4) {
          this.cases.field = 'Lĩnh vực tố cáo B'
        } else if (response.data.ltcase.field == 5) {
          this.cases.field = 'Lĩnh vực tranh chấp A'
        } else if (response.data.ltcase.field == 6) {
          this.cases.field = 'Lĩnh vực tranh chấp B'
        } else if (response.data.ltcase.field == 7) {
          this.cases.field = 'Lĩnh vực kiến nghị A'
        } else if (response.data.ltcase.field == 8) {
          this.cases.field = 'Lĩnh vực kiến nghị B'
        }

        if (response.data.letter.pre_status == 1) {
          this.letter.pre_status = 'Chưa giải quyết xong'
        } else if (response.data.letter.pre_status == 2) {
          this.letter.pre_status = 'Đã được giải quyết'
        } else if (response.data.letter.pre_status == 3) {
          this.letter.pre_status = 'Đã giải quyết lần đầu'
        } else if (response.data.letter.pre_status == 4) {
          this.letter.pre_status = 'Đã giải quyết nhiều lần'
        } else if (response.data.letter.pre_status == 5) {
          this.letter.pre_status = 'Đã có bản án của TAND'
        } else if (response.data.letter.pre_status == 6) {
          this.letter.pre_status = 'Tố cáo tiếp - Quá thời hạn giải quyết'
        }
        this.cases.content = response.data.ltcase.content
      } catch (error) {
        console.log(error)
      }
    },
    async updateLtStatus(id) {
      try {
        Swal.fire({
          title: 'Gửi xử lý?',
          text: 'Bạn có muốn gửi xử lý đơn thư?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Không đồng ý!',
          confirmButtonText: 'Đồng ý!',
        }).then(async (result) => {
          if (result.isConfirmed) {
            const response = await axios.get('http://localhost:3000/letter/updateLtStatus', {
              params: {
                id: id,
                status: 2,
              },
            })
            if (response.status == 200) {
              this.getLetter()
              Swal.fire({
                title: 'Đã gửi!',
                text: 'Đơn thư đã được gửi xử lý.',
                icon: 'success',
              })
            }
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    handleBack() {
      this.$router.push('/')
    },
    formattedDate(element) {
      const date = new Date(element)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    },
    truncateFileName(fileName) {
      const maxLength = 20
      const extension = fileName.substring(fileName.lastIndexOf('.'))
      const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'))

      if (fileName.length > maxLength) {
        const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 3)
        return `${truncatedName}...${extension}`
      }
      return fileName
    },
    async handleDelete(id) {
      try {
        Swal.fire({
          title: 'Xóa?',
          text: 'Bạn sẽ không thể khôi phục lại dữ liệu!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Không đồng ý!',
          confirmButtonText: 'Đồng ý!',
        }).then(async (result) => {
          if (result.isConfirmed) {
            const response = await axios.get('http://localhost:3000/letter/deleteLetter', {
              params: {
                id: id,
              },
            })
            if (response.status == 200) {
              Swal.fire({
                title: 'Đã xóa!',
                text: 'Đơn thư đã được xóa.',
                icon: 'success',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.$router.push('/')
                }
              })
            }
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
  },
  created() {
    this.getLetter()
  },
}
</script>

<template>
  <div class="page-container">
    <div class="div-content">
      <div class="col-md-5">
        <p>
          Khiếu nại tố cáo / <router-link class="link" to="/">Danh sách đơn thư</router-link> /
          <router-link class="link">Chi tiết đơn thư</router-link>
        </p>
      </div>
      <div class="col-md-7 btn-group">
        <button
          v-if="letter.status == 1"
          class="btn-element btn-send"
          @click="
            () => {
              updateLtStatus(letter.id)
            }
          "
        >
          Gửi xử lý
        </button>
        <RouterLink
          v-if="letter.status == 1"
          class="btn-element btn-detail-edit"
          :to="{ name: 'edit', params: { id: this.$route.params.id } }"
          style="text-decoration: none; color: #fff"
          >Sửa</RouterLink
        >
        <button
          v-if="letter.status == 1"
          class="btn-element btn-del"
          @click="handleDelete(this.$route.params.id)"
        >
          Xóa
        </button>
        <button class="btn-element btn-back" @click="handleBack">Quay lại</button>
      </div>
    </div>
    <div class="div-common">
      <div class="letter-content">
        <span class="title">Thông tin chung</span>
        <label for=""
          >Trạng thái:
          <span v-if="letter.status == 1" class="detail-txt">Đang soạn thảo</span>
          <span v-if="letter.status == 2" class="detail-txt">Chờ xử lý</span>
        </label>
      </div>
      <div class="common-content">
        <div class="col-md-3 common-component">
          <label for=""
            >Mã đơn thư: <span class="detail-txt">{{ letter.letter_no }}</span></label
          >
        </div>
        <div class="col-md-3 common-component">
          <label for=""
            >Nguồn gửi: <span class="detail-txt">{{ letter.source }}</span></label
          >
        </div>
        <div class="col-md-3 common-component">
          <label for=""
            >Ngày tiếp nhận: <span class="detail-txt">{{ letter.receive_at }}</span></label
          >
        </div>
        <div class="col-md-3 common-component">
          <label for="">Người tạo: <span class="detail-txt">Admin</span></label>
        </div>
      </div>
    </div>
    <div class="div-common">
      <span class="title">Thông tin người khiếu nại; tố cáo; kiến nghị, phản ánh</span>
      <div class="common-content">
        <div class="col-md-3 common-component">
          <label for=""
            >Phân loại đối tượng:
            <span v-if="letter.sender_type == 1" class="detail-txt">Cá nhân</span>
            <span v-if="letter.sender_type == 2" class="detail-txt">Cơ quan, tổ chức</span>
            <span v-if="letter.sender_type == 3" class="detail-txt">Đoàn đông người</span>
          </label>
        </div>
        <div class="col-md-9 common-component" v-if="letter.sender_type == 2">
          <label for=""
            >Tên cơ quan, tổ chức: <span class="detail-txt">{{ letter.sender.organ }}</span></label
          >
        </div>
        <div :class="['col-md-3', 'common-component', { 'm-t-20': letter.sender_type == 2 }]">
          <label for=""
            >Số người: <span class="detail-txt">{{ letter.sender.quantity }}</span></label
          >
        </div>
        <div :class="['col-md-3', 'common-component', { 'm-t-20': letter.sender_type == 2 }]">
          <label for="" v-if="letter.sender_type == 1"
            >Họ và tên chủ đơn: <span class="detail-txt">{{ letter.sender.owner }}</span></label
          >
          <label for="" v-if="letter.sender_type == 2 || letter.sender_type == 3"
            >Họ và tên người đại diện:
            <span class="detail-txt">{{ letter.sender.owner }}</span></label
          >
        </div>
        <div
          :class="['col-md-3', 'common-component', { 'm-t-20': letter.sender_type == 2 }]"
          v-if="letter.sender_type == 2"
        >
          <label for=""
            >Chức vụ người đại diện:
            <span class="detail-txt">{{ letter.sender.position }}</span></label
          >
        </div>
        <div :class="['col-md-3', 'common-component', { 'm-t-20': letter.sender_type == 2 }]">
          <label for="" v-if="letter.sender_type == 1"
            >CCCD chủ đơn: <span class="detail-txt">{{ letter.sender.Id_card }}</span></label
          >
          <label for="" v-if="letter.sender_type == 2 || letter.sender_type == 3"
            >CCCD người đại diện: <span class="detail-txt">{{ letter.sender.Id_card }}</span></label
          >
        </div>
        <div :class="['col-md-3', 'common-component', 'm-t-20']">
          <label for=""
            >Ngày cấp CCCD:
            <span class="detail-txt">{{ letter.sender.Id_card_created_at }}</span></label
          >
        </div>
        <div :class="['col-md-3', 'common-component', 'm-t-20']">
          <label for=""
            >Nơi cấp CCCD:
            <span class="detail-txt">{{ letter.sender.Id_card_created_in }}</span></label
          >
        </div>
        <div :class="['col-md-3', 'common-component', 'm-t-20']">
          <label for=""
            >Giới tính: <span class="detail-txt">{{ letter.sender.gender }}</span></label
          >
        </div>
        <div :class="['col-md-3', 'common-component', 'm-t-20']">
          <label for=""
            >Dân tộc: <span class="detail-txt">{{ letter.sender.ethnic }}</span></label
          >
        </div>
      </div>
      <div class="common-content">
        <div class="col-md-3 common-component">
          <label for=""
            >Quốc tịch: <span class="detail-txt">{{ letter.sender.nationality }}</span></label
          >
        </div>
        <div class="col-md-3 common-component">
          <label for=""
            >Tỉnh/ thành phố:
            <span class="detail-txt">{{ letter.sender.address.province }}</span></label
          >
        </div>
        <div class="col-md-3 common-component">
          <label for=""
            >Quận/ huyện:
            <span class="detail-txt">{{ letter.sender.address.district }}</span></label
          >
        </div>
        <div class="col-md-3 common-component">
          <label for=""
            >Phường/ xã: <span class="detail-txt">{{ letter.sender.address.commune }}</span></label
          >
        </div>
      </div>
      <div class="common-content">
        <div class="col-md-12 common-component">
          <label for=""
            >Địa chỉ chi tiết:
            <span class="detail-txt">{{ letter.sender.address.specified_address }}</span></label
          >
        </div>
      </div>
    </div>
    <div class="div-common">
      <div class="letter-content">
        <span class="title">Thông tin đơn thư</span>
        <!-- <el-checkbox
          v-model="letter.is_eligible"
          label="Đơn thư không đủ điều kiện xử lý, do trùng lặp, đơn không rõ địa chỉ, không ký tên, nặc danh"
        /> -->
      </div>
      <div class="common-content">
        <div class="col-md-3 common-component">
          <label for=""
            >Lần tiếp nhận: <span class="detail-txt">{{ letter.times_case }}</span></label
          >
        </div>
        <div class="col-md-3 common-component">
          <label for=""
            >Loại vụ việc: <span class="detail-txt">{{ cases.type }}</span></label
          >
        </div>
        <div class="col-md-3 common-component">
          <label for=""
            >Lĩnh vực: <span class="detail-txt">{{ cases.field }}</span></label
          >
        </div>
        <div class="col-md-3 common-component">
          <label for=""
            >Tình trạng vụ việc khi tiếp nhận:
            <span class="detail-txt">{{ letter.pre_status }}</span></label
          >
        </div>
      </div>
      <div class="">
        <div class="col-md-12 common-component">
          <label for=""
            >Nội dung đơn thư: <span class="detail-txt-content">{{ cases.content }}</span></label
          >
        </div>
      </div>
      <div v-if="files.length > 0">
        <label style="padding: 0px 10px" for="">Văn bản đính kèm:</label>
        <ul class="list-file" style="padding-left: 10px">
          <li v-for="(file, index) in files" :key="index" class="file-detail">
            <!-- <span>{{
              file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name
            }}</span> -->
            <a :href="`http://localhost:3000/open/${file.name}`" style="text-decoration: none"
              >{{ truncateFileName(file.name) }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
