// html selectors 
const templateContainer = $('.template-container')

// this will find all instances of '{{text}}'
// https://regex-generator.olafneumann.org/?sampleText=%7B%7Bsam%7D%7D&flags=i&onlyPatterns=false&matchWholeLine=false&selection=2%7CMultiple%20characters
const collectAllInstances = (str) => str.match(/\{\{(([a-zA-Z]+))\}\}/g)
const extractVariablesFromString = (str) => {
    const arrOfInstances = collectAllInstances(str)
    let valuesObject = {}
    arrOfInstances?.map((val, idx) => valuesObject = {
        ...valuesObject,
        [`${val.match(/\{\{(([a-zA-Z]+))\}\}/)[1]}`]: ''
    })
    return valuesObject
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
const getLocalStorage = () => JSON.parse(localStorage.getItem(lsKey)) || []
const setLocalStorage = (arr) => localStorage.setItem(lsKey, JSON.stringify(arr))
const initLocalStorage = () => {
    const defaultStr = 'Hello {{name}},\n\nCreate a custom template using {{this}} pattern to create {{dynamic}} variables!'
    setLocalStorage([{ templateFor: 'first-template', template: defaultStr, templateValues: extractVariablesFromString(defaultStr) }])
}

const buildTemplateInputs = (templateValues, idx) => {
    const arr = []
    for (let [key, value] of Object.entries(templateValues)) {
        arr.push(`<div class="is-flex is-flex-direction-column is-align-items-center m-4">
            <label class="title is-6 mb-1" htmlFor=${key}>${key}</label>
            <textarea type=text name=${key} data-idx="${idx}" aria-label="templateValues" value="${value}" ></textarea>
            </div>`)
    }
    return arr.join('')
}

const init = () => {
    const existingData = getLocalStorage()
    // seed localStorage with example data if none available
    if (!existingData.length) {
        initLocalStorage()
        init()
    }
    // create a new section for each saved template
    existingData.map(({ templateFor, template, templateValues }, idx) => {
        // build a section for each template
        templateContainer.append(`
        <section class="section m-6" data-idx="${idx}">
        <label class="title is-3" htmlFor=${templateFor} ">Name: </label>
        <input type=text data-idx="${idx}" name="${templateFor}" aria-label="templateFor" value="${templateFor}" id="template-for-${idx}" >
        <div class="field mt-3">
        <label class="label">template</label>
        <div class="control">
        <textarea class="textarea" data-idx="${idx}" aria-label="template">${template}</textarea>
        </div></div>
        <label class="label">input variable</label>
        <div class="container is-flex is-flex-wrap-wrap is-justify-content-center mb-6" id=variable-container-${idx}>
        ${/* add any existing values*/buildTemplateInputs(templateValues, idx)}</div>
        <div class="field mt-3">
        <label class="label">output</label>
        <div class="control">
        <textarea class="textarea" data-idx="${idx}" aria-label="template" id="template-output-${idx}" disabled>${buildTemplateOutput(template, templateValues)}</textarea>
        </div></div>
        <button class="button save-template" data-idx="${idx}"">save</button>        
        </section>`);
    })
}
init()

templateContainer.on('keyup', ({ code, target }) => {
    const skipThese = ['shiftleft', 'space', 'shiftright']
    if (skipThese.indexOf(code.toLowerCase()) !== -1) return

    const { ariaLabel, dataset, name, value } = target
    const { idx } = dataset

    const localStorageArr = getLocalStorage()
    const output = $(`#template-output-${idx}`)

    if (ariaLabel === 'templateFor') {
        const templateFor = $(`#template-for-${idx}`).val()
        localStorageArr[idx] = { ...localStorageArr[idx], templateFor }
    }

    if (ariaLabel === 'template') {
        const template = $(`textarea[data-idx="${idx}"]`).val()
        const templateValues = extractVariablesFromString(template)
        localStorageArr[idx] = { ...localStorageArr[idx], template, templateValues }
        $(`#variable-container-${idx}`).empty().append(buildTemplateInputs(templateValues, idx))
    }

    if (ariaLabel === 'templateValues') localStorageArr[idx].templateValues = { ...localStorageArr[idx].templateValues, [name]: value }

    output.val(buildTemplateOutput(localStorageArr[idx].template, localStorageArr[idx].templateValues))
    setLocalStorage(localStorageArr)
})



// const data = { username: 'example' };

// fetch('https://example.com/profile', {
//   method: 'POST', // or 'PUT'
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(data),
// })



templateContainer.on('click', '.save-template', ({ target }) => {
    const { idx } = target.dataset
    console.log(idx)
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