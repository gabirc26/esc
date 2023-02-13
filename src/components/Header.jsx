import React from 'react'
import Navbar from './Navbar'
import '../styles/header.css'

function Header() {
    return (
        <header className='row header'>
            <div className='col text-end mt-3'>
                <Navbar />
            </div>
        
        </header>
    )
}

export default Header