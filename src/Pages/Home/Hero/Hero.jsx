import { FiSearch } from 'react-icons/fi'
import img from '../../../assets/360.jpg'
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const Hero = () => {

    useEffect(() => {
        AOS.init({ duration: 1200 });
    }, []);
    return (
        <div>
            <section className="relative bg-slate-500 overflow-hidden h-[700px] sm:h-[800px]">

                <div
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-20 animate-pulse"
                    style={{ backgroundImage: `url(${img})` }}
                    data-aos="zoom-in"
                ></div>


                <div className="relative z-10 max-w-4xl mx-auto px-6 py-64 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
                        Best food for your taste
                    </h1>
                    <p className="text-lg text-gray-900 mb-8">
                        Discover delectable cuisine and unforgettable moments in our welcoming culinary haven.
                    </p>
                    <div className="flex justify-center mt-8">
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Search delicious dishes..."
                                className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-700 shadow-sm"
                            />
                            <FiSearch className="absolute left-3 top-3.5 text-gray-400 text-lg" />
                        </div>
                    </div>

                </div>
            </section>
        </div>
    )
}
