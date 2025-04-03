import React from 'react'
import { useState } from 'react'
import '/src/style.css'

const SideBar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <>
            {/* Mobile Toggle Button */}
            <button className='sidebar__toggle-btn' onClick={() => setIsSidebarOpen(true)}>
                <img src='./src/assets/sidebar2.png' className='sidebar__toggle-icon'/>
            </button>
            
            {/* Sidebar Panel */}
            <div className={`sidebar__panel ${isSidebarOpen ? "sidebar__panel--open" : ""}`}>
                <div className='sidebar__header'>
                    <div className='sidebar__title'>Aviation WX</div>
                    <button className='sidebar__close-btn' onClick={() => setIsSidebarOpen(false)}>X</button>
                </div>
                <div className='sidebar__nav'>
                    <a href='#' className='sidebar__link'>Overview</a>
                    <a href='#' className='sidebar__link'>Weather Map</a>
                    <a href='#' className='sidebar__link'>Reports</a>
                </div>
            </div>

            {/* Overlay */}
            {isSidebarOpen && (
                <div 
                    className="sidebar__overlay"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </>
    )
}

export default SideBar