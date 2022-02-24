import React, { useState, useEffect } from 'react';
import { useProduct } from '../../contexts/ProductContext.js';
import axios from 'axios';

export default function Cart() {
  const { styleReducer } = useProduct();
  const [stateVal, setStateVal] = styleReducer;
  const [skus, setSkus] = useState();
  const [sku, setSku] = useState();
  const [quantity, setQuantity] = useState();
  const [firstSelected, setFirstSelected] = useState('');
  const [selected, setSelected] = useState('');

  // Set SKUs only after currentStyle has loaded
  useEffect(() => {
    if (stateVal.currentStyle) {
      setSkus(stateVal.currentStyle.skus);
    }
    if (sku) {
      setSelected('');
    }
    if (quantity) {
      setQuantity();
    }
  }, [stateVal.currentStyle]);

  //Set quantity amount after size change
  useEffect(() => {
    if (sku) {
      var quantArr = [];
      var quant = skus[sku].quantity;
      for (var i = 1; i < quant + 1; i++) {
        quantArr.push(i);
        if (i > 14) {
          break;
        }
      }
      setQuantity(quantArr);
    }
  }, [sku]);

  //Change current SKU based on size
  function setSkuOnChange(e) {
    var skus = Object.keys(stateVal.currentStyle.skus);
    setSku(parseInt(skus[e.target.value]));
    setSelected(e.target.value);
  }

  //Change current first SKU based on size
  function setSkuOnFirstChange(e) {
    var skus = Object.keys(stateVal.currentStyle.skus);
    setSku(parseInt(skus[e.target.value]));
    setFirstSelected(e.target.value);
  }

  //Add to cart
  function addToCart(e) {
    e.preventDefault();
    if (!sku || !quantity) {
      alert('Please select size!');
    } else {
      axios
        .post('http://localhost:3000/cart', {
          sku_id: sku,
        })
        .then((response) => {
          console.log('Added to cart!');
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  const cartStyle = {
    display: 'flex',
  };

  return (
    <div style={cartStyle}>
      <div className="order">
        <form onSubmit={addToCart} className="cart-form">
          <select value={firstSelected} onChange={setSkuOnFirstChange}>
            <option>Select Size</option>
            {skus &&
              Object.values(skus).map((sku, index) => {
                return (
                  <option key={index} value={index}>
                    {sku.size}
                  </option>
                );
              })}
          </select>
          <br></br>
          <select name="quantity">
            {skus &&
              sku &&
              quantity &&
              quantity.map((quant) => {
                return (
                  <option key={quant} value={quant}>
                    {quant}
                  </option>
                );
              })}
          </select>
          <button type="submit" className="add-to-cart-button">
            Add to Cart!
          </button>
        </form>
      </div>
      <div className="additional-order">
        <form onSubmit={addToCart} className="cart-form">
          <select value={selected} onChange={setSkuOnChange}>
            <option>Select Size</option>
            {skus &&
              Object.values(skus).map((sku, index) => {
                return (
                  <option key={index} value={index}>
                    {sku.size}
                  </option>
                );
              })}
          </select>
          <br></br>
          <select name="quantity">
            {skus &&
              sku &&
              quantity &&
              quantity.map((quant) => {
                return (
                  <option key={quant} value={quant}>
                    {quant}
                  </option>
                );
              })}
          </select>
          <button type="submit" className="add-to-cart-button">
            Add to Cart!
          </button>
        </form>
      </div>
    </div>
  );
}
