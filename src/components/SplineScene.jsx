import Spline from '@splinetool/react-spline';

export default function SplineScene() {
  return (
    <div
      style={{ width: '90%', height: '100%' }}
      onWheelCapture={(e) => e.stopPropagation()}
    >
      <Spline
        scene="https://prod.spline.design/7eSlSMbJAlUuQaOu/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
