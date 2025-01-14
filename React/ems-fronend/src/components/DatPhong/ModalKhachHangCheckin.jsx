import React, { useState } from 'react'
import './ModalKhachHangCheckin.scss'
import ModalCreateKHC from './ModalCreateKHC';
const ModalKhachHangCheckin = ({ isOpen, onClose ,thongTinDatPhong}) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);
    if (!isOpen) return null;
    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
            <div className="modal-container">
                <div className="modal-header">
                    <h3>{thongTinDatPhong.maThongTinDatPhong} Search Profile</h3> 
                </div>
                <div className="modal-body">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Filter by Profile Name"
                            className="search-input"
                        />
                        <button className="new-btn" onClick={handleOpenModal}>New</button>
                    </div>
                    {/* <div className="profile-list"> 
                        {profiles.map((profile, index) => (
                            <div key={index} className="profile-item">
                                <div className="profile-header">
                                    <span>{profile.id} - {profile.name}</span>
                                </div>
                                <div className="profile-details">
                                    <p>
                                        <strong>Title:</strong> {profile.title}
                                    </p>
                                    <p>
                                        <strong>ID Document:</strong> {profile.idDocument}
                                    </p>
                                    <p>
                                        <strong>Phone Number:</strong> {profile.idDocument}
                                    </p>
                                    <p>
                                        <strong>DOB:</strong> {profile.dob}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div> */}
                </div>
                <div className="modal-footer">
                    {/* <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button> */}
                    <button className="link-btn">Link</button>
                    <button className="link-btn" onClick={onClose}>Close</button>
                </div>
            </div>
            <ModalCreateKHC isOpen={isModalOpen} onClose={handleCloseModal} thongTinDatPhong={thongTinDatPhong}/>
        </div>
    )
}

export default ModalKhachHangCheckin