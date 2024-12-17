<script>
import axios from 'axios'
import Swal from 'sweetalert2'
export default {
  data() {
    return {
      search: {
        gov_agency: '',
        daterange: '',
        source: '',
        letter_no: '',
        sender_type: '',
        sender: '',
        cases_type: '',
        content: '',
        solution: '',
        status: '',

        max_item: 5,
        page: 1,
      },
      letter: [
        {
          id: '',
          letter_no: '',
          receive_at: null,
          sender_type: null,
          sender: {
            quantity: null,
            owner: '',
            Id_card: '',
            address: {
              province: '',
              district: '',
              commune: '',
              specified_address: '',
            },
          },
          cases: {
            type: null,
            content: '',
          },
          status: null,
        },
      ],
      chkSearch: false,
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
      solution_options: [],
      status_options: [
        {
          value: 1,
          label: 'Đang soạn thảo',
        },
        {
          value: 2,
          label: 'Chờ xử lý',
        },
      ],
      address: null,
      total_lt: 0,
      total_page: [],
      count_lt: 0,
    }
  },
  methods: {
    getTotalPage(num) {
      this.total_page = []
      if (this.total_lt > 0) {
        this.count_lt = Math.ceil(this.total_lt / num)
        for (let i = 0; i < this.count_lt; i++) {
          this.total_page.push({ page_num: i + 1 })
        }
      } else {
        this.total_page.push({ page_num: 1 })
      }
    },
    formattedDate(element) {
      const dateObj = new Date(element)
      const day = String(dateObj.getDate()).padStart(2, '0')
      const month = String(dateObj.getMonth() + 1).padStart(2, '0')
      const year = dateObj.getFullYear()
      return `${day}/${month}/${year}`
    },
    getProvince(element) {
      this.address.forEach((province) => {
        if (element == province._id) {
          element = province.name
        }
      })
      return element
    },
    getDistrict(element) {
      this.address.forEach((province) => {
        province.districts.forEach((district) => {
          if (element == district._id) {
            element = district.name
          }
        })
      })
      return element
    },
    getCommune(element) {
      this.address.forEach((province) => {
        province.districts.forEach((district) => {
          district.communes.forEach((commune) => {
            if (element == commune._id) {
              element = commune.name
            }
          })
        })
      })
      return element
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
    async getLetters() {
      this.letter = []
      this.total_lt = 0
      if (!this.search.gov_agency) {
        this.search.gov_agency = ''
      }

      if (!this.search.daterange) {
        this.search.daterange = ''
      } else {
        this.search.daterange[1].setHours(23, 59, 59)
      }

      if (!this.search.source) {
        this.search.source = ''
      }

      if (!this.search.sender_type) {
        this.search.sender_type = ''
      }

      if (!this.search.cases_type) {
        this.search.cases_type = ''
      }

      if (!this.search.status) {
        this.search.status = ''
      }

      try {
        const response = await axios.get('http://localhost:3000/letter/getLetter', {
          params: { limit: this.search.max_item, page: this.search.page, search: this.search },
        })
        this.total_lt = response.data.fullLength
        this.getTotalPage(response.data.page1Length)
        console.log(response.data)

        response.data.letter.forEach((element) => {
          const lt_case = this.getCaseById(element.case)

          lt_case.then((value) => {
            if (this.letter.length < response.data.letter.length) {
              this.letter.push({
                id: element._id,
                letter_no: element.letter_no,
                receive_at: element.receive_at,
                sender_type: element.sender_type,
                sender: {
                  quantity: element.sender[0].quantity,
                  owner: element.sender[0].owner,
                  Id_card: element.sender[0].Id_card,
                  address: {
                    province: this.getProvince(element.sender[0].address[0].province),
                    district: this.getDistrict(element.sender[0].address[0].district),
                    commune: this.getCommune(element.sender[0].address[0].commune),
                    specified_address: element.sender[0].address[0].specified_address,
                  },
                },
                cases: {
                  type: value.case_type,
                  content:
                    value.content.length > 200
                      ? (value.content = value.content.substring(0, 200) + '...')
                      : value.content,
                },
                status: element.status,
              })
            }
          })
        })
      } catch (error) {
        console.log(error)
      }
    },
    async getCaseById(element) {
      try {
        const response = await axios.get('http://localhost:3000/case/getCaseById', {
          params: { id: element },
        })
        return response.data
      } catch (error) {
        console.log(error)
      }
    },
    async getAddress() {
      try {
        const response = await axios.get('http://localhost:3000/province/getProvince')
        this.address = response.data
      } catch (error) {
        console.log(error)
      }
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
              this.getLetters()
              Swal.fire({
                title: 'Đã xóa!',
                text: 'Đơn thư đã được xóa.',
                icon: 'success',
              })
            }
          }
        })
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
              this.getLetters()
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
  },
  created() {
    this.getAgencies()
    this.getAddress()
    this.getLetters()
  },
}
</script>

<template>
  <div class="page-container">
    <div class="search-content">
      <div>
        <p>Khiếu nại tố cáo / <router-link class="link" to="/">Danh sách đơn thư</router-link></p>
      </div>
      <div class="search-bar">
        <el-select-v2
          v-model="search.gov_agency"
          filterable
          :options="gov_agency_options"
          clearable
          placeholder="Đơn vị"
          @change="
            () => {
              search.page = 1
              getLetters()
            }
          "
          style="width: 400px"
        />
        <el-date-picker
          v-model="search.daterange"
          type="daterange"
          range-separator="To"
          start-placeholder="Từ ngày"
          end-placeholder="Đến ngày"
          format="DD/MM/YYYY"
          @change="
            () => {
              search.page = 1
              getLetters()
            }
          "
          style="width: 300px"
        />
        <el-select-v2
          v-model="search.source"
          filterable
          :options="source_options"
          clearable
          style="width: 150px"
          @change="
            () => {
              search.page = 1
              getLetters()
            }
          "
          placeholder="Nguồn đơn thư"
        />
        <router-link class="add-link" to="/create">Thêm mới</router-link>
      </div>
    </div>
    <div>
      <table style="width: 100%; table-layout: fixed">
        <thead>
          <tr>
            <th style="width: 3%">
              <span>STT</span>
            </th>
            <th style="width: 10%">
              <span>Thông tin đơn thư</span>
            </th>
            <th style="width: 10%">
              <span>Phân loại chủ đơn</span>
            </th>
            <th style="width: 15%">
              <span>Thông tin chủ đơn</span>
            </th>
            <th style="width: 11%">
              <span>Loại đơn thư</span>
            </th>
            <th style="width: 30%">
              <span>Nội dung đơn thư</span>
            </th>
            <th style="width: 6%">
              <span>Hướng xử lý</span>
            </th>
            <th style="width: 8%">
              <span>Trạng thái</span>
            </th>
            <th style="width: 7%">
              <span>Thao tác</span>
            </th>
          </tr>
          <tr>
            <td></td>
            <td>
              <el-input
                v-model="search.letter_no"
                placeholder="Nhập..."
                @keyup.enter="
                  () => {
                    search.page = 1
                    getLetters()
                  }
                "
              />
            </td>
            <td>
              <el-select-v2
                class="tb-select-w-150"
                v-model="search.sender_type"
                filterable
                :options="sender_type_options"
                clearable
                @change="
                  () => {
                    search.page = 1
                    getLetters()
                  }
                "
                placeholder="Chọn"
              />
            </td>
            <td>
              <el-input
                v-model="search.sender"
                @keyup.enter="
                  () => {
                    search.page = 1
                    getLetters()
                  }
                "
                placeholder="Nhập..."
              />
            </td>
            <td>
              <el-select-v2
                class="tb-select-w-150"
                v-model="search.cases_type"
                filterable
                :options="cases_type_options"
                clearable
                @change="
                  () => {
                    search.page = 1
                    getLetters()
                  }
                "
                placeholder="Chọn"
              />
            </td>
            <td>
              <el-input
                v-model="search.content"
                @keyup.enter="
                  () => {
                    search.page = 1
                    getLetters()
                  }
                "
                placeholder="Nhập..."
              />
            </td>
            <td>
              <el-select-v2
                v-model="search.solution"
                filterable
                :options="solution_options"
                clearable
                @change="
                  () => {
                    search.page = 1
                    getLetters()
                  }
                "
                placeholder="Chọn"
              />
            </td>
            <td>
              <el-select-v2
                class="tb-select-w-150"
                v-model="search.status"
                filterable
                :options="status_options"
                clearable
                @change="
                  () => {
                    search.page = 1
                    getLetters()
                  }
                "
                placeholder="Chọn"
              />
            </td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <!-- <tr>
            <td>
              <span>1</span>
            </td>
            <td>
              <div class="tb-td-div">
                <span>H.01-24-00000</span>
                <span>12/01/2000</span>
              </div>
            </td>
            <td>
              <div class="tb-td-div"><span>Đoàn đông người</span> <span>4</span></div>
            </td>
            <td>
              <div class="tb-td-div">
                <span>Ngo Hoai Nam</span>
                <span>176261851781</span>
                <span>Phường An Lạc, Thành phố Bắc Ninh, Bắc Ninh</span>
              </div>
            </td>
            <td>
              <span>Tố cáo</span>
            </td>
            <td>
              <span
                >Chuyển tiếp văn bản Chuyển tiếp văn bản Chuyển tiếp văn bản Chuyển tiếp văn bản
                Chuyển tiếp văn bản Chuyển tiếp văn bản</span
              >
            </td>
            <td></td>
            <td>
              <span>Đang soạn thảo</span>
            </td>
            <td>
              <div class="tb-td-div-btn">
                <button class="btn-edit">Sửa</button> <button class="btn-del">Xóa</button>
              </div>
            </td>
          </tr> -->
          <tr v-for="(lt, index) in letter" :key="index">
            <td>
              <span>{{ index + 1 + (search.page - 1) * search.max_item }}</span>
            </td>
            <td>
              <div class="tb-td-div">
                <span
                  ><router-link class="link" :to="{ name: 'detail', params: { id: lt.id } }">{{
                    lt.letter_no
                  }}</router-link></span
                >
                <span>{{ formattedDate(lt.receive_at) }}</span>
              </div>
            </td>
            <td>
              <div class="tb-td-div">
                <span v-if="lt.sender_type == 1">Cá nhân</span>
                <span v-if="lt.sender_type == 2">Cơ quan, tổ chức</span>
                <span v-if="lt.sender_type == 3">Đoàn đông người</span>
                <span>{{ lt.sender.quantity }}</span>
              </div>
            </td>
            <td>
              <div class="tb-td-div">
                <span>{{ lt.sender.owner }}</span>
                <span>{{ lt.sender.Id_card }}</span>
                <span
                  >{{ lt.sender.address.commune }}, {{ lt.sender.address.district }},
                  {{ lt.sender.address.province }}</span
                >
              </div>
            </td>
            <td>
              <span v-if="lt.cases.type == 1">Khiếu nại</span>
              <span v-if="lt.cases.type == 2">Tố cáo</span>
              <span v-if="lt.cases.type == 3">Tranh chấp</span>
              <span v-if="lt.cases.type == 4">Kiến nghị, phản ánh</span>
            </td>
            <td>
              <span>{{ lt.cases.content }}</span>
            </td>
            <td></td>
            <td>
              <span v-if="lt.status == 1" class="status-1">Đang soạn thảo</span>
              <span v-if="lt.status == 2" class="status-2">Chờ xử lý</span>
            </td>
            <td>
              <div class="tb-td-div-btn" v-if="lt.status == 1">
                <button class="btn-xuly" @click="updateLtStatus(lt.id)">Gửi xử lý</button>
                <RouterLink
                  class="btn-edit"
                  :to="{ name: 'edit', params: { id: lt.id } }"
                  style="text-decoration: none; color: #fff"
                  >Sửa</RouterLink
                >
                <button class="btn-del" @click="handleDelete(lt.id)">Xóa</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="div-pagi">
      <div>
        <span>
          Hiển thị {{ letter.length + search.max_item * (search.page - 1) }} bản ghi trong tổng số
          {{ total_lt }} bản ghi</span
        >
      </div>
      <div class="pagi-cp">
        <div>
          <span
            style="cursor: pointer"
            @click="
              () => {
                if (search.page > 1) {
                  search.page = 1
                  getLetters()
                }
              }
            "
            >&lt;&lt;</span
          >
        </div>
        <div>
          <span
            style="cursor: pointer"
            @click="
              () => {
                if (search.page > 1) {
                  search.page--
                  getLetters()
                }
              }
            "
            >&lt;</span
          >
        </div>
        <div v-for="(pg, index) in total_page" :key="index">
          <button
            :class="['btn-pagi', { 'btn-cur-pagi': search.page == pg.page_num }]"
            @click="
              () => {
                if (search.page != pg.page_num) {
                  search.page = pg.page_num
                  getLetters()
                }
              }
            "
          >
            {{ pg.page_num }}
          </button>
        </div>
        <div>
          <span
            style="cursor: pointer"
            @click="
              () => {
                if (search.page < total_page.length) {
                  search.page++
                  getLetters()
                }
              }
            "
            >&gt;</span
          >
        </div>
        <div>
          <span
            style="cursor: pointer"
            @click="
              () => {
                if (search.page < total_page.length) {
                  search.page = total_page.length
                  getLetters()
                }
              }
            "
            >&gt;&gt;</span
          >
        </div>
        <div>
          <select
            v-model="search.max_item"
            @change="
              () => {
                search.page = 1
                getLetters()
              }
            "
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
