import "./App.css";
import products from "../../frontend/src/data/products";
import GroceriesAppContainer from "../../frontend/Components/GroceriesAppContainer";

function App() {
  return (
    <>
      <GroceriesAppContainer products={products} />
    </>
  );
}

export default App;
