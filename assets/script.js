// const dbResponse = [
//     {
//         _id: "6153b0a09d152b407978b133",
//         author_id: "61536a244e496bcf642a9b2c",
//         templateFor: "new-student",
//         templateValues: "['Alice','Bob', 'BobRoss','https://calendly.com']",
//         template: "Hi {{0}},\n\nNice to e-meet you! My name is {{1}}, and I was assigned to be your tutor for the duration of the Bootcamp.\n\nI am a Full Stack Web Developer and Bootcamp graduate, so I understand the challenges you may be facing.\n\nI just sent an invite to our Slack tutoring workspace, Tutors & Students.\nThis is a separate Slack workspace (not a channel) where we will communicate by direct message (DM).\nLet me know if you don't see the invite or have any issues getting set up.\n\nPlease send me (@{{2}}) a DM once you create your account there.\nAlso, make sure to have that Slack available on your mobile phone to message me if there are problems with wifi, etc.\n\nMaximum tutorial sessions per week - our week is Monday - Sunday.\nPart-time (6-month boot camp) students are entitled to 1 session per week.\nFull-time (3-month boot camp) students are entitled to 2 sessions per week. \n\nSchedule your weekly session at: {{3}}\nOn the Calendly page, be sure you have the correct time zone selected in the section labeled 'Times are in' \n\nIf our availability doesn’t sync, let me know and I'll see f we can figure something out!\n\nEach session takes place over Zoom.us (video chat/screen sharing) and lasts about 50 minutes.\nI'll email you the Zoom.us link the day before our scheduled time.\nIf you have not used zoom before, please join the meeting at least 15 minutes early as you ay have to download & install some software.\n\nAll I need from you:\n- Be on Slack 5 minutes before your time slot.\n- Make sure your computer/mic/internet connection is working.\n- Make sure your workspace is quiet and free from interruptions.\n\nAt the end of the session, I will provide you with a link to a 2-minute evaluation form that you are required to complete.\n\nPlease Slack or email me with any questions.  I look forward to our first meeting!\n\nCC Central Support on all emails by always using REPLY ALL.",
//         createdAt: 1632874656,
//         __v: 0
//     }
// ]

// html selectors 
const textarea = $('textarea')


// localstorage tools
const newObj = { values: [], string: '' }
const lsKey = 'template'
const getLocalStorage = () => JSON.parse(localStorage.getItem(lsKey)) || []
const setLocalStorage = (arr) => localStorage.setItem(lsKey, JSON.stringify(arr))


// this will find all instances of '{{text}}'
// https://regex-generator.olafneumann.org/?sampleText=%7B%7Bsam%7D%7D&flags=i&onlyPatterns=false&matchWholeLine=false&selection=2%7CMultiple%20characters
const collectAllInstances = (str) => str.match(/\{\{(([a-zA-Z]+))\}\}/g)
const extractVariablesFromString = (str) => {
    const arrOfInstances = collectAllInstances(str)
    const arrOfValues = arrOfInstances?.map(val => val.match(/\{\{(([a-zA-Z]+))\}\}/)[1])
    return arrOfValues
}

const setVariablesInString = (arr, str) => {

}

const str = 'hello {{sam}} how are you {{today}}'

textarea.on('keyup', (e) => {

    const allText = textarea.val()
    console.log(extractVariablesFromString(allText))
})