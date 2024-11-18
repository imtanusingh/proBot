// const chatInput = document.querySelector(".chat-input textarea");
// const sendChatBtn = document.querySelector("#send-btn");
// const chatbox = document.querySelector(".chatbox");
// const chatbotToggler = document.querySelector(".chatbot-toggler");
// const chatbotCloseBtn = document.querySelector(".close-btn");

// let userMessage;
// // const API_KEY = "WRITE YOUR API KEY";

// const inputInitHeight = chatInput.scrollHeight;


// const  createChatLi =(message, className)=>{
//     const chatLi = document.createElement("li");
//     chatLi.classList.add("chat", className);
//     let chatContent = className === "outgoing" ? `<p></p>`: `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
//     chatLi.innerHTML = chatContent ;
//     chatLi.querySelector("p").textContent = message;
//     return chatLi;
// }

// const generateResponse=(incomingChatLi)=>{
//     const  API_URL = "https://api.openai.com/v1/chat/completions";
//     const messageElement = incomingChatLi.querySelector("p");

//     const requestOptions ={ 
//         method: "POST",
//         headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${API_KEY}`, 
//         },
//         body: JSON.stringify({
//             model: "gpt-3.5-turbo",
//             messages:[{role:"user" , content: userMessage}]
//         })
//     } 

//     fetch(API_URL, requestOptions).then(res => res.json()).then(data =>{
//         // console.log(data);
//         messageElement.textContent = data.choices[0].message.content;
//     }).catch((error) =>{
//         // console.log(error);
//         messageElement.classList.add("error");
//         messageElement.textContent = "Oops! Something went wrong. Try again. ";
//     }).finally(()=>chatbox.scrollTo(0,chatbox.scrollHeight));
// }

// const handleChat =()=>{
//     userMessage = chatInput.value.trim();
//     // console.log(userMessage);
//     if(!userMessage)return;
//     chatInput.value = "";
//     chatInput.style.height=`${inputInitHeight}px`;

//     //append the user message to chat box
//     chatbox.appendChild(createChatLi(userMessage, "outgoing"));
//     chatbox.scrollTo(0, chatbox.scrollHeight);
    
//     setTimeout (()=>{
//         //display thinking message while waiting for response 
//         const incomingChatLi = createChatLi(".....", "incoming")
//         chatbox.scrollTo(0, chatbox.scrollHeight);
//         chatbox.appendChild(incomingChatLi);
        
//     },600)
//     generateResponse();
// }


// chatInput.addEventListener("input", ()=>{
//     chatInput.style.height=`${inputInitHeight}px`;
//     chatInput.style.height=`${chatInput.scrollHeight}px`;
// });

// chatInput.addEventListener("keydown", (e)=>{

//    if(e.key==="Enter" && !e.shiftKey && window.innerWidth>800){
//     e.preventDefault();
//     handleChat();
//    }
// });


// sendChatBtn.addEventListener("click", handleChat);
// chatbotCloseBtn.addEventListener("click", ()=> document.body.classList.remove("show-chatbot"));
// chatbotToggler.addEventListener("click", ()=> document.body.classList.toggle("show-chatbot"));



const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
 const API_KEY = "WRITE YOUR API KEY";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }],
        }),
    };

    // Retry logic for handling errors and rate limits
    let retryCount = 0;
    const maxRetries = 5;
    const backoffDelay = 1000; // Starting delay in ms

    const attemptRequest = () => {
        fetch(API_URL, requestOptions)
            .then((res) => {
                console.log("API Response Status: ", res.status);  // Log the status code
                if (!res.ok) {
                    throw new Error(`Error: ${res.statusText}`);
                }
                return res.json();
            })
            .then((data) => {
                if (data.error) {
                    console.log("API Error: ", data.error);  // Log API error
                    messageElement.classList.add("error");
                    messageElement.textContent = "Oops! Something went wrong. Try again.";
                    return;
                }
                messageElement.textContent = data.choices[0].message.content;
            })
            .catch((error) => {
                console.error("Request failed: ", error);
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(attemptRequest, backoffDelay * Math.pow(2, retryCount));  // Exponential backoff
                } else {
                    messageElement.classList.add("error");
                    messageElement.textContent = "Max retries reached. Please try again later.";
                }
            })
            .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
    };

    attemptRequest();
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user message to chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // Display thinking message while waiting for response
        const incomingChatLi = createChatLi(".....", "incoming");
        chatbox.scrollTo(0, chatbox.scrollHeight);
        chatbox.appendChild(incomingChatLi);

        // Call the function to generate a response
        generateResponse(incomingChatLi);
    }, 600);
};

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
