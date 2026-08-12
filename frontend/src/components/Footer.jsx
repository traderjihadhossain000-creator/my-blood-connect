import {
  HeartPulse,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
} from "lucide-react";

import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black/40 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-14">

          {/* Logo */}
          <div>
            <div className="flex items-center gap-3">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                <HeartPulse className="text-white" />
              </div>

              <div>
                <h2 className="text-3xl font-black text-white">
                  BloodConnect
                </h2>

                <p className="text-red-400">
                  Save Lives Faster
                </p>
              </div>

            </div>

            <p className="text-slate-400 mt-6 leading-8">
              Emergency blood donation platform connecting
              patients, donors and hospitals in real time.
            </p>

          </div>

          {/* Quick Links */}
          <div>

            <h3 className="text-xl font-bold text-white mb-6">
              Quick Links
            </h3>

            <div className="space-y-4 text-slate-400">

              <p className="hover:text-red-400 cursor-pointer transition">
                Home
              </p>

              <p className="hover:text-red-400 cursor-pointer transition">
                Find Donors
              </p>

              <p className="hover:text-red-400 cursor-pointer transition">
                Emergency Board
              </p>

              <p className="hover:text-red-400 cursor-pointer transition">
                Register
              </p>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="text-xl font-bold text-white mb-6">
              Contact
            </h3>

            <div className="space-y-5 text-slate-400">

              <div className="flex gap-3">
                <Mail className="text-red-500" />
                <span>support@bloodconnect.com</span>
              </div>

              <div className="flex gap-3">
                <Phone className="text-red-500" />
                <span>+880 1700-000000</span>
              </div>

              <div className="flex gap-3">
                <MapPin className="text-red-500" />
                <span>Dhaka, Bangladesh</span>
              </div>

            </div>

          </div>

          {/* Social */}

          <div>

            <h3 className="text-xl font-bold text-white mb-6">
              Follow Us
            </h3>

            <div className="flex gap-5">

              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500 hover:text-white transition cursor-pointer">
                <FaFacebookF size={20} />
              </div>

              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500 hover:text-white transition cursor-pointer">
                <FaGithub size={20} />
              </div>

              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500 hover:text-white transition cursor-pointer">
                <FaLinkedinIn size={20} />
              </div>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-5">

          <p className="text-slate-500 text-center">
            © 2026 BloodConnect. All Rights Reserved.
          </p>

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition"
          >
            <ArrowUp />
          </button>

        </div>

      </div>
    </footer>
  );
}
