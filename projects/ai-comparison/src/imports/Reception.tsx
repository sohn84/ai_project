import svgPaths from "./svg-paths";

export default function Reception() {
  return (
    <div className="relative size-[30px]">
      <div className="absolute bottom-1/4 left-[12.5%] right-[12.5%] top-[16.67%]">
        <div className="absolute inset-[-5.71%_-4.44%] bg-[rgba(0,0,0,0)]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.5 19.5">
            <path d={svgPaths.reception} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}
