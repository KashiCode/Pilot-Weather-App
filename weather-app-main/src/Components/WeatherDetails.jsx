import React from 'react'

const WeatherDetails = ({ title, details, moreDetails}) => {
  return (
    <div className=" flex flex-col border-[1px] border-[#2D3C4C] rounded-[16px] bg-[#1D2837] w-full shadow-2xl  p-4">
        <div className='font-medium text-2xl text-neutral-200'>
            {title}
        </div>
        <div className='font-light text-5xl text-neutral-200'>
            {details}
        </div>
        <div className='font-light text-sm text-neutral-300 flex'>
            {moreDetails}
        </div>
    </div>
  )
}

export default WeatherDetails
