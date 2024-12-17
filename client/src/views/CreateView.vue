<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      letter: {
        gov_agency: '',
        letter_no: '',
        source: null,
        receive_at: null,
        sender_type: 1,
        sender: {
          quantity: 1,
          owner: '',
          organ: '',
          position: '',
          Id_card: '',
          Id_card_created_at: null,
          Id_card_created_in: '',
          gender: null,
          ethnic: null,
          nationality: '',
          address: {
            province: '',
            district: '',
            commune: '',
            specified_address: '',
          },
        },
        is_eligible: false,
        times_case: 1,
        pre_status: null,
        status: 1,
      },
      cases: {
        type: 1,
        field: null,
        content: '',
      },
      files: [],
      chkError: {
        gov_agency: false,
        letter_no: false,
        source: false,
        receive_at: false,
        sender_type: false,
        quantity: false,
        owner: false,
        organ: false,
        Id_card: false,
        province: false,
        district: false,
        commune: false,
        specified_address: false,
        times_case: false,
        pre_status: false,
        cases_type: false,
        cases_field: false,
        content: false,
      },
      gov_agency_options: [],
      source_options: [
        {
          value: 1,
          label: 'Bưu điện',
        },
        {
          value: 2,
          label: 'Khác',
        },
      ],
      sender_type_options: [
        {
          value: 1,
          label: 'Cá nhân',
        },
        {
          value: 2,
          label: 'Cơ quan, tổ chức',
        },
        {
          value: 3,
          label: 'Đoàn đông người',
        },
      ],
      gender_options: [
        {
          value: 1,
          label: 'Nam',
        },
        {
          value: 2,
          label: 'Nữ',
        },
      ],
      ethnic_options: [
        {
          value: 1,
          label: 'Kinh',
        },
      ],
      nationality_options: [
        {
          value: 'vietnam',
          label: 'Việt Nam',
        },
      ],
      province_options: [],
      district_options: [],
      commune_options: [],
      times_case_options: [
        {
          value: 1,
          label: 'Tiếp nhận lần đầu',
        },
        {
          value: 2,
          label: 'Tiếp nhận nhiều lần',
        },
      ],
      cases_type_options: [
        {
          value: 1,
          label: 'Khiếu nại',
        },
        {
          value: 2,
          label: 'Tố cáo',
        },
        {
          value: 3,
          label: 'Tranh chấp',
        },
        {
          value: 4,
          label: 'Kiến nghị, phản ánh',
        },
      ],
      field_options: [],
      pre_status_options: [],
    }
  },
  methods: {
    async handleSave() {
      try {
        if (this.validateInput()) {
          const formData = new FormData()
          this.files.forEach((file) => {
            formData.append('files', file)
          })
          formData.append('letter', JSON.stringify(this.letter))
          formData.append('cases', JSON.stringify(this.cases))

          const response = await axios.post('http://localhost:3000/letter/createLetter', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          // const response = await axios.post('http://localhost:3000/letter/createLetter', {
          //   letter: this.letter,
          //   cases: this.cases,
          // })
          if (response.status == 200) {
            Swal.fire({
              title: 'Success',
              text: this.letter.status == 2 ? 'Đơn thư đã được gửi xử lý' : 'Đơn thư đã được thêm',
              icon: 'success',
            }).then((result) => {
              if (result.isConfirmed) {
                this.$router.push('/')
              }
            })
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleBack() {
      this.$router.push('/')
    },
    handleCancel() {
      this.letter.gov_agency = ''
      this.letter.letter_no = ''
      this.letter.source = null
      this.letter.receive_at = null
      this.letter.sender_type = 1
      this.letter.sender.quantity = 1
      this.letter.sender.owner = ''
      this.letter.sender.organ = ''
      this.letter.sender.position = ''
      this.letter.sender.Id_card = ''
      this.letter.sender.Id_card_created_at = null
      this.letter.sender.Id_card_created_in = ''
      this.letter.sender.gender = null
      this.letter.sender.ethnic = null
      this.letter.sender.nationality = ''
      this.letter.sender.address.province = ''
      this.letter.sender.address.district = ''
      this.letter.sender.address.commune = ''
      this.letter.sender.address.specified_address = ''
      this.letter.is_eligible = false
      this.letter.times_case = 1
      this.letter.pre_status = null
      this.letter.status = 1
      this.cases.type = 1
      this.cases.field = null
      this.cases.content = ''
      this.getAgencies()
      this.getDateNow()
      this.getProvince()
      this.handleCaseType()
    },
    checkEmpty(element) {
      if (element == null || element == '') {
        return true
      }
      return false
    },
    validateInput() {
      this.chkError.gov_agency = this.checkEmpty(this.letter.gov_agency)
      this.chkError.letter_no = this.checkEmpty(this.letter.letter_no)
      this.chkError.source = this.checkEmpty(this.letter.source)
      this.chkError.receive_at = this.checkEmpty(this.letter.receive_at)
      this.chkError.sender_type = this.checkEmpty(this.letter.sender_type)
      this.chkError.quantity = this.checkEmpty(this.letter.sender.quantity)
      this.chkError.owner = this.checkEmpty(this.letter.sender.owner)
      this.chkError.Id_card = this.checkEmpty(this.letter.sender.Id_card)
      this.chkError.province = this.checkEmpty(this.letter.sender.address.province)
      this.chkError.district = this.checkEmpty(this.letter.sender.address.district)
      this.chkError.commune = this.checkEmpty(this.letter.sender.address.commune)
      this.chkError.specified_address = this.checkEmpty(
        this.letter.sender.address.specified_address,
      )
      this.chkError.times_case = this.checkEmpty(this.letter.times_case)
      this.chkError.pre_status = this.checkEmpty(this.letter.pre_status)
      this.chkError.content = this.checkEmpty(this.cases.content)
      this.chkError.cases_field = this.checkEmpty(this.cases.field)
      this.chkError.cases_type = this.checkEmpty(this.cases.type)
      if (this.letter.sender_type == 2) {
        this.chkError.organ = this.checkEmpty(this.letter.sender.organ)
      }
      if (
        !this.chkError.gov_agency &&
        !this.chkError.letter_no &&
        !this.chkError.source &&
        !this.chkError.receive_at &&
        !this.chkError.sender_type &&
        !this.chkError.quantity &&
        !this.chkError.owner &&
        !this.chkError.Id_card &&
        !this.chkError.province &&
        !this.chkError.district &&
        !this.chkError.commune &&
        !this.chkError.specified_address &&
        !this.chkError.times_case &&
        !this.chkError.pre_status &&
        !this.chkError.content &&
        !this.chkError.cases_field &&
        !this.chkError.cases_type
      ) {
        if (this.letter.sender_type == 2) {
          if (!this.chkError.organ) {
            return true
          } else {
            return false
          }
        }
        return true
      } else {
        return false
      }
    },
    async getAgencies() {
      this.gov_agency_options = []
      try {
        const response = await axios.get('http://localhost:3000/agency/getAgencies')
        response.data.forEach((element) => {
          this.gov_agency_options.push({
            value: element._id,
            label: element.name,
            code: element.code,
          })
        })
      } catch (error) {
        console.log(error)
      }
    },
    async getProvince() {
      try {
        this.province_options = []
        const response = await axios.get('http://localhost:3000/province/getProvince')
        response.data.forEach((element) => {
          this.province_options.push({
            value: element._id,
            label: element.name,
            districts: element.districts,
          })
        })
        this.letter.sender.address.province = response.data[0]._id
        this.getDistrict()
      } catch (error) {
        console.log(error)
      }
    },
    getDistrict() {
      this.chkError.province = this.checkEmpty(this.letter.sender.address.province)
      this.district_options = []
      this.commune_options = []
      this.letter.sender.address.district = ''
      this.letter.sender.address.commune = ''
      this.province_options.forEach((element) => {
        if (this.letter.sender.address.province == element.value) {
          element.districts.forEach((dt) => {
            this.district_options.push({
              value: dt._id,
              label: dt.name,
              communes: dt.communes,
            })
          })
        }
      })
    },
    getCommune() {
      this.chkError.district = this.checkEmpty(this.letter.sender.address.district)
      this.commune_options = []
      this.letter.sender.address.commune = ''
      this.district_options.forEach((element) => {
        if (this.letter.sender.address.district == element.value) {
          element.communes.forEach((cm) => {
            this.commune_options.push({
              value: cm._id,
              label: cm.name,
            })
          })
        }
      })
    },
    async letterCodeRender() {
      try {
        this.chkError.gov_agency = this.checkEmpty(this.letter.gov_agency)
        this.gov_agency_options.forEach((element) => {
          if (element.value == this.letter.gov_agency) {
            this.letter.letter_no =
              element.code + '-' + new Date().getFullYear().toString().slice(2) + '-'
          }
        })
        const response = await axios.get('http://localhost:3000/letter/getLetterLengthByCode', {
          params: { code: this.letter.letter_no },
        })

        if (response.data.length < 10) {
          this.letter.letter_no = this.letter.letter_no + '0000' + response.data.length.toString()
        } else if (response.data.length < 100) {
          this.letter.letter_no = this.letter.letter_no + '000' + response.data.length.toString()
        } else if (response.data.length < 1000) {
          this.letter.letter_no = this.letter.letter_no + '00' + response.data.length.toString()
        } else if (response.data.length < 10000) {
          this.letter.letter_no = this.letter.letter_no + '0' + response.data.length.toString()
        } else {
          this.letter.letter_no = this.letter.letter_no + response.data.length.toString()
        }
      } catch (error) {
        console.log(error)
      }
    },
    getDateNow() {
      const date = new Date()
      this.letter.receive_at = date
      this.letter.sender.Id_card_created_at = date
    },
    test() {
      console.log(this.letter.gov_agency)
    },
    handleSenderType() {
      if (this.letter.sender_type == 1 && this.letter.sender_type == 2) {
        this.letter.sender.quantity = 1
      } else if (this.letter.sender_type == 3) {
        this.letter.sender.quantity = 5
      }
    },
    handleCaseType() {
      this.chkError.cases_type = this.checkEmpty(this.cases.type)
      this.pre_status_options = []
      this.field_options = []
      this.letter.pre_status = null
      this.cases.field = null
      this.pre_status_options.push({ value: 1, label: 'Chưa giải quyết xong' })

      if (this.cases.type == 1) {
        this.pre_status_options.push({ value: 3, label: 'Đã giải quyết lần đầu' })
        this.pre_status_options.push({ value: 4, label: 'Đã giải quyết nhiều lần' })
        this.pre_status_options.push({ value: 5, label: 'Đã có bản án của TAND' })
        this.field_options.push({ value: 1, label: 'Lĩnh vực khiếu nại A' })
        this.field_options.push({ value: 2, label: 'Lĩnh vực khiếu nại B' })
      } else if (this.cases.type == 2) {
        this.pre_status_options.push({ value: 6, label: 'Tố cáo tiếp - Quá thời hạn giải quyết' })
        this.pre_status_options.push({ value: 7, label: 'Tố cáo tiếp - Đã có kết luận giải quyết' })
        this.field_options.push({ value: 3, label: 'Lĩnh vực tố cáo A' })
        this.field_options.push({ value: 4, label: 'Lĩnh vực tố cáo B' })
      } else if (this.cases.type == 3) {
        this.pre_status_options.push({ value: 2, label: 'Đã được giải quyết' })
        this.field_options.push({ value: 5, label: 'Lĩnh vực tranh chấp A' })
        this.field_options.push({ value: 6, label: 'Lĩnh vực tranh chấp B' })
      } else if (this.cases.type == 4) {
        this.pre_status_options.push({ value: 2, label: 'Đã được giải quyết' })
        this.field_options.push({ value: 7, label: 'Lĩnh vực kiến nghị A' })
        this.field_options.push({ value: 8, label: 'Lĩnh vực kiến nghị B' })
      }
    },
    openFilePicker() {
      document.getElementById('fileInput').click()
    },
    handleUpFile(event) {
      const selectedFiles = event.target.files
      console.log(selectedFiles)

      const updatedFiles = Array.from(selectedFiles).map((file) => {
        const originalName = file.name

        const fileParts = originalName.split('.')
        const baseName = fileParts.slice(0, -1).join('.')
        const extension = fileParts[fileParts.length - 1]

        const newName = `${baseName}-${this.letter.letter_no}.${extension}`

        const updatedFile = new File([file], newName, { type: file.type })

        return updatedFile
      })

      if (selectedFiles.length + this.files.length > 5) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer
            toast.onmouseleave = Swal.resumeTimer
          },
        })
        Toast.fire({
          icon: 'warning',
          title: 'Chỉ được tải lên tối đa 5 file',
        })
      } else if (Array.from(selectedFiles).some((file) => file.size > 20 * 1024 * 1024)) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer
            toast.onmouseleave = Swal.resumeTimer
          },
        })
        Toast.fire({
          icon: 'warning',
          title: 'File vượt quá 20mb',
        })
      } else {
        Array.from(updatedFiles).forEach((file) => {
          this.files.push(file)
        })
        console.log(this.files)
      }
    },
    removeFile(index) {
      this.files.splice(index, 1)
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
  },
  created() {
    this.getAgencies()
    this.getDateNow()
    this.getProvince()
    this.handleCaseType()
  },
}
</script>

<template>
  <div class="page-container">
    <div class="div-content">
      <div class="col-md-5">
        <p>
          Khiếu nại tố cáo / <router-link class="link" to="/">Danh sách đơn thư</router-link> /
          <router-link class="link">Thêm mới đơn thư</router-link>
        </p>
      </div>
      <div class="col-md-7 btn-group">
        <button class="btn-element btn-cancel" @click="handleCancel">Hủy</button>
        <button
          class="btn-element btn-save"
          @click="
            () => {
              letter.status = 1
              handleSave()
            }
          "
        >
          Lưu
        </button>
        <button
          class="btn-element btn-send"
          @click="
            () => {
              letter.status = 2
              handleSave()
            }
          "
        >
          Gửi xử lý
        </button>
        <button class="btn-element btn-back" @click="handleBack">Quay lại</button>
      </div>
    </div>
    <div class="div-common">
      <span class="title">Thông tin chung</span>
      <div class="common-content">
        <div class="col-md-3 common-component">
          <label for="">Đơn vị tiếp nhận <span style="color: red">*</span></label>
          <el-select-v2
            class="common-input"
            v-model="letter.gov_agency"
            filterable
            :options="gov_agency_options"
            @change="letterCodeRender"
            @blur="
              () => {
                chkError.gov_agency = checkEmpty(letter.gov_agency)
              }
            "
            placeholder="Chọn..."
          />
          <span class="error-alert" v-if="chkError.gov_agency"
            >Trường dữ liệu này không được để trống</span
          >
        </div>
        <div class="col-md-3 common-component">
          <label for="">Mã đơn thư <span style="color: red">*</span></label>
          <el-input
            class="common-input"
            v-model="letter.letter_no"
            placeholder="Nhập..."
            disabled
          />
          <span class="error-alert" v-if="chkError.letter_no"
            >Trường dữ liệu này không được để trống</span
          >
        </div>
        <div class="col-md-3 common-component">
          <label for="">Nguồn gửi <span style="color: red">*</span></label>
          <el-select-v2
            class="common-input"
            v-model="letter.source"
            filterable
            :options="source_options"
            @change="
              () => {
                chkError.source = checkEmpty(letter.source)
              }
            "
            @blur="
              () => {
                chkError.source = checkEmpty(letter.source)
              }
            "
            placeholder="Chọn..."
          />
          <span class="error-alert" v-if="chkError.source"
            >Trường dữ liệu này không được để trống</span
          >
        </div>
        <div class="col-md-3 common-component">
          <label for="">Ngày tiếp nhận <span style="color: red">*</span></label>
          <el-date-picker
            class="common-input"
            v-model="letter.receive_at"
            type="date"
            placeholder="Chọn..."
            size="default"
            format="DD/MM/YYYY"
            @change="
              () => {
                chkError.receive_at = checkEmpty(letter.receive_at)
              }
            "
            @blur="
              () => {
                chkError.receive_at = checkEmpty(letter.receive_at)
              }
            "
          />
          <span class="error-alert" v-if="chkError.receive_at"
            >Trường dữ liệu này không được để trống</span
          >
        </div>
      </div>
    </div>
    <div class="div-common">
      <span class="title">Thông tin người khiếu nại; tố cáo; kiến nghị, phản ánh</span>
      <div class="common-content">
        <div class="col-md-3 common-component">
          <label for="">Phân loại đối tượng <span style="color: red">*</span></label>
          <el-select-v2
            class="common-input"
            v-model="letter.sender_type"
            filterable
            :options="sender_type_options"
            placeholder="Chọn..."
            @change="handleSenderType"
            style="width: 240px"
          />
          <span class="error-alert" v-if="chkError.sender_type"
            >Trường dữ liệu này không được để trống</span
          >
        </div>
        <div class="col-md-9 common-component" v-if="letter.sender_type == 2">
          <label for="">Tên cơ quan, tổ chức <span style="color: red">*</span></label>
          <el-input
            class="common-input"
            v-model="letter.sender.organ"
            style="width: 240px"
            placeholder="Nhập..."
            maxlength="200"
            @input="
              () => {
                chkError.organ = checkEmpty(letter.sender.organ)
              }
            "
            @blur="
              () => {
                chkError.organ = checkEmpty(letter.sender.organ)
              }
            "
          />
          <span class="error-alert" v-if="chkError.organ"
            >Trường dữ liệu này không được để trống</span
          >
        </div>
        <div :class="['col-md-3', 'common-component', { 'm-t-20': letter.sender_type == 2 }]">
          <label for="">Số người <span style="color: red">*</span></label>
          <el-input
            class="common-input"
            v-model="letter.sender.quantity"
            style="width: 240px"
            placeholder="Nhập..."
            type="number"
            @input="
              () => {
                if (letter.sender.quantity && letter.sender.quantity.toString().length > 10) {
                  letter.sender.quantity = letter.sender.quantity.toString().slice(0, 10)
                }
                chkError.quantity = checkEmpty(letter.sender.quantity)
              }
            "
            @blur="
              () => {
                chkError.quantity = checkEmpty(letter.sender.quantity)
              }
            "
          />
          <span class="error-alert" v-if="chkError.quantity"
            >Trường dữ liệu này không được để trống</span
          >
        </div>
        <div :class="['col-md-3', 'common-component', { 'm-t-20': letter.sender_type == 2 }]">
          <label for="" v-if="letter.sender_type == 1"
            >Họ và tên chủ đơn <span style="color: red">*</span></label
          >
          <label for="" v-if="letter.sender_type == 2 || letter.sender_type == 3"
            >Họ và tên người đại diện <span style="color: red">*</span></label
          >
          <el-input
            class="common-input"
            v-model="letter.sender.owner"
            style="width: 240px"
            placeholder="Nhập..."
            maxlength="50"
            @input="
              () => {
                chkError.owner = checkEmpty(letter.sender.owner)
              }
            "
            @blur="
              () => {
                chkError.owner = checkEmpty(letter.sender.owner)
              }
            "
          />
          <span class="error-alert" v-if="chkError.owner"
            >Trường dữ liệu này không được để trống</span
          >
        </div>
        <div
          :class="['col-md-3', 'common-component', { 'm-t-20': letter.sender_type == 2 }]"
          v-if="letter.sender_type == 2"
        >
          <label for="">Chức vụ người đại diện</label>
          <el-input
            class="common-input"
            v-model="letter.sender.position"
            style="width: 240px"
            maxlength="200"
            placeholder="Nhập..."
          />
        </div>
        <div :class="['col-md-3', 'common-component', { 'm-t-20': letter.sender_type == 2 }]">
          <label for="" v-if="letter.sender_type == 1"
            >CCCD chủ đơn <span style="color: red">*</span></label
          >
          <label for="" v-if="letter.sender_type == 2 || letter.sender_type == 3"
            >CCCD người đại diện <span style="color: red">*</span></label
          >
          <el-input
            class="common-input"
            v-model="letter.sender.Id_card"
            style="width: 240px"
            placeholder="Nhập..."
            minlength="1"
            maxlength="12"
            @input="
              () => {
                letter.sender.Id_card = letter.sender.Id_card.replace(/[^0-9]/g, '')
                chkError.Id_card = checkEmpty(letter.sender.Id_card)
              }
            "
            @blur="
              () => {
                chkError.Id_card = checkEmpty(letter.sender.Id_card)
              }
            "
          />
          <span class="error-alert" v-if="chkError.Id_card"
            >Trường dữ liệu này không được để trống</span
          >
        </div>
        <div :class="['col-md-3', 'common-component', 'm-t-20']">
          <label for="">Ngày cấp CCCD</label>
          <el-date-picker
            class="common-input"
            v-model="letter.sender.Id_card_created_at"
            type="date"
            placeholder="Chọn..."
            size="default"
            format="DD/MM/YYYY"
          />
        </div>
        <div :class="['col-md-3', 'common-component', 'm-t-20']">
          <label for="">Nơi cấp CCCD</label>
          <el-input
            class="common-input"
            v-model="letter.sender.Id_card_created_in"
            style="width: 240px"
            maxlength="200"
            placeholder="Nhập..."
          />
        </div>
        <div :class="['col-md-3', 'common-component', 'm-t-20']">
          <label for="">Giới tính</label>
          <el-select-v2
            class="common-input"
            v-model="letter.sender.gender"
            filterable
            :options="gender_options"
            placeholder="Chọn..."
            style="width: 240px"
          />
        </div>
        <div :class="['col-md-3', 'common-component', 'm-t-20']">
          <label for="">Dân tộc</label>
          <el-select-v2
            class="common-input"
            v-model="letter.sender.ethnic"
            filterable
            :options="ethnic_options"
            placeholder="Chọn..."
            style="width: 240px"
          />
        </div>
      </div>
      <div class="common-content">
        <div class="col-md-3 common-component">
          <label for="">Quốc tịch</label>
          <el-select-v2
            class="common-input"
            v-model="letter.sender.nationality"
            filterable
            :options="nationality_options"
            placeholder="Chọn..."
            style="width: 240px"
          />
        </div>
        <div class="col-md-3 common-component">
          <label for="">Tỉnh/ thành phố <span style="color: red">*</span></label>
          <el-select-v2
            class="common-input"
            v-model="letter.sender.address.province"
            filterable
            :options="province_options"
            @change="getDistrict"
            placeholder="Chọn..."
            style="width: 240px"
            @blur="
              () => {
                chkError.province = checkEmpty(letter.sender.address.province)
              }
            "
          />
          <span class="error-alert" v-if="chkError.province"
            >Trường dữ liệu này không được để trống</span
          >
        </div>
        <div class="col-md-3 common-component">
          <label for="">Quận/ huyện <span style="color: red">*</span></label>
          <el-select-v2
            class="common-input"
            v-model="letter.sender.address.district"
            filterable
            :options="district_options"
            @change="getCommune"
            placeholder="Chọn..."
            style="width: 240px"
            @blur="
              () => {
                chkError.district = checkEmpty(letter.sender.address.district)
              }
            "
          />
          <span class="error-alert" v-if="chkError.district"
            >Trường dữ liệu này không được để trống</span
          >
        </div>
        <div class="col-md-3 common-component">
          <label for="">Phường/ xã <span style="color: red">*</span></label>
          <el-select-v2
            class="common-input"
            v-model="letter.sender.address.commune"
            filterable
            :options="commune_options"
            placeholder="Chọn..."
            style="width: 240px"
            @change="
              () => {
                chkError.commune = checkEmpty(letter.sender.address.commune)
              }
            "
            @blur="
              () => {
                chkError.commune = checkEmpty(letter.sender.address.commune)
              }
            "
          />
          <span class="error-alert" v-if="chkError.commune"
            >Trường dữ liệu này không được để trống</span
          >
        </div>
      </div>
      <div class="common-content">
        <div class="col-md-12 common-component">
          <label for="">Địa chỉ chi tiết <span style="color: red">*</span></label>
          <el-input
            class="common-input"
            v-model="letter.sender.address.specified_address"
            style="width: 240px"
            placeholder="Nhập..."
            maxlength="200"
            @input="
              () => {
                chkError.specified_address = checkEmpty(letter.sender.address.specified_address)
              }
            "
            @blur="
              () => {
                chkError.specified_address = checkEmpty(letter.sender.address.specified_address)
              }
            "
          />
          <span class="error-alert" v-if="chkError.specified_address"
            >Trường dữ liệu này không được để trống</span
          >
        </div>
      </div>
    </div>
    <div class="div-common">
      <div class="letter-content">
        <span class="title">Thông tin đơn thư</span>
        <el-checkbox
          v-model="letter.is_eligible"
          label="Đơn thư không đủ điều kiện xử lý, do trùng lặp, đơn không rõ địa chỉ, không ký tên, nặc danh"
        />
      </div>
      <div class="common-content">
        <div class="col-md-3 common-component">
          <label for="">Lần tiếp nhận <span style="color: red">*</span></label>
          <el-select-v2
            class="common-input"
            v-model="letter.times_case"
            filterable
            :options="times_case_options"
            placeholder="Chọn..."
            style="width: 240px"
            @change="
              () => {
                chkError.times_case = checkEmpty(letter.times_case)
              }
            "
            @blur="
              () => {
                chkError.times_case = checkEmpty(letter.times_case)
              }
            "
          />
          <span class="error-alert" v-if="chkError.times_case"
            >Trường dữ liệu này không được để trống</span
          >
        </div>
        <div class="col-md-3 common-component">
          <label for="">Loại vụ việc <span style="color: red">*</span></label>
          <el-select-v2
            class="common-input"
            v-model="cases.type"
            filterable
            :options="cases_type_options"
            placeholder="Chọn..."
            @change="handleCaseType"
            style="width: 240px"
            @blur="
              () => {
                chkError.cases_type = checkEmpty(cases.type)
              }
            "
          />
          <span class="error-alert" v-if="chkError.cases_type"
            >Trường dữ liệu này không được để trống</span
          >
        </div>
        <div class="col-md-3 common-component">
          <label for="">Lĩnh vực <span style="color: red">*</span></label>
          <el-select-v2
            class="common-input"
            v-model="cases.field"
            filterable
            :options="field_options"
            placeholder="Chọn..."
            style="width: 240px"
            @change="
              () => {
                chkError.cases_field = checkEmpty(cases.field)
              }
            "
            @blur="
              () => {
                chkError.cases_field = checkEmpty(cases.field)
              }
            "
          />
          <span class="error-alert" v-if="chkError.cases_field"
            >Trường dữ liệu này không được để trống</span
          >
        </div>
        <div class="col-md-3 common-component">
          <label for="">Tình trạng vụ việc khi tiếp nhận <span style="color: red">*</span></label>
          <el-select-v2
            class="common-input"
            v-model="letter.pre_status"
            filterable
            :options="pre_status_options"
            placeholder="Chọn..."
            style="width: 240px"
            @change="
              () => {
                chkError.pre_status = checkEmpty(letter.pre_status)
              }
            "
            @blur="
              () => {
                chkError.pre_status = checkEmpty(letter.pre_status)
              }
            "
          />
          <span class="error-alert" v-if="chkError.pre_status"
            >Trường dữ liệu này không được để trống</span
          >
        </div>
      </div>
      <div class="">
        <div class="col-md-12 common-component">
          <label for="">Nội dung đơn thư <span style="color: red">*</span></label>
          <el-input
            class="common-input"
            v-model="cases.content"
            :rows="2"
            type="textarea"
            placeholder="Nhập..."
            maxlength="5000"
            @input="
              () => {
                chkError.content = checkEmpty(cases.content)
              }
            "
            @blur="
              () => {
                chkError.content = checkEmpty(cases.content)
              }
            "
          />
          <span class="error-alert" v-if="chkError.content"
            >Trường dữ liệu này không được để trống</span
          >
        </div>
      </div>
      <div>
        <button class="btn-upfile" @click="openFilePicker">
          <input
            id="fileInput"
            type="file"
            multiple
            accept=".pdf,.doc,.docx,image/jpeg,image/jpg,image/png,.xlsx,.xls"
            style="display: none"
            @change="handleUpFile"
          />
          <img src="../assets/images/upfile.png" />
          <span>Hồ sơ đính kèm (doc, pdf, xls, xlsx, jpg, jpeg, png). Kích thước tối đa 20Mb.</span>
        </button>
      </div>
      <div v-if="files.length > 0">
        <ul class="list-file">
          <li v-for="(file, index) in files" :key="index" class="file-detail">
            <span>{{ truncateFileName(file.name) }}</span>
            <button type="button" @click="removeFile(index)" class="btn-removefile">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.17731 6.00972L11.5973 1.58972C11.671 1.52106 11.7301 1.43826 11.7711 1.34626C11.8121 1.25426 11.8341 1.15495 11.8359 1.05425C11.8377 0.953544 11.8192 0.853515 11.7814 0.760126C11.7437 0.666738 11.6876 0.581905 11.6163 0.510686C11.5451 0.439467 11.4603 0.383322 11.3669 0.345601C11.2735 0.30788 11.1735 0.289356 11.0728 0.291132C10.9721 0.292909 10.8728 0.314951 10.7808 0.355943C10.6888 0.396935 10.606 0.456037 10.5373 0.529724L6.11731 4.94972L1.69731 0.529724C1.55513 0.397244 1.36709 0.325121 1.17279 0.328549C0.978485 0.331977 0.7931 0.410689 0.655687 0.548102C0.518274 0.685515 0.439562 0.870901 0.436133 1.0652C0.432705 1.2595 0.504829 1.44755 0.637309 1.58972L5.05731 6.00972L0.637309 10.4297C0.496858 10.5703 0.417969 10.761 0.417969 10.9597C0.417969 11.1585 0.496858 11.3491 0.637309 11.4897C0.777934 11.6302 0.968558 11.7091 1.16731 11.7091C1.36606 11.7091 1.55668 11.6302 1.69731 11.4897L6.11731 7.06972L10.5373 11.4897C10.6779 11.6302 10.8686 11.7091 11.0673 11.7091C11.2661 11.7091 11.4567 11.6302 11.5973 11.4897C11.7378 11.3491 11.8166 11.1585 11.8166 10.9597C11.8166 10.761 11.7378 10.5703 11.5973 10.4297L7.17731 6.00972Z"
                  fill="#64748B"
                ></path>
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
