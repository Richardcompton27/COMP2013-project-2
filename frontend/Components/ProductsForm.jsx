export default function ProductForm({
    productName, 
    brand, 
    image, 
    price, 
    handleOnSubmit, 
    handleOnChange,
    isEditing
    }) {
    return (<div>
    <form onSubmit={handleOnSubmit}>
        <label htmlFor="productName">productName: </label>
        <input type="text" name="productName" id="productName" value={productName} onChange={handleOnChange} placeholder="enter productName"/> 
        <br/>
        <label htmlFor="brand">brand: </label>
        <input type="text" name="brand" id="brand" value={brand} onChange={handleOnChange} placeholder="enter brand"/> 
        <br/>
        <label htmlFor="image">image: </label>
        <input type="text" name="image" id="image" value={image} onChange={handleOnChange}placeholder="enter image"/> 
        <br/>
        <label htmlFor="price">price: </label>
        <input type="text" name="price" id="price" value={price} onChange={handleOnChange}placeholder="enter price"/> 
        <br/>
        <button>{isEditing? "Edit" : "Submit" }</button>
    </form>
    </div>
    );
}