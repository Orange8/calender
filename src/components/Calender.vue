<template>
  <div class="calender">
    <div class="choose">
      <span class="choose-year">
        <i class="past" @click="$pastYear">&lt;</i>
        {{thisYear}}年
        <i class="next" @click="$nextYear">&gt;</i>
      </span>
      <span class="choose-today" @click="$today">
        今天
      </span>
      <span class="choose-month">
        <i class="past" @click="$pastMonth">&lt;</i>
        {{thisMonth}}月
        <i class="next" @click="$nextMonth">&gt;</i>
      </span>
    </div>
    <div class="weeks">
      <span>日</span>
      <span>一</span>
      <span>二</span>
      <span>三</span>
      <span>四</span>
      <span>五</span>
      <span>六</span>
    </div>
    <div
        v-for="(items, index) in calenderDateList"
        class="date"
    >
      <span
        v-for="(item, index) in items"
        :key="item.id"
        :class="item.id"
      >{{item.value}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'calender',
  data(){
    return {
      count: 0,
      today: new Date().getDate(),
      today_year: new Date().getFullYear(),
      today_month: new Date().getMonth()+1,
      thisYear: new Date().getFullYear(),
      thisMonth: new Date().getMonth()+1,
      isLeapear: 0,
      monthDate: [],
      calenderDate: [],
      calenderDateList: [],
    }
  },
  created() {
    this.$isLeapear(this.thisYear);
    this.$fillingDate();
  },
  methods: {
    // 判断是否为闰年
    $isLeapear(year) {
      year%100==0?this.isLeapear=(year%400==0?1:0):this.isLeapear=(year%4==0?1:0)
      return this.monthDate = [31, 28+this.isLeapear, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    },
    $fillingDate() {
      // debugger;
      let firstDay_week = new Date(this.thisYear, this.thisMonth-1, 1).getDay()+1;
      let passDay = firstDay_week - 1;
      let futureDay = '';
      let num = 0;
      let num1 = 0;
      for (let i = 1; i <= 42; i++) {
        // 判断本月一号是否为第一天
        if (i < firstDay_week) {
          passDay--;
          let lastMonth = '';
          this.thisMonth-2<0?lastMonth=(this.thisMonth-2==-2?12:11):lastMonth=this.thisMonth-2;
          let data = {
            id: 'past',
            value: this.monthDate[lastMonth] - passDay
          }
          this.calenderDate.push(data);
        } else {
          ++num;
          // 将下月日期填充到剩余空格
          let lastMonth = '';
          this.thisMonth-1<0?lastMonth=11:lastMonth=(this.thisMonth-1);
          if (num > this.monthDate[lastMonth]) {
            ++num1;
            let data = {
              id: 'future',
              value: num1
            }
            this.calenderDate.push(data);
          } else {
            // 判断是否为今天
            if (this.thisYear == this.today_year && this.thisMonth == this.today_month && num == this.today) {
              let data = {
                id: 'today',
                value: num
              }
              this.calenderDate.push(data);
            } else {
              let data = {
                id: 'now',
                value: num
              }
              this.calenderDate.push(data);
            }
          }
        }
        if (i%7 == 0) {
          let dataList = {};
          dataList = this.calenderDate;
          // console.log(dataList);
          this.calenderDateList.push(dataList);
          this.calenderDate = [];
        }
      }
    },
    // 去年
    $pastYear() {
      this.calenderDate = [];
      this.calenderDateList = [];
      this.thisYear--;
      this.$isLeapear(this.thisYear);
      this.$fillingDate();
    },
    // 明年
    $nextYear() {
      this.calenderDate = [];
      this.calenderDateList = [];
      this.thisYear++;
      this.$isLeapear(this.thisYear);
      this.$fillingDate();
    },
    // 上个月
    $pastMonth() {
      this.calenderDate = [];
      this.calenderDateList = [];
      this.thisMonth--;
      if (this.thisMonth == 0) {
        this.thisMonth = 12;
        this.thisYear--
      }
      this.$isLeapear(this.thisYear);
      this.$fillingDate();
    },
    // 下个月
    $nextMonth() {
      this.calenderDate = [];
      this.calenderDateList = [];
      this.thisMonth++;
      if (this.thisMonth == 13) {
        this.thisMonth = 1;
        this.thisYear++;
      }
      this.$isLeapear(this.thisYear);
      this.$fillingDate();
    },
    // 今天
    $today() {
      this.calenderDate = [];
      this.calenderDateList = [];
      this.thisYear = this.today_year;
      this.thisMonth = this.today_month;
      this.$isLeapear(this.thisYear);
      this.$fillingDate();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.calender{
  width: 500px;
  margin: 0 auto;
  .choose{
    display: flex;
    .choose-year{
      flex: 1;
      text-align: left;
      i.past, i.next{
        display: inline-block;
        padding: 0 10px;
        cursor: pointer;
      }
    }
    .choose-month{
      flex: 1;
      text-align: right;
      i.past, i.next{
        display: inline-block;
        padding: 0 10px;
        cursor: pointer;
      }
    }
    .choose-today{
      flex: 1;
      text-align: center;
      cursor: pointer;
    }
  }
  .weeks{
    display: flex;
    font-size: 0px;
    border-left: 1px solid #ddd;
    span{
      flex: 1;
      line-height: 30px;
      background-color: #eee;
      font-size: 14px;
      border-right: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      border-top: 1px solid #ddd;
    }
  }
  .date{
    display: flex;
    border-left: 1px solid #ddd;
    span{
      flex: 1;
      line-height: 50px;
      border-right: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      color: #000;
      &.past, &.future{
        color: #999;
      }
      &.today{
        color: #fd614c;
        font-weight: bold;
      }
    }
  }
}
</style>
