import React from 'react'
import './ListProduct.css'
import { useState } from 'react'
import { useEffect } from 'react'
import cross_icon from '../../assets/cross_icon.png'

const ListProduct = () => {

  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    await fetch('http://localhost:4000/allproducts').then((resp) => resp.json()).then((data) => {
      setAllProducts(data);
    })
  }

  useEffect (() => {
    fetchInfo();
  }, []);

  const removeProduct = async (id) => {
    await fetch('http://localhost:4000/removeproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id
      })
    })
    await fetchInfo();
  }

  return (
    <div className='listproduct'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((item, i) => {
          return (
            <>
              <div key={i} className="listproduct-format-main listproduct-format">
                <img src={item.image} alt="" className='listproduct-product-icon' />
                <p>{item.name}</p>
                <p>${item.old_price}</p>
                <p>${item.new_price}</p>
                <p>{item.category}</p>
                <img onClick={() => {removeProduct(item.id)}} src={cross_icon} alt="" className='listproduct-remove-icon' />
              </div>
              <hr />
            </>
          )
        })}
      </div>
    </div>
  )
}

export default ListProduct
