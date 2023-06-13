const locale = 'en'
const intlMonth = new Intl.DateTimeFormat(locale, { month: 'long' })
const intlWeekday = new Intl.DateTimeFormat(locale, { weekday: 'short' })

const currentYear = new Date().getFullYear()

const weekdays = [...Array(7).keys()]
const weekdayNames = weekdays.map((day) => (
  intlWeekday.format(new Date(2023, 0, day + 1))
))

const months = [...Array(12).keys()]

const calendar = months.map((month) => {
  const daysInMonth = new Date(currentYear, month + 1, 0).getDate()
  const daysOfMonth = [...Array(daysInMonth).keys()].map((day) => day + 1)
  const firstDayOfMonth = new Date(currentYear, month, 1).getDay()
  const monthName = intlMonth.format(new Date(currentYear, month))

  return { daysOfMonth, firstDayOfMonth, monthName }
})

const weekdayNamesHtml = weekdayNames.map((weekday) => (
  `<li class="day-name">${weekday}</li>`
)).join('')

const monthsHtml = calendar.map(({ daysOfMonth, firstDayOfMonth, monthName }) => {
  const monthHtml = `<h1>${monthName} ${currentYear}</h1>`

  const firstDayOfMonthAttributes = `
    class="first-day" style="--first-day-start: ${firstDayOfMonth}"
  `
  const weekdaysHtml = daysOfMonth.map((day, index) => (
    `<li ${index === 0 ? firstDayOfMonthAttributes : ''}>${day}</li>`
  )).join('')

  const calendarHtml = `<ol>${weekdayNamesHtml} ${weekdaysHtml}</ol>`

  return `${monthHtml} ${calendarHtml}`
}).join('')

document.querySelector('#calendar').innerHTML = monthsHtml
