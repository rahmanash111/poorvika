import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import "../css/formpage.css"
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { createSlug } from "../utils/CommonFunctions";
import { submitFormData } from "../apis/api-service";
const apiUrl = import.meta.env.VITE_BASE_URL;

export default function FormPage() {

    const navigate = useNavigate();

    const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'onChange' });

    //to add validation on amount based on payment
    const paymentYesOrNo = watch("isPaidEvent");

    const handleSubmitForm = async (event) => {

        //refactoring event according to the request 
        event = {
            ...event,
            ticketPrice: Number(event.ticketPrice),
            isPaidEvent: Boolean(event.isPaidEvent),
            slug: createSlug(event.slug)
        }

        //creating formdata object to post data in axios
        const formData = new FormData();
        formData.append("event", JSON.stringify(event));
        formData.append("file", event.bannerImage[0]);

        const res = await submitFormData(formData);

        if (res?.status == 200) {
            const slug = res?.data?.slug;
            navigate(`/${slug}`);
        } else {
            // alert("Something Went Wrong");
        }
    }

    return (
        <>
            <section className="formpage-container mt-4 w-100">
                <Container className="bg-light rounded-2">
                    <h1 className="py-4">Create New Event</h1>
                    <hr />
                    <Form className="" onSubmit={handleSubmit(handleSubmitForm)}>
                        <Row>
                            <Col sm={6}>
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label>headline</Form.Label>
                                    <Form.Control
                                        type="text"
                                        isInvalid={!!errors.headline}
                                        {...register("headline", {
                                            required: "headLine is required",
                                            maxLength: {
                                                value: 75,
                                                message: "Too Many Characters"
                                            },
                                            // pattern: {
                                            //     value: /^[a-zA-Z][a-zA-Z .]*[. ]*$/,
                                            //     // value:/^[a-zA-Z](?:[a-zA-Z .]*[a-zA-Z])?$/, this doesn't let the value ends with dot and empty space(.," "),but this shows the error while cursor waiting in space 
                                            //     message: "Numbers, Special characters and Empty spaces are not allowed",
                                            // }
                                        })}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.headline?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col sm={6}>
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label>SubHeadline</Form.Label>
                                    <Form.Control
                                        type="text"
                                        isInvalid={!!errors.subHeadline}
                                        {...register("subHeadline", {
                                            required: "subHeadline is required",
                                            maxLength: {
                                                value: 75,
                                                message: "Too Many Characters"
                                            },
                                            // pattern: {
                                            //     value: /^[a-zA-Z][a-zA-Z .]*[. ]*$/,
                                            //     // value:/^[a-zA-Z](?:[a-zA-Z .]*[a-zA-Z])?$/, this doesn't let the value ends with dot and empty space(.," "),but this shows the error while cursor waiting in space 
                                            //     message: "Numbers, Special characters and Empty spaces are not allowed",
                                            // }
                                        })}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.subHeadline?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label>Slug</Form.Label>
                                    <Form.Control
                                        type="text"
                                        isInvalid={!!errors.slug}
                                        {...register("slug", {
                                            required: "slug is required",
                                            maxLength: {
                                                value: 40,
                                                message: "Too Many Characters"
                                            },
                                            // pattern: {
                                            //     value: /^[a-zA-Z][a-zA-Z .]*[. ]*$/,
                                            //     // value:/^[a-zA-Z](?:[a-zA-Z .]*[a-zA-Z])?$/, this doesn't let the value ends with dot and empty space(.," "),but this shows the error while cursor waiting in space 
                                            //     message: "Numbers, Special characters and Empty spaces are not allowed",
                                            // }
                                        })}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.slug?.message}</Form.Control.Feedback>
                                </Form.Group>

                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label>BannerCta</Form.Label>
                                    <Form.Control
                                        type="text"
                                        isInvalid={!!errors.bannerCta}
                                        {...register("bannerCta", {
                                            required: "bannerCta is required",
                                            maxLength: {
                                                value: 75,
                                                message: "Too Many Characters"
                                            },
                                            // pattern: {
                                            //     value: /^[a-zA-Z][a-zA-Z .]*[. ]*$/,
                                            //     // value:/^[a-zA-Z](?:[a-zA-Z .]*[a-zA-Z])?$/, this doesn't let the value ends with dot and empty space(.," "),but this shows the error while cursor waiting in space 
                                            //     message: "Numbers, Special characters and Empty spaces are not allowed",
                                            // }
                                        })} />
                                    <Form.Control.Feedback type="invalid">{errors.bannerCta?.message}</Form.Control.Feedback>
                                </Form.Group>

                            </Col>
                        </Row>
                        <Row>
                            <Col sm={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Payment</Form.Label>
                                    <div>
                                        <Form.Check
                                            inline
                                            label="Yes"
                                            type="radio"
                                            value={true}
                                            isInvalid={!!errors.isPaidEvent}
                                            {...register('isPaidEvent', { setValueAs: true, required: "Please select an option." })}
                                        />
                                        <Form.Check
                                            inline
                                            label="No"
                                            type="radio"
                                            value={false}
                                            isInvalid={!!errors.isPaidEvent}
                                            {...register('isPaidEvent', { setValueAs: false, required: "Please select an option." })}
                                        />
                                    </div>
                                    {errors.isPaidEvent && (
                                        <div className="text-danger mt-1">{errors.isPaidEvent.message}</div>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col sm={3}>
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label>Ticket Price</Form.Label>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text>&#8377;</InputGroup.Text>
                                        <Form.Control
                                            disabled={!(paymentYesOrNo == "true")}
                                            type="number"
                                            isInvalid={!!errors.ticketPrice}
                                            {...register("ticketPrice", {
                                                validate: (value) => {
                                                    if (paymentYesOrNo == "true" && !value) {
                                                        return "Amount is required";
                                                    } else if (value) {
                                                        if (value <= 0 || value > 50000) {
                                                            return "Enter the valid amount"
                                                        } else {
                                                            return true;
                                                        }
                                                    }
                                                    return true;
                                                },
                                                // required: "subHeadline is required",
                                                // maxLength: {
                                                //     value: 75,
                                                //     message: "Too Many Characters"
                                                // },
                                                // pattern: {
                                                //     value: /^[a-zA-Z][a-zA-Z .]*[. ]*$/,
                                                //     // value:/^[a-zA-Z](?:[a-zA-Z .]*[a-zA-Z])?$/, this doesn't let the value ends with dot and empty space(.," "),but this shows the error while cursor waiting in space 
                                                //     message: "Numbers, Special characters and Empty spaces are not allowed",
                                                // }
                                            })}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.ticketPrice?.message}</Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>Banner Image</Form.Label>
                                    <Form.Control
                                        accept="image/*"
                                        type="file"
                                        isInvalid={!!errors.bannerImage}
                                        {...register('bannerImage', {
                                            required: 'File is required',
                                            validate: (value) => {
                                                const file = value?.[0];
                                                if (!file) return 'No file selected';
                                                if (file.size > 2000000) return 'File size exceeds 2MB';
                                                if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                                                    return 'Invalid file type';
                                                }
                                                return true;
                                            }
                                        })}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.bannerImage?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col sm={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>Privacy Policy Document</Form.Label>
                                    <Form.Control
                                        accept=".pdf"
                                        type="file"
                                        isInvalid={!!errors.policyDocument}
                                        {...register('policyDocument', {
                                            required: 'File is required',
                                            validate: (value) => {
                                                const file = value?.[0];
                                                if (!file) return 'No file selected';
                                                if (file.size > 5000000) return 'File size exceeds 5MB';
                                                // if (!['pdf'].includes(file.type)) {
                                                //     return 'Invalid file type';
                                                // }
                                                return true;
                                            }
                                        })}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.policyDocument?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                        </Row>
                        {/* <Row>
                            <Col sm={{ span: 2 }}>
                                <Form.Group>
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control type="date" name="date" onChange={handleChange} />
                                </Form.Group>
                            </Col>
                            <Col sm={{ span: 2 }}>
                                <Form.Group>
                                    <Form.Label>Start Time</Form.Label>
                                    <Form.Control type="time" name="startTime" onChange={handleChange} />
                                </Form.Group>
                            </Col>
                            <Col sm={{ span: 2 }}>
                                <Form.Group>
                                    <Form.Label>End Time</Form.Label>
                                    <Form.Control type="time" name="endTime" onChange={handleChange} />
                                </Form.Group>
                            </Col>
                        </Row> */}
                        <Row>
                            <Col xs={{ span: 2, offset: 8 }} sm={{ span: 2, offset: 11 }}>
                                <Button className="my-4" type="submit" variant="primary">
                                    Generate
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </section >
        </>
    )
}
