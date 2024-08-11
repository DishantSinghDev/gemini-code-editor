import { useEffect, useState } from "react";
import Siriwave from "react-siriwave";

const WaveForm = ({ analyzerData }) => {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(60);
  const [amplitude, setAmplitude] = useState(0); // Default amplitude
  const [speed, setSpeed] = useState(0.5); // Default speed

  useEffect(() => {
    const handleResize = () => {
      setWidth(100);
      setHeight(50);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (analyzerData) {
      const { dataArray, bufferLength } = analyzerData;

      // Calculate amplitude based on frequency data
      const sum = dataArray.reduce((acc, val) => acc + val, 0);
      const average = sum / bufferLength;
      setAmplitude(Math.max(0, (average / 255) * (0.5 * height))); // Normalize to height

      // Set speed based on frequency data or other logic
      setSpeed(0.05 + (average / 255) * 0.2); // Example adjustment for speed
    }
  }, [analyzerData, height]);

  return (
    <Siriwave
      color="#6adc92"
      amplitude={amplitude}
      speed={speed}
      width={width}
      height={height}
      
    />
  );
};

export default WaveForm;
