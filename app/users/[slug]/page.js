"use client"
import React from 'react'
import { useParams, useSearchParams } from 'next/navigation'

import { useState, useEffect } from 'react'

const Page = () => {
    const params = useParams()
    const [profileImage, setprofileImage] = useState('')
    const [handleName, sethandleName] = useState('')
    const [description, setdescription] = useState('')
    const [originalURL, setoriginalURL] = useState('')
    const [keyword, setkeyword] = useState('')
    const [links, setLinks] = useState([]);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Checks if user already exists, if exists, directly shows his/her InfoTree else creates new.
    const [userExists, setUserExists] = useState(false);
    const [userData, setUserData] = useState(null);

    const searchParams = useSearchParams();
    const isEditMode = searchParams.get("edit") === "true";

    useEffect(() => {
        if (links.length > 0) {
            localStorage.setItem(`links-${params.slug}`, JSON.stringify(links));
        }
    }, [links, params.slug]);

    useEffect(() => {
        const savedLinks = localStorage.getItem(`links-${params.slug}`);
        if (savedLinks) {
            setLinks(JSON.parse(savedLinks));
        }
    }, [params.slug]);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch(`/api/user/${params.slug}`);
            const data = await res.json();

            if (data.exists) {
                setUserExists(true);
                setUserData(data.user);
                setprofileImage(data.user.profileImage || "");
                sethandleName(data.user.handleName || "");
                setdescription(data.user.description || "");
                setLinks(data.user.links || []);
            }
        };

        fetchUser();
    }, [params.slug]);


    const handleAddItem = () => {
        if (!originalURL.trim() || !keyword.trim()) {
            alert("Please fill both the original URL and keyword.");
            return;
        }

        setLinks([...links, { originalURL, keyword }]);
        alert("Item added successfully !");
        setoriginalURL('');
        setkeyword('');
    }

    const handleSubmit = async () => {
        if (!profileImage || !handleName || !description || links.length === 0) {
            alert("Please fill all fields and add at least one link.");
            return;
        }

        if (!userExists) {
            if (password.length < 8) {
                alert("Password must be at least 8 characters.");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }
        }

        const res = await fetch(`/api/user/${params.slug}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                profileImage,
                handleName,
                description,
                links,
                ...(!userExists && { password })  // only include password if creating
            })
        });

        const result = await res.json();

        if (result.success) {
            const userURL = `${window.location.origin}/users/${params.slug}`;

            alert(`InfoTree created successfully! 🎉\n\nShare your link:\n${userURL}`);

            // Optionally auto-copy to clipboard:
            try {
                await navigator.clipboard.writeText(userURL);
                alert("Link copied to clipboard!");
            } catch (err) {
                console.warn("Clipboard copy failed:", err.message);
            }

            // Cleanup localStorage and reset
            localStorage.removeItem(`links-${params.slug}`);
            setLinks([]);

            // 🔁 Redirect to view page
            window.location.href = `/users/${params.slug}`;
        }
        else {
            alert(result.message || "Something went wrong.");
        }
    }

    const handleUpdate = async () => {
        const res = await fetch(`/api/user/${params.slug}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                profileImage,
                handleName,
                description,
                links
            })
        });

        const result = await res.json();

        if (result.success) {
            const userURL = `${window.location.origin}/users/${params.slug}`;

            alert(`InfoTree updated successfully! 🎉\n\nHere's your link:\n${userURL}`);

            try {
                await navigator.clipboard.writeText(userURL);
                alert("Link copied to clipboard!");
            } catch (err) {
                console.warn("Clipboard copy failed:", err.message);
            }

            // Redirect to view mode
            window.location.href = `/users/${params.slug}`;
        } else {
            alert("Failed to update. Please try again.");
        }

    };

    return (
        <div className="flex flex-col items-center">
            {userExists && !isEditMode ? (
                // ✅ Show existing user's InfoTree
                // Example wrapper in JSX
                <div className="flex flex-col items-center justify-start p-6 bg-orange-500">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl py-6 px-6 text-center">
                        <img src={userData.profileImage}
                            alt="Profile"
                            className="mx-auto w-32 h-32 rounded-full border-4 border-indigo-500 object-cover shadow-md" />
                        <h1 className="mt-4 text-3xl font-bold text-gray-800">{userData.handleName}</h1>
                        <p className="mt-2 text-gray-900 font-semibold">{userData.description}</p>

                        <div className="mt-6 space-y-4">
                            {userData.links.map((link, i) => (
                                <a key={i}
                                    href={link.originalURL}
                                    target="_blank" rel="noopener noreferrer"
                                    className="block py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full shadow hover:shadow-lg transition">
                                    {link.keyword}
                                </a>
                            ))}
                        </div>

                        <footer className="mt-8 text-xs text-gray-400">© {new Date().getFullYear()} InfoTree by {userData.handleName}</footer>
                    </div>
                </div>

            ) : (
                // 📝 Show form for new user
                <>
                    <div className='text-white text-2xl m-3 font-bold'>
                        Welcome, {params.slug.replace(/%20/g, "-")}, Create your InfoTree!
                    </div>

                    <div className="profileImage m-3">
                        <input type="text" id="profileImage" name="profileImage" placeholder="Enter link of your profile image" required value={profileImage} onChange={(e) => setprofileImage(e.target.value)}
                            className="w-[50vw] px-4 py-4 border-3 border-white rounded-xl shadow-sm text-gray-800 bg-white font-bold cursor-pointer"
                        />
                    </div>

                    <div className="handleName m-3">
                        <input type="text" id="handleName" name="handleName" placeholder="Enter your handle's Name" required value={handleName} onChange={(e) => sethandleName(e.target.value)} 
                            className="w-[50vw] px-4 py-4 border-3 border-white rounded-xl shadow-sm text-gray-800 bg-white font-bold cursor-pointer"
                        />
                    </div>

                    <div className="description m-3">
                        <input type="text" id="description" name="description" placeholder="Enter description for your handle" required value={description} onChange={(e) => setdescription(e.target.value)}
                             className="w-[50vw] px-4 py-4 border-3 border-white rounded-xl shadow-sm text-gray-800 bg-white font-bold cursor-pointer"
                        />
                    </div>

                    <div className="password m-3">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Set a password (min 8 characters)"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-[50vw] px-4 py-4 border-3 border-white rounded-xl shadow-sm text-gray-800 bg-white font-bold cursor-pointer"
                        />
                    </div>
                    <div className="confirmPassword m-3">
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-[50vw] px-4 py-4 border-3 border-white rounded-xl shadow-sm text-gray-800 bg-white font-bold cursor-pointer"
                        />
                    </div>

                    <div className="addLink m-3 flex gap-2 p-0">
                        <input type="text" id="originalURL" name="originalURL" placeholder="Enter link of your item" required value={originalURL} onChange={(e) => setoriginalURL(e.target.value)}
                            className="w-[25vw] px-4 py-4 border-3 border-white rounded-xl shadow-sm text-gray-800 bg-white font-bold cursor-pointer m-0"
                        />
                        <input type="text" id="keyword" name="keyword" placeholder="Enter keyword" required value={keyword} onChange={(e) => setkeyword(e.target.value)}
                            className="w-[15vw] px-4 py-4 border-3 border-white rounded-xl shadow-sm text-gray-800 bg-white font-bold cursor-pointer"
                        />
                        <button onClick={handleAddItem} className='w-[9vw] cursor-pointer border-3 border-white rounded-xl shadow-sm text-gray-800 bg-white font-bold'>Add Item</button>
                    </div>

                    {links.length > 0 && (
                        <div className="text-white mt-4">
                            <div className="font-bold mb-2">Your Links:</div>
                            <ul className="list-disc pl-5">
                                {links.map((link, index) => (
                                    <li key={index}>{link.keyword} → {link.originalURL}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {isEditMode && links.length > 0 && (
                        <ul className="mt-4 text-white font-bold">
                            {links.map((link, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <span>{link.keyword} → {link.originalURL}</span>
                                    <button
                                        onClick={() => {
                                            const updated = [...links];
                                            updated.splice(index, 1);
                                            setLinks(updated);
                                        }}
                                        className="text-red-500 underline text-sm cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {isEditMode && (
                        <button
                            onClick={handleUpdate}
                            className="bg-green-500 text-white py-4 px-6 mt-6 rounded-xl font-bold cursor-pointer"
                        >
                            Save Changes
                        </button>
                    )}

                    <button onClick={handleSubmit} className='bg-pink-500 text-white py-4 px-4 text-center rounded-xl w-[50vw] font-bold text-xl cursor-pointer mt-4 mb-8'>
                        Generate your InfoTree Page
                    </button>
                </>
            )}
        </div>
    )

}

export default Page
