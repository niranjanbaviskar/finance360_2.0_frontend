'use client';

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { noise } from './perline';
import React from 'react';

const BubbleEffect = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const springRef = useRef({ scale: 1 });

  useImperativeHandle(ref, () => ({
    startSpeaking: () => {
      isSpeakingRef.current = false;
    },
    stopSpeaking: () => {
      isSpeakingRef.current = false;
      // Smoothly return the bubble to its normal scale
      gsap.to(springRef.current, {
        duration: 1,
        scale: 1,
        ease: "elastic.out(1, 0.2)",
      });
    },
  }));

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });

    const scene = new THREE.Scene();

    const setup = () => {
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;

      scene.fog = new THREE.Fog(0x000000, 10, 950);

      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 0, 300);
    };

    const createLights = () => {
      const ambientLight = new THREE.AmbientLight(0x4b0082, 0.5);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0x4169e1, 2, 300);
      pointLight1.position.set(100, 100, 100);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x9400d3, 2, 300);
      pointLight2.position.set(-100, -100, 100);
      scene.add(pointLight2);
    };

    const vertex = width > 575 ? 80 : 40;
    const bubbleGeometry = new THREE.SphereGeometry(100, vertex, vertex);
    const positionAttribute = bubbleGeometry.getAttribute('position');
    const originalPositions = positionAttribute.array.slice();
    let bubble;
    let glowMesh;

    const createBubble = () => {
      const bubbleMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x4b0082,
        emissive: 0x9400d3,
        emissiveIntensity: 0.5,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
        transmission: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      });

      bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
      scene.add(bubble);

      const glowGeometry = new THREE.SphereGeometry(102, vertex, vertex);
      const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
          coefficient: { value: 0.5 },
          power: { value: 2.0 },
          glowColor: { value: new THREE.Color(0x4169e1) },
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float coefficient;
          uniform float power;
          uniform vec3 glowColor;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(coefficient - dot(vNormal, vec3(0.0, 0.0, 1.0)), power);
            gl_FragColor = vec4(glowColor, intensity);
          }
        `,
        transparent: true,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      });

      glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      scene.add(glowMesh);
    };

    let mouse = new THREE.Vector2(0, 0);

    const onMouseMove = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;

      gsap.to(mouse, {
        duration: 0.8,
        x,
        y,
        ease: "power2.out",
      });
    };

    const updateVertices = (time) => {
      const positionAttribute = bubbleGeometry.getAttribute('position');
      const positions = positionAttribute.array;

      const intensity = isSpeakingRef.current ? 0.8 : 0.4;
      const speed = isSpeakingRef.current ? 0.001 : 0.0005;

      for (let i = 0; i < positions.length; i += 3) {
        const x = originalPositions[i];
        const y = originalPositions[i + 1];
        const z = originalPositions[i + 2];

        const perlin = noise.simplex3(
          (x * 0.01) + (time * speed),
          (y * 0.01) + (time * speed),
          (z * 0.01)
        );

        const ratio = (perlin * intensity + 1);
        positions[i] = originalPositions[i] * ratio;
        positions[i + 1] = originalPositions[i + 1] * ratio;
        positions[i + 2] = originalPositions[i + 2] * ratio;
      }

      positionAttribute.needsUpdate = true;
    };

    const render = (time) => {
      animationRef.current = requestAnimationFrame(render);

      if (bubble && glowMesh) {
        const rotationSpeed = isSpeakingRef.current ? 0.002 : 0.001;
        bubble.rotation.y += rotationSpeed;

        bubble.scale.set(springRef.current.scale, springRef.current.scale, springRef.current.scale);
        glowMesh.scale.set(springRef.current.scale, springRef.current.scale, springRef.current.scale);

        updateVertices(time);

        glowMesh.geometry.attributes.position.array.set(bubbleGeometry.attributes.position.array);
        glowMesh.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    const onResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    setup();
    createLights();
    createBubble();
    requestAnimationFrame(render);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onMouseMove);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationRef.current);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute w-full h-full" />;
});

export default BubbleEffect;
