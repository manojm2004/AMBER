import Hero3D from './landing/Hero3D';
import Workflow3D from './landing/Workflow3D';
import Features from './landing/Features';
import TargetUsers from './landing/TargetUsers';
import SystemArchitecture from './landing/SystemArchitecture';
import LiveDemoMock from './landing/LiveDemoMock';
import ProblemSolution from './landing/ProblemSolution';
import Global3DBackground from './landing/Global3DBackground';

export default function Home() {
  return (
    <div className="relative w-full flex-1 flex flex-col font-sans selection:bg-amber-cyan selection:text-black">
      
      {/* 
        This is the permanent 3D fixed background layer spanning the entire page 
        All other components rest passively on top of it.
      */}
      <Global3DBackground />

      <div className="relative z-10 flex flex-col w-full">
         <Hero3D />
         <Workflow3D />
         <Features />
         <TargetUsers />
         <SystemArchitecture />
         <LiveDemoMock />
         <ProblemSolution />
      </div>
      
    </div>
  );
}
