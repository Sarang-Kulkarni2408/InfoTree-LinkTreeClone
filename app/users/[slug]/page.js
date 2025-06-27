"use client";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

const Page = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const isEditMode = searchParams.get("edit") === "true";

    const [profileImage, setprofileImage] = useState("");
    const [handleName, sethandleName] = useState("");
    const [description, setdescription] = useState("");
    const [originalURL, setoriginalURL] = useState("");
    const [keyword, setkeyword] = useState("");
    const [links, setLinks] = useState([]);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [userExists, setUserExists] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isVerified, setIsVerified] = useState(false);

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
                if (isEditMode) {
                    setPassword("");
                    setConfirmPassword("");
                }
            }
        };
        fetchUser();
    }, [params.slug, isEditMode]);

    useEffect(() => {
        if (isEditMode) {
            const verified = sessionStorage.getItem("edit-verified");
            if (verified === "true") {
                setIsVerified(true);
            } else {
                alert("Unauthorized edit access. Redirecting to view-only mode.");
                window.location.href = `/users/${params.slug}`;
            }
        }
    }, [searchParams, params.slug, isEditMode]);

    const handleAddItem = () => {
        if (!originalURL.trim() || !keyword.trim()) {
            alert("Please fill both the original URL and keyword.");
            return;
        }
        setLinks([...links, { originalURL, keyword }]);
        alert("Item added successfully!");
        setoriginalURL("");
        setkeyword("");
    };

    const handleSubmit = async () => {
        if (!profileImage || !handleName || !description || links.length === 0) {
            alert("Please fill all fields and add at least one link.");
            return;
        }

        if (!userExists) {
            if (password.length < 8 || confirmPassword.length < 8) {
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
                ...(password !== "********" && { password }),
            }),
        });

        const result = await res.json();
        if (result.success) {
            sessionStorage.setItem("edit-verified", "false");
            const userURL = `${window.location.origin}/users/${params.slug}`;
            navigator.clipboard.writeText(userURL).then(() => {
                alert("🔗 InfoTree generated successfully and link copied to clipboard!");
            }).catch(() => {
                alert("❌ Failed to copy link.");
            });
            window.location.href = `/users/${params.slug}`;
        } else {
            alert(result.message || "Something went wrong.");
        }
    };

    const handleUpdate = async () => {
        if (!profileImage || !handleName || !description || links.length === 0) {
            alert("Please fill all fields and add at least one link.");
            return;
        }
        if (password.length < 8 || confirmPassword.length < 8) {
            alert("Password must be at least 8 characters and if you don't want to chage your password, enter your old password.");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const res = await fetch(`/api/user/${params.slug}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                profileImage,
                handleName,
                description,
                links,
                ...(password !== "********" && password.length >= 8 && { password }),
            }),
        });

        const result = await res.json();
        if (result.success) {
            sessionStorage.setItem("edit-verified", "false");
            const userURL = `${window.location.origin}/users/${params.slug}`;
            navigator.clipboard.writeText(userURL).then(() => {
                alert("🔗 InfoTree updated successfully and link copied to clipboard!");
            }).catch(() => {
                alert("❌ Failed to copy link.");
            });
            window.location.href = `/users/${params.slug}`;
        } else {
            alert("Failed to update. Please try again OR No change made !");
        }
    };

    return (
        <div className="flex flex-col items-center">
            {userExists && !isEditMode ? (
                <div className="flex flex-col items-center justify-start p-6 bg-orange-500">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl py-6 px-6 text-center">
                        <img
                            src={userData.profileImage}
                            alt="Profile"
                            className="mx-auto w-32 h-32 rounded-full border-4 border-indigo-500 object-cover shadow-md"
                        />
                        <h1 className="mt-4 text-3xl font-bold text-gray-800">
                            {userData.handleName}
                        </h1>
                        <p className="mt-2 text-gray-900 font-semibold">{userData.description}</p>
                        <div className="mt-6 space-y-4">
                            {userData.links.map((link, i) => (
                                <a
                                    key={i}
                                    href={link.originalURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full shadow hover:shadow-lg transition"
                                >
                                    {link.keyword}
                                </a>
                            ))}
                        </div>
                        <footer className="mt-8 text-xs text-gray-400">
                            © {new Date().getFullYear()} InfoTree by {userData.handleName}
                        </footer>
                    </div>
                </div>
            ) : (
                <>
                    <div className="text-white text-2xl m-3 font-bold">
                        Welcome, {params.slug.replace(/%20/g, "-")}, Create your InfoTree!
                    </div>

                    {/* FORM FIELDS */}
                    {[["profileImage", profileImage, setprofileImage, "Link of profile image"],
                    ["handleName", handleName, sethandleName, "Your handle name"],
                    ["description", description, setdescription, "Enter description"],
                    ["password", password, setPassword, "Set a password (min 8 chars)"],
                    ["confirmpassword", confirmPassword, setConfirmPassword, "Confirm your password"]
                    ].map(([id, val, setFn, ph]) => (
                        <div key={id} className="m-3">
                            <input
                                type={id.includes("password") ? "password" : "text"}
                                placeholder={ph}
                                value={val}
                                onChange={(e) => setFn(e.target.value)}
                                className="w-[50vw] px-4 py-4 border-3 border-white rounded-xl shadow-sm text-gray-800 bg-white font-bold cursor-pointer"
                            />
                        </div>
                    ))}

                    {/* ADD LINK */}
                    <div className="addLink m-3 flex gap-2 p-0">
                        <input type="text" placeholder="Enter URL" value={originalURL} onChange={(e) => setoriginalURL(e.target.value)}
                            className="w-[25vw] px-4 py-4 border-3 border-white rounded-xl shadow-sm text-gray-800 bg-white font-bold" />
                        <input type="text" placeholder="Keyword" value={keyword} onChange={(e) => setkeyword(e.target.value)}
                            className="w-[15vw] px-4 py-4 border-3 border-white rounded-xl shadow-sm text-gray-800 bg-white font-bold" />
                        <button onClick={handleAddItem}
                            className="w-[9vw] cursor-pointer border-3 border-white rounded-xl shadow-sm text-gray-800 bg-white font-bold">
                            Add Item
                        </button>
                    </div>

                    {/* SHOW LINKS */}
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

                    {/* DELETE LINKS */}
                    {isEditMode && isVerified && links.length > 0 && (
                        <ul className="mt-4 text-white font-bold">
                            {links.map((link, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <span>{link.keyword} → {link.originalURL}</span>
                                    <button onClick={() => {
                                        const updated = [...links];
                                        updated.splice(index, 1);
                                        setLinks(updated);
                                    }} className="text-red-500 underline text-sm cursor-pointer">Delete</button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* SUBMIT BUTTONS */}
                    {isEditMode && isVerified ? (
                        <button onClick={handleUpdate}
                            className="bg-green-500 text-white py-4 px-6 mt-6 rounded-xl font-bold cursor-pointer">
                            Save Changes
                        </button>
                    ) : (
                        <button onClick={handleSubmit}
                            className="bg-pink-500 text-white py-4 px-4 mt-4 mb-8 text-xl rounded-xl font-bold cursor-pointer w-[50vw]">
                            Generate your InfoTree Page
                        </button>
                    )}
                </>
            )}

            <button onClick={() => window.location.href = "/"}
                className="mt-4 mb-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow cursor-pointer">
                ← Go to Home Page
            </button>
        </div>
    );
};

export default Page;
