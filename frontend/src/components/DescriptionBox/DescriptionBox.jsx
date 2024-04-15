import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>An e-commerce website is an online platform that facilitates in the buying and selling of products or services
          over the internet.This website serves as a virtual marketplace where businesses nad individuals showcase their products, interact with
          customers and make transactions without the need of a physical presence. E-commerce websites have gained immense popularity due to their simplicity,
          accessibility and the global reach they offer.
        </p>
        <p>
          E-commerce websites typically display products or services a detalied descriptions, images, prices and any available varations(e.g., color, size, etc.).
          Each product usually has its own dedicated page with relevant information.
        </p>
      </div>
    </div>
  )
}

export default DescriptionBox
