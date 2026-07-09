import Hero from "../sections/Hero";
import Summary from "../sections/Summary";
import { PageWrapper } from "./pageTransition";

export default function HomePage() {
    return (
        <PageWrapper>
            <Hero />
            <Summary />
        </PageWrapper>
    );
}
