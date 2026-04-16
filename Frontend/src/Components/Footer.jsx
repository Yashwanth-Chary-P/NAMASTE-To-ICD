import React from 'react'
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { SiPicsart } from "react-icons/si";
import { FaYoutube } from "react-icons/fa";
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='bg-blue-950 h-full flex flex-col text-[#c7cfdd] p-4'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-[#c7cfdd]  mt-14'>
            <div className="flex flex-col mx-auto ">
                <h4 className='text-white mb-4'>Contact</h4>
                <p><strong className='text-slate-400'>Address: </strong>562 Wellington Road. Street 32.San Francisco</p>
                <p><strong className='text-slate-400'>Phone: </strong>+01 2222 365 /(+91) 01 2345 6789 </p>
                <p><strong className='text-slate-400'>Hours: </strong>10:00 -18:00.Mon - Sat</p>
                
                <h4 className='text-white mt-4'>Follow us</h4>
                <div className="m-4 flex gap-1">
                    <FaFacebookF />
                    <FaTwitter />
                    <FaInstagram />
                    <SiPicsart />
                    <FaYoutube />
                </div>

            </div>
            <div className="flex flex-col mx-auto">
                <h4 className='text-white mb-4'>About</h4>
            
                <a to="#">About us</a>
                <a to="#">Delivery Information</a>
                <a to="#">Privacy Policy</a>
                <a to="#">Terms & Conditions</a>
                <a to="#">Contact us</a>
                

            </div>
            <div className="flex flex-col mx-auto">
                <h4 className='text-white mb-4'>My Account</h4>
                <a to="#">Sign In</a>
                <a to="#">View Cart</a>
                <a to="#">My Wishlist</a>
                <a to="#">Track My Order</a>
                <a to="#">Help</a>
            </div>
            <div className="flex flex-col mx-auto">
                <h4 className='text-white mb-4'>Install App</h4>
                <p>From App Store or Google Play Store</p>
                <div className="flex gap-2 mb-4">
                    <img className='mt-2 w-[60px] md:w-[120px]'  src={assets.app} alt=""/>
                    <img className='mt-2 w-[60px] md:w-[120px]' src={assets.play} alt=""/>                    
                </div>
                <p >Secured Payment Gateways</p>
                <img className='mt-2' src={assets.pay} alt=""/>
            </div>
        </div>
        <div className='text-white mx-auto mt-2'>
            <p>©  Copyright 2008-2025 insurance.com. All Rights Reserved.</p>
        </div>

    </div>
  )
}

export default Footer