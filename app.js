const { 
    createBot, 
    createProvider, 
    createFlow, 
    addKeyword, 
    CoreClass } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
//import { ChatGPTClass } from './chatgpt.class'

//const chatGpt=new ChatGPTClass();

const ChatGPTClass = require('./chatgpt.class')

const createBotGPT= async({provider, database}) =>  {

    return new ChatGPTClass(database, provider);
}


//const chatGPT = new ChatGPTClass(new MockAdapter(), createProvider(BaileysProvider))



const flowSecundario = addKeyword(['0', 'siguiente'])
.addAnswer('Muchas gracias por utilizar el chatBot del programa de Ingenieria de sistemas de la Universidad Mariana')
.addAnswer('Si desea volver al incio escriba menu, de lo contrario puede salir del chat');



const flowPregunta = addKeyword(['1', 'uno', 'número 1', 'número uno', 'numero 1', 'numero uno', 'número1', 'numero1']).addAnswer(
    [
        createBotGPT,
      '📄 A continuación podrás escribir tu pregunta acerca de tu proceso investigativo',
      '','',
      '👉 *0* Para finalizar esta opcion 😉'
        //createBotGPT
      
        
    ],
    null,
    null,
    [flowSecundario])






const flowFechas = addKeyword(['2', 'dos', 'número dos', 'número 2', 'numero dos', 'numero 2', 'número2', 'numero2']).addAnswer(
    [
        '🙌 Selecciona una de las siguientes opciones',
        '👉 *1* Para fechas de sustentación de tesis 🤔📜',
        '👉 *2* Para fechas de grados 🎓🥳',
        '👉 *3* Para fechas programadas de sustentacion de tesis 💪📑',
        '','',
        '👉 *0* Para finalizar esta opcion 😉'
    ],
    null,
    null,
    [flowSecundario]
)



const flowPqrs = addKeyword(['3', 'tres', 'número tres', 'número 3', 'numero tres', 'numero 3', 'número3', 'numero3']).addAnswer(
    [
        '🚀 Selecciona una opción',
        '👉 *1* Peticion 🎓🥳',
        '👉 *2* Queja 🎓🥳',
        '👉 *3* Recurso 🎓🥳',
        '👉 *4* Solicitud 🎓🥳',
        '👉 *5* Felicitacion🎓🥳',
        '👉 *6* Otras observaciones🎓🥳',
        '','',
        '👉 *0* Para finalizar esta opcion 😉'
    ],
    null,
    null,
    [flowSecundario]
)



const flowFinal = addKeyword(['discord']).addAnswer(
    ['🤪 Únete al discord', 'https://link.codigoencasa.com/DISCORD', '\n*2* Para siguiente paso.'],
    null,
    null,
    [flowSecundario]
)

const flowMenu = addKeyword(['menu', 'menú'])
    .addAnswer('🙌 Menú principal')
    .addAnswer(
        [
            'Selecciona la opción de tu interés, respondiendo con un número de la siguiente lista',
            '',
            '👉 *1* Para preguntas sobre el proceso investigativo 🤔📜',
            '',
            '👉 *2* Para consultar las fechas disponibles de sustentación de tesis 💪📜 y fechas de grados 🎓🥳',
            '',
            '👉 *3* Para PQRS del Chat Bot 🚦🛑',
        ],
        null,
        null,
        [ flowPregunta, flowPqrs, flowFechas, flowFinal]
    );



const flowPrincipal = addKeyword(['hola', 'ole', 'alo','Buen dia','buenos dias','buenas tardes','buenas noches','buenas'])
    //.addAnswer('Digite su correo electronico institucional',{capture:true})
    .addAnswer('🙌 Hola, bienvenido al Chat Bot del proceso investigativo de *Ingeniería de Sistemas* de la *Universidad Mariana*')
    .addAnswer('¿Cual es tu correo institucional?',{capture:true},(ctx, {fallBack})=>
    {        
        if(!ctx.body.includes('@umariana.edu.co'))
        {
            return fallBack()
        }
        //console.log('Mensaje entrante', ctx.body)
    })
    .addAnswer(
        [
            'Selecciona la opción de tu interés, respondiendo con un número de la siguiente lista',
            '',
            '👉 *1* Para preguntas sobre el proceso investigativo 🤔📜',
            '',
            '👉 *2* Para consultar las fechas disponibles de sustentación de tesis 💪📜 y fechas de grados 🎓🥳',
            '',
            '👉 *3* Para PQRS del Chat Bot 🚦🛑',
        ],
        null,
        null,
        [flowPregunta, flowPqrs, flowFechas, flowFinal, flowMenu]
    )

    


    

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowMenu])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    createBotGPT({
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
