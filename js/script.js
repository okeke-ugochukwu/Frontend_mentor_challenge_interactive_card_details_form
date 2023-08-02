var main = document.querySelector('.main')
var form = document.getElementById('form')

var submitBtn = document.getElementById('submit_btn')
var formConfirmation = document.querySelector('.confirmation')

var continueBtn = document.querySelector('.continue-btn')
var previewBtn = document.querySelector('.preview-btn')
var returnBtn = document.querySelector('.return-btn')

var previewBlock = document.querySelector('.card-preview-block')
var formBlock = document.querySelector('.card-details-block')

var cardContainer = document.querySelector('.card-preview')
var cardContainerInr = document.querySelector('.card-preview_inner')
var cardContainerInrSub = document.querySelector('.card-preview__inner')
var cardContainerInrSub2 = document.querySelector('.card-preview___inner')
cardContainerInr.vanillaTilt.destroy();


var cardFront = document.querySelector('.card-preview__front')
var cardBack = document.querySelector('.card-preview__back')
var cardInfo = document.querySelector('.card_info')

var assets = { }

//CREATE A LIST OF IDs TO REFERNCE INPUTS
var inputs = ['name', 'number', 'month', 'year', 'cvc']

//GENERATE A LIST OF OBJECTS FROM THE ABOVE ARRAY OF IDs
//EACH OBJECT HAS: 
   //>>AN ID (STRING), USED TO TARGET & REFERENCE EVERY ELEMENT USED IN THE REAL TIME PREVIEW
   //>>EL: THE SOURCE INPUT ELEMENT
   //>>IND: THE SOURCE INPUT STATE INTICATOR (STYLED TO BE THE SOURCE INPUT BORDER)
   //>>ERR.EL: ELEMENT FOR DISPLAYING ERROR MSSGS BASED ON THE VALIDITY OP THE SOURCE INPUT'S VALUE
   //>>ERR.MSSG: THE ERROR MSSG TO BE DISPLAYED
   //>>DISPLAYEL: THE ELEMENT IN THE ATM CARD BEING UPDATED BY THE SOURCE INPUT
   //>>VALUE.INIT: THE ORIRINAL TEXT CONTENT OF 'DISPLAYEL'
   //>>VALUE.NEW: THE NEW TEXT CONTENT OF 'DISPLAY' ELEMENT GOTTEN FROM THE VALUE OF THE SOURCE ELEMENT AS SOON AS CHANGED

//WITH THESE VALUES IN EACH OBJECT, INPUTS ELEMENT ON THE FORM ARE MATCHED 
//TO CORESPONDING ELEMENTS ITS NEEDS

//INPIRED BY VUE MODEL :)

inputs.forEach(id => {
   assets[`${id}_input`] = {
      id: id,
      el: document.getElementById(`${id}_input`),
      ind: document.getElementById(`${id}_input_ind`),
      err: {
         el: document.getElementById(`${id}_input_err`) || document.getElementById(`exp_err`),
         mssg: null
      },
      dispalyEl: document.getElementById(`card_${id}`),
      value: {
         init: document.getElementById(`card_${id}`).innerText.toLowerCase(),
         new: null
      }
   }
});

for (const asset in assets) {
   assets[asset].el.addEventListener('keyup', (e)=> {
      let a = assets[asset] 

      a.value.new = a.el.value 
      REMOVE_ERROR(a)

      switch (true) {
         case e.key === 'Tab' || e.key === 'Shift': ' '
         break;

         case a.value.new.length === 0 : 
            a.dispalyEl.innerText = a.value.init
         break;
         
         case a.id === 'name': 
            if( a.el.value.length > 25 ) {
               a.value.new = a.el.value.substring(0, 25)
               UPDATE_VALUES(a)
            }
            else{
               a.dispalyEl.innerText = a.el.value
            }
         break;

         case a.id === 'number': 
            var textArray = 
               a.el.value  
                  .replace(/\s/g,'')
                  .replace(/[^a-zA-z0-9 ]/g,'') 
                  .split('')

            if (textArray.length > 16) {
               textArray = textArray.splice(0, 16)
               assets.month_input.el.focus()
            }
            
            if (textArray.length === 16) {
               assets.month_input.el.focus()
            }

            if (textArray.length > 4) {
               var interval = 4 ; var position = 0

               for (let i = 0; i < Math.floor(textArray.length/interval); i++) {
                  position += interval
                  textArray
                     .splice(position + i, 0, " ")
               }  
            }

            textArray = textArray.join('').trim()
            
            a.value.new = textArray; 
            UPDATE_VALUES(a)

         break;

         case a.id === 'month' || a.id === 'year': 
            if ( a.el.value.length === 2 ) {
               UPDATE_VALUES(a)

               a.id === 'month'
                  ? assets.year_input.el.focus()
                  : assets.cvc_input.el.focus()  
            }
            else if ( a.el.value.length > 2 ) {
               a.value.new = a.el.value.substring(0, 2)
               UPDATE_VALUES(a)

               a.id === 'month'
                  ? assets.year_input.el.focus()
                  : assets.cvc_input.el.focus()    
            }
            else {
               a.dispalyEl.innerText = a.el.value
            }

         break;

         case a.id === 'cvc' || a.id === 'year': 
            if( a.el.value.length > 3 ) {
               a.value.new = a.el.value.substring(0, 3)
               UPDATE_VALUES(a)
            }
            else{
               a.dispalyEl.innerText = a.el.value
            }
         break;
   
         default:
            a.dispalyEl.innerText = a.el.value;
      }

      
   })
   
}

const UPDATE_VALUES = (a) => {
   a.el.value = a.value.new
   a.dispalyEl.innerText = a.value.new  
}


submitBtn.addEventListener('click', (e) => {
   e.preventDefault()
   VERIFY_INPUTS()
})

previewBtn.addEventListener('mousedown', (e)=> {
   e.target.style.transform =  'scale(.98)'
})

previewBtn.addEventListener('mouseup', (e)=> {
   e.target.style.transform =  'scale(1)'
})

previewBtn.addEventListener('click', ()=> {
   INIT_PREVIEW()
})

returnBtn.addEventListener('click', ()=> {
   END_PREVIEW()
})

const VERIFY_INPUTS = () => {

   let validInputs = 0
   
   for (const asset in assets) {
      let a = assets[asset] 

      switch (true) { 
         case a.value.new === null  || a.value.new.length === 0 :
            SHOW_ERROR(a, "Can't be blank")
         break;

         case a.id === 'name':
            if(/[0-9]/i.test(a.value.new)) {
               SHOW_ERROR(a, "Wrong format, letters only")
            }
            else if(a.value.new.split(' ').length  === 1) {
               SHOW_ERROR(a, "At least two names")
            }
            else {
               validInputs++
            }
         break;

         case a.id === 'number' :
            if(a.value.new.length < 16) {
               SHOW_ERROR(a, "Incomplete card number")
            }
            else if(/[a-z]/i.test(a.value.new)) {
               SHOW_ERROR(a, "Wrong format, numbers only")
            }
            else {
               validInputs++
            }
         break;

         case a.id === 'month': 
            if(a.value.new.length < 2) {
               SHOW_ERROR(a, "Incomplete date format")
            }
            else if ( +a.el.value > 31 ) {
               SHOW_ERROR(a, "Incorrect date")
            }
            else {
               validInputs++
            }
         break;

         case a.id === 'year': 
            if(a.value.new.length < 2) {
               SHOW_ERROR(a, "Incomplete date format")
            }
            else if ( +a.el.value < 23 ) {
               SHOW_ERROR(a, "Incorrect date")
            }
            else {
               validInputs++
            }
         break;

         case a.id === 'cvc': 
            if(a.value.new.length < 3) {
               SHOW_ERROR(a, "Incomplete cvc")
            }
            else {
               validInputs++
            }
         break;
      
      }
   }

   validInputs === 5 ? INIT_SUBMIT_CONFIRMATION() : ' '
}

const SHOW_ERROR = (asset, mssg) => {
   asset.err.el.innerText = mssg
   asset.err.el.classList.add('shown')
   asset.el.classList.add('invalid') 
}

const REMOVE_ERROR = (asset) => {
   asset.err.el.innerText = ''
   asset.err.el.classList.remove('shown')
   asset.el.classList.remove('invalid') 
}

const INIT_SUBMIT_CONFIRMATION = (e) => {
   submitBtn.value = 'One sec..'

   setTimeout(() => {
      form.classList.add('hidden')
      formConfirmation.classList.remove('hidden')
   }, 1000);
}

const INIT_PREVIEW = () =>{

   setTimeout(()=> {
      main.style.opacity = 0
      
   }, 500)

   setTimeout(()=> {

      VanillaTilt.init(cardContainerInr)
      cardContainerInrSub.addEventListener('dblclick', ROTATE)
      cardContainerInrSub.addEventListener('mouseenter', SHOW_INSTRUCTION)
      cardContainerInrSub.addEventListener('mouseleave', HIDE_INSTRUCTION)

      cardContainerInrSub2.style.animation = '2s levitate linear infinite'

      formBlock.classList.add('in-preview')
      previewBlock.classList.add('in-preview')

      cardContainer.classList.add('in-preview')

   }, 1000)

   setTimeout(()=> {
      main.style.opacity = 1
   }, 1500)
}

const END_PREVIEW = () => {
   setTimeout(()=> {
      main.style.opacity = 0
   }, 500)

   setTimeout(()=> {
      cardContainerInrSub.style.transform = "rotateY(0deg)"

      cardContainerInrSub.removeEventListener('dblclick', ROTATE)
      cardContainerInrSub.removeEventListener('mouseenter', SHOW_INSTRUCTION)
      cardContainerInrSub.removeEventListener('mouseleave', HIDE_INSTRUCTION)
      cardContainerInr.vanillaTilt.destroy();

      cardContainerInrSub2.style.animation = ''


      formBlock.classList.remove('in-preview')
      previewBlock.classList.remove('in-preview')
      cardContainer.classList.remove('in-preview')
   }, 1000)

   setTimeout(()=> {
      main.style.opacity = 1
   }, 1500)
}

const ROTATE = () => {
   
   if ( cardContainerInrSub.style.transform === "rotateY(0deg)" ) {
      cardContainerInrSub.style.transform = 'rotateY(180deg)'
   }
   else {
      cardContainerInrSub.style.transform = "rotateY(0deg)"
   }
}
const SHOW_INSTRUCTION = () => {
   cardInfo.innerText = 'Double-click to spin'
   cardInfo.classList.add('in-preview')
}

const HIDE_INSTRUCTION = () => {
   cardInfo.innerText = ''
   cardInfo.classList.remove('in-preview')
}