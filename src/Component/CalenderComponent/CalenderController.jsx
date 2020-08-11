import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faAlignJustify } from '@fortawesome/free-brands-svg-icons';
import {
    faPlay,
    faCloudRain,
    faSun,
    faPooStorm,
    faCloudSun
} from '@fortawesome/free-solid-svg-icons'
import React, { Component } from 'react';
import CalenderBody from './CalenderBody/CalenderBody';
import CalenderHeader from './CalenderHeader/CalenderHeader';
import { CheckMarkedDay } from '../Store/ModalOperation'
import './Calender.css'

export default class CaldenderController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDay: '',
            month: '',
            year: '',
            monthDays: '',
            weekDays: '',
            retrieveDayArr: []

        }
        console.log('Find out when the location can be loaded;', this.props)
        console.log(this.props.location.pathname.indexOf('/calender'))
    }


    getMonthDays = () => {
        //根据月份获取当前天数
        var year = this.state.year,
            month = this.state.month;
        var temp = new Date(year, month, 0).getDate();
        return temp
    }

    getFirstDayWeek = () => {
        //根据年月返回当月1号是星期几
        var year = this.state.year,
            month = this.state.month;
        var dt = new Date(year + '/' + month + '/1');//new Date(year,month,1);
        var Weekdays = dt.getDay();
        return Weekdays
    }


    changeCalender = (_year, _month) => {
        let { month, year } = this.state;
        month = _month;
        year = _year;
        this.setState({
            month,
            year,
        })
    }

    initCalendar = (_year, _month, _day) => {
        let { month, year, currentDay } = this.state;
        month = _month;
        year = _year;
        currentDay = _day;
        this.setState({
            month,
            year,
            currentDay
        })
        this.markDayRetrieve()
    }

    //Controller is used to interacte with the localStorage....
    markDayRetrieve = () => {
        console.log('Now reCheck the marked day 了')
        const markDayArr = CheckMarkedDay()

        let newDayAr = []
        markDayArr.length !== 0 && markDayArr.map(item => {
            newDayAr.push(Number(item.split('-')[0]))
        })
        this.setState({
            retrieveDayArr: newDayAr
        })
    }


    render() {
        const monthDays = this.getMonthDays();
        const weekDays = this.getFirstDayWeek()
        const { month, year, currentDay, retrieveDayArr } = this.state
        console.log(retrieveDayArr)
        return (
            <div className="cardFrame">
                <div className="card_calender">
                    < CalenderHeader
                        initCalendar={this.initCalendar}
                        changeCalender={this.changeCalender}
                        month={month}
                        year={year}
                    />
                    < CalenderBody
                        month={month}
                        year={year}
                        day={currentDay}
                        monthDays={monthDays}
                        weekDays={weekDays}
                        markDayRetrieve={this.markDayRetrieve}
                        retrieveDayArr={retrieveDayArr}
                    />
                </div>
            </div>
        )
    }
}