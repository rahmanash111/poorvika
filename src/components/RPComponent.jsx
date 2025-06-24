import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

const baseUrl = import.meta.env.VITE_BASE_URL;


const RPComponent = ({ eventData: { id, headline } }) => {
    console.log(id, headline);


    const [userData, setUserdata] = useState(null);
    const [paymentDetail, setPaymentDetail] = useState(null);
    const [show, setShow] = useState(false);
    const [successModalShow, setSuccessModalShow] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: 'onChange' });

    const handleUserForm = (data) => {
        setUserdata({ eventId: id, userEmail: data.email })
    }

    useEffect(() => {
        if (userData != null) {
            handlePayment();
        }
    }, [userData])

    useEffect(() => {
        if (paymentDetail != null) {
            setSuccessModalShow(true)
        }
    }, [paymentDetail])


    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };


    const handlePayment = async () => {
        setShow(false);
        reset();
        console.log(userData);

        const res = await axios.post('http://192.168.0.32:8080/api/razorpay/create-order', userData);
        const { orderId, amount, currency } = res.data;

        const options = {
            key: 'rzp_test_2iwKXca1VQvhhc', // Replace with your Razorpay key
            amount,
            currency,
            name: 'Ticket Booking',
            description: 'Event Ticket',
            order_id: orderId,
            handler: async function (response) {
                console.log(response, 'Razorpay verify res');

                const res = await axios.post('http://192.168.0.32:8080/api/razorpay/verify-payment', {
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                });

                console.log(res);
                if (res?.status == 200 && res?.data?.data?.paymentStatus == "SUCCESS") {
                    setPaymentDetail(res?.data?.data);
                }
            },
            prefill: {
                name: 'User Name',
                email: userData.userEmail,
            },
            theme: {
                color: getRandomColor(),
            },
            config: {
                display: {
                    hide: [{ method: "paylater" }], // This hides the Pay Later option    
                },
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
            alert("❌ Payment failed: " + response.error.description);
        })
        rzp.open();
    };

    return (
        <div className="p-4">
            <Button className="m-auto" variant="primary" onClick={() => setShow(true)}>
                Buy Ticket
            </Button>
            {/* modal to get email id */}
            <Modal
                show={show}
                onHide={() => setShow(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Enter Your Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="" onSubmit={handleSubmit(handleUserForm)}>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                isInvalid={!!errors.email}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Enter a valid email",
                                    },
                                })}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button className="my-4" type="submit" variant="primary">
                            Continue
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* payment success modal */}
            <Modal
                show={successModalShow}
                onHide={() => { setSuccessModalShow(false); setPaymentDetail(null) }}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Your Payment Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        <ListGroup.Item key={4}>{`Event Name: ${headline}`}</ListGroup.Item>
                        <ListGroup.Item key={1}>{`Order ID: ${paymentDetail?.orderId}`}</ListGroup.Item>
                        <ListGroup.Item key={2}>{`Amount: ${paymentDetail?.amount}`}</ListGroup.Item>
                        <ListGroup.Item key={3}>{`Payment Status: ${paymentDetail?.paymentStatus}`}</ListGroup.Item>
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setSuccessModalShow(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RPComponent;
