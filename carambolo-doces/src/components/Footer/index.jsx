import React from "react";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaInstagram, FaTiktok, FaMapMarkerAlt } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-blue to-darkBlue text-white py-12 border-t-2 border-gold">
      <div className="container mx-auto flex justify-between items-start px-6 space-x-12">
        <div className="flex items-start">
          <img
            src="src/assets/logo_footer.png"
            alt="Logo do Footer"
            className=""
          />
        </div>

        <div className="flex-1 flex flex-col items-start">
          <ul className="space-y-3">
            <li>
              <a href="#" className="underline">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="underline">
                Carambolos
              </a>
            </li>
            <li>
              <a href="#" className="underline">
                Fornada da Semana
              </a>
            </li>
            <li>
              <a href="#" className="underline">
                Datas Especiais
              </a>
            </li>
          </ul>
        </div>

        <div className="flex-1 flex flex-col items-start">
          <h4 className="text-gradient font-semibold mb-2">CONTATO</h4>
          <p className="pb-3">
            <IoLogoWhatsapp className="inline h-6 w-6 mr-2 text-gold" />{" "}
            (11) 98380-6301
          </p>
          <h4 className="text-gradient font-semibold mb-2">ENDEREÇO</h4>
          <p>
            <FaMapMarkerAlt className="inline h-6 w-6 mr-2 text-gold" /> Rua
            Itapeva 26 cj 808
          </p>
        </div>

        <div className="flex-1 flex flex-col items-start">
          <h4 className="text-gradient font-semibold mb-2">REDES SOCIAIS</h4>
          <p className="mb-3">
            <FaInstagram className="inline h-6 w-6 mr-2 text-gold" />{" "}
            @carambolodoces
          </p>
          <p>
            <FaTiktok className="inline h-6 w-6 mr-2 text-gold" />{" "}
            @carambolodoces
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
