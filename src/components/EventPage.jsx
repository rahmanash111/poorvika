import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "../css/eventpage.css"
import { getEventData } from "../apis/api-service";
import RPComponent from "./RPComponent";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function EventPage() {

    //extracting the slug from the url
    const location = useLocation();
    const arr = location.pathname.split("/");
    const slug = arr[arr.length - 1];

    const [pageData, setPageData] = useState(null);

    useEffect(() => {

        const handleApiCall = async (slug) => {
            const res = await getEventData(slug);

            if (res?.status == 200) {
                console.log(res);
                setPageData(res?.data)
            } else {
                console.log("Something Went Wrong");
            }
        }
        handleApiCall(slug);
    }, [])

    return (
        <div className="event-page w-100 d-flex align-items-center justify-content-center">
            {
                pageData ? (
                    <section style={{ textAlign: "center" }} className="hero-section">
                        <div className="hero-title">
                            <h2>
                                {pageData?.subHeadline}
                            </h2>
                            <h1 className="mt-5">
                                {pageData?.headline}
                            </h1>
                            <img style={{}} className="banner-image w-75 h-25 mt-5" src={`${baseUrl}${pageData?.imageUrl}`} />
                        </div>
                        <img />
                        <div>
                            <br />
                            <p><b>Content Goes Here.</b></p>
                        </div>
                        <RPComponent eventData={pageData} />
                        {/* <Button>{pageData.bannerCta}</Button> */}
                    </section>)
                    :
                    <div className="w-100 h-25 d-flex align-items-center justify-content-center">
                        <Spinner />
                    </div>
            }
        </div>
    )
}
