import React from 'react';
import styles from './ProductManagement.module.css';


export const Sidebar = () => {
    const menuItems = [
        { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ab6ac09b8dc541fa070d3362f1a153529c6a25ebaf860c31674d8b0513b9a7d6?placeholderIfAbsent=true&apiKey=81a05b4ff4df450c992658cfeff61704", label: "Bán hàng" },
        {
            icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/944cf996a9d98c34f1d0a71ebe73e74f0c851e208d9899a5d3ccdfd10d68db58?placeholderIfAbsent=true&apiKey=81a05b4ff4df450c992658cfeff61704", label: "Sản phẩm",
            subItems: ["Sản phẩm", "Danh mục", "Hình ảnh", "Chất liệu", "Màu sắc", "Kích thước", "Thương hiệu"]
        },
        { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/8bfe2e1697865d0abc8bf8b6b0175e6451f40fe8c4660327227f64e5be1013a0?placeholderIfAbsent=true&apiKey=81a05b4ff4df450c992658cfeff61704", label: "Hóa đơn" },
        { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/0aadaf21bae1da466fe57ac9b29085e5efc4faf1b6d114513daf5a84bab750c5?placeholderIfAbsent=true&apiKey=81a05b4ff4df450c992658cfeff61704", label: "Tài khoản" },
        { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/af9fd5bc123149edc6e30e37da8aeaebfe7967a064178bf71b818b6b94c0408a?placeholderIfAbsent=true&apiKey=81a05b4ff4df450c992658cfeff61704", label: "Thống kê" },
        { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/23be0dd4bfdbf4cbc65d18fa194cd8bedbce42a366f662abe6078d5a99dc394f?placeholderIfAbsent=true&apiKey=81a05b4ff4df450c992658cfeff61704", label: "Báo cáo" }
    ];

    return (
        <nav className={styles.sidebar}>
            <div className={styles.menuList}>
                {menuItems.map((item, index) => (
                    <div key={index} className={styles.menuItem}>
                        <img src={item.icon} alt="" className={styles.menuIcon} />
                        <span>{item.label}</span>
                        {item.subItems && (
                            <div className={styles.subMenu}>
                                {item.subItems.map((subItem, subIndex) => (
                                    <div key={subIndex} className={styles.subMenuItem}>
                                        {subItem}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className={styles.logoutButton}>
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/18ce9fd068d7ecb41f73502d38f447cd2854b1d07476c798ef9814b2ac183ec7?placeholderIfAbsent=true&apiKey=81a05b4ff4df450c992658cfeff61704" alt="" className={styles.logoutIcon} />
                <span>Đăng xuất</span>
            </div>
        </nav>
    );
};