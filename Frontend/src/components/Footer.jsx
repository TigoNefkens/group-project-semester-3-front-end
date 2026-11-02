import "./Footer.css"
import footerimage from "../assets/SiouxLogoGrey.png";

export default function footer() {


    return (
        <>
            <div className="footer-container">
                <img src={footerimage} className="footer-image"></img>
                <div className="contact">info@sioux.eu</div>
            </div>
        </>
    )
}