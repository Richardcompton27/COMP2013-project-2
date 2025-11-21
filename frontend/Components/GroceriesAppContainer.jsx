import { useState, useEffect } from "react";
import CartContainer from "./CartContainer";
import ProductsContainer from "./ProductsContainer";
import NavBar from "./NavBar";
import axios from "axios";
import ProductForm from "./ProductsForm";
export default function GroceriesAppContainer() {
  /*
  const [productQuantity, setProductQuantity] = useState(
    products.map((product) => ({ id: product.id, quantity: 0 }))
  );
  
*/
//states
const [products, setProductsData] = useState([]); //is used to store and manage the products

const [cartList, setCartList] = useState([]);// is used to store and manage the cart

const [productQuantity, setProductQuantity] = useState([]); // is used to store and manage product quantity

const [formData, setFormData] = useState({ // is used to store and manage the form data
  productName: "",
  brand: "",
  image: "",
  price: "",
});

const [postResponse, setPostResponse] = useState("");
//get data from db handler
//one handler for the database becase it was being weird
const handleProductsDB = async () => {
  try {
    const response = await axios.get("http://localhost:3000/products");
    setProductsData(response.data);
    //had to put this in here as before it was tied to products being passed through to this jsx file but now its coming from 
    // a db and it was the easiest way i could find how to do it 
    //so this allows me to still have the quantity buttons work
    //also it was giving me an error that it was either out of range or repeating for some reason 
    //this should fix it 
    setProductQuantity((prev) => {
  if (prev.length === 0) {
    return response.data.map((product) => ({
      id: product.id,
      quantity: 0
    }));
  }
  return prev;
});
  } catch (error) {
    console.log(error.message);
  }
};

//use effect

useEffect(() => {
  handleProductsDB();
}, [postResponse]); 



//handle the submission of data
const handleOnSubmit = async(e) => {
  e.preventDefault();
  try{
  const newProductId = Date.now().toString(); //creates a variable for the new id and does what the comment below explains
  await axios.post("http://localhost:3000/products", {...formData, id: newProductId }) //added this to just make a random unique id like all the original data has as thats how it allows the quantity to change and it to be added to cart
  .then((response) => {setPostResponse(response.data.message); //inside the .then it has 2 functions the message and the registers the new id inside product quantity so it can be used to edit the quantity like how it does it when the db is created
    setProductQuantity(prev => [
    ...prev,
    { id: newProductId, quantity: 0 }
    ]);
  }).then(() => setFormData({
    productName: "",
    brand: "",
    image: "",
    price: "",
  }));
  }catch(error) {
    console.log(error.message);
  }
};


//handle the onchange event for the form
const handleOnChange = (e) => {
setFormData((prevData) => {
  return {...prevData, [e.target.name]: e.target.value};
  

})

};


//handle to delete one product by id
const handleOnDelete = async(id) => {
  try{
    const response = await axios.delete(`http://localhost:3000/products/${id}`);
    setPostResponse(response.data.message);
  }catch(error){
    console.log(error.message);
  }
};

//handle the edition of one contact by its id

const handleOnEdit = async (id) => {
  try{
    const productToEdit = await axios.get(`http://localhost:3000/products/${id}`);
    //setPostResponse(response.data.message);
    setFormData({
      productName: productToEdit.data.productName,
      brand: productToEdit.data.brand,
      image: productToEdit.data.image,
      price: productToEdit.data.price,
    });
  }catch(error){
    console.log(error.message);
  }
};


//handlers

  const handleAddQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  const handleRemoveQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId && product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId && product.quantity > 0) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  const handleAddToCart = (productId) => {
    const product = products.find((product) => (product.id) === productId);
    const pQuantity = productQuantity.find(
      (product) => product.id === productId
    );
    const newCartList = [...cartList];
    const productInCart = newCartList.find(
      (product) => product.id === productId
    );
    if (productInCart) {
      productInCart.quantity += pQuantity.quantity;
    } else if (pQuantity.quantity === 0) {
      alert(`Please select quantity for ${product.productName}`);
    } else {
      newCartList.push({ ...product, quantity: pQuantity.quantity });
    }
    setCartList(newCartList);
  };


  const handleRemoveFromCart = (productId) => {
    const newCartList = cartList.filter((product) => (product.id) !== productId);
    setCartList(newCartList);
  };

  const handleClearCart = () => {
    setCartList([]);
  };
  
  //render
  return (
    <div>
      <NavBar quantity={cartList.length} />
      <div className="GroceriesApp-Container">
        <ProductForm //for the form this is all the data being passed from the ProductsForm.jsx
        productName={formData.productName} 
        brand={formData.brand} 
        image={formData.image} 
        price={formData.price} 
        handleOnSubmit={handleOnSubmit} 
        handleOnChange={handleOnChange}/>
        <ProductsContainer
          products={products}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          productQuantity={productQuantity}
          handleOnDelete={handleOnDelete}
          handleOnEdit={handleOnEdit}
        />
        <CartContainer
          cartList={cartList}
          handleRemoveFromCart={handleRemoveFromCart}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleClearCart={handleClearCart}
        />
      </div>
    </div>
  );
}
