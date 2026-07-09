import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { world } from "./world";

const vertex = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;

const fragment = /* glsl */ `
  uniform vec3 uTop; uniform vec3 uBottom;
  varying vec3 vPos;
  void main() {
    float h = normalize(vPos).y * 0.5 + 0.5;
    vec3 col = mix(uBottom, uTop, pow(h, 0.85));
    gl_FragColor = vec4(col, 1.0);
  }`;

export default function SkyDome() {
    const mat = useRef();
    useFrame(() => {
        if (!mat.current || !world.palette) return;
        mat.current.uniforms.uTop.value.set(world.palette.top);
        mat.current.uniforms.uBottom.value.set(world.palette.bot);
    });
    return (
        <mesh scale={60}>
            <sphereGeometry args={[1, 32, 32]} />
            <shaderMaterial
                ref={mat}
                side={THREE.BackSide}
                depthWrite={false}
                vertexShader={vertex}
                fragmentShader={fragment}
                uniforms={{
                    uTop: { value: new THREE.Color("#cfe4f2") },
                    uBottom: { value: new THREE.Color("#f7ecd9") },
                }}
            />
        </mesh>
    );
}
