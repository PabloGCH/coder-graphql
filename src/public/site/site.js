const socket = io();
const content = document.getElementById("content");
let currentUserEmail = "";
let username = "";

const getCookie = (name) => {
	let cookievalue;
	document.cookie.split(';').every(el => {
		let [key,value] = el.split('=');
		if(key == name) {
			cookievalue = value
			return false;
		}
		return true;
	})
	return cookievalue;
}
username = getCookie("username");

//HANDLEBARS HELPERS
Handlebars.registerHelper("compareStrings", (a, b, options) => {
	return a == b ? options.fn(this) : options.inverse(this);
})
//FUNCTIONS
const loginForm = async() => {
	const response = await fetch("../templates/login.handlebars");
	const result = await response.text();
	const template = Handlebars.compile(result);
	const html = template();
	return html;
}
const serverInfo = async() => {
	let serverData = await fetch("/api/info/server");
	const response = await fetch("../templates/info.handlebars");
	const result = await response.text();
	const template = Handlebars.compile(result);
	const html = template({loggedUser: username, ...await serverData.json()});
	return html;
}
const logError = async() => {
	const response = await fetch("../templates/logError.handlebars");
	const result = await response.text();
	const template = Handlebars.compile(result);
	const html = template();
	return html;
}
const regError = async() => {
	const response = await fetch("../templates/regError.handlebars");
	const result = await response.text();
	const template = Handlebars.compile(result);
	const html = template();
	return html;
}
const registerForm = async() => {
	const response = await fetch("../templates/register.handlebars");
	const result = await response.text();
	const template = Handlebars.compile(result);
	const html = template();
	return html;
}
const productForm = async() => {
	const response = await fetch("../templates/form.handlebars");
	const result = await response.text();
	const template = Handlebars.compile(result);
	const html = template({loggedUser: username});
	return html;
}

const productTable = async(data) => {
	Object.assign(data, {loggedUser: username})
	const response = await fetch("../templates/products.handlebars");
	const result = await response.text();
	const template = Handlebars.compile(result);
	const html = template(data)
	return html;
}

const productFormSubmit = () => {
    const form = document.getElementById("product-form");
    const inputs = form.getElementsByTagName("input");
    let newProduct = {
        name: inputs[0].value,
        price: inputs[1].value,
        imgUrl: inputs[2].value
    };
    let query = `
    mutation {
    addProduct(name: "${newProduct.name}", price: ${newProduct.price}, imgUrl: "${newProduct.imgUrl}") {
        success
        message
    }
    }`
    fetch("/graphql", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: query,
            variables: {}
        })
    })
        .then(async(res) => {
            let data = await res.json();
            data = data.data.addProduct
            if(data.success) {
                window.location.replace("stock")
            }
            if(!data.success && data.message == "not_logged") {
                window.location.replace("login")
            }
        })
}

const chatSection = async(data, user) => {
    Object.assign(data, {user: user, loggedUser: username})
    const response = await fetch("../templates/chat.handlebars");
    const result = await response.text();
    const template = Handlebars.compile(result);
    const html = template(data);
    return html;
}

//EVENTS
const sendMessage = () => {

    currentUserEmail = document.getElementById("email").value;
    let message = document.getElementById("message").value;
    let date = new Date();
    let dateStr = date.getDate().toString() + "/" + date.getMonth().toString() + "/" + date.getFullYear().toString() + " - " + date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString();
    let query = `
    mutation {
    addMessage(email: "${currentUserEmail}", message: "${message}", date: "${dateStr}") {
        success
        message
    }
    }
    `
    fetch("/graphql", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: query,
            variables: {}
        })
    })
        .then(async(res) => {
            console.log(res)
            let data = await res.json();
            if(!data.success && data.message == "not_logged") {
                window.location.replace("login")
            }
        })
}

//REGISTER EVENT
const registerSubmit = () => {
    const form = document.getElementById("reg-form");
    const inputs = form.getElementsByTagName("input");
    let regData = {
        username: inputs[0].value,
        password: inputs[1].value
    };
    fetch("/api/auth/register", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(regData)
    })
        .then(async(res) => {
            let data = await res.json();
            if(data.success) {
                window.location.replace("login")
            } else {
                window.location.replace("regerror")
            }
        })
}
//LOGIN EVENT
const logSubmit = () => {
    const form = document.getElementById("log-form");
    const inputs = form.getElementsByTagName("input");
    let logData = {
        username: inputs[0].value,
        password: inputs[1].value,
    };
    fetch("/api/auth/login", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(logData)
    })
        .then(async(res) => {
            let data = await res.json();
            if(data.success){
                window.location.replace("stock")
            } else {
                window.location.replace("logerror")
            }
        })
}


//ROUTES
if(window.location.pathname.includes("/stock")) {
    productTable({}).then(res => {
        content.innerHTML = res;
    })
    socket.on("products", data => {
        productTable(data).then(res => {
            content.innerHTML = res;
        })
    })
}
if(window.location.pathname.includes("/form")) {
    productForm().then(res => {
        content.innerHTML = res;
    })
}
if(window.location.pathname.includes("/login")) {
    loginForm().then(res => {
        content.innerHTML = res;
    })
}
if(window.location.pathname.includes("/regerror")) {
    regError().then(res => {
        content.innerHTML = res;
    })
}
if(window.location.pathname.includes("/logerror")) {
    logError().then(res => {
        content.innerHTML = res;
    })
}
if(window.location.pathname.includes("/register")) {
    registerForm().then(res => {
        content.innerHTML = res;
    })
}
if(window.location.pathname.includes("/info")) {
    serverInfo().then(res => {
        content.innerHTML = res;
    })
}
if(window.location.pathname.includes("/chat")) {
    chatSection({}, currentUserEmail).then(res => {
        content.innerHTML = res;
        document.getElementById("email").value = currentUserEmail;
        let messageBox = document.getElementById("message-box");
        messageBox.scrollTop = messageBox.scrollHeight;
    })
    socket.on("messages", data => {
        console.log("MESSAGE UPDATE",data)
        chatSection(data, currentUserEmail).then(res => {
            content.innerHTML = res;
            document.getElementById("email").value = currentUserEmail;
            let messageBox = document.getElementById("message-box");
            messageBox.scrollTop = messageBox.scrollHeight;
        })
    })
}

const logOff = () => {
    fetch("/api/auth/logoff", {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    }).then(res => {
        window.location.replace("/")
    })
} 

