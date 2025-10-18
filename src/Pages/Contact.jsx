import React from "react";
import SocialLinks from "../components/SocialLinks";
import AOS from "aos";
import "aos/dist/aos.css";
import { MessageCircle, Mail, MessageSquare } from "lucide-react";

const ContactPage = () => {
  React.useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  return (
    <div className="px-[5%] sm:px-[5%] lg:px-[10%]" >
      <div className="text-center lg:mt-[5%] mt-10 mb-2 sm:px-0 px-[5%]">
        <h2
          data-aos="fade-down"
          data-aos-duration="1000"
          className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
        >
          Let's Connect
        </h2>
        <p
          data-aos="fade-up"
          data-aos-duration="1100"
          className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2"
        >
          Ready to bring your creative vision to life? Let's collaborate and create something extraordinary together.
        </p>
      </div>

      <div
        className="h-auto py-10 flex items-center justify-center"
        id="Contact"
      >
        <div className="container px-[1%] flex justify-center">
          <div
            className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl rounded-3xl shadow-2xl p-8 py-12 sm:p-12 transform transition-all duration-500 hover:shadow-[#6366f1]/20 w-full max-w-4xl border border-white/10"
          >
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl mb-6 shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                Let's Create Magic
              </h2>
              <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Passionate about transforming ideas into stunning visual experiences. 
                Let's collaborate on your next design project.
              </p>
            </div>

            {/* Social Links Section */}
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-8 flex items-center justify-center gap-3">
                <div className="w-2 h-2 bg-[#6366f1] rounded-full animate-pulse"></div>
                Connect With Me
                <div className="w-2 h-2 bg-[#a855f7] rounded-full animate-pulse"></div>
              </h3>
              
              <div className="flex justify-center space-x-8 mb-12">
                <SocialLinks />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;