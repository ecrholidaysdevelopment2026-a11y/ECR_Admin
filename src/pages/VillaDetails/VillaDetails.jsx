import { useParams } from "react-router-dom";
import VillaDetailsSection from "../../component/Container/VillaDetailsSection/VillaDetailsSection";

function VillaDetails() {
    const { slug } = useParams();
    return <VillaDetailsSection slug={slug} />;
}

export default VillaDetails;
