//GET HTML ELEMENTS
const getProductResponse = document.getElementById("get-response");
const addProductBody = document.getElementById("add-body");
const addProductResponse = document.getElementById("add-response");
const updateProductBody = document.getElementById("update-body");
const updateProductResponse = document.getElementById("update-response");
const removeProductResponse = document.getElementById("remove-response");

const BACKURL = "http://localhost:8080/api";
const axiosInstance = axios.create({
    baseURL: BACKURL,
    withCredentials: true,
});

async function logIn() {
	let logData = {
		username: "asd",
		password: "123",
	};
    let response = await axiosInstance.post(`${BACKURL}/auth/login`, logData);
    console.log("LOGIN RESULT: ", response);
}

//GET PRODUCTS
async function getProducts() {
    try {
        const response = await axios.get(`${BACKURL}/products/products`)
        getProductResponse.innerHTML = JSON.stringify(response.data, null, 4);
    }
    catch (error) {
        console.log(error);
    }
}
async function addProduct() {
    try {
        let newProduct = {
            name: "new product",
            price: 400,
            imgUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.BcNb40Mq_PfOj795lDFqaAHaFV%26pid%3DApi&f=1&ipt=5d7140326ebeb108d2cb5cf625cd7be07f95cc4fcf3f908cc6f0c41d04e8c5b2&ipo=images" 
        };
        addProductBody.innerHTML = JSON.stringify(newProduct, null, 4);
        const response = await axiosInstance.post(`${BACKURL}/products/product`, newProduct);
        addProductResponse.innerHTML = JSON.stringify(response.data, null, 4);
        console.log(response);
        let id = (response.data && response.data.newProduct && response.data.newProduct._id) || -1;
        return id;
    }
    catch (error) {
        console.log(error);
    }
}
async function updateProduct(id) {
    try {
        let newProduct = {
            name: "new name product",
            price: 150,
            imgUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.BcNb40Mq_PfOj795lDFqaAHaFV%26pid%3DApi&f=1&ipt=5d7140326ebeb108d2cb5cf625cd7be07f95cc4fcf3f908cc6f0c41d04e8c5b2&ipo=images" 
        };
        updateProductBody.innerHTML = JSON.stringify(newProduct, null, 4);
        const response = await axiosInstance.put(`${BACKURL}/products/product/${id}`, newProduct);
        updateProductResponse.innerHTML = JSON.stringify(response.data, null, 4);
        console.log(response);

    } catch (error) {
        console.log(error);
    }
}
async function removeProduct(id) {
    try {
        let response = await axiosInstance.delete(`${BACKURL}/products/product/${id}`);
        removeProductResponse.innerHTML = JSON.stringify(response.data, null, 4);

    } catch (error) {
        console.log(error);
    }
}

async function test() {
    await logIn();
    await getProducts();
    let newProductId = await addProduct() || -1;
    await updateProduct(newProductId);
    await removeProduct(newProductId);
}

test();


