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
const [products, setProductsData] = useState([]);
const [cartList, setCartList] = useState([]);
const [productQuantity, setProductQuantity] = useState([]);
const [formData, setFormData] = useState({
  productName: "",
  brand: "",
  image: "",
  price: "",
});
//get data from db handler
//one handler for the database becase it was being weird
const handleProductsDB = async () => {
  try {
    const response = await axios.get("http://localhost:3000/products");
    setProductsData(response.data);

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
}, []); 



//handle the submission of data
const handleOnSubmit = async() => {
  try{
  await axios.post("http://localhost:3000/products", formData)
  .then((response) => console.logI(response));
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
        <ProductForm 
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
