import React from "react";
 import { IoClose } from "react-icons/io5";
 
 function ModalBase({ children, title, onClose }) {
   const handleClickOutside = (e) => {
     if (e.target === e.currentTarget) {
       onClose();
     }
   };
 
   return (
     <div
       className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
       onClick={handleClickOutside}
     >
       <div className="bg-gradient-to-b from-blue to-darkBlue rounded-lg shadow-md border-2 border-gold p-8 w-[400px] max-w-full mx-4 relative">
         <button onClick={onClose} className="absolute top-4 right-4 text-gold text-4xl">
           <IoClose />
         </button>
         <h2 className="text-center text-white text-2xl font-bold mb-4 uppercase">
           {title}
         </h2>
         {children}
       </div>
     </div>
   );
 }
 
 export default ModalBase;