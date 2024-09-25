import React, { useState } from 'react';
import '../components/Home.scss';
import { Button, Col, FormControl, FormGroup, Row, Container } from 'react-bootstrap';
const FormSearch = () => {
    const init = {
        nameYacht: '',
        location: '',
        price: ''
    }
    const [searchData, setSearchData] = useState(init);
    const handleChange = (e) => {
        setSearchData(
            {
                ...searchData,
                [e.target.name]: e.target.value
            }
        )
    }
    const handleSearch = () => {
        console.log("check search", searchData)
    }

    return (
        <div>
            <div className='homepage-content container '>
                <form className='mb-3 serach-yacht p-4'>
                    <div className='text-center'>
                        <h3 style={{ fontWeight: 'bold' }}>Bạn muốn gì ?</h3>
                        <p>Tìm phòng phù hợp với nhu cầu của bạn</p>
                    </div>
                    <div className='form-search'>
                        <Row>
                            <Col md={4}>
                                <FormGroup>
                                    <FormControl
                                        type='date'
                                        name='startDate'
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <FormControl
                                        type='date'
                                        name='endDate'
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <FormControl
                                        type='number'
                                        placeholder='Số người'
                                        name='numberOfPeople'
                                        onChange={handleChange}
                                        min='1'
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <button style={{ paddingLeft: '30px', paddingRight: '30px' }} size='lg'>Tìm Kiếm</button>
                            </Col>
                        </Row>


                    </div>
                </form>
            </div >

        </div >
    )
};

export default FormSearch;