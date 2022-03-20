import { useEffect } from "react";
import { useState } from "react";
import { addToCart } from "../lib/shopify";

export default function AddToCart(props) {
  const[ variantId, setVariantId ] = useState(null);
  const[ qty, setQty ] = useState(1);
  let cartId;
  
  useEffect(() => {   
    setVariantId(props.id);
    setQty(1);
  }, [props.id])

  function increment () {
    event.preventDefault()
    setQty(qty => qty += 1);
  };

  function decrement () {
    event.preventDefault()
    if (qty <= 0) return;
    setQty(qty => qty +- 1);
  };

  async function addItems() {
    event.preventDefault(); 

    const lines = [{ quantity: qty, merchandiseId: variantId}];

    let localCartData = JSON.parse(
      window.localStorage.getItem('organika:shopify:cart')
    );

    if (localCartData == null) {
      return
    }
  
    cartId = localCartData.id
    const result = await addToCart(cartId, lines);
    if (qty <= 0) return
    window.localStorage.setItem('organika:shopify:status', 'changed');

  }

  return (
    <div>
      <div className="custom-number-input h-10 w-32">
        <label htmlFor="custom-input-number" className="w-full text-gray-700 text-sm font-semibold">Quantity
        </label>
        <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
          <button onClick={ () => decrement() } data-action="decrement" className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none">
            <span className="leading-none m-auto text-2xl font-thin">−</span>
          </button>
          <input type="number" className="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700" name="custom-input-number" min="1" value={qty}></input>
          <button onClick={ () => increment() } data-action="increment" className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
            <span className="leading-none m-auto text-2xl font-thin">+</span>
          </button>
        </div>
      </div>      
      <button
      onClick={() => {addItems()}}
      type="submit"
      className="mt-10 w-full bg-lime-600/75 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
      Add To Cart
      </button>
    </div>
  )
}