import React, { useState, useEffect } from 'react';
import { assets, homeMiddle, projectUses, traditionalSystems } from '../../assets/assets';
import { FaRegCirclePause, FaRegCirclePlay } from "react-icons/fa6";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const Home = () => {

   

 
    // Carousel 1
    const [currIdxHome, setCurrIdxHome] = useState(0);
    const [isPausedHome, setIsPausedHome] = useState(false);

    // Carousel 2
    const [currIdxProject, setCurrIdxProject] = useState(0);
    const [isPausedProject, setIsPausedProject] = useState(false);

    // Auto slide for homeMiddle
    useEffect(() => {
        if (isPausedHome) return;
        const interval = setInterval(() => {
            setCurrIdxHome((prev) => (prev + 1) % homeMiddle.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isPausedHome]);

    // Auto slide for projectUses
    useEffect(() => {
        if (isPausedProject) return;
        const interval = setInterval(() => {
            setCurrIdxProject((prev) => (prev + 1) % projectUses.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isPausedProject]);

    // Handlers for prev/next
    const handlePrevProject = () => {
        setCurrIdxProject((prev) => (prev - 1 + projectUses.length) % projectUses.length);
    };
    const handleNextProject = () => {
        setCurrIdxProject((prev) => (prev + 1) % projectUses.length);
    };


     const [currentTS, setCurrentTS] = useState(0);
    const systemNames = ["Ayurveda", "Siddha", "Unani"];

    const handleClickTS = (index) => {
        setCurrentTS(index);
    };
 

  // Auto-slide left list
    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentTS((prev) => (prev + 1) % systemNames.length);
        }, 3000); // change slide every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='bg-gray-300 p-4'>
            <div className='flex gap-5'>

                {/* Left Info Card */}
                <div className='w-[300px] shadow-xl rounded-xl bg-white'>
                    <img className='w-[100px] mx-[90px] my-2' src={assets.Leaf} alt="leaf" />
                    <p className='text-[12px] font-bold ml-[5px]'>"India’s traditional medicine is our Green Gold—</p>
                    <p className='text-[12px] font-bold ml-[50px]'>mapping it digitally for a healthier future."</p>
                    <img className='w-[220px] mt-2' src={assets.Modi} alt="Modi" />
                </div>

                {/* Middle Carousel */}
                <div className='w-[300px] shadow-xl rounded-xl bg-white flex flex-col items-center p-4'>
                    <img className='w-[200px] mt-2 rounded-full bg-cyan-700' src={homeMiddle[currIdxHome].image} alt={homeMiddle[currIdxHome].text} />
                    <p className='text-[20px] font-bold my-2 text-cyan-700 text-center'>{homeMiddle[currIdxHome].text}</p>

                    {/* Dots + Pause/Play */}
                    <div className='flex items-center justify-between w-full mt-4 '>
                        <div className='flex gap-2 mx-[65px]'>
                            {homeMiddle.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrIdxHome(idx)}
                                    className={`w-4 h-4 rounded-full ${currIdxHome === idx ? 'bg-blue-500' : 'bg-gray-400'}`}
                                ></button>
                            ))}
                        </div>


                    </div>

                    <button
                        onClick={() => setIsPausedHome(!isPausedHome)}
                        className='rounded text-sm cursor-pointer ml-[220px] mt-4 '
                    >
                        {isPausedHome ? <FaRegCirclePlay size={30} /> : <FaRegCirclePause size={30} />}
                    </button>
                </div>

                <div className='w-[300px]  shadow-xl rounded-xl bg-white flex flex-col p-4'>
                    {/* Top: Title and Description */}
                    <div className='flex-1 overflow-y-auto mt-4'>
                        <p className='text-[18px] font-bold my-2 text-black text-center'>
                            {projectUses[currIdxProject].title}
                        </p>
                        <p className='text-[16px] my-2 text-center'>
                            {projectUses[currIdxProject].description}
                        </p>
                    </div>

                    {/* Bottom: Buttons and Pause/Play */}
                    <div className='flex gap-2 items-center ml-[90px]'>
                        <button onClick={handlePrevProject} className='p-1 hover:bg-gray-200 rounded'>
                            <AiOutlineLeft size={30} />
                        </button>
                        <button onClick={handleNextProject} className='p-1 hover:bg-gray-200 rounded'>
                            <AiOutlineRight size={30} />
                        </button>
                    </div>


                    <button
                        onClick={() => setIsPausedProject(!isPausedProject)}
                        className='rounded text-sm cursor-pointer mt-4 ml-[230px]'
                    >
                        {isPausedProject ? <FaRegCirclePlay size={30} /> : <FaRegCirclePause size={30} />}
                    </button>
                </div>

                <div className='w-[300px] shadow-xl rounded-xl bg-white'>
                    <img className='w-[150px] h-[150px] mt-8 mx-[70px] rounded-full my-2' src={assets.ICD} alt="leaf" />
                    <ul className='text-[14px]  ml-[30px] list-disc space-y-1 mt-10'>
                        <li>International standard for disease classification.</li>
                        <li>Facilitates global reporting and research.</li>
                        <li>Improves healthcare interoperability and policy making.</li>
                    </ul>
                </div>


            </div>

            <div className='w-[600px] mx-auto mt-[50px] mb-2'>
                <p className='md:text-[24px] font-bold text-[#005596] ml-[50px] md:ml-[100px]'>Traditional Medicinal Systems </p>


                <div className='flex gap-3 w-full md:w-[900px] px-4'>
                    {/* Left List */}
                    <ul className="mt-[50px] w-[250px] md:w-[300px] flex-shrink-0 pr-4 border-r-2 border-blue-400">
                        {systemNames.map((insur, index) => (
                            <li
                                key={index}
                                className={`cursor-pointer mt-[30px] md:mt-[40px] uppercase relative pb-[7px] border-b-2
          border-[#cdcdcd] transform scale-100 origin-left transition-all duration-500 
          ${index === currentTS ? 'text-blue-600 font-bold border-blue-600 scale-105' : 'text-black'}`}
                                onClick={() => handleClickTS(index)}
                            >
                                <span className="text-[12px] md:text-[1.6rem] font-normal text-nowrap">{insur}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Right Card */}
                    <div className="flex-1 flex flex-col items-center justify-center p-4 rounded-lg transition-all">
                        {traditionalSystems.map((item, id) =>
                            id === currentTS ? (
                                <div key={id} className="flex flex-col items-center text-center animate-fadeIn">
                                    <img
                                        src={item.image}
                                        className="w-[400px] h-auto rounded-lg transition-transform duration-500 hover:scale-105"
                                        alt={item.text}
                                    />
                                    <div className="mt-4 md:text-lg md:font-semibold text-gray-800 px-4 text-left">
                                        {item.text}
                                    </div>
                                    <button className="mt-2 w-[150px] md:w-[200px] relative overflow-hidden text-white font-medium rounded-full px-6 py-2 text-[20px] bg-orange-400 transition-all duration-300 ease-in-out 
            before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-full before:bg-white 
            before:rounded-full before:scale-x-0 before:origin-left before:transition-transform before:duration-300 
            before:ease-[cubic-bezier(0.86,0,0.07,1)] hover:before:scale-x-100 hover:before:origin-left hover:text-orange-400">
                                        <span className="relative z-10">Explore</span>
                                    </button>
                                </div>
                            ) : null
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Home;
