import React from 'react'
import { ShopContext } from '../context/ShopContext'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrum from '../components/BreadCrums/Breadcrum'
import ProductDisplay from '../components/ProductDisplay/ProductDisplay'

const Product = () => {
  const {all_product} = useContext(ShopContext)
  const {productId} = useParams();
  const product = all_product.find((item) => item.id === Number(productId));
  return (
    <div>
      <Breadcrum product={product}/>
      <ProductDisplay product={product} />
    </div>
  )
}

export default Product
