import React from 'react'

const Navbar = () => {
  const handleAbout = () => {
    alert("InfoTree is a secure, password-protected link-sharing app inspired by Linktree developed by 'SSK Developers'.\nCreate, manage, and share all your important links from one place!");
  };

  const handleContact = () => {
    alert("For any queries or feedback, contact the developer at:\nsarangkulkarni2408@gmail.com\n");
  };
  return (
    <div className='bg-white mx-auto w-[80vw] h-[10vh] text-black my-7 rounded-4xl flex items-center justify-between px-12'>
      <div className="logo flex">
        <span className='text-3xl font-semibold'>InfoHub</span>
        <img src="/infoTreeLogo.svg" alt="logo" className='pt-1' />
      </div>
      <div className="intro gap-3">
        <a href="/note" className="pr-5 font-bold cursor-pointer hover:text-xl">Home</a>
        <span onClick={handleAbout} className='px-5 font-bold cursor-pointer hover:text-xl'>About</span>
        <span onClick={handleContact} className='pl-5 font-bold cursor-pointer hover:text-xl'>Contact Us</span>
      </div>
    </div>
  )
}

export default Navbar
