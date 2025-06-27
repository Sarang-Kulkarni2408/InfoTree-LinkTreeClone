"use client"

import React from 'react'

const page = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-6 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 rounded-2xl shadow-xl">

      <div className='text-2xl font-bold text-center mb-3'># 🔗 <span className="text-blue-600 dark:text-blue-400">InfoTree</span> – Your Personalized Link Manager
</div>
      <p className="mt-2 text-lg leading-relaxed">
        <strong>InfoTree</strong> is a secure, customizable Linktree clone that allows users to create, manage, and share a single link containing all their important URLs — like social media profiles, project links, portfolios, and more.
      </p>

      <div className='text-xl font-bold mt-3'>## ✨ Features - </div>

      <ul className="list-disc pl-6 space-y-1 mt-4">
        <li>🌐 <strong>Public user pages</strong> at <code>/users/[username]</code></li>
        <li>🔐 <strong>Secure password-protected editing</strong></li>
        <li>📝 <strong>Create, edit, and delete links</strong> dynamically</li>
        <li>📸 <strong>Add profile image, handle name, and description</strong></li>
        <li>🧾 <strong>Password confirmation</strong> on first creation</li>
        <li>👁️ <strong>Clean InfoTree UI</strong> for viewing</li>
        <li>📋 <strong>Copyable shareable links</strong> after creation/edit</li>
        <li>⚡ <strong>Fast, local-first experience</strong> with MongoDB backend</li>
      </ul>

      <div className='text-xl font-bold mt-4'>## 👨‍💻 How It Works (User Guide) - </div>

      <ol className="list-decimal pl-6 mt-2 space-y-1">
        <li>On Home Page, Choose <strong>"Create InfoTree"</strong> or <strong>"Visit InfoTree"</strong></li>
        <li>Enter your desired <code>username</code></li>
      </ol>

      ### 🔧 If Creating a New InfoTree

      <ul className="list-disc pl-6 mt-2 space-y-1">
        <li>If username is <strong>not taken</strong>, you can:</li>
        <ul className="list-[circle] pl-6 mt-1 space-y-1">
          <li>Enter your <strong>profile image</strong>, <strong>name</strong>, and <strong>description</strong></li>
          <li>Add multiple links (<code>originalURL + keyword</code>)</li>
          <li>Set and confirm a <strong>password</strong></li>
          <li><span className="text-red-600 dark:text-red-400 font-semibold">NOTE:</span> You can change the password but can't reset it, so don’t forget it!</li>
          <li>Click <strong>“Generate InfoTree”</strong></li>
          <li>Copy and share your public link!</li>
        </ul>
      </ul>

      ### 🔐 If Username Already Exists

      <ul className="list-disc pl-6 mt-2 space-y-1">
        <li>You'll get two options:</li>
        <ul className="list-[circle] pl-6 mt-1 space-y-1">
          <li>🔁 <strong>Choose another</strong></li>
          <li>🔐 <strong>It’s mine</strong> → enter password</li>
        </ul>
        <li>If correct → redirected to <strong>edit mode</strong></li>
        <li>Update info, add/remove links, then <strong>Save Changes</strong></li>
        <li>Link auto-copies and redirects to your public InfoTree</li>
      </ul>

      <div className='text-xl font-bold mt-3'>## 🛠 Tech Stack - </div>

      <table className="table-auto w-full mt-4 text-sm border border-zinc-200 dark:border-zinc-700 text-center">
        <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
          <tr>
            <th className="px-4 py-2 border border-zinc-200 dark:border-zinc-700">Tool / Library</th>
            <th className="px-4 py-2 border border-zinc-200 dark:border-zinc-700">Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 font-medium">Next.js (App Router)</td>
            <td className="px-4 py-2 border border-zinc-200 dark:border-zinc-700">Frontend + Routing</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 font-medium">MongoDB</td>
            <td className="px-4 py-2 border border-zinc-200 dark:border-zinc-700">Data storage (local for now)</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 font-medium">Tailwind CSS</td>
            <td className="px-4 py-2 border border-zinc-200 dark:border-zinc-700">Styling</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 font-medium">Crypto (Node.js)</td>
            <td className="px-4 py-2 border border-zinc-200 dark:border-zinc-700">SHA-256 Password Hashing</td>
          </tr>
        </tbody>
      </table>

      <div className='text-2xl text-center font-bold mt-5 mb-0'>Thank You !</div>

    </div>
  )
}

export default page
