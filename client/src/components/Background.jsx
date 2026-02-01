import React from 'react';

const Background = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-blue-900/20 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-800/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
    </div>
);

export default Background;
