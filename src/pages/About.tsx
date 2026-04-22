import { useGlobalContext } from "../context/Global";
import "../style/about.scss";

const About = () => {
    const { t } = useGlobalContext();

    return (
        <div class="about">
            <div class="header">
                <h2>{t("about_description")}</h2>
            </div>
            <div class="content">
            TODO
            </div>
        </div>
    );
};

export default About;
