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
      <span class="weekends">日</span>
      <span>一</span>
      <span>二</span>
      <span>三</span>
      <span>四</span>
      <span>五</span>
      <span class="weekends">六</span>
    </div>
    <div
      v-for="(items, index) in calenderDateList"
      :key="index"
      class="date">
      <span
        v-for="(item, index) in items"
        :key="index"
        :class="item.id">
        <i v-if="item.signIn" class="signIn">签</i>
        <i v-if="item.holiday" class="holiday">休</i>
        {{item.day}}
      </span>
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
      monthDate: [], // 今年月份列表
      calenderDate: [],
      calenderDateList: [],
      signList: [1509206400000, 1509379200000,1509811200000, 1510243200000], //已签到日期列表
      holidayList: [1509206400000, 1506787200000, 1506873600000, 1506960000000, 1507046400000, 1507132800000, 1507219200000, 1507305600000] // 节假日日期列表
    }
  },
  created() {
    this.$isLeapear(this.thisYear);
    this.$fillingDate();
    // console.log(this.holidayList);
  },
  methods: {
    // 判断是否为闰年
    $isLeapear(year) {
      year%100==0?this.isLeapear=(year%400==0?1:0):this.isLeapear=(year%4==0?1:0)
      return this.monthDate = [31, 28+this.isLeapear, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    },
    // 填充日历
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
          // 将上月日期填充到空格
          passDay--;
          let lastMonth = '';
          let thisYear = '';
          let thisMonth = '';
          let thisDay = '';
          this.thisMonth-2<0?lastMonth=(this.thisMonth-2==-2?12:11):lastMonth=this.thisMonth-2;
          this.thisMonth == 1 ? thisYear = this.thisYear - 1 : thisYear = this.thisYear;
          this.thisMonth == 1 ? thisMonth = 12 : thisMonth = this.thisMonth - 1;
          thisDay = this.monthDate[lastMonth] - passDay;
          let data = {
            id: 'past',
            year: thisYear,
            month: thisMonth,
            day: thisDay
          }
          //判断节假日及签到日期
          this.$specialDate(this.signList, this.holidayList, thisYear, thisMonth, thisDay, data);
          // debugger;
          this.calenderDate.push(data);
        } else {
          ++num;
          // 将下月日期填充到剩余空格
          let nextMonth = '';
          let thisYear = '';
          let thisMonth = '';
          this.thisMonth-1<0?nextMonth=11:nextMonth=(this.thisMonth-1);
          this.thisMonth == 12 ? thisYear = this.thisYear + 1 : thisYear = this.thisYear;
          this.thisMonth == 12 ? thisMonth = 1 : thisMonth = this.thisMonth + 1;
          if (num > this.monthDate[nextMonth]) {
            ++num1;
            let data = {
              id: 'future',
              year: thisYear,
              month: thisMonth,
              day: num1
            }
            //判断节假日及签到日期
            this.$specialDate(this.signList, this.holidayList, thisYear, thisMonth, num1, data);
            // debugger;
            this.calenderDate.push(data);
          } else {
            // 判断是否为今天
            if (this.thisYear == this.today_year && this.thisMonth == this.today_month && num == this.today) {
              let data = {
                id: 'today',
                year: this.thisYear,
                month: this.thisMonth,
                day: num
              }
              //判断节假日及签到日期
              this.$specialDate(this.signList, this.holidayList, this.thisYear, this.thisMonth, num, data);
              // debugger;
              this.calenderDate.push(data);
            } else {
              let data = {
                id: 'now',
                year: this.thisYear,
                month: this.thisMonth,
                day: num
              }
              //判断节假日及签到日期
              this.$specialDate(this.signList, this.holidayList, this.thisYear, this.thisMonth, num, data);
              // debugger;
              this.calenderDate.push(data);
            }
          }
        }
        if (i%7 == 0) {
          let dataList = {};
          dataList = this.calenderDate;
          //添加周末标识
          dataList[0].weekends = true;
          dataList[dataList.length-1].weekends = true;
          dataList[0].id = dataList[0].id + ' weekends';
          dataList[dataList.length-1].id = dataList[dataList.length-1].id + ' weekends';
          console.log(dataList);
          this.calenderDateList.push(dataList);
          this.calenderDate = [];
        }
      }
      console.log(this.calenderDateList);
    },
    // 判断已签到的日期以及节假日
    $specialDate(signList, holidayList, thisYear, thisMonth, thisDay, data) {
      //判断已签到的日期
      for (let s = 0; s < signList.length; s++) {
        // debugger;
        let d = new Date();
        d.setTime(signList[s]);
        if (thisYear == (d.getFullYear()) && thisMonth == (d.getMonth()+1) && thisDay == (d.getDate())) {
          data.id = data.id + ' signIn';
          data.signIn = true;
        }
      }
      //判断节假日
      for (let h = 0; h < holidayList.length; h++) {
        // debugger;
        let d = new Date();
        d.setTime(holidayList[h]);
        if (thisYear == (d.getFullYear()) && thisMonth == (d.getMonth()+1) && thisDay == (d.getDate())) {
          data.id = data.id + ' holiday';
          data.holiday = true;
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
      &.weekends{
        color: #e02d2d;
      }
    }
  }
  .date{
    display: flex;
    border-left: 1px solid #ddd;
    span{
      position: relative;
      flex: 1;
      line-height: 50px;
      border-right: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      color: #000;
      font-weight: bold;
      &.today{
        color: #fff;
        background-color: #ffb207;
        font-weight: bold;
      }
      &.weekends{
        color: #e02d2d;
      }
      &.past, &.future{
        color: #b7b7b7;
      }
      &.signIn{
        i.signIn{
          display: inline-block;
          position: absolute;
          left: 0;
          top: 10px;
          color: #e02d2d;
          font-weight: bold;
          font-style: normal;
          line-height: 0;
        }
      }
      &.holiday{
        i.holiday{
          display: inline-block;
          position: absolute;
          right: 0;
          top: 10px;
          color: #e02d2d;
          font-weight: bold;
          font-style: normal;
          line-height: 0;
        }
      }
    }
  }
}
</style>
