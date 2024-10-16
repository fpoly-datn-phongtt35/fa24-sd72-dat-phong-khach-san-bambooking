import React,{ useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/Header.css';
const HeaderComponents = () => {
    return (
        <header className="navbar">
            <button className="navbar-item">Button</button>
                <ul className="navbar-navbar">
                    <li className="navbar-item">
                        <Link className="navbar-link" to="/NhanVien">Giỏ hàng</Link>
                    </li>
                </ul>
        </header>

    );

}

export default HeaderComponents;
