// html selectors 
const templateContainer = $('.template-container')

// this will find all instances of '{{text}}'
// https://regex-generator.olafneumann.org/?sampleText=%7B%7Bsam%7D%7D&flags=i&onlyPatterns=false&matchWholeLine=false&selection=2%7CMultiple%20characters
const collectAllInstances = (str) => str.match(/\{\{(([a-zA-Z]+))\}\}/g)
const extractVariablesFromString = (str) => {
    const arrOfInstances = collectAllInstances(str)
    let valuesObject = {}
    arrOfInstances?.map((val, i) => valuesObject = {
        ...valuesObject,
        [`${val.match(/\{\{(([a-zA-Z]+))\}\}/)[1]}`]: ''
    })
    return valuesObject
}

const persistVariableValues = (ls, templateValues) => {
    for (let [k] of Object.entries(templateValues)) {
        templateValues[k] = ls.templateValues[k] || ''
    }
}

const buildTemplateOutput = (template, templateValues) => {
    let updatedTemplate = template
    for (let [key, value] of Object.entries(templateValues)) {
        updatedTemplate = updatedTemplate.replace(`{{${key}}}`, value)
    }
    return updatedTemplate
}

// localstorage tools
const lsKey = 'templateTool'
const getLocalStorage = () => JSON.parse(localStorage.getItem(lsKey)) || initLocalStorage()
const setLocalStorage = (arr) => localStorage.setItem(lsKey, JSON.stringify(arr))
const initLocalStorage = () => {
    const defaultStr = `Hi {{firstName}}
    <Invite student to 'Tutors & Students' slack right now>
    Nice to e-meet you! My name is Samuel, and I was assigned to be your tutor for the duration of the Bootcamp.
    I am a Full Stack Web Developer and Bootcamp graduate, so I understand the challenges you may be facing.
    I just sent an invite to our Slack tutoring workspace, Tutors & Students.
    This is a separate Slack workspace (not a channel) where we will communicate by direct message (DM).
    Let me know if you don't see the invite or have any issues getting set up.
    Please send me (@Samuel Fox) a DM once you create your account there.
    Also, make sure to have that Slack available on your mobile phone to message me if there are problems with wifi, etc.
    Maximum tutorial sessions per week - our week is Monday - Sunday.
    Part-time (6-month boot camp) students are entitled to 1 session per week.
    Full-time (3-month boot camp) students are entitled to 2 sessions per week.
    Schedule your weekly session at: https://calendly.com/samueljfox-2u/tutor-session
    On the Calendly page, be sure you have the correct time zone selected in the section labeled "Times are in"
    If our availability doesn’t sync, let me know and I'll see if we can figure something out!
    Each session takes place over Zoom.us (video chat/screen sharing) and lasts about 50 minutes.
    I'll email you the Zoom.us link the day before our scheduled time.
    If you have not used zoom before, please join the meeting at least 15 minutes early as you may have to download & install some software.
    All I need from you:
    Be on Slack 5 minutes before your time slot.
    Make sure your computer/mic/internet connection is working.
    Make sure your workspace is quiet and free from interruptions.
    At the end of the session, I will provide you with a link to a 2-minute evaluation form that you are required to complete.
    Please Slack or email me with any questions.  I look forward to our first meeting!
    CC Central Support on all emails by always using REPLY ALL.\n    
    Thank you,
    
    Samuel Fox
    
    sfox2@bootcampspot.com`
    const newArr = [{
        templateFor: 'first-template',
        template: defaultStr,
        templateValues: extractVariablesFromString(defaultStr)
    }]
    setLocalStorage(newArr)
    return newArr
}

const buildTemplateInputs = (templateValues, i) => {
    const arr = []
    for (let [key, value] of Object.entries(templateValues)) {
        arr.push(`<div class="is-flex is-flex-direction-column is-align-items-center m-4">
            <label class="title is-6 mb-1" htmlFor=${key}>${key}</label>
            <textarea type=text name=${key} data-i="${i}" aria-label="templateValues">${value}</textarea>
            </div>`)
    }
    return arr.join('')
}

const init = () => {
    const existingData = getLocalStorage()
    // seed localStorage with example data if none available

    // create a new section for each saved template
    existingData.map(({ templateFor, template, templateValues }, i) => {
        // build a section for each template
        templateContainer.append(`
        <section class="section" data-i="${i}">
        <div class="is-flex is-align-items-center">
        <label class="label mb-0 mx-2 is-size-7" htmlFor=${templateFor}">1. name it</label>
        <input type=text data-i="${i}" name="${templateFor}" aria-label="templateFor" value="${templateFor}" id="template-for-${i}" >
        </div>
        <div class="field mt-3 border">
        <label class="label is-size-7">2. build it</label>
        <div class="control">
        <p class="is-size-7 mx-6 mb-3">**build a template in the textbox below. To create a variable, wrap a word {{likeThis}} to see the magic</p>
        <textarea class="textarea" data-i="${i}" aria-label="template">${template}</textarea>
        </div></div>
        <div class="container is-flex is-flex-wrap-wrap border" id=variable-container-${i}>
        <label class="label mb-0 is-size-7">3.{{value}} it</label>
        ${/* add any existing values*/buildTemplateInputs(templateValues, i)}</div>
        <div class="field mt-3 border">
        <label class="label is-size-7">3. view it</label>
        <div class="control">
        <textarea class="textarea" data-i="${i}" aria-label="template" id="template-output-${i}" disabled>${buildTemplateOutput(template, templateValues)}</textarea>
        </div></div>
        <button class="button is-small is-primary is-outlined save-template" data-i="${i}"">save it</button>        
        </section>`);
    })
}
init()


const handleKeyup = ({ code, target }) => {
    const skipThese = ['shiftleft', 'shiftright']
    if (skipThese.indexOf(code.toLowerCase()) !== -1) return

    const { ariaLabel, dataset, name, value } = target
    const { i } = dataset

    const ls = getLocalStorage()

    if (ariaLabel === 'templateFor') {
        const templateFor = $(`#template-for-${i}`).val().replace(' ', '-')
        ls[i] = { ...ls[i], templateFor }
        $(`#template-for-${i}`).val(templateFor)
    }

    if (ariaLabel === 'template') {
        const template = $(`textarea[data-i="${i}"]`).val()
        let templateValues = extractVariablesFromString(template,)
        persistVariableValues(ls[i], templateValues)
        ls[i] = { ...ls[i], template, templateValues }
        $(`#variable-container-${i}`).empty().append(buildTemplateInputs(ls[i].templateValues, i))
    }

    if (ariaLabel === 'templateValues') {
        ls[i].templateValues = { ...ls[i].templateValues, [name]: value }
    }

    $(`#template-output-${i}`).val(buildTemplateOutput(ls[i].template, ls[i].templateValues))
    setLocalStorage(ls)
}

templateContainer.on('keyup', handleKeyup)



// const data = { username: 'example' };

// fetch('https://example.com/profile', {
//   method: 'POST', // or 'PUT'
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(data),
// })



templateContainer.on('click', '.save-template', ({ target }) => {
    const { i } = target.dataset
    console.log(i)
})
const setAuthTokenforDev = () => {

}
fetch('http://localhost:3001/api/template', {
    headers: {
        "Authorization": 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoic2FtMUBlbWFpbC5jb20iLCJfaWQiOiI2MTUzNmEyNDRlNDk2YmNmNjQyYTliMmMifSwiaWF0IjoxNjMzMDI5Mzg4LCJleHAiOjE2MzMxMTU3ODh9.Mibb9kzDvwB9E_En5sf3V0wOZ7p13J9lc6HU12gL954'
    }
})
    .then(response => response.json())
    .then((data) => console.log(data))
    .catch(error => console.log(error))