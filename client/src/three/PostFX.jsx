import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

export default function PostFX() {
    return (
        <EffectComposer multisampling={0}>
            <Bloom intensity={0.8} luminanceThreshold={0.65} mipmapBlur />
            <Vignette eskil={false} offset={0.18} darkness={0.55} />
        </EffectComposer>
    );
}
