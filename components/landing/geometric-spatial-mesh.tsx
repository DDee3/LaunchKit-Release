"use client";

import { useEffect, useRef } from "react";

export function GeometricSpatialMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", onResize);

    // 3D Torus parameters
    const numMajor = 36;
    const numMinor = 18;

    let rotX = 0.55;
    let rotY = 0.35;
    let rotZ = 0;

    let targetRotX = 0.55;
    let targetRotY = 0.35;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / width - 0.5;
      const y = (e.clientY - rect.top) / height - 0.5;
      targetRotY = 0.35 + x * 0.8;
      targetRotX = 0.55 + y * 0.6;
    };

    window.addEventListener("mousemove", onMouseMove);

    const render = () => {
      const R = Math.min(width, height) * 0.28; // Major radius
      const r = Math.min(width, height) * 0.12; // Minor radius

      rotX += (targetRotX - rotX) * 0.05 + 0.002;
      rotY += (targetRotY - rotY) * 0.05 + 0.003;
      rotZ += 0.001;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const fov = 400;

      const points: { x: number; y: number; z: number }[][] = [];

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);

      for (let i = 0; i < numMajor; i++) {
        points[i] = [];
        const u = (i / numMajor) * Math.PI * 2;
        const cosU = Math.cos(u);
        const sinU = Math.sin(u);

        for (let j = 0; j < numMinor; j++) {
          const v = (j / numMinor) * Math.PI * 2;
          const cosV = Math.cos(v);
          const sinV = Math.sin(v);

          // 3D Torus coordinates
          let x = (R + r * cosV) * cosU;
          let y = (R + r * cosV) * sinU;
          let z = r * sinV;

          // Rotate Z
          let x1 = x * cosZ - y * sinZ;
          let y1 = x * sinZ + y * cosZ;
          let z1 = z;

          // Rotate X
          let y2 = y1 * cosX - z1 * sinX;
          let z2 = y1 * sinX + z1 * cosX;
          let x2 = x1;

          // Rotate Y
          let x3 = x2 * cosY + z2 * sinY;
          let z3 = -x2 * sinY + z2 * cosY;
          let y3 = y2;

          points[i][j] = { x: x3, y: y3, z: z3 };
        }
      }

      // Draw wireframe rings
      ctx.lineWidth = 1;

      for (let i = 0; i < numMajor; i++) {
        const nextI = (i + 1) % numMajor;
        for (let j = 0; j < numMinor; j++) {
          const nextJ = (j + 1) % numMinor;
          const p1 = points[i][j];
          const p2 = points[nextI][j];
          const p3 = points[i][nextJ];

          // Project to 2D
          const scale1 = fov / (fov + p1.z + 250);
          const px1 = cx + p1.x * scale1;
          const py1 = cy + p1.y * scale1;

          const scale2 = fov / (fov + p2.z + 250);
          const px2 = cx + p2.x * scale2;
          const py2 = cy + p2.y * scale2;

          const scale3 = fov / (fov + p3.z + 250);
          const px3 = cx + p3.x * scale3;
          const py3 = cy + p3.y * scale3;

          // Dynamic depth-based alpha and amber lighting
          const depthAlpha = Math.max(0.04, Math.min(0.45, (p1.z + r + 50) / (2 * r + 100)));

          // Amber accent glow for vertices facing the viewer
          if (p1.z > 0 && (i % 3 === 0 || j % 3 === 0)) {
            ctx.strokeStyle = `rgba(255, 90, 0, ${depthAlpha * 1.2})`;
          } else {
            ctx.strokeStyle = `rgba(255, 255, 255, ${depthAlpha * 0.4})`;
          }

          ctx.beginPath();
          ctx.moveTo(px1, py1);
          ctx.lineTo(px2, py2);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(px1, py1);
          ctx.lineTo(px3, py3);
          ctx.stroke();

          // Subtle glowing amber nodes at key intersections
          if (p1.z > 40 && i % 4 === 0 && j % 3 === 0) {
            ctx.fillStyle = `rgba(255, 90, 0, ${depthAlpha * 1.5})`;
            ctx.beginPath();
            ctx.arc(px1, py1, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-75">
      <div className="absolute inset-0 [background:radial-gradient(circle_at_center,transparent_0%,#000000_75%)] z-10 pointer-events-none" />
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[1200px] max-h-[800px] object-contain"
      />
    </div>
  );
}

