const XacNhanDatPhong = ({
    showModal,
    handleCloseModal,
    handleConfirmBooking,
    selectedRooms = [], // Mảng chứa các phòng đã chọn
    startDate,
    endDate,
    children,
    adults
}) => {
    return (
        <div className={`XNDP-modal-container ${showModal ? 'show' : ''}`}>
            <div className="XNDP-modal-content">
                <h2>Rooms ({selectedRooms.length})</h2>
                <p>{startDate} - {endDate}</p>
                {selectedRooms.length > 0 ? (
                    selectedRooms.map((room, index) => (
                        <div key={index} className="room-card">
                            <h5>{room.tenLoaiPhong} - {room.tenPhong}</h5>
                            <div className="room-details">
                                <p>Mã phòng: {room.maPhong}</p>
                                <div className="room-persons">
                                    <label>Adults: {adults}</label>
                                    <label>Children: {children}</label>

                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No rooms selected</p>
                )}
                <div className="modal-footer">
                    <button className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
                    <button className="confirm-btn" onClick={handleConfirmBooking}>Create Reservation</button>
                </div>
            </div>
        </div>
    );
};

export default XacNhanDatPhong;
